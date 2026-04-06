# Backend

## Stack

- Node.js + Express
- SQL Server (`mssql` + `msnodesqlv8`)
- SSE para eventos en tiempo real

## Entrada principal

- `backend/src/app/server.js`

## Estructura actual

- `backend/src/config/`: variables de entorno, DB y CORS.
- `backend/src/db/`: pool de SQL Server.
- `backend/src/infra/sse/`: canal SSE.
- `backend/src/infra/serial/`: placeholder para serial.
- `backend/src/modules/`: funcionalidad por dominio.

## Endpoints

- `GET /` mensaje base del backend.
- `GET /health` estado del backend y DB.
- `GET /events` SSE para lecturas y respuestas IA.
- `POST /simulate/reading` inserta lecturas simuladas y publica SSE.

### POST /simulate/reading

Body esperado:
```json
{
  "deviceId": "sim-ui",
  "sensors": {
    "soilMoisture": 37,
    "airTemp": 26,
    "light": 750,
    "rainRaw": 620
  }
}
```

Respuesta:
```json
{
  "ok": true,
  "stored": true,
  "ts": "2024-01-01T12:00:00",
  "ml": { "...": "..." }
}
```

## Eventos SSE

- `reading`: datos de sensores.
- `ml`: respuesta de la IA.

## Variables de entorno

Archivo: `backend/.env`
```
PORT=3000
ML_URL=http://127.0.0.1:8001
DB_SERVER=localhost
DB_NAME=AgriFlowDB2
DB_DRIVER=msnodesqlv8
DB_INSTANCE=SQLEXPRESS
DB_TRUSTED_CONNECTION=true
```
