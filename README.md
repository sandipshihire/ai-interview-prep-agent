# 🎙️ InterviewAI - AI-Powered Interview Preparation Agent

> **"Practice Smarter. Interview Better."**
> A complete, production-ready, full-stack AI interview preparation platform designed for students, freshers, and job seekers to prepare for technical, HR, and behavioral interviews with real-time feedback, speech recognition, and performance analytics.

---

## 🌟 Architecture & Features Overview

```
interview-ai/
├── backend/                  # FastAPI Python Backend
│   ├── app/
│   │   ├── main.py           # Application entrypoint & CORS middleware
│   │   ├── core/
│   │   │   ├── config.py     # Environment configuration & settings
│   │   │   └── security.py   # JWT token creation & bcrypt password hashing
│   │   ├── database/
│   │   │   └── session.py    # SQLAlchemy ORM session & database engine
│   │   ├── models/
│   │   │   └── models.py     # 8 Database models (Users, Resumes, Sessions, Answers...)
│   │   ├── schemas/
│   │   │   └── schemas.py    # Pydantic v2 schemas for requests & responses
│   │   ├── services/
│   │   │   ├── ai_service.py         # Pluggable LLM provider (OpenAI, Gemini, Groq + NLP)
│   │   │   ├── resume_service.py     # PyMuPDF / python-docx text extraction & matching
│   │   │   ├── question_service.py   # Dynamic tailored interview question generation
│   │   │   ├── evaluation_service.py # 6-dimension answer grading (0-10 scale)
│   │   │   ├── report_service.py     # ReportLab PDF report generation
│   │   │   └── analytics_service.py  # Readiness score & dashboard metrics
│   │   └── api/
│   │       ├── auth.py       # POST /api/auth/register, /login, GET /me
│   │       ├── resumes.py    # POST /api/resumes/upload, GET, DELETE
│   │       ├── questions.py  # POST /api/questions/generate
│   │       ├── interviews.py # POST /api/interviews, answer, finish
│   │       ├── reports.py    # GET /api/reports, /pdf export
│   │       ├── analytics.py  # GET /api/analytics/dashboard, readiness
│   │       ├── profile.py    # GET, PUT /api/profile
│   │       └── jobs.py       # GET /api/jobs catalog
│   ├── tests/
│   │   ├── conftest.py       # Pytest fixtures & isolated test SQLite DB
│   │   └── test_api.py       # Full test suite for auth, resumes, interviews, PDF
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Backend environment variables template
│   └── .env                  # Development environment configuration
├── src/                      # React 18 + Vite Frontend
│   ├── components/           # Reusable UI components (AudioRecorder, QuestionCard...)
│   ├── context/              # Auth, Theme, and Toast React Context providers
│   ├── pages/                # 14 Full SaaS pages (Landing, Dashboard, Interview...)
│   ├── services/api.js       # Centralized Axios client connecting to /api
│   ├── App.jsx               # React Router routes
│   └── index.css             # Tailwind CSS custom styles & animations
├── vite.config.js            # Vite configuration with /api backend proxy
├── package.json              # Frontend npm dependencies
└── README.md                 # Complete documentation
```

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18, Vite | Lightning-fast development & optimized tree-shaken production bundles |
| **Styling** | Tailwind CSS | Custom professional palette, light & dark theme toggle |
| **Icons & Charts**| Lucide React, Recharts | Interactive RadarChart, AreaChart, LineChart |
| **Voice / Audio** | Web Speech API | Browser SpeechRecognition (STT) + SpeechSynthesis (TTS) |
| **Backend** | Python 3.10+, FastAPI | High-performance asynchronous REST API architecture |
| **Validation** | Pydantic v2 | Strict schema typing and request validation |
| **Database** | SQLAlchemy 2.0 ORM | Compatible with SQLite (local development) and PostgreSQL (production) |
| **Authentication**| JWT & Passlib/bcrypt | Secure salted password hashing and stateless token verification |
| **Resume Parsing**| PyMuPDF (`fitz`), python-docx | Text extraction from PDF and DOCX documents with NLP skill taxonomy |
| **AI & NLP Engine**| Multi-provider LLM + NLP | Pluggable OpenAI / Gemini / Groq + heuristic 6-dimension evaluation fallback |
| **PDF Engine** | ReportLab | Generates downloadable evaluation summary reports with custom styling |
| **Testing** | Pytest, TestClient | Automated integration tests for all REST endpoints |

---

## 🚀 Key End-to-End Workflows

### 1. User Registration & Authentication
- Secure account creation with email format checking, password confirmation, and bcrypt hashing.
- Issues JWT bearer access tokens stored securely in browser storage.
- Auto-seeds a default test account on first run:
  - **Email**: `demo@interviewai.io`
  - **Password**: `Password123!`

