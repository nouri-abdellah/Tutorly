from __future__ import annotations

from typing import AsyncIterator

from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.api.errors import ApiError
from app.auth.tokens import AuthenticatedSession, AuthenticationError, TokenVerifier
from app.supabase.client import SupabaseRestClient

_bearer = HTTPBearer(auto_error=False)


async def get_authenticated_session(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> AuthenticatedSession:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise ApiError(
            401,
            "UNAUTHENTICATED",
            "errors.unauthenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    verifier: TokenVerifier = request.app.state.token_verifier
    try:
        return verifier.verify(credentials.credentials)
    except AuthenticationError as exc:
        raise ApiError(
            401,
            "UNAUTHENTICATED",
            "errors.unauthenticated",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


async def get_supabase_client(
    request: Request,
    session: AuthenticatedSession = Depends(get_authenticated_session),
) -> AsyncIterator[SupabaseRestClient]:
    settings = request.app.state.settings
    client = SupabaseRestClient(
        supabase_url=settings.supabase_url,
        anon_key=settings.supabase_anon_key,
        access_token=session.access_token,
    )
    try:
        yield client
    finally:
        await client.aclose()
