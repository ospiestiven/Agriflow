# Frontend

## Stack

- React + Vite
- Tailwind CSS

## Entrada principal

- `frontend/src/App.jsx`

## Funcionamiento

- Se conecta a `http://localhost:3000/events` con `EventSource`.
- Escucha eventos `reading` y `ml` para actualizar la UI en tiempo real.
- Tiene un boton para enviar lecturas simuladas a:
  `POST http://localhost:3000/simulate/reading`

## Nota sobre configuracion

Actualmente la URL del backend esta hardcodeada en `App.jsx`. Se recomienda
moverla a una variable `VITE_API_URL` cuando se haga refactor.

## Comandos

Desde `frontend/`:
- `npm run dev`
- `npm run build`
