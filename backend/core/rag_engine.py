import re
from pathlib import Path
from core.embedder import embedder
from core.retriever import retriever
from core.llm_client import generate_legal_answer, generate_draft, check_risk
from models.chat_schema import ChatResponse, LegalReference
from models.draft_schema import DraftResponse, RiskCheckResponse, RiskCategory

TEMPLATES_DIR = Path(__file__).resolve().parent.parent.parent / "knowledge_base" / "templates"


class RAGEngine:
    async def initialize(self):
        embedder.load()
        retriever.initialize()
        if retriever.is_empty:
            print("⚠️  Knowledge base empty. Run: python scripts/embed_and_index.py")

    async def answer_legal_question(self, question: str, history: list, language: str = "hi") -> ChatResponse:
        chunks = retriever.retrieve(query=question)
        if not chunks:
            return ChatResponse(
                answer="माफ करें, इस सवाल के लिए relevant law section नहीं मिला। NALSA helpline 15100 call करें।",
                references=[],
                next_steps=["NALSA helpline 15100 call करें", "Nearest district court Legal Aid Cell से मिलें"],
                confidence=0.0,
            )
        law_context = self._build_context(chunks)
        raw_answer = await generate_legal_answer(question, law_context, history, language)
        references = [
            LegalReference(
                section=c["section"],
                title=c["title"],
                source=c["source"],
                url=c.get("url", ""),
                summary=c["text"][:200] + "...",
            )
            for c in chunks[:3]
        ]
        next_steps = self._extract_next_steps(raw_answer)
        avg_score = sum(c["score"] for c in chunks) / len(chunks)
        return ChatResponse(
            answer=raw_answer,
            references=references,
            next_steps=next_steps,
            confidence=round(avg_score, 2),
        )

    async def generate_legal_draft(self, draft_type: str, details: dict, language: str = "hi") -> DraftResponse:
        template_path = TEMPLATES_DIR / f"{draft_type}.txt"
        template = template_path.read_text(encoding="utf-8") if template_path.exists() else ""
        chunks = retriever.retrieve(query=draft_type.replace("_", " "), top_k=3)
        relevant_laws = [c["section"] for c in chunks]
        draft_text = await generate_draft(draft_type, details, template, language)
        submission_map = {
            "complaint_letter": "Superintendent of Police / Police Station",
            "legal_notice": "Send by Registered Post to respondent",
            "fir_application": "Nearest Police Station",
            "consumer_complaint": "District Consumer Disputes Redressal Forum",
            "salary_complaint": "Labour Commissioner Office",
            "harassment_complaint": "Police Station + Internal Complaints Committee",
            "rent_dispute": "Rent Controller / Civil Court",
        }
        return DraftResponse(
            draft_text=draft_text,
            draft_type=draft_type,
            relevant_laws=relevant_laws,
            where_to_submit=submission_map.get(draft_type, "Relevant authority"),
            tips=[
                "सभी documents की 3 copies रखें",
                "Submit करने पर acknowledgement लें",
                "Lawyer से verify करवाएं submit करने से पहले",
            ],
        )

    async def analyze_risk(self, text: str) -> RiskCheckResponse:
        result = await check_risk(text)
        return RiskCheckResponse(
            category=RiskCategory(result.get("category", "safe")),
            risk_level=result.get("risk_level", 0),
            issues_found=result.get("issues", []),
            applicable_sections=result.get("sections", []),
            safer_alternative=result.get("safer_alternative"),
            explanation=result.get("explanation", ""),
        )

    def _build_context(self, chunks: list) -> str:
        parts = []
        for i, c in enumerate(chunks, 1):
            parts.append(f"[{i}] {c['section']} – {c['title']}\nSource: {c['source']}\n{c['text']}")
        return "\n---\n".join(parts)

    def _extract_next_steps(self, answer: str) -> list:
        steps = []
        for line in answer.splitlines():
            line = line.strip()
            if re.match(r"^(\d+[\.\)]\s|\-\s|\•\s)", line) and len(line) > 10:
                clean = re.sub(r"^[\d\.\)\-\•\*]\s*", "", line).strip()
                if clean:
                    steps.append(clean)
        return steps[:5]


rag_engine = RAGEngine()
