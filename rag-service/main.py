import os
import pickle
import requests
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="SmartLab Local RAG AI Service")

VECTOR_DB_DIR = os.path.join(os.path.dirname(__file__), "vector_store")
INDEX_FILE = os.path.join(VECTOR_DB_DIR, "store.pkl")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "llama3.1:8b")
EMBED_MODEL = "nomic-embed-text"

def load_store():
    if not os.path.exists(INDEX_FILE):
        return None
    try:
        with open(INDEX_FILE, "rb") as f:
            return pickle.load(f)
    except Exception as e:
        print(f"Error loading index file: {e}")
        return None

def get_ollama_embedding(text):
    url = f"{OLLAMA_BASE_URL}/api/embeddings"
    res = requests.post(url, json={"model": EMBED_MODEL, "prompt": text}, timeout=15)
    if res.status_code == 200:
        vec = np.array(res.json()["embedding"], dtype=np.float32)
        norm = np.linalg.norm(vec)
        return vec / norm if norm > 0 else vec
    else:
        raise Exception(f"Ollama embedding failed with status {res.status_code}")

class QuestionRequest(BaseModel):
    question: str
    model: Optional[str] = DEFAULT_MODEL
    top_k: Optional[int] = 4

class AskResponse(BaseModel):
    answer: str
    sources: List[str]
    model: str
    source: str

@app.get("/")
def read_root():
    store = load_store()
    chunk_count = len(store["documents"]) if store else 0
    return {
        "status": "online",
        "service": "SmartLab Local RAG Engine",
        "indexed_chunks": chunk_count,
        "embed_model": EMBED_MODEL
    }

@app.post("/ask", response_model=AskResponse)
@app.post("/api/chatbot/ask", response_model=AskResponse)
def ask_question(req: QuestionRequest):
    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    q_clean = question.lower()
    if q_clean in ["hello", "hi", "hey", "good morning", "good afternoon"] or q_clean.startswith("hello ") or q_clean.startswith("hi "):
        return AskResponse(
            answer="Hello! I am your Karpagam College of Engineering (KCE) SmartLab AI Assistant. Ask me about equipment availability, lab locations, booking workflows, API endpoints, or database structures!",
            sources=[],
            model=req.model or DEFAULT_MODEL,
            source="SmartLab Assistant"
        )

    store = load_store()
    if not store or not store.get("documents"):
        return AskResponse(
            answer="The project knowledge base is currently empty. Please run index_docs.py to index your files.",
            sources=[],
            model=req.model or DEFAULT_MODEL,
            source="RAG Engine"
        )

    # Encode query with Ollama nomic-embed-text
    try:
        q_emb = get_ollama_embedding(question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate query embedding: {str(e)}")

    embeddings = store["embeddings"]
    documents = store["documents"]
    metadatas = store["metadatas"]

    # Compute Cosine Similarities
    similarities = np.dot(embeddings, q_emb)

    # Sort descending
    top_k = req.top_k or 4
    top_indices = np.argsort(similarities)[::-1][:top_k]

    # Guardrail threshold: if best similarity is too low (< 0.40 cosine similarity), question is out of project scope
    SIMILARITY_THRESHOLD = 0.40
    best_score = similarities[top_indices[0]] if len(top_indices) > 0 else 0

    if best_score < SIMILARITY_THRESHOLD:
        return AskResponse(
            answer="I don't have information about that in this project.",
            sources=[],
            model=req.model or DEFAULT_MODEL,
            source="SmartLab Guardrail"
        )

    valid_chunks = []
    sources = set()
    for idx in top_indices:
        if similarities[idx] >= (SIMILARITY_THRESHOLD - 0.05):
            valid_chunks.append(documents[idx])
            meta = metadatas[idx]
            if meta and "source" in meta:
                sources.add(meta["source"])

    context_str = "\n---\n".join(valid_chunks)

    system_prompt = (
        "You are the dedicated SmartLab AI Assistant for Karpagam College of Engineering.\n"
        "Answer the user's question accurately using ONLY the project context provided below.\n"
        "If the question cannot be answered from the provided context, respond exactly: 'I don't have information about that in this project.'\n"
        "Do NOT hallucinate or use external general knowledge.\n\n"
        f"Context:\n{context_str}\n"
    )

    payload = {
        "model": req.model or DEFAULT_MODEL,
        "prompt": f"{system_prompt}\nUser Question: {question}\n\nAnswer:",
        "stream": False,
        "options": {
            "temperature": 0.2,
            "top_p": 0.9
        }
    }

    try:
        res = requests.post(f"{OLLAMA_BASE_URL}/api/generate", json=payload, timeout=60)
        if res.status_code == 200:
            ans = res.json().get("response", "").strip()
            return AskResponse(
                answer=ans or "I don't have information about that in this project.",
                sources=list(sources),
                model=req.model or DEFAULT_MODEL,
                source="Ollama Local RAG Engine"
            )
    except Exception as e:
        print(f"Ollama generation error: {e}")

    return AskResponse(
        answer="I retrieved relevant project context, but the local Ollama LLM is currently unreachable.",
        sources=list(sources),
        model=req.model or DEFAULT_MODEL,
        source="RAG Vector Engine (Ollama Offline)"
    )

@app.post("/reindex")
def reindex_docs():
    from index_docs import build_index
    build_index()
    store = load_store()
    chunk_count = len(store["documents"]) if store else 0
    return {"status": "success", "indexed_chunks": chunk_count}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
