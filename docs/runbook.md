# Ejecucion Local

## Requisitos

- Node.js (backend y frontend)
- Python 3.10+ (servicio IA)
- SQL Server local con instancia `SQLEXPRESS` (o ajusta `.env`)

## Pasos

1. (Opcional) Cargar sketch en Arduino y cerrar el Monitor Serie.
2. Iniciar IA:
   - `python -m uvicorn app:app --host 127.0.0.1 --port 8001`
3. Iniciar backend:
   - `npm run dev` (desde `backend/`)
4. Iniciar frontend:
   - `npm run dev` (desde `frontend/`)
5. Abrir `http://localhost:5173`.

## URLs clave

- Backend: `http://localhost:3000`
- SSE: `http://localhost:3000/events`
- IA: `http://127.0.0.1:8001`
