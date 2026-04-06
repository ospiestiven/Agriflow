# AgriFlow - Documentacion Tecnica Completa

AgriFlow es un sistema inteligente de riego que integra hardware, backend, IA y
visualizacion en tiempo real. Su objetivo es optimizar el uso del agua en
cultivos mediante decisiones automatizadas y control manual desde un panel web.

Esta documentacion toma como base `doc/AgriFlow_Documentacion_Completa.pdf` y
ademas refleja el estado actual del codigo del repositorio.

## 1. Arquitectura General

El sistema se organiza en cuatro capas que operan en modo local (offline):

- **Hardware (Arduino Uno)**: mide variables ambientales y controla la bomba por
  rele.
- **Backend (Node.js/Express)**: recibe datos, guarda lecturas, consulta la IA y
  comunica eventos en tiempo real.
- **IA (FastAPI, Python)**: analiza lecturas y recomienda riego.
- **Frontend (React + Tailwind)**: panel en tiempo real con control manual.

## 2. Flujo de Datos

1. Arduino mide y envia JSON por Serial.
2. Backend recibe lecturas, guarda en la base de datos y llama a la IA.
3. IA responde con recomendacion y el backend publica eventos por SSE.
4. Frontend muestra lecturas y predicciones en vivo.
5. El usuario puede enviar Start/Stop (flujo previsto con Arduino).

En el estado actual, el frontend tambien puede generar una lectura simulada
para pruebas.

## 3. Backend (Node.js/Express)

**Entrada principal**
- `backend/src/app/server.js`

**Estructura (resumen)**
- `backend/src/config/`: carga de variables de entorno, CORS y DB.
- `backend/src/db/`: conexion y pool SQL Server.
- `backend/src/infra/sse/`: servidor SSE.
- `backend/src/modules/`: funcionalidades por dominio.
  - `health`: estado de API y DB.
  - `readings`: simulacion e insercion de lecturas.
  - `sensors`: inicializacion de sensores.
  - `ml`: llamada a servicio IA.
- `backend/src/utils/`: utilidades (tiempo).

**Endpoints principales**
- `GET /` mensaje base.
- `GET /health` estado del backend y DB.
- `GET /events` canal SSE.
- `POST /simulate/reading` inserta lecturas simuladas y dispara SSE.

**Eventos SSE**
- `reading`: `{ ts, deviceId, soilMoisture, airTemp, light, rainRaw, ... }`
- `ml`: salida del servicio IA.

**Variables de entorno (backend/.env)**
```
PORT=3000
ML_URL=http://127.0.0.1:8001
DB_SERVER=localhost
DB_NAME=AgriFlowDB2
DB_DRIVER=msnodesqlv8
DB_INSTANCE=SQLEXPRESS
DB_TRUSTED_CONNECTION=true
```

## 4. Base de Datos (SQL Server)

La app usa SQL Server con autenticacion Windows (`msnodesqlv8`). El backend
asume dos tablas minimas:

**Tabla `Sensores` (minimo esperado)**
- `id_sensor` (PK)
- `nombre`
- `tipo`
- `pin`
- `unidad_medida`

**Tabla `Lecturas` (minimo esperado)**
- `id_lectura` (PK)
- `id_sensor` (FK a `Sensores`)
- `valor`
- `fecha_lectura`

El backend crea automaticamente sensores base si no existen:
Humedad Suelo, Temp Aire DHT11, Luz, Lluvia.

**DDL sugerido (referencial)**
```sql
CREATE TABLE Sensores (
  id_sensor INT IDENTITY(1,1) PRIMARY KEY,
  nombre NVARCHAR(100) NOT NULL,
  tipo NVARCHAR(100) NOT NULL,
  pin NVARCHAR(20) NOT NULL,
  unidad_medida NVARCHAR(20) NOT NULL
);

CREATE TABLE Lecturas (
  id_lectura INT IDENTITY(1,1) PRIMARY KEY,
  id_sensor INT NOT NULL,
  valor FLOAT NOT NULL,
  fecha_lectura DATETIME2 NOT NULL,
  CONSTRAINT FK_Lecturas_Sensores
    FOREIGN KEY (id_sensor) REFERENCES Sensores(id_sensor)
);
```

## 5. IA (FastAPI, Python)

**Archivo principal**
- `ml/app.py`

**Endpoints**
- `GET /health`
- `POST /predict`

**Entrada /predict**
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

**Salida /predict (actual)**
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

**Reglas implementadas hoy**
- Si `soilMoisture < 40` -> riego activado (10 min, 3 LPM).

**Reglas previstas (segun documento original)**
- Ajustes por temperatura, pH y otros factores.

**Variables de entorno (ML)**
- `MODEL_PATH` (default `model.pkl`)
- `MODEL_VERSION` (default `0.1.0`)

## 6. Frontend (React + Tailwind)

**Entrada principal**
- `frontend/src/App.jsx`

El frontend se conecta al backend via SSE:
- `EventSource("http://localhost:3000/events")`

Muestra:
- Lecturas en tiempo real.
- Prediccion IA.
- Boton para enviar lectura simulada.

Actualmente la URL del backend esta hardcodeada en `App.jsx`.

## 7. Ejecucion Local

1. (Opcional) cargar sketch en Arduino y cerrar Monitor Serie.
2. Iniciar IA:
   - `python -m uvicorn app:app --host 127.0.0.1 --port 8001`
3. Iniciar backend:
   - `npm run dev` (desde `backend/`)
4. Iniciar frontend:
   - `npm run dev` (desde `frontend/`)
5. Abrir `http://localhost:5173`.

## 8. Puertos y URLs

- Backend: `http://localhost:3000`
- SSE: `http://localhost:3000/events`
- IA: `http://127.0.0.1:8001`
- Frontend: `http://localhost:5173`

## 9. Observaciones

- El codigo actual contiene caracteres mal codificados (ej: "Â°C"). Conviene
  guardar los archivos en UTF-8 cuando se haga limpieza general.
- El flujo Arduino <-> Backend esta descrito, pero la integracion serial aun es
  un placeholder en `backend/src/infra/serial/serialReader.js`.
