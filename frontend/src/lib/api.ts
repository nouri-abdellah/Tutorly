import type { Profile } from "../types";
import { supabase } from "./supabase";

const apiUrl = (
  import.meta.env.VITE_API_URL?.trim() || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export class ProfileApiError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ProfileApiError";
  }
}

function extractErrorCode(value: unknown): string | null {
  if (typeof value !== "object" || value === null || !("error" in value)) {
    return null;
  }

  const error = value.error;
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return null;
  }

  return typeof error.code === "string" ? error.code : null;
}

export async function fetchProfile(): Promise<Profile> {
  if (!supabase) {
    throw new ProfileApiError("CONFIGURATION", 0, "Supabase is not configured");
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new ProfileApiError("SESSION", 401, "Could not read the session");
  }
  if (!session) {
    throw new ProfileApiError("UNAUTHENTICATED", 401, "No active session");
  }

  const response = await fetch(`${apiUrl}/api/v1/me`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    let code = "UNKNOWN";
    try {
      code = extractErrorCode(await response.json()) ?? "UNKNOWN";
    } catch {
      // Keep the generic code when the response is not JSON.
    }
    throw new ProfileApiError(code, response.status, "Profile request failed");
  }

  return (await response.json()) as Profile;
}
