from groq import AsyncGroq
from config import settings
import json

_groq_client = None


def get_groq_client():
    global _groq_client
    if _groq_client is None:
        _groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    return _groq_client


async def generate_legal_answer(
    question: str,
    law_context: str,
    history: list,
    language: str = "auto",
) -> str:
    client = get_groq_client()

    # Language instruction — bilkul clear
    if language == "en":
        lang_rule = "RESPOND IN ENGLISH ONLY. Do NOT use Hindi or Devanagari script anywhere in your response. Full English response."
        lang_force = "ANSWER IN ENGLISH ONLY:"
    elif language == "hi":
        lang_rule = "केवल हिंदी में जवाब दें। कोई English नहीं। पूरा जवाब हिंदी में।"
        lang_force = "केवल हिंदी में जवाब दें:"
    else:
        # Auto detect from question
        hindi_chars = sum(1 for c in question if '\u0900' <= c <= '\u097F')
        if hindi_chars > 3:
            lang_rule = "User wrote in Hindi. Respond in Hindi only."
            lang_force = "हिंदी में जवाब दें:"
        else:
            lang_rule = "User wrote in English/Hinglish. Respond in English only."
            lang_force = "Answer in English only:"

    system = f"""You are Nyay AI — a Digital Legal Assistant for India.

LANGUAGE RULE (HIGHEST PRIORITY — NEVER IGNORE):
{lang_rule}

RESPONSE STYLE:
- Give clear, direct answer like ChatGPT
- Use **bold** for law section names
- Use numbered steps for processes
- Be conversational and helpful
- Always mention specific law sections (IPC Section 406, Payment of Wages Act 1936, etc.)
- Explain what the law means simply
- Tell exactly what steps to take and where to go
- End with a one-line disclaimer: this is information, not legal advice

You have access to relevant Indian law sections below. Use them to give accurate answers."""

    messages = [{"role": "system", "content": system}]

    # Add history
    for msg in history[-6:]:
        messages.append({"role": msg["role"], "content": msg["content"]})

    # User message — language force at the END
    user_content = f"""Law Sections Reference:
{law_context}

---
{lang_force} {question}"""

    messages.append({"role": "user", "content": user_content})

    response = await client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=messages,
        temperature=0.3,
        max_tokens=1500,
    )
    return response.choices[0].message.content


async def generate_draft(
    draft_type: str,
    details: dict,
    template: str,
    language: str = "hi",
) -> str:
    client = get_groq_client()

    lang_instruction = (
        "Write the ENTIRE draft in Hindi (Devanagari script) only."
        if language == "hi"
        else "Write the ENTIRE draft in English only."
    )

    details_text = "\n".join([f"- {k}: {v}" for k, v in details.items()])

    messages = [
        {
            "role": "system",
            "content": f"""You are an expert legal document writer for India.
{lang_instruction}
Write professional, court-ready legal drafts.
Format: Date, To, Subject, Body, Signature.
Fill all details from provided information.
Use [FILL HERE] where info is missing.""",
        },
        {
            "role": "user",
            "content": f"""Draft Type: {draft_type}

Details:
{details_text}

Template Reference:
{template}

Write complete professional draft now.""",
        },
    ]

    response = await client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=messages,
        temperature=0.2,
        max_tokens=2000,
    )
    return response.choices[0].message.content


async def check_risk(text: str) -> dict:
    client = get_groq_client()

    system = """You are a legal risk analyzer for Indian law.
Respond ONLY in valid JSON — no extra text:
{
  "risk_level": 0,
  "category": "safe",
  "issues": [],
  "sections": [],
  "safer_alternative": "",
  "explanation": ""
}
risk_level: 0 to 10
category: "safe" or "warning" or "danger"
explanation: write in same language as the input"""

    response = await client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": f"Analyze for legal risk in India:\n\n{text}"},
        ],
        temperature=0.1,
        max_tokens=600,
        response_format={"type": "json_object"},
    )
    return json.loads(response.choices[0].message.content)
