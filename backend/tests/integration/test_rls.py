from __future__ import annotations

import os
import uuid
from dataclasses import dataclass
from urllib.parse import urlsplit

import httpx2
import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app

SUPABASE_URL = os.environ.get("SUPABASE_TEST_URL", "").rstrip("/")
ANON_KEY = os.environ.get("SUPABASE_TEST_ANON_KEY", "")
SERVICE_ROLE_KEY = os.environ.get("SUPABASE_TEST_SERVICE_ROLE_KEY", "")

pytestmark = [
    pytest.mark.integration,
    pytest.mark.skipif(
        not (SUPABASE_URL and ANON_KEY and SERVICE_ROLE_KEY),
        reason="local Supabase test credentials are not configured",
    ),
]

_LOCAL_HOSTS = {"127.0.0.1", "localhost", "::1"}


@dataclass(frozen=True)
class RlsTestUser:
    id: str
    email: str
    access_token: str

    @property
    def auth_headers(self) -> dict[str, str]:
        return {
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {self.access_token}",
        }


def _service_headers() -> dict[str, str]:
    return {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    }


def _rest_url(path: str) -> str:
    return f"{SUPABASE_URL}/rest/v1/{path}"


def _auth_url(path: str) -> str:
    return f"{SUPABASE_URL}/auth/v1/{path}"


def _create_user(
    client: httpx2.Client, email: str, password: str
) -> RlsTestUser:
    response = client.post(
        _auth_url("admin/users"),
        headers=_service_headers(),
        json={"email": email, "password": password, "email_confirm": True},
    )
    assert response.status_code == 200, response.text
    user_id = response.json()["id"]

    sign_in = client.post(
        _auth_url("token"),
        params={"grant_type": "password"},
        headers={"apikey": ANON_KEY},
        json={"email": email, "password": password},
    )
    assert sign_in.status_code == 200, sign_in.text
    access_token = sign_in.json()["access_token"]
    return RlsTestUser(id=user_id, email=email, access_token=access_token)


def _delete_user(client: httpx2.Client, user_id: str) -> None:
    client.delete(
        _auth_url(f"admin/users/{user_id}"),
        headers=_service_headers(),
    )


def _select_profile(
    client: httpx2.Client, user: RlsTestUser, profile_id: str | None = None
) -> httpx2.Response:
    params: dict[str, str] = {"select": "id,created_at,updated_at"}
    if profile_id is not None:
        params["id"] = f"eq.{profile_id}"
    return client.get(_rest_url("profiles"), headers=user.auth_headers, params=params)


@pytest.fixture(scope="module")
def api_client() -> TestClient:
    settings = Settings(
        supabase_url=SUPABASE_URL,
        supabase_anon_key=ANON_KEY,
        supabase_jwks_url=f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json",
        supabase_jwt_issuer=f"{SUPABASE_URL}/auth/v1",
        frontend_origins=("http://localhost:5173",),
    )
    with TestClient(create_app(settings)) as client:
        yield client


@pytest.fixture(scope="module")
def users() -> tuple[RlsTestUser, RlsTestUser]:
    parsed = urlsplit(SUPABASE_URL)
    if parsed.hostname not in _LOCAL_HOSTS:
        pytest.fail("refusing to run RLS tests against a non-local Supabase URL")

    password = "Tutorly-local-test-password-123!"
    suffix = uuid.uuid4().hex
    client = httpx2.Client(timeout=20.0)
    created: list[RlsTestUser] = []
    try:
        first = _create_user(
            client, f"tutorly.rls.a.{suffix}@example.com", password
        )
        created.append(first)
        second = _create_user(
            client, f"tutorly.rls.b.{suffix}@example.com", password
        )
        created.append(second)
        yield first, second
    finally:
        for user in created:
            _delete_user(client, user.id)
        client.close()


def test_new_auth_users_receive_exactly_one_profile(
    users: tuple[RlsTestUser, RlsTestUser]
) -> None:
    with httpx2.Client(timeout=20.0) as client:
        for user in users:
            response = _select_profile(client, user)
            assert response.status_code == 200, response.text
            payload = response.json()
            assert len(payload) == 1
            assert payload[0]["id"] == user.id


def test_users_cannot_read_each_others_profiles(
    users: tuple[RlsTestUser, RlsTestUser]
) -> None:
    user_a, user_b = users
    with httpx2.Client(timeout=20.0) as client:
        response = _select_profile(client, user_a, profile_id=user_b.id)
        assert response.status_code == 200, response.text
        assert response.json() == []


