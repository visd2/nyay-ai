# ⚖️ Nyay AI – Digital Legal Assistant (India)

> **Har Indian ka apna AI Legal Assistant** – law sections, proof-based answers, draft generator, risk checker.

---

## ⚠️ Disclaimer
Nyay AI ek **legal information assistant** hai. Yeh lawyer nahi hai.
Serious legal matters mein please ek qualified lawyer se consult karein.
Free legal aid ke liye NALSA helpline: **15100**

---

## 🚀 Quick Start (5 steps)

### Step 1 – Clone & Setup
```bash
git clone https://github.com/yourname/nyay-ai.git
cd nyay-ai
cp .env.example .env
# .env mein apna GROQ_API_KEY add karein
```

### Step 2 – Get Free API Key
1. https://console.groq.com pe jaao
2. Free account banao
3. API key copy karo → `.env` mein paste karo

### Step 3 – Install & Embed Laws
```bash
make install    # dependencies install
make embed      # laws ko ChromaDB mein index karo
```

### Step 4 – Run Backend
```bash
make run-backend
# API available at: http://localhost:8000
# Docs at: http://localhost:8000/docs
```

### Step 5 – Run Frontend
```bash
make run-frontend
# App available at: http://localhost:5173
```

---

## 🐳 Docker (Production)
```bash
make docker-up     # Start everything
# App: http://localhost:3000
make docker-down   # Stop
```

---

## 📁 Project Structure
```
nyay-ai/
├── backend/              ← FastAPI + RAG Engine
│   ├── main.py           ← Entry point
│   ├── config.py         ← Settings
│   ├── api/              ← Endpoints (chat, draft, risk, voice)
│   ├── core/             ← RAG pipeline (embedder, retriever, LLM)
│   └── models/           ← Pydantic schemas
├── knowledge_base/
│   ├── raw_laws/         ← Law JSON files (IPC, Constitution, etc.)
│   ├── templates/        ← Draft templates
│   └── vector_store/     ← ChromaDB (auto-generated)
├── frontend/             ← React + Tailwind
│   └── src/
│       ├── pages/        ← Home, Chat, Draft, Risk, About
│       ├── components/   ← MessageBubble, RiskAlert, DraftCard, etc.
│       └── services/     ← API calls, Voice, Storage
├── scripts/              ← Data ingestion & testing
└── tests/                ← pytest test suite
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server status |
| POST | `/api/chat` | Legal Q&A with references |
| POST | `/api/draft` | Generate legal document |
| GET | `/api/draft/types` | List draft types |
| POST | `/api/risk` | Check text for legal risk |
| POST | `/api/voice/transcribe` | Audio → text (Whisper) |

---

## 💡 Features
- 🧾 **Legal Chat** – Hindi/English mein law explain, section reference ke saath
- 📑 **Proof-Based Answers** – Har jawab mein India Code source
- 📝 **Draft Generator** – FIR, complaint letter, legal notice, consumer complaint
- ⚠️ **Risk Checker** – Text mein legal risk detect karo
- 🎤 **Voice Input** – Hindi mein bolo, AI samjhega
- 🔒 **RAG System** – Hallucination minimum, accurate answers

---

## 🛠️ Tech Stack
- **Backend**: FastAPI + Python 3.11
- **LLM**: Groq (Llama 3 70B) – Free API
- **RAG**: LangChain + ChromaDB + sentence-transformers
- **Frontend**: React 18 + Tailwind CSS + Vite
- **Deployment**: Render (backend) + Vercel (frontend)

---

## 📊 Adding More Laws

1. `knowledge_base/raw_laws/` mein nayi JSON file add karo
2. Format:
```json
[
  {
    "section": "IPC Section XYZ",
    "title": "Section Title",
    "text": "Full section text...",
    "source": "India Code",
    "url": "https://indiacode.nic.in/...",
    "category": "criminal"
  }
]
```
3. Re-embed: `make embed`

---

## 📞 Legal Resources
- **NALSA Free Legal Aid**: 15100
- **Consumer Helpline**: 1800-11-4000
- **eCourts**: https://ecourts.gov.in
- **RTI Online**: https://rtionline.gov.in
- **Tele Law**: https://tele-law.in

---

Made with ❤️ for India | Open Source | Not affiliated with any government body
