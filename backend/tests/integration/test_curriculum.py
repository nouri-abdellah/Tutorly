from __future__ import annotations

import os
import threading
import uuid
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from urllib.parse import urlsplit

import httpx2
import pytest

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
class Student:
    id: str
    email: str
    access_token: str

    @property
    def auth_headers(self) -> dict[str, str]:
        return {
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {self.access_token}",
        }


@dataclass(frozen=True)
class CurriculumFixture:
    student: Student
    curriculum_id: str
    draft_only_curriculum_id: str
    published_version_id: str
    reviewed_version_id: str
    draft_version_id: str
    published_source_id: str
    reviewed_source_id: str
    draft_source_id: str
    published_unit_id: str
    reviewed_unit_id: str
    draft_unit_id: str
    published_topic_id: str
    reviewed_topic_id: str
    draft_topic_id: str
    published_skill_ids: tuple[str, str, str]
    reviewed_skill_id: str
    draft_skill_ids: tuple[str, str]
    concurrent_skill_ids: tuple[str, str]
    published_code: str
    published_academic_year: str


def _service_headers() -> dict[str, str]:
    return {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    }


def _anon_headers() -> dict[str, str]:
    return {"apikey": ANON_KEY}


def _rest_url(path: str) -> str:
    return f"{SUPABASE_URL}/rest/v1/{path}"


def _auth_url(path: str) -> str:
    return f"{SUPABASE_URL}/auth/v1/{path}"


def _write_headers(headers: dict[str, str]) -> dict[str, str]:
    return {**headers, "Prefer": "return=representation"}


def _post(
    client: httpx2.Client,
    table: str,
    payload: dict[str, object],
    *,
    headers: dict[str, str] | None = None,
) -> httpx2.Response:
    return client.post(
        _rest_url(table),
        headers=_write_headers(headers or _service_headers()),
        json=payload,
    )


def _insert_ok(
    client: httpx2.Client,
    table: str,
    payload: dict[str, object],
) -> None:
    response = _post(client, table, payload)
    assert response.status_code == 201, response.text


def _select(
    client: httpx2.Client,
    table: str,
    params: dict[str, str],
    *,
    headers: dict[str, str] | None = None,
) -> httpx2.Response:
    return client.get(
        _rest_url(table),
        headers=headers or _service_headers(),
        params=params,
    )


def _delete(
    client: httpx2.Client,
    table: str,
    params: dict[str, str],
) -> None:
    client.delete(
        _rest_url(table),
        headers=_service_headers(),
        params=params,
    )


def _create_student(client: httpx2.Client, email: str, password: str) -> Student:
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
    return Student(
        id=user_id,
        email=email,
        access_token=sign_in.json()["access_token"],
    )


