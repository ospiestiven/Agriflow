import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Dashboard from "../pages/Dashboard.jsx";
import Readings from "../pages/Readings.jsx";
import AiRules from "../pages/AiRules.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ScrollToHash from "../components/ScrollToHash.jsx";

export default function App() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <div className="min-h-screen bg-app text-slate-900 layout">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />

        <Sidebar activeSection={activeSection} />

        <main className="page">
          <ScrollToHash offset={110} />
          <Routes>
            <Route
              path="/dashboard"
              element={<Dashboard onSectionChange={setActiveSection} />}
            />
            <Route path="/readings" element={<Readings />} />
            <Route path="/ai" element={<AiRules />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
