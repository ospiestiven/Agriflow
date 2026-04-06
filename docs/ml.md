# IA (FastAPI)

## Ubicacion

- `ml/app.py`

## Dependencias

En `ml/requirements.txt`:
- fastapi
- uvicorn
- numpy
- pydantic
- scikit-learn
- joblib

## Endpoints

- `GET /health` estado del servicio y del modelo.
- `POST /predict` prediccion de riego.

## Entrada /predict
```json
{
  "deviceId": "sim",
  "ts": "2024-01-01T12:00:00",
  "features": {
    "soilMoisture": 37,
    "airTemp": 26,
    "flowLpm": 3,
    "soilPH": 7
  }
}
```

## Salida /predict
```json
{
  "should_irrigate": true,
  "minutes_to_irrigate": 10,
  "recommended_flow_lpm": 3.0,
  "liters_total": 30.0,
  "confidence": 0.5,
  "explain": ["fallback_rules"]
}
```

## Variables de entorno

- `MODEL_PATH` (default `model.pkl`)
- `MODEL_VERSION` (default `0.1.0`)