@pytest.fixture(scope="module")
def curriculum() -> CurriculumFixture:
    parsed = urlsplit(SUPABASE_URL)
    if parsed.hostname not in _LOCAL_HOSTS:
        pytest.fail("refusing to run curriculum tests against a non-local Supabase URL")

    suffix = uuid.uuid4().hex
    curriculum_id = str(uuid.uuid4())
    draft_only_curriculum_id = str(uuid.uuid4())
    published_version_id = str(uuid.uuid4())
    reviewed_version_id = str(uuid.uuid4())
    draft_version_id = str(uuid.uuid4())
    published_source_id = str(uuid.uuid4())
    reviewed_source_id = str(uuid.uuid4())
    draft_source_id = str(uuid.uuid4())
    published_unit_id = str(uuid.uuid4())
    reviewed_unit_id = str(uuid.uuid4())
    draft_unit_id = str(uuid.uuid4())
    published_topic_id = str(uuid.uuid4())
    reviewed_topic_id = str(uuid.uuid4())
    draft_topic_id = str(uuid.uuid4())
    published_skill_ids = tuple(str(uuid.uuid4()) for _ in range(3))
    reviewed_skill_id = str(uuid.uuid4())
    draft_skill_ids = tuple(str(uuid.uuid4()) for _ in range(2))
    concurrent_skill_ids = tuple(str(uuid.uuid4()) for _ in range(2))
    published_code = f"TST-PUB-{suffix}"
    published_academic_year = f"test-year-{suffix}"
    password = "Tutorly-local-test-password-123!"
    client = httpx2.Client(timeout=20.0)
    student: Student | None = None

    all_curricula = (curriculum_id, draft_only_curriculum_id)
    all_versions = (
        published_version_id,
        reviewed_version_id,
        draft_version_id,
    )
    all_units = (published_unit_id, reviewed_unit_id, draft_unit_id)
    all_topics = (published_topic_id, reviewed_topic_id, draft_topic_id)
    all_skills = (
        *published_skill_ids,
        reviewed_skill_id,
        *draft_skill_ids,
        *concurrent_skill_ids,
    )

    try:
        _insert_ok(
            client,
            "curricula",
            {
                "id": curriculum_id,
                "name": f"Synthetic test curriculum {suffix}",
                "country": "DZ",
                "grade_level": "test-grade",
                "academic_stream": "test-stream",
                "subject": "mathematics",
            },
        )
        _insert_ok(
            client,
            "curricula",
            {
                "id": draft_only_curriculum_id,
                "name": f"Synthetic draft-only curriculum {suffix}",
                "country": "DZ",
                "grade_level": "test-grade",
                "academic_stream": "test-stream",
                "subject": "mathematics",
            },
        )

        for version_id, status, year in (
            (published_version_id, "published", published_academic_year),
            (reviewed_version_id, "reviewed", f"reviewed-{suffix}"),
            (draft_version_id, "draft", f"draft-{suffix}"),
        ):
            _insert_ok(
                client,
                "curriculum_versions",
                {
                    "id": version_id,
                    "curriculum_id": curriculum_id,
                    "academic_year": year,
                    "status": status,
                },
            )
        _insert_ok(
            client,
            "curriculum_versions",
            {
                "id": str(uuid.uuid4()),
                "curriculum_id": draft_only_curriculum_id,
                "academic_year": f"draft-only-{suffix}",
                "status": "draft",
            },
        )

        for source_id, version_id, title in (
            (published_source_id, published_version_id, "Published test source"),
            (reviewed_source_id, reviewed_version_id, "Reviewed test source"),
            (draft_source_id, draft_version_id, "Draft test source"),
        ):
            _insert_ok(
                client,
                "curriculum_sources",
                {
                    "id": source_id,
                    "curriculum_version_id": version_id,
                    "title": title,
                    "issuer": "Synthetic test issuer",
                    "source_url": "https://example.invalid/source",
                    "document_date": "2026-01-01",
                },
            )

        for unit_id, version_id, source_id, title in (
            (
                published_unit_id,
                published_version_id,
                published_source_id,
                "Published test unit",
            ),
            (
                reviewed_unit_id,
                reviewed_version_id,
                reviewed_source_id,
                "Reviewed test unit",
            ),
            (draft_unit_id, draft_version_id, draft_source_id, "Draft test unit"),
        ):
            _insert_ok(
                client,
                "curriculum_units",
                {
                    "id": unit_id,
                    "curriculum_version_id": version_id,
                    "title": title,
                    "description": "Synthetic test metadata",
                    "display_order": 1,
                    "source_id": source_id,
                    "source_page": "1",
                },
            )

        for topic_id, unit_id, source_id, title in (
            (
                published_topic_id,
                published_unit_id,
                published_source_id,
                "Published test topic",
            ),
            (
                reviewed_topic_id,
                reviewed_unit_id,
                reviewed_source_id,
                "Reviewed test topic",
            ),
            (draft_topic_id, draft_unit_id, draft_source_id, "Draft test topic"),
        ):
            _insert_ok(
                client,
                "topics",
                {
                    "id": topic_id,
                    "unit_id": unit_id,
                    "title": title,
                    "description": "Synthetic test metadata",
                    "display_order": 1,
                    "source_id": source_id,
                    "source_page": "2",
                },
            )

        for skill_id, version_id, source_id, code in (
            (
                published_skill_ids[0],
                published_version_id,
                published_source_id,
                published_code,
            ),
            (
                published_skill_ids[1],
                published_version_id,
                published_source_id,
                f"TST-PUB-2-{suffix}",
            ),
            (
                published_skill_ids[2],
                published_version_id,
                published_source_id,
                f"TST-PUB-3-{suffix}",
            ),
            (
                reviewed_skill_id,
                reviewed_version_id,
                reviewed_source_id,
                f"TST-REV-{suffix}",
            ),
            (
                draft_skill_ids[0],
                draft_version_id,
                draft_source_id,
                f"TST-DRAFT-1-{suffix}",
            ),
            (
                draft_skill_ids[1],
                draft_version_id,
                draft_source_id,
                f"TST-DRAFT-2-{suffix}",
            ),
            (
                concurrent_skill_ids[0],
                published_version_id,
                published_source_id,
                f"TST-CONCURRENT-1-{suffix}",
            ),
            (
                concurrent_skill_ids[1],
                published_version_id,
                published_source_id,
                f"TST-CONCURRENT-2-{suffix}",
            ),
        ):
            _insert_ok(
                client,
                "skills",
                {
                    "id": skill_id,
                    "curriculum_version_id": version_id,
                    "code": code,
                    "title": "Synthetic test skill",
                    "description": "Synthetic test metadata",
                    "difficulty_level": 3,
                    "source_id": source_id,
                    "source_page": "3",
                },
            )

        for display_order, skill_id in enumerate(published_skill_ids, start=1):
            _insert_ok(
                client,
                "topic_skills",
                {
                    "topic_id": published_topic_id,
                    "skill_id": skill_id,
                    "display_order": display_order,
                },
            )
        _insert_ok(
            client,
            "topic_skills",
            {
                "topic_id": draft_topic_id,
                "skill_id": draft_skill_ids[0],
                "display_order": 1,
            },
        )

        _insert_ok(
            client,
            "skill_prerequisites",
            {
                "skill_id": published_skill_ids[0],
                "prerequisite_skill_id": published_skill_ids[1],
            },
        )
        _insert_ok(
            client,
            "skill_prerequisites",
            {
                "skill_id": published_skill_ids[1],
                "prerequisite_skill_id": published_skill_ids[2],
            },
        )
        _insert_ok(
            client,
            "skill_prerequisites",
            {
                "skill_id": draft_skill_ids[0],
                "prerequisite_skill_id": draft_skill_ids[1],
            },
        )

        student = _create_student(
            client,
            f"tutorly.curriculum.{suffix}@example.com",
            password,
        )

        yield CurriculumFixture(
            student=student,
            curriculum_id=curriculum_id,
            draft_only_curriculum_id=draft_only_curriculum_id,
            published_version_id=published_version_id,
            reviewed_version_id=reviewed_version_id,
            draft_version_id=draft_version_id,
            published_source_id=published_source_id,
            reviewed_source_id=reviewed_source_id,
            draft_source_id=draft_source_id,
            published_unit_id=published_unit_id,
            reviewed_unit_id=reviewed_unit_id,
            draft_unit_id=draft_unit_id,
            published_topic_id=published_topic_id,
            reviewed_topic_id=reviewed_topic_id,
            draft_topic_id=draft_topic_id,
            published_skill_ids=published_skill_ids,
            reviewed_skill_id=reviewed_skill_id,
            draft_skill_ids=draft_skill_ids,
            concurrent_skill_ids=concurrent_skill_ids,
            published_code=published_code,
            published_academic_year=published_academic_year,
        )
    finally:
        skill_ids = ",".join(all_skills)
        topic_ids = ",".join(all_topics)
        unit_ids = ",".join(all_units)
        version_ids = ",".join(all_versions)
        curriculum_ids = ",".join(all_curricula)

        _delete(client, "skill_prerequisites", {"skill_id": f"in.({skill_ids})"})
        _delete(
            client,
            "skill_prerequisites",
            {"prerequisite_skill_id": f"in.({skill_ids})"},
        )
        _delete(client, "topic_skills", {"topic_id": f"in.({topic_ids})"})
        _delete(client, "skills", {"curriculum_version_id": f"in.({version_ids})"})
        _delete(client, "topics", {"unit_id": f"in.({unit_ids})"})
        _delete(
            client,
            "curriculum_units",
            {"curriculum_version_id": f"in.({version_ids})"},
        )
        _delete(
            client,
            "curriculum_sources",
            {"curriculum_version_id": f"in.({version_ids})"},
        )
        _delete(
            client,
            "curriculum_versions",
            {"curriculum_id": f"in.({curriculum_ids})"},
        )
        _delete(client, "curricula", {"id": f"in.({curriculum_ids})"})

        if student is not None:
            client.delete(
                _auth_url(f"admin/users/{student.id}"),
                headers=_service_headers(),
            )
        client.close()


