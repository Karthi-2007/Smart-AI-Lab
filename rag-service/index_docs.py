import os
import glob
import pickle
import requests
import numpy as np

VECTOR_DB_DIR = os.path.join(os.path.dirname(__file__), "vector_store")
os.makedirs(VECTOR_DB_DIR, exist_ok=True)
INDEX_FILE = os.path.join(VECTOR_DB_DIR, "store.pkl")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
EMBED_MODEL = "nomic-embed-text"

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

DOC_FILES = [
    "API_DOCUMENTATION.md",
    "FRONTEND_BACKEND_API_MAPPING.md",
    "PROJECT_WORKFLOW.md",
    "walkthrough.md"
]

CODE_DIRS = [
    os.path.join("backend", "Two Services", "smartlab-service", "src", "main", "java", "com", "smartlab", "controller"),
    os.path.join("backend", "Two Services", "smartlab-service", "src", "main", "java", "com", "smartlab", "entity"),
    os.path.join("backend", "Two Services", "smartlab-service", "src", "main", "java", "com", "smartlab", "service")
]

def chunk_text(text, chunk_size=350, overlap=40):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if len(chunk.strip()) > 30:
            chunks.append(chunk)
    return chunks

def get_ollama_embedding(text, retries=3):
    url = f"{OLLAMA_BASE_URL}/api/embeddings"
    for attempt in range(retries):
        try:
            res = requests.post(url, json={"model": EMBED_MODEL, "prompt": text}, timeout=60)
            if res.status_code == 200:
                vec = np.array(res.json()["embedding"], dtype=np.float32)
                norm = np.linalg.norm(vec)
                return vec / norm if norm > 0 else vec
        except Exception as e:
            if attempt == retries - 1:
                raise e
            import time
            time.sleep(2)
    raise Exception("Failed to obtain Ollama embedding after retries")

def build_index():
    documents = []
    metadatas = []

    print(f"Indexing project files from: {ROOT_DIR}")

    # Index Markdown Docs
    for doc in DOC_FILES:
        filepath = os.path.join(ROOT_DIR, doc)
        if os.path.exists(filepath):
            print(f"  - Indexing doc: {doc}")
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            chunks = chunk_text(content)
            for idx, c in enumerate(chunks):
                documents.append(c)
                metadatas.append({"source": doc, "type": "markdown", "chunk": idx})

    # Index Java Backend Source Files
    for rel_dir in CODE_DIRS:
        abs_dir = os.path.join(ROOT_DIR, rel_dir)
        if os.path.exists(abs_dir):
            for java_file in glob.glob(os.path.join(abs_dir, "*.java")):
                filename = os.path.basename(java_file)
                print(f"  - Indexing code: {filename}")
                with open(java_file, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                chunks = chunk_text(content, chunk_size=250, overlap=30)
                for idx, c in enumerate(chunks):
                    documents.append(c)
                    metadatas.append({"source": filename, "type": "code", "chunk": idx})

    if not documents:
        print("No documents found to index.")
        return

    print(f"\nGenerating Ollama '{EMBED_MODEL}' local embeddings for {len(documents)} chunks...")
    embeddings = []
    for i, doc in enumerate(documents):
        if (i + 1) % 20 == 0 or (i + 1) == len(documents):
            print(f"  Embedded {i + 1}/{len(documents)} chunks...")
        embeddings.append(get_ollama_embedding(doc))

    embeddings = np.array(embeddings, dtype=np.float32)

    store = {
        "documents": documents,
        "metadatas": metadatas,
        "embeddings": embeddings
    }

    os.makedirs(os.path.dirname(INDEX_FILE), exist_ok=True)
    with open(INDEX_FILE, "wb") as f:
        pickle.dump(store, f)
        f.flush()
        os.fsync(f.fileno())

    print(f"\nSuccessfully saved vector store with {len(documents)} chunks to {INDEX_FILE}!")

if __name__ == "__main__":
    build_index()
