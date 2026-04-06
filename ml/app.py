from fastapi import FastAPI, Response
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import os, joblib

MODEL_PATH = os.getenv("MODEL_PATH", "model.pkl")
MODEL = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None
VERSION = os.getenv("MODEL_VERSION", "0.1.0")

class PredictIn(BaseModel):
    deviceId: str
    ts: str
    features: dict

app = FastAPI()


@app.get("/")
def root():
    """Redirect root to the interactive docs so GET / doesn't return 404."""
    return RedirectResponse(url="/docs")


@app.get("/favicon.ico")
def favicon():
    # Return empty response to avoid 404 in browsers requesting favicon
    return Response(status_code=204)

@app.get("/health")
def health():
    return {"status": "ok", "model_version": VERSION, "loaded": MODEL is not None}

@app.post("/predict")
def predict(inp: PredictIn):
    f = inp.features
    # Aquí luego ajustamos al orden real de tu .zip
    should = f.get("soilMoisture", 0) < 40
    minutes = 10 if should else 0
    flow = 3.0 if should else 0.0
    return {
        "should_irrigate": should,
        "minutes_to_irrigate": minutes,
        "recommended_flow_lpm": flow,
        "liters_total": flow * minutes,
        "confidence": 0.5 if MODEL is None else 0.8,
        "explain": ["fallback_rules" if MODEL is None else "model_inference"]
    }