def test_curriculum_structure_is_created_and_linked(
    curriculum: CurriculumFixture,
) -> None:
    with httpx2.Client(timeout=20.0) as client:
        checks = (
            ("curricula", {"id": f"eq.{curriculum.curriculum_id}"}),
            (
                "curriculum_versions",
                {"id": f"eq.{curriculum.published_version_id}"},
            ),
            (
                "curriculum_sources",
                {"id": f"eq.{curriculum.published_source_id}"},
            ),
            ("curriculum_units", {"id": f"eq.{curriculum.published_unit_id}"}),
            ("topics", {"id": f"eq.{curriculum.published_topic_id}"}),
            (
                "skills",
                {"id": f"eq.{curriculum.published_skill_ids[0]}"},
            ),
            (
                "topic_skills",
                {
                    "topic_id": f"eq.{curriculum.published_topic_id}",
                    "skill_id": f"eq.{curriculum.published_skill_ids[0]}",
                },
            ),
            (
                "skill_prerequisites",
                {
                    "skill_id": f"eq.{curriculum.published_skill_ids[0]}",
                    "prerequisite_skill_id": (
                        f"eq.{curriculum.published_skill_ids[1]}"
                    ),
                },
            ),
        )

        for table, params in checks:
            response = _select(client, table, params)
            assert response.status_code == 200, response.text
            assert len(response.json()) == 1, (table, response.text)


