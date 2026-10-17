import json
import logging
from typing import List, Dict, Any, Optional
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)

# Specialized curated questions across roles, types, and difficulty levels
CURATED_DOMAIN_QUESTIONS = {
    "frontend-dev": [
        {
            "question": "Can you explain the difference between 'let', 'const', and 'var' in modern JavaScript, highlighting hoisting and temporal dead zone?",
            "category": "Core JavaScript",
            "difficulty": "Beginner",
            "relevant_skill": "JavaScript",
            "evaluation_criteria": "Candidate should mention block scoping for let/const vs function scoping for var, temporal dead zone (TDZ), and reassignment immutability for const.",
            "hints": "Think about variable lifecycle, hoisting behavior, and re-declaration rules."
        },
        {
            "question": "How does React's Virtual DOM reconciliation algorithm (Fiber) work, and why are keys essential when rendering dynamic lists?",
            "category": "React Architecture",
            "difficulty": "Intermediate",
            "relevant_skill": "React",
            "evaluation_criteria": "Mention diffing heuristic (O(n) complexity), element type comparisons, key stability across re-renders to avoid remounting, and batching state updates.",
            "hints": "Consider how React minimizes expensive direct mutations to the real browser DOM."
        },
        {
            "question": "How would you optimize the Core Web Vitals (LCP, FID/INP, CLS) of a heavy single-page application?",
            "category": "Web Performance",
            "difficulty": "Advanced",
            "relevant_skill": "Performance Optimization",
            "evaluation_criteria": "Discuss code-splitting/lazy loading, image compression (WebP/AVIF), SSR/SSG, CDN caching, minimizing layout shifts with aspect-ratio reserves, and web workers.",
            "hints": "Address Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift."
        },
        {
            "question": "Explain the CSS Box Model and the difference between 'content-box' and 'border-box'.",
            "category": "Styling & Layout",
            "difficulty": "Beginner",
            "relevant_skill": "CSS / Tailwind",
            "evaluation_criteria": "Explains margin, border, padding, and content width calculation. Notes that border-box includes padding and border in total width.",
            "hints": "How does box-sizing affect the rendered element's width?"
        },
        {
            "question": "What is the difference between client-side rendering (CSR), server-side rendering (SSR), and static site generation (SSG)?",
            "category": "Web Architecture",
            "difficulty": "Intermediate",
            "relevant_skill": "Next.js / SSR",
            "evaluation_criteria": "Clear trade-off comparison regarding SEO, Time to Interactive (TTI), server load, hydration overhead, and build time.",
            "hints": "Consider when HTML is generated: at runtime in browser, runtime on server, or build time."
        }
    ],
    "backend-dev": [
        {
            "question": "Explain the architectural differences between SQL (Relational) and NoSQL databases. When would you choose one over the other?",
            "category": "Database Architecture",
            "difficulty": "Intermediate",
            "relevant_skill": "SQL & Databases",
            "evaluation_criteria": "Mentions ACID vs BASE guarantees, schema rigidity, horizontal vs vertical scaling, joins, and real-world use cases (e.g., transactional banking vs high-throughput IoT/logs).",
            "hints": "Think about ACID properties, relations, schemaless documents, and horizontal partitioning."
        },
        {
            "question": "What is database indexing, how do B-Trees optimize query speeds, and what are the trade-offs of having too many indexes?",
            "category": "Database Optimization",
            "difficulty": "Advanced",
            "relevant_skill": "Database Indexing",
            "evaluation_criteria": "Explains logarithmic search time, index traversal, point lookups vs range scans, and write penalty on INSERT/UPDATE/DELETE.",
            "hints": "Balance between read acceleration and write overhead."
        },
        {
            "question": "How do you securely handle user authentication and session management in a distributed REST API using JWTs?",
            "category": "API Security",
            "difficulty": "Intermediate",
            "relevant_skill": "Security & JWT",
            "evaluation_criteria": "Mentions cryptographic signing (HMAC/RSA), stateless verification, token expiration, refresh token rotation, HttpOnly cookies vs Authorization header, and revocation strategies.",
            "hints": "Discuss token structure (header, payload, signature) and security trade-offs."
        },
        {
            "question": "What is the difference between synchronous, asynchronous, and multi-threaded programming in Python?",
            "category": "Python Internals",
            "difficulty": "Intermediate",
            "relevant_skill": "Python / FastAPI",
            "evaluation_criteria": "Explains event loop (asyncio), non-blocking I/O, GIL (Global Interpreter Lock), CPU-bound vs I/O-bound bottlenecks, and multiprocessing.",
            "hints": "Consider how the Python GIL impacts CPU threads compared to async event loops."
        },
        {
            "question": "How do you implement rate limiting and idempotency in a high-scale payment or transaction API?",
            "category": "System Design",
            "difficulty": "Advanced",
            "relevant_skill": "System Design",
            "evaluation_criteria": "Mentions token bucket or leaky bucket algorithms, Redis counters, unique Idempotency-Key headers, and distributed locking.",
            "hints": "Think about how to prevent duplicate billing if network times out."
        }
    ],
    "python-dev": [
        {
            "question": "What is the difference between a list and a tuple in Python, and why is immutability beneficial?",
            "category": "Python Fundamentals",
            "difficulty": "Beginner",
            "relevant_skill": "Python",
            "evaluation_criteria": "Mentions mutability vs immutability, memory overhead, hashability (tuples can be dictionary keys), and performance implications.",
            "hints": "Consider syntax, memory allocation, and use as dictionary keys."
        },
        {
            "question": "Explain how Python's generators and the 'yield' keyword work. When would you use a generator instead of returning a list?",
            "category": "Python Internals",
            "difficulty": "Intermediate",
            "relevant_skill": "Python",
            "evaluation_criteria": "Explains lazy evaluation, iterator protocol, memory efficiency with large datasets or streams, and state preservation across yields.",
            "hints": "Think about memory footprint when reading gigabyte-sized log files."
        },
        {
            "question": "Explain Django or FastAPI's request-response lifecycle from incoming HTTP request to returned response.",
            "category": "Framework Architecture",
            "difficulty": "Intermediate",
            "relevant_skill": "FastAPI / Django",
            "evaluation_criteria": "Mentions WSGI/ASGI servers, middleware execution, routing, dependency injection / request validation (Pydantic), ORM querying, and serialization.",
            "hints": "Trace the path of an incoming packet through middleware, route handler, and response generation."
        },
        {
            "question": "What is database normalization, and can you describe 1NF, 2NF, and 3NF with an example?",
            "category": "Databases",
            "difficulty": "Intermediate",
            "relevant_skill": "Relational Databases",
            "evaluation_criteria": "Defines atomic values (1NF), removal of partial dependencies (2NF), and removal of transitive dependencies (3NF) to reduce redundancy.",
            "hints": "Focus on data redundancy and anomalies in insertion, deletion, and update."
        }
    ],
    "hr-behavioral": [
        {
            "question": "Tell me about yourself, your technical background, and what motivated you to pursue this career path.",
            "category": "Introduction & Background",
            "difficulty": "Beginner",
            "relevant_skill": "Professional Communication",
            "evaluation_criteria": "Clear chronological narrative, relevant technical milestones, passion for technology, and crisp conclusion connecting background to the role.",
            "hints": "Use Present-Past-Future structure: who you are now, what you've built, and why this role excites you."
        },
        {
            "question": "Describe a challenging technical problem or project obstacle you encountered. How did you diagnose the issue and resolve it?",
            "category": "STAR Behavioral",
            "difficulty": "Intermediate",
            "relevant_skill": "Problem Solving",
            "evaluation_criteria": "Uses STAR method (Situation, Task, Action, Result), describes specific technical diagnostic steps, team collaboration, and measurable outcome.",
            "hints": "Clearly articulate your personal contribution rather than just 'the team did'."
        },
        {
            "question": "Tell me about a time when you disagreed with a colleague or team lead on a technical approach. How did you handle the discussion?",
            "category": "Teamwork & Conflict Resolution",
            "difficulty": "Intermediate",
            "relevant_skill": "Conflict Resolution",
            "evaluation_criteria": "Shows emotional maturity, active listening, focus on data/benchmarks over ego, willingness to disagree and commit once a decision is made.",
            "hints": "Emphasize respectful communication, trade-off analysis, and team cohesion."
        },
        {
            "question": "Where do you see yourself professionally in the next three to five years, and how does this role fit into that vision?",
            "category": "Career Aspirations",
            "difficulty": "Beginner",
            "relevant_skill": "Goal Setting",
            "evaluation_criteria": "Realistic growth goals, eagerness to master engineering fundamentals, taking architectural ownership, and alignment with company trajectory.",
            "hints": "Show ambition paired with pragmatic milestones."
        }
    ]
}


