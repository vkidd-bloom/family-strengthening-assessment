import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/coordinator/Login.jsx";
import Dashboard from "./pages/coordinator/Dashboard.jsx";
import CohortSetup from "./pages/coordinator/CohortSetup.jsx";
import Results from "./pages/coordinator/Results.jsx";
import Assessment from "./pages/respondent/Assessment.jsx";
import Submitted from "./pages/respondent/Submitted.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Coordinator flow */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cohort/new" element={<CohortSetup />} />
        <Route path="/cohort/:id/results" element={<Results />} />

        {/* Respondent flow — :token is the unique cohort identifier */}
        <Route path="/assess/:token" element={<Assessment />} />
        <Route path="/submitted" element={<Submitted />} />
      </Routes>
    </BrowserRouter>
  );
}