def test_duplicate_skill_code_is_rejected(
    curriculum: CurriculumFixture,
) -> None:
    with httpx2.Client(timeout=20.0) as client:
        response = _post(
            client,
            "skills",
            {
                "id": str(uuid.uuid4()),
                "curriculum_version_id": curriculum.published_version_id,
                "code": curriculum.published_code,
                "title": "Duplicate code test skill",
            },
        )
        assert response.status_code == 409, response.text


def test_duplicate_display_orders_are_rejected(
    curriculum: CurriculumFixture,
) -> None:
    with httpx2.Client(timeout=20.0) as client:
        duplicate_unit = _post(
            client,
            "curriculum_units",
            {
                "id": str(uuid.uuid4()),
                "curriculum_version_id": curriculum.published_version_id,
                "title": "Duplicate order unit",
                "display_order": 1,
            },
        )
        assert duplicate_unit.status_code == 409, duplicate_unit.text

        duplicate_topic = _post(
            client,
            "topics",
            {
                "id": str(uuid.uuid4()),
                "unit_id": curriculum.published_unit_id,
                "title": "Duplicate order topic",
                "display_order": 1,
            },
        )
        assert duplicate_topic.status_code == 409, duplicate_topic.text


def test_duplicate_academic_year_is_rejected(
    curriculum: CurriculumFixture,
) -> None:
    with httpx2.Client(timeout=20.0) as client:
        response = _post(
            client,
            "curriculum_versions",
            {
                "id": str(uuid.uuid4()),
                "curriculum_id": curriculum.curriculum_id,
                "academic_year": curriculum.published_academic_year,
                "status": "draft",
            },
        )
        assert response.status_code == 409, response.text


def test_self_prerequisite_is_rejected(
    curriculum: CurriculumFixture,
) -> None:
    with httpx2.Client(timeout=20.0) as client:
        response = _post(
            client,
            "skill_prerequisites",
            {
                "skill_id": curriculum.published_skill_ids[0],
                "prerequisite_skill_id": curriculum.published_skill_ids[0],
            },
        )
        assert response.status_code in {400, 409}, response.text


def test_cross_version_topic_skill_link_is_rejected(
    curriculum: CurriculumFixture,
) -> None:
    with httpx2.Client(timeout=20.0) as client:
        response = _post(
            client,
            "topic_skills",
            {
                "topic_id": curriculum.published_topic_id,
                "skill_id": curriculum.draft_skill_ids[0],
                "display_order": 99,
            },
        )
        assert response.status_code in {400, 409}, response.text


