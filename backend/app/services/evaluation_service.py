import json
import logging
import re
from typing import Dict, Any, List, Optional
from app.services.ai_service import ai_service
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)

class EvaluationService:
    @classmethod
    async def evaluate_answer(
        cls,
        question_text: str,
        answer_text: str,
        evaluation_criteria: Optional[str] = None,
        category: str = "Technical",
        target_role: str = "Developer"
    ) -> Dict[str, Any]:
        """
        Evaluates candidate answer across 6 dimensions on 0-10 scale:
        1. Relevance
        2. Technical Accuracy
        3. Completeness
        4. Clarity
        5. Communication Quality
        6. Logical Structure
        """
        cleaned_answer = answer_text.strip() if answer_text else ""
        word_count = len(cleaned_answer.split())

        # Handle empty or extremely short answers
        if word_count < 3:
            return {
                "overall_score": 15.0,
                "criterion_score_10": 1.5,
                "criteria_scores": {
                    "relevance": 2.0,
                    "technical_accuracy": 1.0,
                    "completeness": 1.0,
                    "clarity": 2.0,
                    "communication_quality": 2.0,
                    "logical_structure": 1.0
                },
                "what_went_well": ["Attempted response recorded."],
                "missing_concepts": ["Substantive explanation of the core technical concept."],
                "incorrect_statements": ["No conceptual content provided in the response."],
                "suggested_improvements": [
                    "Provide a structured response defining the concept, its purpose, and an illustrative example.",
                    "Elaborate on advantages, trade-offs, and practical industry application."
                ],
                "sample_improved_answer": (
                    f"A strong answer for this question would define the fundamental mechanism, "
                    f"explain how it is utilized in {target_role} workflows, and discuss key architectural benefits."
                ),
                "recommended_follow_up_topic": f"Core fundamentals of {category}",
                "follow_up_question": f"Could you provide a detailed overview of {category} principles and how you've applied them?"
            }

        # Attempt live LLM evaluation if configured
        if ai_service.is_live_ai_available():
            prompt = (
                f"You are a principal technical interviewer evaluating a candidate for {target_role}.\n"
                f"Question: {question_text}\n"
                f"Candidate Answer: {answer_text}\n"
                f"Expected Criteria: {evaluation_criteria or 'Industry best practices'}\n\n"
                "Evaluate this answer rigorously and return valid JSON with keys:\n"
                "- overall_score (float 0-100)\n"
                "- criteria_scores (object with float 0-10 scores: relevance, technical_accuracy, completeness, clarity, communication_quality, logical_structure)\n"
                "- what_went_well (list of strings)\n"
                "- missing_concepts (list of strings)\n"
                "- incorrect_statements (list of strings, can be empty)\n"
                "- suggested_improvements (list of strings)\n"
                "- sample_improved_answer (string)\n"
                "- recommended_follow_up_topic (string)\n"
                "- follow_up_question (string, optional adaptive probe based on their answer)\n"
                "Return JSON only."
            )
            llm_res = await ai_service.call_llm(prompt)
            if llm_res:
                try:
                    cleaned = llm_res.strip()
                    if cleaned.startswith("```json"):
                        cleaned = cleaned[7:]
                    if cleaned.startswith("```"):
                        cleaned = cleaned[3:]
                    if cleaned.endswith("```"):
                        cleaned = cleaned[:-3]
                    parsed = json.loads(cleaned.strip())
                    if "criteria_scores" in parsed and "overall_score" in parsed:
                        parsed["criterion_score_10"] = round(parsed["overall_score"] / 10.0, 1)
                        return parsed
                except Exception as e:
                    logger.warning(f"Failed parsing LLM evaluation JSON: {e}. Falling back to NLP evaluator.")

        # Deterministic NLP Rubric Evaluation
        return cls._deterministic_nlp_evaluate(question_text, cleaned_answer, evaluation_criteria, category, target_role)

    @classmethod
    def _deterministic_nlp_evaluate(
        cls,
        question_text: str,
        answer: str,
        criteria: Optional[str],
        category: str,
        target_role: str
    ) -> Dict[str, Any]:
        """
        Deterministic, semantic rubric evaluator computing dimensional scores (0-10).
        """
        word_count = len(answer.split())
        lower_ans = answer.lower()
        lower_q = question_text.lower()
        lower_crit = (criteria or "").lower()

        # 1. Relevance: Cosine similarity between question + criteria and answer
        reference_text = f"{question_text} {criteria or ''}"
        try:
            tfidf = TfidfVectorizer(stop_words="english")
            vecs = tfidf.fit_transform([reference_text, answer])
            sim = float(cosine_similarity(vecs[0:1], vecs[1:2])[0][0])
            relevance_score = round(min(max(sim * 10.5, 4.0), 9.6), 1)
        except Exception:
            relevance_score = 7.5

        # 2. Technical Accuracy: presence of key technical indicators
        tech_indicators = [
            "function", "component", "state", "database", "api", "query", "index",
            "memory", "performance", "asynchronous", "lifecycle", "table", "key",
            "object", "class", "method", "scope", "thread", "process", "cache"
        ]
        matches = sum(1 for kw in tech_indicators if kw in lower_ans)
        technical_accuracy = round(min(max(5.0 + (matches * 0.7), 4.5), 9.5), 1)

        # 3. Completeness: depth of explanation
        if word_count < 15:
            completeness = 4.5
        elif word_count < 35:
            completeness = 6.8
        elif word_count < 75:
            completeness = 8.4
        else:
            completeness = 9.2

        # 4. Clarity: sentence structure, readability
        sentences = [s.strip() for s in re.split(r"[.!?]+", answer) if len(s.strip()) > 3]
        clarity = 8.5 if len(sentences) >= 2 else 7.0

        # 5. Communication Quality
        communication_quality = 8.4 if word_count >= 25 else 6.5

        # 6. Logical Structure: transition words or step sequences
        structure_markers = ["because", "therefore", "first", "second", "for example", "furthermore", "however", "in addition", "whereas", "while"]
        struct_count = sum(1 for sm in structure_markers if sm in lower_ans)
        logical_structure = round(min(max(6.0 + (struct_count * 0.9), 5.5), 9.4), 1)

        # Composite overall score out of 100
        # Weights: Accuracy 30%, Relevance 25%, Completeness 20%, Structure 10%, Clarity 10%, Comm 5%
        composite_10 = (
            (technical_accuracy * 0.30) +
            (relevance_score * 0.25) +
            (completeness * 0.20) +
            (logical_structure * 0.10) +
            (clarity * 0.10) +
            (communication_quality * 0.05)
        )
        overall_score = round(composite_10 * 10, 1)

        what_went_well = []
        if relevance_score >= 7.0:
            what_went_well.append("Directly addressed the primary intent of the question.")
        if technical_accuracy >= 7.0:
            what_went_well.append("Accurately identified technical terminology and mechanisms.")
        if word_count >= 30:
            what_went_well.append("Articulated a coherent explanation with adequate context.")
        if not what_went_well:
            what_went_well.append("Demonstrated fundamental familiarity with the topic.")

        missing_concepts = []
        if word_count < 40:
            missing_concepts.append("Could benefit from detailing a concrete code or production use case.")
        if struct_count == 0:
            missing_concepts.append("Discussion of performance trade-offs, edge cases, and architectural constraints.")

        suggested_improvements = [
            "Structure your answer using the 'Concept -> Mechanism -> Practical Example' framework.",
            "Discuss real-world constraints such as scale, latency, and failure handling.",
            "Quantify advantages where possible (e.g., algorithmic time complexity, network savings)."
        ]

        sample_improved_answer = (
            f"In a production {target_role} environment, {question_text.rstrip('?')} is best addressed by "
            f"clearly delineating the core architecture, explaining the underlying trade-offs, "
            f"and implementing safe guardrails for scalability and maintainability."
        )

        follow_up_question = f"How would you handle this under high concurrent load or edge-case network partitions in {target_role}?"

        return {
            "overall_score": overall_score,
            "criterion_score_10": round(composite_10, 1),
            "criteria_scores": {
                "relevance": relevance_score,
                "technical_accuracy": technical_accuracy,
                "completeness": completeness,
                "clarity": clarity,
                "communication_quality": communication_quality,
                "logical_structure": logical_structure
            },
            "what_went_well": what_went_well,
            "missing_concepts": missing_concepts or ["Minor edge-case optimizations"],
            "incorrect_statements": [],
            "suggested_improvements": suggested_improvements,
            "sample_improved_answer": sample_improved_answer,
            "recommended_follow_up_topic": f"Advanced {category}",
            "follow_up_question": follow_up_question
        }

evaluation_service = EvaluationService()
