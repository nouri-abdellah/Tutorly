from __future__ import annotations

import uuid
from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_supabase_client
from app.main import app
from app.supabase.client import ProfileRow, SupabaseRestClientError
from auth_helpers import make_access_token


class FakeSupabaseClient:
    def __init__(self, profile: ProfileRow | None = None, error: Exception | None = None):
        self.profile = profile
        self.error = error
        self.requested_user_id: uuid.UUID | None = None

    async def get_profile(self, user_id: uuid.UUID) -> ProfileRow | None:
        self.requested_user_id = user_id
        if self.error is not None:
            raise self.error
        return self.profile


@pytest.fixture(autouse=True)
def clear_dependency_overrides():
    yield
    app.dependency_overrides.clear()


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def _profile(user_id: uuid.UUID) -> ProfileRow:
    now = datetime.now(timezone.utc)
    return ProfileRow(id=user_id, created_at=now, updated_at=now)


def _assert_unauthorized(response) -> None:
    assert response.status_code == 401
    assert response.headers["www-authenticate"] == "Bearer"
    body = response.json()
    assert body["error"]["code"] == "UNAUTHENTICATED"
    assert body["error"]["message_key"] == "errors.unauthenticated"
    assert body["error"]["request_id"]


def test_missing_authorization_header_is_401(client: TestClient) -> None:
    _assert_unauthorized(client.get("/api/v1/me"))


def test_non_bearer_scheme_is_401(client: TestClient) -> None:
    _assert_unauthorized(
        client.get(
            "/api/v1/me",
            headers={"Authorization": "Basic dXNlcjpwYXNzd29yZA=="},
        )
    )


def test_invalid_token_is_401(client: TestClient) -> None:
    _assert_unauthorized(
        client.get("/api/v1/me", headers={"Authorization": "Bearer not-a-jwt"})
    )


def test_expired_token_is_401(client: TestClient) -> None:
    token = make_access_token(expires_in_seconds=-10)
    _assert_unauthorized(
        client.get("/api/v1/me", headers={"Authorization": f"Bearer {token}"})
    )


def test_wrong_issuer_is_401(client: TestClient) -> None:
    token = make_access_token(issuer="http://127.0.0.1:54321/auth/v2")
    _assert_unauthorized(
        client.get("/api/v1/me", headers={"Authorization": f"Bearer {token}"})
    )


def test_wrong_audience_is_401(client: TestClient) -> None:
    token = make_access_token(audience="other")
    _assert_unauthorized(
        client.get("/api/v1/me", headers={"Authorization": f"Bearer {token}"})
    )


def test_wrong_signature_is_401(client: TestClient) -> None:
    token = make_access_token(secret="wrong-secret-that-is-at-least-32-characters")
    _assert_unauthorized(
        client.get("/api/v1/me", headers={"Authorization": f"Bearer {token}"})
    )


def test_missing_subject_is_401(client: TestClient) -> None:
    token = make_access_token(omit_subject=True)
    _assert_unauthorized(
        client.get("/api/v1/me", headers={"Authorization": f"Bearer {token}"})
    )


def test_service_role_token_is_401(client: TestClient) -> None:
    token = make_access_token(role="service_role")
    _assert_unauthorized(
        client.get("/api/v1/me", headers={"Authorization": f"Bearer {token}"})
    )


def test_unsigned_token_is_401(client: TestClient) -> None:
    # alg=none must never be accepted.
    token = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ4In0."
    _assert_unauthorized(
        client.get("/api/v1/me", headers={"Authorization": f"Bearer {token}"})
    )


def test_valid_token_returns_profile_owned_by_subject(client: TestClient) -> None:
    user_id = uuid.uuid4()
    fake = FakeSupabaseClient(profile=_profile(user_id))
    app.dependency_overrides[get_supabase_client] = lambda: fake
    token = make_access_token(subject=user_id)

    response = client.get(
        "/api/v1/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json()["id"] == str(user_id)
    assert fake.requested_user_id == user_id
    assert response.headers["x-request-id"]
    assert response.headers["cache-control"] == "no-store"


def test_client_supplied_user_identity_is_ignored(client: TestClient) -> None:
    authenticated_id = uuid.uuid4()
    other_id = uuid.uuid4()
    fake = FakeSupabaseClient(profile=_profile(authenticated_id))
    app.dependency_overrides[get_supabase_client] = lambda: fake
    token = make_access_token(subject=authenticated_id)

    response = client.get(
        f"/api/v1/me?user_id={other_id}",
        headers={
            "Authorization": f"Bearer {token}",
            "X-User-ID": str(other_id),
        },
    )

    assert response.status_code == 200
    assert response.json()["id"] == str(authenticated_id)
    assert fake.requested_user_id == authenticated_id


def test_missing_profile_is_404(client: TestClient) -> None:
    user_id = uuid.uuid4()
    fake = FakeSupabaseClient(profile=None)
    app.dependency_overrides[get_supabase_client] = lambda: fake
    token = make_access_token(subject=user_id)

    response = client.get(
        "/api/v1/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "PROFILE_NOT_FOUND"
    assert response.json()["error"]["request_id"]


def test_database_failure_returns_generic_503(client: TestClient) -> None:
    user_id = uuid.uuid4()
    fake = FakeSupabaseClient(error=SupabaseRestClientError("private detail"))
    app.dependency_overrides[get_supabase_client] = lambda: fake
    token = make_access_token(subject=user_id)

    response = client.get(
        "/api/v1/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 503
    assert response.json()["error"]["code"] == "DATABASE_UNAVAILABLE"
    assert "private detail" not in response.text
