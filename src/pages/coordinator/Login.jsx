import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "../../styles/global.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Intentionally vague to avoid confirming whether an email address exists.
      setError("Incorrect email or password. Please try again.");
      setLoading(false);
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div className="page-header">
        <div className="container container--narrow">
          <h1 style={{ fontSize: "var(--font-size-2xl)", fontWeight: "var(--font-weight-bold)" }}>
            Family Strengthening Assessment
          </h1>
        </div>
      </div>

      <main id="main-content">
        <div className="container container--narrow" style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-16)" }}>
          <div className="card" style={{ maxWidth: "480px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-2)" }}>
              Coordinator sign in
            </h2>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)" }}>
              Sign in to manage your assessment cohorts and view results.
            </p>

            {error && (
              <div className="alert alert--error" role="alert" style={{ marginBottom: "var(--space-6)" }}>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  aria-required="true"
                />
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--full-width"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p style={{ marginTop: "var(--space-6)", textAlign: "center", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
              Don't have an account?{" "}
              <Link to="/signup">Create one</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
