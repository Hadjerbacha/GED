from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse  # <-- Ajoutez cette importation
from transformers import pipeline
from pydantic import BaseModel
import logging
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NLP Classification Service")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClassificationRequest(BaseModel):
    text: str
    categories: list[str] | None = None

# Utilisez un modèle plus léger pour de meilleures performances
classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli",  # Modèle plus rapide
    device="cpu"
)

@app.post("/classify")
async def classify_document(request: ClassificationRequest):
    try:
        # Limitez la taille du texte pour éviter les timeouts
        text = request.text[:5000]  # Prendre seulement les 5000 premiers caractères
        categories = request.categories or ["contrat", "rapport", "facture", "cv"]
        
        result = classifier(
            text,
            candidate_labels=categories,
            multi_label=False
        )
        
        return {
            "category": result["labels"][0],
            "confidence": float(result["scores"][0]),
            "all_predictions": dict(zip(result["labels"], result["scores"]))
        }
        
    except Exception as e:
        logging.error(f"Erreur de classification: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": f"Erreur de traitement NLP: {str(e)}"}
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.middleware("http")
async def add_cors_header(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0",
        port=5001,
        workers=1,  # Réduire à 1 worker pour éviter les conflits
        timeout_keep_alive=30
    )

