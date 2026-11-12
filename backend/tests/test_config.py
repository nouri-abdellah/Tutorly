from __future__ import annotations

import pytest

from app.config import ConfigurationError, load_settings
from support import TEST_ISSUER, TEST_JWT_SECRET


BASE_ENV = {
    "SUPABASE_URL": "http://127.0.0.1:54321",
    "SUPABASE_ANON_KEY": "public-anon-key",
    "SUPABASE_JWT_SECRET": TEST_JWT_SECRET,
}


def test_load_settings_derives_local_issuer_and_origins() -> None:
    settings = load_settings(BASE_ENV)

    assert settings.supabase_url == "http://127.0.0.1:54321"
    assert settings.jwt_issuer == TEST_ISSUER
    assert settings.frontend_origins == (
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    )


def test_missing_url_is_rejected() -> None:
    env = dict(BASE_ENV)
    env.pop("SUPABASE_URL")

    with pytest.raises(ConfigurationError, match="SUPABASE_URL"):
        load_settings(env)


def test_missing_anon_key_is_rejected() -> None:
    env = dict(BASE_ENV)
    env.pop("SUPABASE_ANON_KEY")

    with pytest.raises(ConfigurationError, match="SUPABASE_ANON_KEY"):
        load_settings(env)


def test_neither_signing_configuration_is_rejected() -> None:
    env = dict(BASE_ENV)
    env.pop("SUPABASE_JWT_SECRET")

    with pytest.raises(ConfigurationError, match="exactly one"):
        load_settings(env)


def test_both_signing_configurations_are_rejected() -> None:
    env = dict(BASE_ENV)
    env["SUPABASE_JWKS_URL"] = (
        "http://127.0.0.1:54321/auth/v1/.well-known/jwks.json"
    )

    with pytest.raises(ConfigurationError, match="exactly one"):
        load_settings(env)


def test_short_hmac_secret_is_rejected() -> None:
    env = dict(BASE_ENV)
    env["SUPABASE_JWT_SECRET"] = "too-short"

    with pytest.raises(ConfigurationError, match="SUPABASE_JWT_SECRET"):
        load_settings(env)


def test_hmac_secret_only_configuration_is_accepted() -> None:
    settings = load_settings(BASE_ENV)

    assert settings.jwt_secret == TEST_JWT_SECRET
    assert settings.supabase_jwks_url is None


def test_jwks_only_configuration_is_accepted() -> None:
    env = dict(BASE_ENV)
    env.pop("SUPABASE_JWT_SECRET")
    env["SUPABASE_JWKS_URL"] = "http://127.0.0.1:54321/auth/v1/.well-known/jwks.json"

    settings = load_settings(env)

    assert settings.jwt_secret is None
    assert settings.supabase_jwks_url is not None


def test_invalid_frontend_origin_is_rejected() -> None:
    env = dict(BASE_ENV)
    env["FRONTEND_ORIGINS"] = "http://localhost:5173/path"

    with pytest.raises(ConfigurationError, match="FRONTEND_ORIGINS"):
        load_settings(env)
