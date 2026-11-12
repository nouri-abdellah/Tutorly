from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

from support import TEST_AUDIENCE, TEST_ISSUER, TEST_JWT_SECRET


def make_access_token(
    *,
    subject: uuid.UUID | str | None = None,
    secret: str = TEST_JWT_SECRET,
    issuer: str = TEST_ISSUER,
    audience: str = TEST_AUDIENCE,
    role: str = "authenticated",
    expires_in_seconds: int = 3600,
    omit_subject: bool = False,
    extra_claims: dict[str, Any] | None = None,
) -> str:
    now = datetime.now(timezone.utc)
    claims: dict[str, Any] = {
        "aud": audience,
        "exp": now + timedelta(seconds=expires_in_seconds),
        "iat": now,
        "iss": issuer,
        "role": role,
    }
    if not omit_subject:
        claims["sub"] = str(subject or uuid.uuid4())
    if extra_claims:
        claims.update(extra_claims)
    return jwt.encode(claims, secret, algorithm="HS256")
