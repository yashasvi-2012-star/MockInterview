import io
import re
from collections import Counter
from typing import Any

from fastapi import HTTPException, UploadFile, status


class ResumeService:
    allowed_content_types = {
        "text/plain",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }

    technical_skills = {
        "python",
        "java",
        "javascript",
        "typescript",
        "react",
        "node",
        "fastapi",
        "django",
        "flask",
        "mongodb",
        "postgresql",
        "mysql",
        "redis",
        "docker",
        "kubernetes",
        "aws",
        "azure",
        "gcp",
        "git",
        "rest",
        "graphql",
        "machine learning",
        "deep learning",
        "pandas",
        "numpy",
        "scikit-learn",
        "tensorflow",
        "pytorch",
        "sql",
        "html",
        "css",
    }

    soft_skills = {
        "leadership",
        "communication",
        "collaboration",
        "problem solving",
        "ownership",
        "mentoring",
        "teamwork",
        "adaptability",
        "critical thinking",
    }

    ats_keywords = {
        "experience",
        "projects",
        "skills",
        "education",
        "certifications",
        "achievements",
        "responsibilities",
        "metrics",
        "impact",
        "built",
        "developed",
        "implemented",
        "optimized",
        "designed",
        "deployed",
        "managed",
    }

    @classmethod
    async def analyze_resume(cls, file: UploadFile, user_id: str) -> dict[str, Any]:
        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded resume file is empty.",
            )

        cls._validate_file(file)
        extracted_text = cls.extract_text(file.filename or "", file.content_type or "", content)
        normalized_text = cls._normalize_text(extracted_text)

        if len(normalized_text) < 100:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Unable to extract enough resume text for analysis.",
            )

        skill_analysis = cls.analyze_skills(normalized_text)
        ats_score = cls.calculate_ats_score(normalized_text, skill_analysis)
        suggestions = cls.generate_improvement_suggestions(normalized_text, skill_analysis, ats_score)

        return {
            "user_id": user_id,
            "file_name": file.filename,
            "ats_score": ats_score,
            "skill_analysis": skill_analysis,
            "improvement_suggestions": suggestions,
            "text_summary": {
                "word_count": len(normalized_text.split()),
                "character_count": len(normalized_text),
                "detected_sections": cls.detect_sections(normalized_text),
            },
        }

    @classmethod
    def extract_text(cls, filename: str, content_type: str, content: bytes) -> str:
        extension = filename.lower().rsplit(".", 1)[-1] if "." in filename else ""

        if content_type == "text/plain" or extension == "txt":
            return content.decode("utf-8", errors="ignore")

        if content_type == "application/pdf" or extension == "pdf":
            return cls._extract_pdf_text(content)

        if (
            content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            or extension == "docx"
        ):
            return cls._extract_docx_text(content)

        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported resume format. Upload a TXT, PDF, or DOCX file.",
        )

    @classmethod
    def analyze_skills(cls, text: str) -> dict[str, Any]:
        technical_matches = cls._find_keyword_matches(text, cls.technical_skills)
        soft_skill_matches = cls._find_keyword_matches(text, cls.soft_skills)

        return {
            "technical_skills": technical_matches,
            "soft_skills": soft_skill_matches,
            "technical_skill_count": len(technical_matches),
            "soft_skill_count": len(soft_skill_matches),
            "top_repeated_terms": cls._top_repeated_terms(text),
        }

    @classmethod
    def calculate_ats_score(cls, text: str, skill_analysis: dict[str, Any]) -> dict[str, Any]:
        detected_sections = cls.detect_sections(text)
        keyword_matches = cls._find_keyword_matches(text, cls.ats_keywords)
        word_count = len(text.split())

        section_score = min(len(detected_sections) * 10, 40)
        keyword_score = min(len(keyword_matches) * 3, 30)
        skill_score = min(skill_analysis["technical_skill_count"] * 2, 20)
        length_score = 10 if 350 <= word_count <= 900 else 5 if 200 <= word_count < 350 else 0
        total_score = min(section_score + keyword_score + skill_score + length_score, 100)

        return {
            "score": total_score,
            "grade": cls._score_grade(total_score),
            "matched_keywords": keyword_matches,
            "breakdown": {
                "sections": section_score,
                "keywords": keyword_score,
                "skills": skill_score,
                "length": length_score,
            },
        }

    @classmethod
    def generate_improvement_suggestions(
        cls,
        text: str,
        skill_analysis: dict[str, Any],
        ats_score: dict[str, Any],
    ) -> list[str]:
        suggestions: list[str] = []
        sections = cls.detect_sections(text)

        for section in ["experience", "projects", "skills", "education"]:
            if section not in sections:
                suggestions.append(f"Add a clear {section.title()} section to improve ATS parsing.")

        if skill_analysis["technical_skill_count"] < 6:
            suggestions.append("Include more role-relevant technical skills using exact industry keywords.")

        if not re.search(r"\b\d+%|\b\d+\+|\b\d+x|\b\d+\s+(users|clients|projects|requests)\b", text):
            suggestions.append("Add measurable impact using numbers, percentages, scale, or performance metrics.")

        if ats_score["score"] < 70:
            suggestions.append("Use standard resume headings and concise bullet points for better ATS compatibility.")

        if len(text.split()) < 350:
            suggestions.append("Expand key work experience and project descriptions with responsibilities and outcomes.")

        return suggestions or ["Resume is well structured. Continue tailoring keywords to each job description."]

    @classmethod
    def detect_sections(cls, text: str) -> list[str]:
        sections = ["summary", "experience", "projects", "skills", "education", "certifications"]
        return [section for section in sections if re.search(rf"\b{section}\b", text)]

    @classmethod
    def _validate_file(cls, file: UploadFile) -> None:
        filename = file.filename or ""
        extension = filename.lower().rsplit(".", 1)[-1] if "." in filename else ""
        supported_extension = extension in {"txt", "pdf", "docx"}
        supported_type = file.content_type in cls.allowed_content_types

        if not supported_extension and not supported_type:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Unsupported resume format. Upload a TXT, PDF, or DOCX file.",
            )

    @staticmethod
    def _extract_pdf_text(content: bytes) -> str:
        try:
            from pypdf import PdfReader
        except ImportError as exc:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="PDF extraction requires the optional 'pypdf' package.",
            ) from exc

        reader = PdfReader(io.BytesIO(content))
        return "\n".join(page.extract_text() or "" for page in reader.pages)

    @staticmethod
    def _extract_docx_text(content: bytes) -> str:
        try:
            from docx import Document
        except ImportError as exc:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="DOCX extraction requires the optional 'python-docx' package.",
            ) from exc

        document = Document(io.BytesIO(content))
        return "\n".join(paragraph.text for paragraph in document.paragraphs)

    @staticmethod
    def _normalize_text(text: str) -> str:
        return re.sub(r"\s+", " ", text).strip().lower()

    @staticmethod
    def _find_keyword_matches(text: str, keywords: set[str]) -> list[str]:
        return sorted(keyword for keyword in keywords if re.search(rf"\b{re.escape(keyword)}\b", text))

    @staticmethod
    def _top_repeated_terms(text: str) -> list[dict[str, Any]]:
        words = re.findall(r"\b[a-z][a-z0-9+#.-]{2,}\b", text)
        stop_words = {"and", "the", "for", "with", "from", "that", "this", "are", "was", "were"}
        counts = Counter(word for word in words if word not in stop_words)
        return [{"term": term, "count": count} for term, count in counts.most_common(10)]

    @staticmethod
    def _score_grade(score: int) -> str:
        if score >= 85:
            return "excellent"
        if score >= 70:
            return "good"
        if score >= 50:
            return "average"
        return "needs_improvement"