def test_cross_version_prerequisite_is_rejected(
    curriculum: CurriculumFixture,
) -> None:
    with httpx2.Client(timeout=20.0) as client:
        response = _post(
            client,
            "skill_prerequisites",
            {
                "skill_id": curriculum.published_skill_ids[0],
                "prerequisite_skill_id": curriculum.draft_skill_ids[0],
            },
        )
        assert response.status_code in {400, 409}, response.text


def test_direct_prerequisite_cycle_is_rejected(
    curriculum: CurriculumFixture,
) -> None:
    with httpx2.Client(timeout=20.0) as client:
        response = _post(
            client,
            "skill_prerequisites",
            {
                "skill_id": curriculum.published_skill_ids[1],
                "prerequisite_skill_id": curriculum.published_skill_ids[0],
            },
        )
        assert response.status_code in {400, 409}, response.text


def test_indirect_prerequisite_cycle_is_rejected(
    curriculum: CurriculumFixture,
) -> None:
    with httpx2.Client(timeout=20.0) as client:
        response = _post(
            client,
            "skill_prerequisites",
            {
                "skill_id": curriculum.published_skill_ids[2],
                "prerequisite_skill_id": curriculum.published_skill_ids[0],
            },
        )
        assert response.status_code in {400, 409}, response.text


def test_updating_prerequisite_to_create_cycle_is_rejected(
    curriculum: CurriculumFixture,
) -> None:
    first, second, third = curriculum.published_skill_ids
    with httpx2.Client(timeout=20.0) as client:
        response = client.patch(
            _rest_url("skill_prerequisites"),
            headers=_write_headers(_service_headers()),
            params={
                "skill_id": f"eq.{second}",
                "prerequisite_skill_id": f"eq.{third}",
            },
            json={"prerequisite_skill_id": first},
        )
        assert response.status_code in {400, 409}, response.text
        assert "cycle" in response.text.lower()

        rows = _select(
            client,
            "skill_prerequisites",
            {"skill_id": f"in.({second},{third})"},
        )
        assert rows.status_code == 200, rows.text
        edges = {
            (row["skill_id"], row["prerequisite_skill_id"])
            for row in rows.json()
        }
        assert (second, third) in edges
        assert (second, first) not in edges


def test_concurrent_opposite_prerequisites_cannot_both_commit(
    curriculum: CurriculumFixture,
) -> None:
    first, second = curriculum.concurrent_skill_ids
    barrier = threading.Barrier(2)

    def insert_edge(
        skill_id: str, prerequisite_skill_id: str
    ) -> httpx2.Response:
        with httpx2.Client(timeout=20.0) as client:
            barrier.wait(timeout=10)
            return _post(
                client,
                "skill_prerequisites",
                {
                    "skill_id": skill_id,
                    "prerequisite_skill_id": prerequisite_skill_id,
                },
            )

    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = (
            executor.submit(insert_edge, first, second),
            executor.submit(insert_edge, second, first),
        )
        responses = [future.result(timeout=30) for future in futures]

    statuses = sorted(response.status_code for response in responses)
    assert statuses[0] == 201, [response.text for response in responses]
    assert statuses[1] in {400, 409}, [response.text for response in responses]

    with httpx2.Client(timeout=20.0) as client:
        response = _select(
            client,
            "skill_prerequisites",
            {"skill_id": f"in.({first},{second})"},
        )
        assert response.status_code == 200, response.text
        rows = response.json()
        assert len(rows) == 1, response.text
        edge = (rows[0]["skill_id"], rows[0]["prerequisite_skill_id"])
        assert edge in {(first, second), (second, first)}


