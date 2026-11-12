from __future__ import annotations

import uuid
from datetime import datetime

import httpx2
from pydantic import BaseModel, ValidationError


class SupabaseRestClientError(Exception):
    """A PostgREST request failed; details are intentionally not exposed."""


class ProfileRow(BaseModel):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class SupabaseRestClient:
    """Request-scoped PostgREST client using the public key and student JWT."""

    def __init__(
        self,
        *,
        supabase_url: str,
        anon_key: str,
        access_token: str,
        timeout: float = 10.0,
    ) -> None:
        self._client = httpx2.AsyncClient(
            base_url=supabase_url.rstrip("/"),
            timeout=httpx2.Timeout(timeout),
            headers={
                "apikey": anon_key,
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json",
            },
        )

    async def get_profile(self, user_id: uuid.UUID) -> ProfileRow | None:
        try:
            response = await self._client.get(
                "/rest/v1/profiles",
                params={
                    "select": "id,created_at,updated_at",
                    "id": f"eq.{user_id}",
                    "limit": "1",
                },
            )
        except httpx2.HTTPError as exc:
            raise SupabaseRestClientError("profile request failed") from exc

        if response.status_code >= 400:
            raise SupabaseRestClientError("profile request was rejected")

        try:
            payload = response.json()
            if not isinstance(payload, list):
                raise ValueError("unexpected PostgREST response")
            if not payload:
                return None
            return ProfileRow.model_validate(payload[0])
        except (ValueError, TypeError, ValidationError) as exc:
            raise SupabaseRestClientError("invalid profile response") from exc

    async def aclose(self) -> None:
        await self._client.aclose()