class QuestionService:
    @classmethod
    async def generate_questions(
        cls,
        target_role: str,
        experience_level: str = "Fresher",
        interview_type: str = "Technical",
        programming_language: str = "Python",
        topics: List[str] = None,
        number_of_questions: int = 5,
        difficulty_level: str = "Intermediate",
        job_description: Optional[str] = None,
        resume_text: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Generates tailored interview questions. Uses LLM if available; otherwise uses
        intelligent role/type/skill-based dynamic synthesis.
        """
        topics = topics or []
        role_key = target_role.lower().replace(" ", "-")

        # Attempt live LLM generation if configured
        if ai_service.is_live_ai_available():
            prompt = (
                f"Generate exactly {number_of_questions} tailored interview questions for a {experience_level} candidate "
                f"interviewing for {target_role}.\n"
                f"Interview Type: {interview_type}\n"
                f"Difficulty: {difficulty_level}\n"
                f"Language/Tech: {programming_language}\n"
                f"Topics: {', '.join(topics) if topics else 'Standard domain curriculum'}\n"
                f"{f'Resume Context: {resume_text[:600]}' if resume_text else ''}\n"
                f"{f'Job Description: {job_description[:400]}' if job_description else ''}\n\n"
                "Return a strict JSON array of objects with keys: "
                "question, category, difficulty, relevant_skill, evaluation_criteria, hints. "
                "Do NOT wrap in extra prose, return valid JSON only."
            )
            llm_response = await ai_service.call_llm(prompt)
            if llm_response:
                try:
                    # Clean markdown fence if present
                    cleaned = llm_response.strip()
                    if cleaned.startswith("```json"):
                        cleaned = cleaned[7:]
                    if cleaned.startswith("```"):
                        cleaned = cleaned[3:]
                    if cleaned.endswith("```"):
                        cleaned = cleaned[:-3]
                    parsed = json.loads(cleaned.strip())
                    if isinstance(parsed, list) and len(parsed) > 0:
                        return parsed[:number_of_questions]
                except Exception as e:
                    logger.warning(f"Failed to parse LLM JSON questions: {e}. Using deterministic engine.")

        # Deterministic dynamic synthesis
        pool = []
        if interview_type.lower() in ["hr", "behavioral"]:
            pool = CURATED_DOMAIN_QUESTIONS["hr-behavioral"]
        elif "python" in role_key or programming_language.lower() == "python":
            pool = CURATED_DOMAIN_QUESTIONS["python-dev"] + CURATED_DOMAIN_QUESTIONS["backend-dev"]
        elif "backend" in role_key or "data" in role_key:
            pool = CURATED_DOMAIN_QUESTIONS["backend-dev"] + CURATED_DOMAIN_QUESTIONS["python-dev"]
        else:
            pool = CURATED_DOMAIN_QUESTIONS["frontend-dev"] + CURATED_DOMAIN_QUESTIONS["backend-dev"]

        # If mixed or project-based, append behavioral or project question
        results = []
        if interview_type.lower() in ["project-based", "mixed"]:
            results.append({
                "question": f"Walk me through the most technically challenging project on your resume. What was your architectural design, and what trade-offs did you make?",
                "category": "Project Architecture",
                "difficulty": difficulty_level,
                "relevant_skill": "System Architecture",
                "evaluation_criteria": "Examines modular component separation, database design, API design, trade-offs, and scalability considerations.",
                "hints": "Focus on the problem statement, technology choices, technical hurdles, and outcomes."
            })

        for item in pool:
            if len(results) >= number_of_questions:
                break
            if item not in results:
                # Adjust difficulty label to match requested preference if suitable
                adapted = dict(item)
                adapted["difficulty"] = difficulty_level
                results.append(adapted)

        # Pad with customized questions if needed
        while len(results) < number_of_questions:
            idx = len(results) + 1
            results.append({
                "question": f"In {target_role}, how do you ensure code maintainability, testing coverage, and production reliability for feature #{idx}?",
                "category": f"{target_role} Engineering Practices",
                "difficulty": difficulty_level,
                "relevant_skill": programming_language or "Software Engineering",
                "evaluation_criteria": "Mentions unit/integration testing, clean architecture, documentation, and continuous integration.",
                "hints": "Consider automated test pipelines, linters, and code reviews."
            })

        return results[:number_of_questions]

question_service = QuestionService()