def test_cross_version_sources_are_rejected(
    curriculum: CurriculumFixture,
) -> None:
    with httpx2.Client(timeout=20.0) as client:
        unit_response = _post(
            client,
            "curriculum_units",
            {
                "id": str(uuid.uuid4()),
                "curriculum_version_id": curriculum.published_version_id,
                "title": "Cross-version source unit",
                "display_order": 20,
                "source_id": curriculum.draft_source_id,
            },
        )
        assert unit_response.status_code in {400, 409}, unit_response.text

        topic_response = _post(
            client,
            "topics",
            {
                "id": str(uuid.uuid4()),
                "unit_id": curriculum.published_unit_id,
                "title": "Cross-version source topic",
                "display_order": 20,
                "source_id": curriculum.draft_source_id,
            },
        )
        assert topic_response.status_code in {400, 409}, topic_response.text

        skill_response = _post(
            client,
            "skills",
            {
                "id": str(uuid.uuid4()),
                "curriculum_version_id": curriculum.published_version_id,
                "code": f"TST-CROSS-SOURCE-{uuid.uuid4().hex}",
                "title": "Cross-version source skill",
                "source_id": curriculum.draft_source_id,
            },
        )
        assert skill_response.status_code in {400, 409}, skill_response.text


def test_same_version_and_null_sources_are_accepted(
    curriculum: CurriculumFixture,
) -> None:
    valid_unit_id = str(uuid.uuid4())
    null_unit_id = str(uuid.uuid4())
    valid_topic_id = str(uuid.uuid4())
    null_topic_id = str(uuid.uuid4())
    valid_skill_id = str(uuid.uuid4())
    null_skill_id = str(uuid.uuid4())

    with httpx2.Client(timeout=20.0) as client:
        try:
            _insert_ok(
                client,
                "curriculum_units",
                {
                    "id": valid_unit_id,
                    "curriculum_version_id": curriculum.published_version_id,
                    "title": "Valid source unit",
                    "display_order": 30,
                    "source_id": curriculum.published_source_id,
                },
            )
            _insert_ok(
                client,
                "curriculum_units",
                {
                    "id": null_unit_id,
                    "curriculum_version_id": curriculum.published_version_id,
                    "title": "Null source unit",
                    "display_order": 31,
                    "source_id": None,
                },
            )
            _insert_ok(
                client,
                "topics",
                {
                    "id": valid_topic_id,
                    "unit_id": valid_unit_id,
                    "title": "Valid source topic",
                    "display_order": 1,
                    "source_id": curriculum.published_source_id,
                },
            )
            _insert_ok(
                client,
                "topics",
                {
                    "id": null_topic_id,
                    "unit_id": null_unit_id,
                    "title": "Null source topic",
                    "display_order": 1,
                    "source_id": None,
                },
            )
            _insert_ok(
                client,
                "skills",
                {
                    "id": valid_skill_id,
                    "curriculum_version_id": curriculum.published_version_id,
                    "code": f"TST-VALID-SOURCE-{uuid.uuid4().hex}",
                    "title": "Valid source skill",
                    "source_id": curriculum.published_source_id,
                },
            )
            _insert_ok(
                client,
                "skills",
                {
                    "id": null_skill_id,
                    "curriculum_version_id": curriculum.published_version_id,
                    "code": f"TST-NULL-SOURCE-{uuid.uuid4().hex}",
                    "title": "Null source skill",
                    "source_id": None,
                },
            )

            units = _select(
                client,
                "curriculum_units",
                {"id": f"in.({valid_unit_id},{null_unit_id})"},
            )
            assert units.status_code == 200, units.text
            unit_sources = {
                row["id"]: row["source_id"] for row in units.json()
            }
            assert unit_sources[valid_unit_id] == curriculum.published_source_id
            assert unit_sources[null_unit_id] is None

            topics = _select(
                client,
                "topics",
                {"id": f"in.({valid_topic_id},{null_topic_id})"},
            )
            assert topics.status_code == 200, topics.text
            topic_sources = {
                row["id"]: row["source_id"] for row in topics.json()
            }
            assert topic_sources[valid_topic_id] == curriculum.published_source_id
            assert topic_sources[null_topic_id] is None

            skills = _select(
                client,
                "skills",
                {"id": f"in.({valid_skill_id},{null_skill_id})"},
            )
            assert skills.status_code == 200, skills.text
            skill_sources = {
                row["id"]: row["source_id"] for row in skills.json()
            }
            assert skill_sources[valid_skill_id] == curriculum.published_source_id
            assert skill_sources[null_skill_id] is None
        finally:
            _delete(
                client,
                "topics",
                {"unit_id": f"in.({valid_unit_id},{null_unit_id})"},
            )
            _delete(
                client,
                "curriculum_units",
                {"id": f"in.({valid_unit_id},{null_unit_id})"},
            )
            _delete(
                client,
                "skills",
                {"id": f"in.({valid_skill_id},{null_skill_id})"},
            )


