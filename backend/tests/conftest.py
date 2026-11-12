from __future__ import annotations

import os

from support import TEST_ISSUER, TEST_JWT_SECRET

# The application requires validated configuration at import time. These are
# inert unit-test defaults; integration tests use their own SUPABASE_TEST_* values.
os.environ.setdefault("SUPABASE_URL", "http://127.0.0.1:54321")
os.environ.setdefault("SUPABASE_ANON_KEY", "unit-test-anon-key")
os.environ.setdefault("SUPABASE_JWT_SECRET", TEST_JWT_SECRET)
os.environ.setdefault("SUPABASE_JWT_ISSUER", TEST_ISSUER)
