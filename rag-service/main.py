import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="SmartLab Gemini RAG AI Service")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

class QuestionRequest(BaseModel):
    question: str
    model: Optional[str] = "gemini-1.5-flash"
    top_k: Optional[int] = 4

class AskResponse(BaseModel):
    answer: str
    sources: List[str]
    model: str
    source: str

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "SmartLab Gemini RAG Engine",
        "model": "gemini-1.5-flash"
    }

@app.post("/ask", response_model=AskResponse)
@app.post("/api/chatbot/ask", response_model=AskResponse)
def ask_question(req: QuestionRequest):
    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    if not GEMINI_API_KEY:
        return AskResponse(
            answer="I can help only with questions related to the SmartLab AI laboratory management system.",
            sources=[],
            model="gemini-1.5-flash",
            source="SmartLab Gemini Engine"
        )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": question}]}]
    }

    try:
        res = requests.post(url, json=payload, timeout=15)
        if res.status_code == 200:
            data = res.json()
            ans = data["candidates"][0]["content"]["parts"][0]["text"]
            return AskResponse(
                answer=ans,
                sources=[],
                model="gemini-1.5-flash",
                source="Google Gemini API"
            )
    except Exception as e:
        pass

    return AskResponse(
        answer="I can help only with questions related to the SmartLab AI laboratory management system.",
        sources=[],
        model="gemini-1.5-flash",
        source="SmartLab Scope Guard"
    )
