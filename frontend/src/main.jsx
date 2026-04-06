// Punto de entrada del frontend y render de React.
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./app/App.jsx";
import './index.css'   // <= IMPORTANTE
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
