import sys
import os

# Add backend directory to module search path so app imports work seamlessly
backend_dir = os.path.join(os.path.dirname(__file__), "..", "backend")
if os.path.exists(backend_dir) and backend_dir not in sys.path:
    sys.path.insert(0, os.path.abspath(backend_dir))

# Expose the FastAPI ASGI application for Vercel Serverless Functions
from app.main import app
