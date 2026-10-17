import io
import pytest
from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "ai_engine" in data


def test_auth_workflow(client: TestClient):
    # 1. Register a new user
    reg_payload = {
        "full_name": "Test Candidate",
        "email": "testcandidate@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    token = reg_data["access_token"]
    assert reg_data["user"]["email"] == "testcandidate@example.com"

    # 2. Login
    login_res = client.post("/api/auth/login", json={
        "email": "testcandidate@example.com",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data

    # 3. Protected endpoint GET /api/auth/me
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "testcandidate@example.com"

    # 4. Failed login with wrong password
    bad_login = client.post("/api/auth/login", json={
        "email": "testcandidate@example.com",
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401


def test_resume_upload_and_analysis(client: TestClient):
    # Register/Login
    client.post("/api/auth/register", json={
        "full_name": "Resume User",
        "email": "resumeuser@example.com",
        "password": "Password123!"
    })
    login_res = client.post("/api/auth/login", json={
        "email": "resumeuser@example.com",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create dummy text file disguised as pdf or docx
    # PyMuPDF can parse memory stream or we can create a simple PDF using fitz
    import fitz
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text(
        (50, 72),
        "John Doe - Senior Python Developer.\n"
        "Skills: Python, Django, FastAPI, PostgreSQL, Docker, React, Git.\n"
        "Education: B.Tech Computer Science.\n"
        "Projects: Built scalable microservice API and distributed task pipeline."
    )
    pdf_bytes = doc.tobytes()
    doc.close()

    files = {"file": ("my_resume.pdf", pdf_bytes, "application/pdf")}
    data = {"target_role": "Python Developer", "job_description": "Seeking Python engineer with FastAPI and SQL experience."}
    upload_res = client.post("/api/resumes/upload", files=files, data=data, headers=headers)
    assert upload_res.status_code == 201
    upload_data = upload_res.json()
    assert upload_data["original_filename"] == "my_resume.pdf"
    resume_id = upload_data["id"]

    # Verify resume in list
    list_res = client.get("/api/resumes", headers=headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # Verify resume detail & analysis
    detail_res = client.get(f"/api/resumes/{resume_id}", headers=headers)
    assert detail_res.status_code == 200
    detail_data = detail_res.json()
    assert "Python" in detail_data["extracted_text"]
    assert detail_data["latest_analysis"] is not None
    assert detail_data["latest_analysis"]["matchScore"] > 50


def test_question_generation(client: TestClient):
    login_res = client.post("/api/auth/login", json={
        "email": "testcandidate@example.com",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    gen_payload = {
        "target_role": "Python Developer",
        "experience_level": "Fresher",
        "interview_type": "Technical",
        "programming_language": "Python",
        "number_of_questions": 3,
        "difficulty_level": "Intermediate"
    }
    res = client.post("/api/questions/generate", json=gen_payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data["questions"]) == 3
    assert "question" in data["questions"][0]
    assert "evaluation_criteria" in data["questions"][0]


def test_interview_lifecycle_and_evaluation(client: TestClient):
    # 1. Login
    login_res = client.post("/api/auth/login", json={
        "email": "testcandidate@example.com",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Start Interview Session
    init_payload = {
        "target_role": "Backend Developer",
        "interview_type": "Technical",
        "difficulty": "Intermediate",
        "question_count": 2,
        "time_limit_minutes": 15
    }
    create_res = client.post("/api/interviews", json=init_payload, headers=headers)
    assert create_res.status_code == 201
    session_data = create_res.json()
    session_id = session_data["id"]
    assert len(session_data["questions"]) >= 2
    q1 = session_data["questions"][0]

    # 3. Submit Answer to Question 1
    answer_payload = {
        "question_id": q1["id"],
        "answer_text": (
            "SQL databases are relational and strictly enforce ACID compliance, using structured tables and foreign keys. "
            "NoSQL databases like MongoDB or Cassandra are document or key-value stores designed for horizontal scalability, "
            "flexible schemaless models, and high ingestion throughput."
        )
    }
    eval_res = client.post(f"/api/interviews/{session_id}/answer", json=answer_payload, headers=headers)
    assert eval_res.status_code == 200
    eval_data = eval_res.json()
    assert "overall_score" in eval_data
    assert eval_data["overall_score"] > 60
    assert "criteria_scores" in eval_data
    assert "technical_accuracy" in eval_data["criteria_scores"]
    assert "what_went_well" in eval_data
    assert "sample_improved_answer" in eval_data

    # 4. Finish Interview
    finish_res = client.post(f"/api/interviews/{session_id}/finish", headers=headers)
    assert finish_res.status_code == 200
    assert finish_res.json()["status"] == "completed"

    # 5. Fetch Session Report
    report_res = client.get(f"/api/reports/{session_id}", headers=headers)
    assert report_res.status_code == 200
    rep_data = report_res.json()
    assert rep_data["session_id"] == session_id
    assert rep_data["answered_questions"] >= 1
    assert "radar_competencies" in rep_data

    # 6. Download PDF Report
    pdf_res = client.get(f"/api/reports/{session_id}/pdf", headers=headers)
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert len(pdf_res.content) > 1000

    # 7. Check Dashboard Analytics
    dash_res = client.get("/api/analytics/dashboard", headers=headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["total_interviews"] >= 1
    assert dash_data["questions_practiced"] >= 1
    assert len(dash_data["recent_sessions"]) >= 1
