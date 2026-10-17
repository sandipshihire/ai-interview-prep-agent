import os
import json
import logging
from typing import Dict, Any, Optional, List
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    """
    Unified AI service layer with provider abstraction.
    Supports OpenAI, Gemini, Groq, and local deterministic NLP mode.
    """

    def __init__(self):
        self.provider = settings.AI_PROVIDER.lower()
        self.api_key = settings.AI_API_KEY
        self.model = settings.AI_MODEL

    def is_live_ai_available(self) -> bool:
        return bool(self.api_key and self.provider != "demo")

    def get_provider_status(self) -> Dict[str, Any]:
        return {
            "provider": self.provider,
            "is_live": self.is_live_ai_available(),
            "model": self.model or ("GPT-4o / Claude 3.5 / Gemini 1.5" if self.is_live_ai_available() else "Deterministic Local NLP Engine"),
            "mode_label": "Live LLM Provider" if self.is_live_ai_available() else "Demo Mode (Heuristic & NLP Analysis)"
        }

    async def call_llm(self, prompt: str, system_prompt: str = "You are an expert technical interviewer and AI career coach.") -> Optional[str]:
        """
        Invokes configured LLM provider if API key exists, otherwise returns None to trigger fallback.
        """
        if not self.is_live_ai_available():
            return None

        try:
            if self.provider == "openai":
                import openai
                client = openai.AsyncOpenAI(api_key=self.api_key)
                response = await client.chat.completions.create(
                    model=self.model or "gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                )
                return response.choices[0].message.content
            
            elif self.provider == "gemini":
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                model = genai.GenerativeModel(self.model or "gemini-1.5-flash")
                response = await model.generate_content_async(f"{system_prompt}\n\n{prompt}")
                return response.text
                
        except Exception as e:
            logger.warning(f"Live LLM call to {self.provider} failed: {e}. Falling back to deterministic NLP engine.")
            return None

ai_service = AIService()
