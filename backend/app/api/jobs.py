from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any, Optional

router = APIRouter(prefix="/jobs", tags=["Job Catalog"])

JOB_ROLES_CATALOG = [
    {
        "id": "frontend-dev",
        "title": "Frontend Developer",
        "department": "Engineering",
        "experienceLevel": "Entry - Mid Level",
        "difficulty": "Intermediate",
        "category": "Technical",
        "shortDescription": "Build rich, modern, responsive web experiences with React, TypeScript, and state-of-the-art UI architectures.",
        "description": "Evaluates understanding of modern JavaScript, React lifecycle and hooks, CSS/Tailwind layouts, state management, web performance optimization, and REST integrations.",
        "requiredSkills": ["React", "JavaScript (ES6+)", "TypeScript", "HTML5/CSS3", "Tailwind CSS", "REST API", "Git"],
        "totalQuestions": 10,
        "estimatedDuration": "20 min",
        "popular": True,
        "accentColor": "#6366F1",
    },
    {
        "id": "backend-dev",
        "title": "Backend Developer",
        "department": "Engineering",
        "experienceLevel": "Entry - Mid Level",
        "difficulty": "Advanced",
        "category": "Technical",
        "shortDescription": "Architect robust APIs, scalable databases, serverless workflows, and secure asynchronous microservices.",
        "description": "Tests your grasp of backend architectures, RESTful API design, database querying/indexing (SQL & NoSQL), authentication (JWT/OAuth), caching (Redis), and asynchronous processing.",
        "requiredSkills": ["Python", "FastAPI / Django", "Node.js", "PostgreSQL", "Redis", "Docker", "REST APIs"],
        "totalQuestions": 10,
        "estimatedDuration": "25 min",
        "popular": True,
        "accentColor": "#8B5CF6",
    },
    {
        "id": "fullstack-dev",
        "title": "Full Stack Developer",
        "department": "Engineering",
        "experienceLevel": "Entry - Mid Level",
        "difficulty": "Advanced",
        "category": "Technical",
        "shortDescription": "Bridge frontend user interfaces and backend architectures with full-lifecycle engineering proficiency.",
        "description": "Covers end-to-end web engineering: React component state, server communication, database transactions, API security, and deployment pipelines.",
        "requiredSkills": ["React", "Node.js / Python", "PostgreSQL", "REST APIs", "Tailwind CSS", "Git", "Docker"],
        "totalQuestions": 12,
        "estimatedDuration": "30 min",
        "popular": True,
        "accentColor": "#06B6D4",
    },
    {
        "id": "python-dev",
        "title": "Python Developer",
        "department": "Engineering",
        "experienceLevel": "Entry - Mid Level",
        "difficulty": "Intermediate",
        "category": "Technical",
        "shortDescription": "Master Python fundamentals, OOP, generators, ORM frameworks, and modern async web backends.",
        "description": "Focuses on core Python language features, memory management, decorators, generators, Django/FastAPI request lifecycle, and SQL databases.",
        "requiredSkills": ["Python", "FastAPI", "Django", "SQL", "Git", "Pytest", "Docker"],
        "totalQuestions": 10,
        "estimatedDuration": "20 min",
        "popular": True,
        "accentColor": "#10B981",
    },
    {
        "id": "data-analyst",
        "title": "Data Analyst",
        "department": "Analytics",
        "experienceLevel": "Entry Level",
        "difficulty": "Beginner",
        "category": "Technical",
        "shortDescription": "Extract insights from raw datasets using SQL queries, Pandas, statistical modeling, and dashboards.",
        "description": "Evaluates relational SQL queries, joins, aggregations, window functions, Pandas data wrangling, data hygiene, and visualization.",
        "requiredSkills": ["SQL", "Python", "Pandas", "Power BI / Tableau", "Statistics", "Excel"],
        "totalQuestions": 8,
        "estimatedDuration": "20 min",
        "popular": False,
        "accentColor": "#F59E0B",
    },
    {
        "id": "ml-engineer",
        "title": "Machine Learning Engineer",
        "department": "AI & Research",
        "experienceLevel": "Mid - Senior Level",
        "difficulty": "Advanced",
        "category": "Technical",
        "shortDescription": "Build, evaluate, fine-tune, and deploy machine learning models and LLM/NLP pipelines into production.",
        "description": "Evaluates supervised vs unsupervised algorithms, loss functions, overfitting mitigation, PyTorch/TensorFlow fundamentals, and model serving.",
        "requiredSkills": ["Python", "Machine Learning", "PyTorch", "Scikit-Learn", "FastAPI", "Docker", "NLP"],
        "totalQuestions": 10,
        "estimatedDuration": "25 min",
        "popular": True,
        "accentColor": "#EC4899",
    },
    {
        "id": "hr-behavioral",
        "title": "HR & Behavioral Interview",
        "department": "Human Resources",
        "experienceLevel": "All Levels",
        "difficulty": "Intermediate",
        "category": "Behavioral",
        "shortDescription": "Master behavioral STAR questions, cultural alignment, leadership scenarios, and team collaboration.",
        "description": "Tests your situational judgment, adaptability, teamwork, conflict management, and motivation using the STAR method.",
        "requiredSkills": ["STAR Technique", "Conflict Resolution", "Verbal Communication", "Teamwork", "Adaptability"],
        "totalQuestions": 6,
        "estimatedDuration": "15 min",
        "popular": True,
        "accentColor": "#3B82F6",
    }
]


@router.get("", response_model=List[Dict[str, Any]])
def get_jobs(category: Optional[str] = None):
    if category:
        return [j for j in JOB_ROLES_CATALOG if j["category"].lower() == category.lower()]
    return JOB_ROLES_CATALOG


@router.get("/{role_id}", response_model=Dict[str, Any])
def get_job_by_id(role_id: str):
    role = next((j for j in JOB_ROLES_CATALOG if j["id"] == role_id), None)
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Job role '{role_id}' not found")
    return role
