from __future__ import annotations

import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, Response
from pydantic import BaseModel

from app.api.deps import get_authenticated_session, get_supabase_client
from app.api.errors import ApiError
from app.auth.tokens import AuthenticatedSession
from app.supabase.client import SupabaseRestClient, SupabaseRestClientError

router = APIRouter(prefix="/api/v1", tags=["profile"])


class ProfileResponse(BaseModel):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


@router.get("/me", response_model=ProfileResponse)
async def get_me(
    response: Response,
    session: AuthenticatedSession = Depends(get_authenticated_session),
    client: SupabaseRestClient = Depends(get_supabase_client),
) -> ProfileResponse:
    """Return the profile owned by the verified JWT subject.

    The endpoint deliberately has no user identifier parameter. Ownership comes
    only from the verified token, and PostgREST applies the profiles RLS policy
    as a second independent check.
    """
    try:
        profile = await client.get_profile(session.user_id)
    except SupabaseRestClientError as exc:
        raise ApiError(
            503,
            "DATABASE_UNAVAILABLE",
            "errors.database_unavailable",
        ) from exc

    if profile is None:
        raise ApiError(404, "PROFILE_NOT_FOUND", "errors.profile_not_found")

    response.headers["Cache-Control"] = "no-store"
    return ProfileResponse(
        id=profile.id,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )
