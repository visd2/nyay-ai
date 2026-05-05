.PHONY: help install embed test run-backend run-frontend run docker-up docker-down

help:
	@echo ""
	@echo "🏛️  Nyay AI – Available Commands"
	@echo "──────────────────────────────────"
	@echo "  make install       Install all dependencies"
	@echo "  make embed         Ingest laws + embed into ChromaDB"
	@echo "  make test          Run backend tests"
	@echo "  make run-backend   Start FastAPI backend (port 8000)"
	@echo "  make run-frontend  Start React frontend (port 5173)"
	@echo "  make run           Start both (requires tmux)"
	@echo "  make docker-up     Start with Docker Compose"
	@echo "  make docker-down   Stop Docker containers"
	@echo ""

install:
	@echo "📦 Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ All installed!"

embed:
	@echo "📚 Ingesting laws..."
	cd backend && python ../scripts/ingest_laws.py
	@echo "🔄 Embedding into ChromaDB..."
	cd backend && python ../scripts/embed_and_index.py

test:
	@echo "🧪 Running tests..."
	cd backend && pytest ../tests/ -v

run-backend:
	@echo "🚀 Starting Nyay AI Backend on port 8000..."
	cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload

run-frontend:
	@echo "🌐 Starting Nyay AI Frontend on port 5173..."
	cd frontend && npm run dev

docker-up:
	@echo "🐳 Starting with Docker Compose..."
	docker-compose up --build -d
	@echo "✅ Running at http://localhost:3000"

docker-down:
	docker-compose down
