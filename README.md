# UrbanLens — AI-Powered Civic Issue Reporting Platform

UrbanLens is a production-grade civic issue reporting platform designed for Indian cities. It uses GPT-4o Vision for automated issue verification and severity assessment, and OpenAI Whisper for multi-lingual voice-to-text reporting (English, Kannada, Hindi).

## Live Demo
- **Frontend**: [https://urbanlens.vercel.app](https://urbanlens.vercel.app)
- **Backend**: [https://urbanlens-production.railway.app](https://urbanlens-production.railway.app)

## Test Accounts (Password: `password123`)
| Role | Email |
| --- | --- |
| Citizen | `tarun.citizen@test.com` |
| Municipal | `tarun.municipal@test.com` |
| Contractor | `tarun.contractor@test.com` |
| Admin | `tarun.admin@test.com` |

## Key Features
- **AI-Powered Verification**: GPT-4o Vision analyzes uploaded images to verify issues, detect categories, and assess severity levels.
- **Duplicate Detection**: Auto-flags nearby reports of the same issue and upgrades priority.
- **Multi-lingual Voice Reporting**: Speak in English, Kannada, or Hindi. Whisper auto-detects the language and transcribes it.
- **Contractor Bidding System**: Smart routing of issues to contractors based on specializations.
- **Interactive Map**: Clustered severity map using Leaflet for municipal oversight.
- **Real-time Notifications**: Keeps all stakeholders updated on progress and assignments.

## Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion, Zustand, i18next, React Leaflet.
- **Backend**: FastAPI, Python, SQLAlchemy, SQLite, JWT Auth.
- **AI**: OpenAI GPT-4o, OpenAI Whisper.

## Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---
*Created with ❤️ by Antigravity*
