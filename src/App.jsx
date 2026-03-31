import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import Login from "./pages/coordinator/Login.jsx";
import SignUp from "./pages/coordinator/SignUp.jsx";
import Dashboard from "./pages/coordinator/Dashboard.jsx";
import CohortSetup from "./pages/coordinator/CohortSetup.jsx";
import Results from "./pages/coordinator/Results.jsx";
import Assessment from "./pages/respondent/Assessment.jsx";
import Submitted from "./pages/respondent/Submitted.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Coordinator flow — protected routes require a signed-in coordinator */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/cohort/new" element={<RequireAuth><CohortSetup /></RequireAuth>} />
          <Route path="/cohort/:id/results" element={<RequireAuth><Results /></RequireAuth>} />

          {/* Respondent flow — no auth required, accessed via unique cohort token link */}
          <Route path="/assess/:token" element={<Assessment />} />
          <Route path="/submitted" element={<Submitted />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
