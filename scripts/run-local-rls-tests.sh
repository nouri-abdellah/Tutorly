#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

status_env="$(npx supabase status -o env)"

get_value() {
  printf '%s\n' "$status_env" \
    | sed -n "s/^$1=\"\{0,1\}\([^\"]*\)\"\{0,1\}$/\1/p" \
    | head -n 1
}

api_url="$(get_value API_URL)"
anon_key="$(get_value ANON_KEY)"
service_role_key="$(get_value SERVICE_ROLE_KEY)"

if [[ -z "$api_url" || -z "$anon_key" || -z "$service_role_key" ]]; then
  printf '%s\n' "Could not read local Supabase credentials from 'npx supabase status -o env'." >&2
  printf '%s\n' "Start the local stack with: npx supabase start" >&2
  exit 1
fi

case "$api_url" in
  http://127.0.0.1:*|http://localhost:*|http://\[::1\]:*) ;;
  *)
    printf '%s\n' "Refusing to run RLS tests against non-local Supabase URL: $api_url" >&2
    exit 1
    ;;
esac

uv_bin="${UV_BIN:-uv}"
if ! command -v "$uv_bin" >/dev/null 2>&1; then
  uv_bin="$HOME/.local/bin/uv"
fi

cd backend
SUPABASE_TEST_URL="$api_url" \
SUPABASE_TEST_ANON_KEY="$anon_key" \
SUPABASE_TEST_SERVICE_ROLE_KEY="$service_role_key" \
  "$uv_bin" run pytest -q tests/integration
