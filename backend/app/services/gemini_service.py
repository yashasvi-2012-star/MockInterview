import json
import logging
import re
from typing import Any, Optional

from fastapi import HTTPException, status

from app.config import get_env, get_gemini_model, load_environment


logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self) -> None:
        load_environment()
        self.model = None
        api_key = get_env("GEMINI_API_KEY")
        model_name = get_gemini_model()

        if not api_key:
            logger.error("GEMINI_API_KEY is not configured.")
            return

        try:
            from google import genai
        except ImportError:
            logger.error("google-genai is not installed.")
            return

        self.client = genai.Client(api_key=api_key)
        self.model_name = model_name
        self.model = self.client.models

    def generate_interview_questions(
        self,
        role: str,
        skills: list[str],
        difficulty: str = "medium",
        question_count: int = 5,
        experience_level: Optional[str] = None,
        interview_type: Optional[str] = None,
    ) -> dict[str, Any]:
        skill_focus = ", ".join(skill.strip() for skill in skills if skill.strip())
        prompt = f"""
        Generate customized interview questions for this exact candidate target.
        Every question must be specific to the role, interview type, experience level, and listed skills.
        Do not use generic, reusable, or hardcoded interview questions.

        Role: {role}
        Skills: {skill_focus or "No explicit skills provided; infer role-relevant skills from the role and interview type"}
        Difficulty: {difficulty}
        Experience Level: {experience_level or "Not specified"}
        Interview Type: {interview_type or "Mixed"}
        Question Count: {question_count}

        Requirements:
        - Create exactly {question_count} questions.
        - Reflect the role in each question.
        - Prefer the provided skills when present.
        - Match the interview type. For behavioral interviews, ask scenario and impact questions. For technical interviews, ask implementation and tradeoff questions. For system design interviews, ask architecture and scaling questions. For mixed interviews, balance categories.
        - Match the expected depth to the experience level.
        - Avoid repeating wording across different roles.

        Return only valid JSON using this structure:
        {{
          "role": "string",
          "difficulty": "easy | medium | hard",
          "questions": [
            {{
              "question_id": "string",
              "question": "string",
              "category": "technical | behavioral | problem_solving | system_design",
              "skill": "string",
              "difficulty": "easy | medium | hard",
              "expected_points": ["string"],
              "evaluation_rubric": {{
                "excellent": "string",
                "good": "string",
                "needs_improvement": "string"
              }}
            }}
          ]
        }}
        """

        self._ensure_model()
        return self._safe_generate_json(prompt)

    def evaluate_candidate_answer(
        self,
        question: str,
        answer: str,
        role: Optional[str] = None,
        expected_points: Optional[list[str]] = None,
    ) -> dict[str, Any]:
        prompt = f"""
        Evaluate the candidate answer for an interview response.

        Role: {role or "Not specified"}
        Question: {question}
        Candidate Answer: {answer}
        Expected Points: {", ".join(expected_points or []) or "Not provided"}

        Return only valid JSON using this structure:
        {{
          "score": 0,
          "max_score": 10,
          "rating": "excellent | good | average | poor",
          "strengths": ["string"],
          "weaknesses": ["string"],
          "missing_points": ["string"],
          "improvement_suggestions": ["string"],
          "feedback": "string"
        }}
        """

        self._ensure_model()
        return self._safe_generate_json(prompt)

    def generate_feedback(
        self,
        role: str,
        evaluations: list[dict[str, Any]],
        interview_metadata: Optional[dict[str, Any]] = None,
    ) -> dict[str, Any]:
        prompt = f"""
        Generate final interview feedback from candidate answer evaluations.

        Role: {role}
        Interview Metadata: {json.dumps(interview_metadata or {}, default=str)}
        Evaluations: {json.dumps(evaluations, default=str)}

        Return only valid JSON using this structure:
        {{
          "overall_score": 0,
          "readiness_level": "ready | almost_ready | needs_practice",
          "summary": "string",
          "key_strengths": ["string"],
          "priority_improvements": ["string"],
          "recommended_topics": ["string"],
          "next_steps": ["string"]
        }}
        """

        self._ensure_model()
        return self._safe_generate_json(prompt)

    def _safe_generate_json(self, prompt: str) -> dict[str, Any]:
        try:
            response = self.model.generate_content(
                model=self.model_name,
                contents=prompt,
                config={
                    "temperature": 0.3,
                    "response_mime_type": "application/json",
                },
            )
            raw_text = getattr(response, "text", "") or ""
            return self._parse_json_response(raw_text)
        except Exception as exc:  # pragma: no cover - external API failures
            logger.warning("Gemini request failed: %s", exc)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI generation service is unavailable.",
            ) from exc

    def _ensure_model(self) -> None:
        if self.model is None:
            logger.error("Gemini model is not initialized. Check GEMINI_API_KEY, google-genai installation, and GEMINI_MODEL.")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI generation service is not configured.",
            )

    @staticmethod
    def _parse_json_response(raw_text: str) -> dict[str, Any]:
        cleaned_text = GeminiService._strip_markdown_fences(raw_text)

        try:
            parsed = json.loads(cleaned_text)
        except json.JSONDecodeError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Gemini returned an invalid JSON response.",
            ) from exc

        if not isinstance(parsed, dict):
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Gemini response must be a JSON object.",
            )

        return parsed

    @staticmethod
    def _strip_markdown_fences(raw_text: str) -> str:
        text = raw_text.strip()
        fenced_match = re.fullmatch(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)

        if fenced_match:
            return fenced_match.group(1).strip()

        return text


def get_gemini_service() -> GeminiService:
    return GeminiService()
