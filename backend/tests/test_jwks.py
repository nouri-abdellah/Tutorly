from __future__ import annotations

import json
import threading
import uuid
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import ec

from app.auth.tokens import AuthenticationError, TokenVerifier
from app.config import Settings
from auth_helpers import make_access_token
from support import TEST_AUDIENCE, TEST_ISSUER, TEST_JWT_SECRET

_KID = "tutorly-test-key"


class _JwksHandler(BaseHTTPRequestHandler):
    hits = 0
    body = b""

    def do_GET(self) -> None:
        type(self).hits += 1
        if self.path != "/jwks.json":
            self.send_response(404)
            self.end_headers()
            return

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(self.body)))
        self.end_headers()
        self.wfile.write(self.body)

    def log_message(self, _format: str, *_args: object) -> None:
        # Keep test output quiet and never log request details.
        return


@pytest.fixture
def jwks_server():
    private_key = ec.generate_private_key(ec.SECP256R1())
    public_jwk = jwt.algorithms.ECAlgorithm.to_jwk(
        private_key.public_key(), as_dict=True
    )
    public_jwk.update({"kid": _KID, "use": "sig", "alg": "ES256"})
    _JwksHandler.hits = 0
    _JwksHandler.body = json.dumps({"keys": [public_jwk]}).encode()

    server = ThreadingHTTPServer(("127.0.0.1", 0), _JwksHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield private_key, f"http://127.0.0.1:{server.server_port}/jwks.json"
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)


def _make_es256_token(
    private_key: ec.EllipticCurvePrivateKey,
    *,
    subject: uuid.UUID | None = None,
) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {
            "aud": TEST_AUDIENCE,
            "exp": now + timedelta(seconds=300),
            "iat": now,
            "iss": TEST_ISSUER,
            "role": "authenticated",
            "sub": str(subject or uuid.uuid4()),
        },
        private_key,
        algorithm="ES256",
        headers={"kid": _KID},
    )


def _jwks_settings(jwks_url: str) -> Settings:
    return Settings(
        supabase_url="http://127.0.0.1:54321",
        supabase_anon_key="test-anon-key",
        supabase_jwks_url=jwks_url,
    )


def _secret_settings() -> Settings:
    return Settings(
        supabase_url="http://127.0.0.1:54321",
        supabase_anon_key="test-anon-key",
        supabase_jwt_secret=TEST_JWT_SECRET,
    )


def test_es256_token_is_verified_through_jwks_and_cached(
    jwks_server,
) -> None:
    private_key, jwks_url = jwks_server
    verifier = TokenVerifier(_jwks_settings(jwks_url))

    user_id = uuid.uuid4()
    token = _make_es256_token(private_key, subject=user_id)

    assert verifier.verify(token).user_id == user_id
    assert verifier.verify(token).user_id == user_id
    assert _JwksHandler.hits == 1


def test_hs256_token_is_rejected_in_jwks_mode(jwks_server) -> None:
    _, jwks_url = jwks_server
    verifier = TokenVerifier(_jwks_settings(jwks_url))

    with pytest.raises(AuthenticationError, match="unsupported token algorithm"):
        verifier.verify(make_access_token())

    assert _JwksHandler.hits == 0


def test_hs256_token_is_verified_in_secret_mode() -> None:
    verifier = TokenVerifier(_secret_settings())
    user_id = uuid.uuid4()

    assert verifier.verify(make_access_token(subject=user_id)).user_id == user_id


def test_asymmetric_token_is_rejected_in_secret_mode() -> None:
    private_key = ec.generate_private_key(ec.SECP256R1())
    verifier = TokenVerifier(_secret_settings())

    with pytest.raises(AuthenticationError, match="unsupported token algorithm"):
        verifier.verify(_make_es256_token(private_key))