def test_users_cannot_insert_profiles(
    users: tuple[RlsTestUser, RlsTestUser]
) -> None:
    user_a, user_b = users
    with httpx2.Client(timeout=20.0) as client:
        response = client.post(
            _rest_url("profiles"),
            headers={**user_a.auth_headers, "Prefer": "return=representation"},
            json={"id": user_b.id},
        )
        assert response.status_code in {401, 403}, response.text


def test_users_cannot_update_each_others_profiles(
    users: tuple[RlsTestUser, RlsTestUser]
) -> None:
    user_a, user_b = users
    with httpx2.Client(timeout=20.0) as client:
        before = _select_profile(client, user_b)
        assert before.status_code == 200, before.text
        before_row = before.json()[0]

        response = client.patch(
            _rest_url("profiles"),
            headers={**user_a.auth_headers, "Prefer": "return=representation"},
            params={"id": f"eq.{user_b.id}"},
            json={"updated_at": "2000-01-01T00:00:00+00:00"},
        )
        assert response.status_code in {401, 403}, response.text

        after = _select_profile(client, user_b)
        assert after.status_code == 200, after.text
        assert after.json()[0] == before_row


def test_users_cannot_delete_profiles(
    users: tuple[RlsTestUser, RlsTestUser]
) -> None:
    user_a, _ = users
    with httpx2.Client(timeout=20.0) as client:
        response = client.delete(
            _rest_url("profiles"),
            headers=user_a.auth_headers,
            params={"id": f"eq.{user_a.id}"},
        )
        assert response.status_code in {401, 403}, response.text

        still_there = _select_profile(client, user_a)
        assert still_there.status_code == 200, still_there.text
        assert len(still_there.json()) == 1


def test_users_cannot_change_profile_ownership(
    users: tuple[RlsTestUser, RlsTestUser]
) -> None:
    user_a, user_b = users
    with httpx2.Client(timeout=20.0) as client:
        before = _select_profile(client, user_a)
        assert before.status_code == 200, before.text
        before_row = before.json()[0]

        response = client.patch(
            _rest_url("profiles"),
            headers={**user_a.auth_headers, "Prefer": "return=representation"},
            params={"id": f"eq.{user_a.id}"},
            json={"id": user_b.id},
        )
        assert response.status_code in {401, 403}, response.text

        after = _select_profile(client, user_a)
        assert after.status_code == 200, after.text
        assert after.json() == [before_row]
        assert after.json()[0]["id"] == user_a.id


def test_users_cannot_change_created_at(
    users: tuple[RlsTestUser, RlsTestUser]
) -> None:
    user_a, _ = users
    with httpx2.Client(timeout=20.0) as client:
        before = _select_profile(client, user_a)
        assert before.status_code == 200, before.text
        before_row = before.json()[0]

        response = client.patch(
            _rest_url("profiles"),
            headers={**user_a.auth_headers, "Prefer": "return=representation"},
            params={"id": f"eq.{user_a.id}"},
            json={"created_at": "2000-01-01T00:00:00+00:00"},
        )
        assert response.status_code in {401, 403}, response.text

        after = _select_profile(client, user_a)
        assert after.status_code == 200, after.text
        assert after.json() == [before_row]


def test_users_cannot_update_their_own_profiles(
    users: tuple[RlsTestUser, RlsTestUser]
) -> None:
    user_a, _ = users
    with httpx2.Client(timeout=20.0) as client:
        before = _select_profile(client, user_a)
        assert before.status_code == 200, before.text
        before_row = before.json()[0]

        response = client.patch(
            _rest_url("profiles"),
            headers={**user_a.auth_headers, "Prefer": "return=representation"},
            params={"id": f"eq.{user_a.id}"},
            json={"updated_at": "2000-01-01T00:00:00+00:00"},
        )
        assert response.status_code in {401, 403}, response.text

        after = _select_profile(client, user_a)
        assert after.status_code == 200, after.text
        assert after.json()[0] == before_row


def test_anonymous_access_is_denied() -> None:
    with httpx2.Client(timeout=20.0) as client:
        response = client.get(
            _rest_url("profiles"),
            headers={"apikey": ANON_KEY},
        )
        assert response.status_code in {401, 403}, response.text


def test_fastapi_me_uses_verified_identity_and_request_scoped_rls(
    api_client: TestClient,
    users: tuple[RlsTestUser, RlsTestUser],
) -> None:
    user_a, user_b = users

    response = api_client.get(
        f"/api/v1/me?user_id={user_b.id}",
        headers={
            "Authorization": f"Bearer {user_a.access_token}",
            "X-User-ID": user_b.id,
        },
    )

    assert response.status_code == 200, response.text
    assert response.json()["id"] == user_a.id


def test_fastapi_me_rejects_missing_token(api_client: TestClient) -> None:
    response = api_client.get("/api/v1/me")

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHENTICATED"
