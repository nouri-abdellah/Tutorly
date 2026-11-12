from __future__ import annotations

import os
from functools import lru_cache
from typing import Mapping
from urllib.parse import urlsplit

from pydantic import BaseModel, ConfigDict, Field, SecretStr, ValidationError, model_validator


class ConfigurationError(RuntimeError):
    """Raised when required backend configuration is missing or invalid."""


def _origin_list(value: str) -> tuple[str, ...]:
    origins = tuple(item.strip().rstrip("/") for item in value.split(",") if item.strip())
    if not origins:
        raise ValueError("at least one frontend origin is required")

    for origin in origins:
        parsed = urlsplit(origin)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError(f"invalid frontend origin: {origin!r}")
        if parsed.path not in {"", "/"} or parsed.query or parsed.fragment:
            raise ValueError(f"frontend origins must not contain a path: {origin!r}")
    return origins


class Settings(BaseModel):
    model_config = ConfigDict(frozen=True, extra="ignore")

    supabase_url: str
    supabase_anon_key: str = Field(min_length=1)
    supabase_jwt_secret: SecretStr | None = None
    supabase_jwks_url: str | None = None
    supabase_jwt_issuer: str | None = None
    supabase_jwt_audience: str = "authenticated"
    frontend_origins: tuple[str, ...] = (
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    )

    @model_validator(mode="after")
    def validate_urls_and_signing(self) -> "Settings":
        supabase_url = self.supabase_url.rstrip("/")
        if not supabase_url:
            raise ValueError("SUPABASE_URL is required")
        parsed = urlsplit(supabase_url)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError("SUPABASE_URL must be an absolute HTTP(S) URL")

        if self.supabase_jwks_url is not None:
            jwks = self.supabase_jwks_url.rstrip("/")
            parsed_jwks = urlsplit(jwks)
            if parsed_jwks.scheme not in {"http", "https"} or not parsed_jwks.netloc:
                raise ValueError("SUPABASE_JWKS_URL must be an absolute HTTP(S) URL")
            object.__setattr__(self, "supabase_jwks_url", jwks)

        secret = self.jwt_secret
        if (secret is None) == (self.supabase_jwks_url is None):
            raise ValueError(
                "configure exactly one of SUPABASE_JWT_SECRET or SUPABASE_JWKS_URL"
            )
        if secret is not None and len(secret) < 32:
            raise ValueError("SUPABASE_JWT_SECRET must contain at least 32 characters")

        object.__setattr__(self, "supabase_url", supabase_url)
        return self

    @property
    def jwt_secret(self) -> str | None:
        if self.supabase_jwt_secret is None:
            return None
        value = self.supabase_jwt_secret.get_secret_value()
        return value or None

    @property
    def jwt_issuer(self) -> str:
        if self.supabase_jwt_issuer:
            return self.supabase_jwt_issuer.rstrip("/")
        return f"{self.supabase_url}/auth/v1"


def load_settings(environ: Mapping[str, str] | None = None) -> Settings:
    """Build validated settings from environment variables.

    Only field names are reported on failure so malformed values and secrets are
    never echoed in startup errors.
    """
    values = os.environ if environ is None else environ

    missing = [
        name
        for name in ("SUPABASE_URL", "SUPABASE_ANON_KEY")
        if not (values.get(name) or "").strip()
    ]
    if missing:
        raise ConfigurationError(
            "Invalid backend configuration: " + ", ".join(missing)
        )

    raw_secret = (values.get("SUPABASE_JWT_SECRET") or "").strip()
    raw_jwks = (values.get("SUPABASE_JWKS_URL") or "").strip()
    if bool(raw_secret) == bool(raw_jwks):
        raise ConfigurationError(
            "Invalid backend configuration: configure exactly one of "
            "SUPABASE_JWT_SECRET or SUPABASE_JWKS_URL"
        )
    if raw_secret and len(raw_secret) < 32:
        raise ConfigurationError(
            "Invalid backend configuration: SUPABASE_JWT_SECRET"
        )

    try:
        origins = _origin_list(
            values.get(
                "FRONTEND_ORIGINS",
                "http://localhost:5173,http://127.0.0.1:5173",
            )
        )
    except ValueError:
        raise ConfigurationError(
            "Invalid backend configuration: FRONTEND_ORIGINS"
        ) from None

    try:
        return Settings(
            supabase_url=(values.get("SUPABASE_URL") or "").strip(),
            supabase_anon_key=(values.get("SUPABASE_ANON_KEY") or "").strip(),
            supabase_jwt_secret=raw_secret or None,
            supabase_jwks_url=raw_jwks or None,
            supabase_jwt_issuer=(values.get("SUPABASE_JWT_ISSUER") or "").strip()
            or None,
            supabase_jwt_audience=(values.get("SUPABASE_JWT_AUDIENCE") or "").strip()
            or "authenticated",
            frontend_origins=origins,
        )
    except ValidationError as exc:
        fields = sorted({str(error["loc"][0]) for error in exc.errors() if error["loc"]})
        raise ConfigurationError(
            "Invalid backend configuration"
            + (f": {', '.join(fields)}" if fields else "")
        ) from None


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return load_settings()