def test_updating_to_cross_version_source_is_rejected(
    curriculum: CurriculumFixture,
) -> None:
    unit_id = str(uuid.uuid4())
    with httpx2.Client(timeout=20.0) as client:
        try:
            _insert_ok(
                client,
                "curriculum_units",
                {
                    "id": unit_id,
                    "curriculum_version_id": curriculum.published_version_id,
                    "title": "Source update test unit",
                    "display_order": 40,
                    "source_id": curriculum.published_source_id,
                },
            )

            response = client.patch(
                _rest_url("curriculum_units"),
                headers=_write_headers(_service_headers()),
                params={"id": f"eq.{unit_id}"},
                json={"source_id": curriculum.draft_source_id},
            )
            assert response.status_code in {400, 409}, response.text

            stored = _select(
                client,
                "curriculum_units",
                {"id": f"eq.{unit_id}"},
            )
            assert stored.status_code == 200, stored.text
            assert stored.json()[0]["source_id"] == curriculum.published_source_id
        finally:
            _delete(client, "curriculum_units", {"id": f"eq.{unit_id}"})


def _published_visibility_checks(
    curriculum: CurriculumFixture,
) -> tuple[tuple[str, dict[str, str], dict[str, str]], ...]:
    return (
        (
            "curricula",
            {"id": f"eq.{curriculum.curriculum_id}"},
            {"id": curriculum.curriculum_id},
        ),
        (
            "curriculum_versions",
            {"id": f"eq.{curriculum.published_version_id}"},
            {"id": curriculum.published_version_id},
        ),
        (
            "curriculum_sources",
            {"id": f"eq.{curriculum.published_source_id}"},
            {"id": curriculum.published_source_id},
        ),
        (
            "curriculum_units",
            {"id": f"eq.{curriculum.published_unit_id}"},
            {"id": curriculum.published_unit_id},
        ),
        (
            "topics",
            {"id": f"eq.{curriculum.published_topic_id}"},
            {"id": curriculum.published_topic_id},
        ),
        (
            "skills",
            {"id": f"eq.{curriculum.published_skill_ids[0]}"},
            {"id": curriculum.published_skill_ids[0]},
        ),
        (
            "topic_skills",
            {
                "topic_id": f"eq.{curriculum.published_topic_id}",
                "skill_id": f"eq.{curriculum.published_skill_ids[0]}",
            },
            {
                "topic_id": curriculum.published_topic_id,
                "skill_id": curriculum.published_skill_ids[0],
            },
        ),
        (
            "skill_prerequisites",
            {
                "skill_id": f"eq.{curriculum.published_skill_ids[0]}",
                "prerequisite_skill_id": f"eq.{curriculum.published_skill_ids[1]}",
            },
            {
                "skill_id": curriculum.published_skill_ids[0],
                "prerequisite_skill_id": curriculum.published_skill_ids[1],
            },
        ),
    )


def test_anonymous_users_can_read_published_content(
    curriculum: CurriculumFixture,
) -> None:
    with httpx2.Client(timeout=20.0) as client:
        for table, params, expected_fields in _published_visibility_checks(
            curriculum
        ):
            response = _select(
                client,
                table,
                params,
                headers=_anon_headers(),
            )
            assert response.status_code == 200, (table, response.text)
            rows = response.json()
            assert len(rows) == 1, (table, response.text)
            for column, expected in expected_fields.items():
                assert rows[0][column] == expected, (table, column, response.text)


def test_authenticated_users_can_read_published_content(
    curriculum: CurriculumFixture,
) -> None:
    with httpx2.Client(timeout=20.0) as client:
        for table, params, expected_fields in _published_visibility_checks(
            curriculum
        ):
            response = _select(
                client,
                table,
                params,
                headers=curriculum.student.auth_headers,
            )
            assert response.status_code == 200, (table, response.text)
            rows = response.json()
            assert len(rows) == 1, (table, response.text)
            for column, expected in expected_fields.items():
                assert rows[0][column] == expected, (table, column, response.text)


