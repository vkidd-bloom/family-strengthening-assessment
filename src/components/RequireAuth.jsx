/**
 * RequireAuth.jsx
 *
 * A route wrapper that redirects unauthenticated users to /login.
 * Wrap any coordinator-only route with this component in App.jsx.
 *
 * Example:
 *   <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
