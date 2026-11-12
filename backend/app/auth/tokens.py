from __future__ import annotations

import uuid
from dataclasses import dataclass, field

import jwt

from app.config import Settings

_ASYMMETRIC_ALGORITHMS = {
    "RS256",
    "RS384",
    "RS512",
    "ES256",
    "ES384",
    "ES512",
    "EdDSA",
}
_MAX_TOKEN_LENGTH = 8192


class AuthenticationError(Exception):
    """The bearer token could not be verified as an authenticated student token."""


@dataclass(frozen=True)
class AuthenticatedSession:
    user_id: uuid.UUID
    access_token: str = field(repr=False)


class TokenVerifier:
    def __init__(self, settings: Settings) -> None:
        self._issuer = settings.jwt_issuer
        self._audience = settings.supabase_jwt_audience
        self._secret = settings.jwt_secret
        self._jwks_client = (
            jwt.PyJWKClient(
                settings.supabase_jwks_url,
                cache_keys=True,
                max_cached_keys=16,
                cache_jwk_set=True,
                lifespan=300,
                timeout=10,
                cooldown_duration=30,
            )
            if settings.supabase_jwks_url
            else None
        )

    def verify(self, token: str) -> AuthenticatedSession:
        if not token or len(token) > _MAX_TOKEN_LENGTH:
            raise AuthenticationError("invalid token")

        try:
            header = jwt.get_unverified_header(token)
            algorithm = header.get("alg")
            if not isinstance(algorithm, str):
                raise AuthenticationError("invalid token algorithm")

            key = self._signing_key(token, algorithm)
            claims = jwt.decode(
                token,
                key,
                algorithms=[algorithm],
                audience=self._audience,
                issuer=self._issuer,
                options={"require": ["exp", "sub", "aud", "iss"]},
            )
        except AuthenticationError:
            raise
        except Exception as exc:
            # PyJWT and the JWKS client raise several exception types. All mean
            # the token is not acceptable; never surface provider details.
            raise AuthenticationError("invalid token") from exc

        if claims.get("role") != "authenticated":
            raise AuthenticationError("invalid token role")

        subject = claims.get("sub")
        if not isinstance(subject, str):
            raise AuthenticationError("invalid token subject")

        try:
            user_id = uuid.UUID(subject)
        except (ValueError, AttributeError) as exc:
            raise AuthenticationError("invalid token subject") from exc

        return AuthenticatedSession(user_id=user_id, access_token=token)

    def _signing_key(self, token: str, algorithm: str) -> object:
        if self._jwks_client is not None:
            if algorithm not in _ASYMMETRIC_ALGORITHMS:
                raise AuthenticationError("unsupported token algorithm")
            return self._jwks_client.get_signing_key_from_jwt(token).key

        if algorithm != "HS256" or self._secret is None:
            raise AuthenticationError("unsupported token algorithm")
        return self._secret