def test_unpublished_content_is_hidden_from_students(
    curriculum: CurriculumFixture,
) -> None:
    hidden_checks = (
        (
            "curricula",
            {"id": f"eq.{curriculum.draft_only_curriculum_id}"},
        ),
        (
            "curriculum_versions",
            {"id": f"eq.{curriculum.draft_version_id}"},
        ),
        (
            "curriculum_versions",
            {"id": f"eq.{curriculum.reviewed_version_id}"},
        ),
        (
            "curriculum_sources",
            {"id": f"eq.{curriculum.draft_source_id}"},
        ),
        (
            "curriculum_sources",
            {"id": f"eq.{curriculum.reviewed_source_id}"},
        ),
        (
            "curriculum_units",
            {"id": f"eq.{curriculum.draft_unit_id}"},
        ),
        (
            "curriculum_units",
            {"id": f"eq.{curriculum.reviewed_unit_id}"},
        ),
        ("topics", {"id": f"eq.{curriculum.draft_topic_id}"}),
        ("topics", {"id": f"eq.{curriculum.reviewed_topic_id}"}),
        ("skills", {"id": f"eq.{curriculum.draft_skill_ids[0]}"}),
        ("skills", {"id": f"eq.{curriculum.reviewed_skill_id}"}),
        (
            "topic_skills",
            {"topic_id": f"eq.{curriculum.draft_topic_id}"},
        ),
        (
            "skill_prerequisites",
            {"skill_id": f"eq.{curriculum.draft_skill_ids[0]}"},
        ),
    )

    with httpx2.Client(timeout=20.0) as client:
        for table, params in hidden_checks:
            response = _select(
                client,
                table,
                params,
                headers=curriculum.student.auth_headers,
            )
            assert response.status_code == 200, (table, response.text)
            assert response.json() == [], (table, response.text)

        anonymous_response = _select(
            client,
            "curriculum_versions",
            {"id": f"eq.{curriculum.draft_version_id}"},
            headers=_anon_headers(),
        )
        assert anonymous_response.status_code == 200, anonymous_response.text
        assert anonymous_response.json() == []


def test_students_cannot_write_curriculum_content(
    curriculum: CurriculumFixture,
) -> None:
    student = curriculum.student
    with httpx2.Client(timeout=20.0) as client:
        insert_response = _post(
            client,
            "curricula",
            {
                "id": str(uuid.uuid4()),
                "name": "Student-created curriculum",
                "country": "DZ",
                "grade_level": "test-grade",
                "academic_stream": "test-stream",
                "subject": "mathematics",
            },
            headers=student.auth_headers,
        )
        assert insert_response.status_code in {401, 403}, insert_response.text

        publish_response = client.patch(
            _rest_url("curriculum_versions"),
            headers=_write_headers(student.auth_headers),
            params={"id": f"eq.{curriculum.reviewed_version_id}"},
            json={"status": "published"},
        )
        assert publish_response.status_code in {401, 403}, publish_response.text

        reviewed = _select(
            client,
            "curriculum_versions",
            {"id": f"eq.{curriculum.reviewed_version_id}"},
        )
        assert reviewed.status_code == 200, reviewed.text
        assert reviewed.json()[0]["status"] == "reviewed"

        delete_response = client.delete(
            _rest_url("curriculum_units"),
            headers=student.auth_headers,
            params={"id": f"eq.{curriculum.published_unit_id}"},
        )
        assert delete_response.status_code in {401, 403}, delete_response.text

        still_there = _select(
            client,
            "curriculum_units",
            {"id": f"eq.{curriculum.published_unit_id}"},
        )
        assert still_there.status_code == 200, still_there.text
        assert len(still_there.json()) == 1

        prerequisite_response = _post(
            client,
            "skill_prerequisites",
            {
                "skill_id": curriculum.published_skill_ids[0],
                "prerequisite_skill_id": curriculum.published_skill_ids[2],
            },
            headers=student.auth_headers,
        )
        assert prerequisite_response.status_code in {401, 403}, (
            prerequisite_response.text
        )