### 2. Resume Parsing & NLP Gap Analysis
- Upload resumes in **PDF** or **DOCX** format (up to 5MB).
- Extracts clean text using PyMuPDF and python-docx.
- Identifies technical skills, frameworks, databases, developer tools, and projects.
- Computes an **Estimated Match Score** against selected role and optional job description.
  - *Clearly labeled as an estimated relevance score, not a hiring guarantee.*
- Highlights missing high-demand skills and provides actionable resume bullet recommendations.

### 3. Dynamic Question Generation
- Configurable by target job track, interview type (Technical, HR, Behavioral, Coding, Project-Based, Mixed), difficulty (Beginner, Intermediate, Advanced), and question count.
- Contextualizes questions based on detected skills and projects in the candidate's resume.

### 4. Interactive Live Mock Interview
- Interactive card view with question progress, digital timer, and hints.
- **Voice Mode**:
  - Read questions aloud using Web Speech Synthesis.
  - Dictate responses using the browser Web Speech Recognition API with animated waveforms.
  - Edit recognized transcript before submission.
- **Text Mode**: Fallback typed responses with zero microphone requirements.

### 5. Multi-Dimensional AI Answer Evaluation Engine
Evaluates every submitted answer across 6 criteria on a 0 to 10 scale:
1. **Relevance**: Alignment with the core intent of the question.
2. **Technical Accuracy**: Correctness of mechanisms, data structures, and architectural principles.
3. **Completeness**: Thoroughness of explanation and edge-case awareness.
4. **Clarity**: Readability, sentence flow, and precise vocabulary.
5. **Communication Quality**: Professional presentation and clarity.
6. **Logical Structure**: Organization using the *Concept -> Mechanism -> Example* format.

Returns:
- Strengths and what the candidate did well
- Missing critical concepts
- Suggested concrete improvements
- Model sample answer exemplar
- Adaptive follow-up probes

### 6. Comprehensive Interview Report & PDF Download
- After completing an interview, an evaluation report is compiled.
- Visualizes performance across a 5-axis competency radar chart.
- Includes a one-click **"Download PDF Report"** button generating a clean ReportLab PDF document with tables, scores, and learning plans.

### 7. Interview Readiness Score & Analytics
- Calculates an **Interview Readiness Score (0-100)**:
  $$\text{Readiness} = 0.35 \times \text{AvgScore} + 0.25 \times \text{Accuracy} + 0.20 \times \text{Relevance} + 0.10 \times \text{CompletionRate} + 0.10 \times \text{Consistency}$$
- If fewer than 2 sessions are completed, displays: `"Not enough practice data yet"` with preliminary calibration.
- All dashboard statistics, recent activity, and charts are populated from database records.

---

## ⚡ How to Run the Application Locally

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher (Node 24 recommended)
- npm 9 or higher

---

### Step 1: Start the FastAPI Backend

1. Navigate to the `backend/` directory:
   ```bash
   cd interview-ai/backend
   ```

2. (Optional) Activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux / macOS:
   source venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI development server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

5. Verify backend health:
   - Open [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)
   - Interactive Swagger API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Step 2: Start the React Frontend

1. Open a second terminal and navigate to the project root:
   ```bash
   cd interview-ai
   ```

2. Install npm dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Running Automated Tests

Run the backend Pytest suite:
```bash
cd interview-ai/backend
python -m pytest -v tests/test_api.py
```

Verify frontend build:
```bash
cd interview-ai
npm run build
```

---

## 🔑 AI Provider Configuration (Demo vs. Live Mode)

By default, the application runs in **Deterministic Demo NLP Mode** (`AI_PROVIDER="demo"`). In this mode, the system uses internal NLP heuristics, TF-IDF cosine similarity, and structured question banks, allowing 100% of features to function without any external API keys or charges.

To enable live LLM evaluation, edit `backend/.env`:

### Using OpenAI:
```env
AI_PROVIDER="openai"
AI_API_KEY="sk-proj-your-openai-api-key"
AI_MODEL="gpt-4o-mini"
```

### Using Google Gemini:
```env
AI_PROVIDER="gemini"
AI_API_KEY="AIzaSyYourGeminiApiKey"
AI_MODEL="gemini-1.5-flash"
```

---

## 🚢 Production Deployment Instructions

### 1. Backend (e.g. Render / Railway / AWS EC2)
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Set environment variables:
  - `DATABASE_URL`: `postgresql://user:password@hostname:5432/interviewai`
  - `SECRET_KEY`: Long random cryptographic string
  - `AI_PROVIDER`: `demo` or `openai` / `gemini`
  - `AI_API_KEY`: External provider key

### 2. Frontend (e.g. Vercel / Netlify)
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_BASE_URL`: URL of your deployed backend (e.g. `https://api.yourdomain.com/api`)
