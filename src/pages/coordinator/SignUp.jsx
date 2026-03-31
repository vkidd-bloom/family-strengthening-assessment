import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "../../styles/global.css";

export default function SignUp() {
  const navigate = useNavigate();
  const [agencyName, setAgencyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Create the auth account
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Create the organization record linked to the new user
    const { error: orgError } = await supabase
      .from("organizations")
      .insert({ name: agencyName.trim(), created_by: data.user.id });

    if (orgError) {
      setError("Account created, but we couldn't save your agency name. Please contact support.");
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div className="page-header">
        <div className="container container--narrow">
          <h1 style={{ fontSize: "var(--font-size-2xl)", fontWeight: "var(--font-weight-bold)" }}>
            Family Strengthening Self-Assessment
          </h1>
        </div>
      </div>

      <main id="main-content">
        <div className="container container--narrow" style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-16)" }}>
          <div className="card" style={{ maxWidth: "480px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-2)" }}>
              Create a coordinator account
            </h2>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)" }}>
              Set up your account to create assessments and view results for your agency.
            </p>

            {error && (
              <div className="alert alert--error" role="alert" style={{ marginBottom: "var(--space-6)" }}>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              <div className="form-group">
                <label htmlFor="agency-name" className="form-label">Agency name</label>
                <input
                  id="agency-name"
                  type="text"
                  className="form-input"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  autoComplete="organization"
                  required
                  aria-required="true"
                />
              </div>

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
                  autoComplete="new-password"
                  required
                  aria-required="true"
                  minLength={8}
                />
                <span className="form-hint">Minimum 8 characters</span>
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--full-width"
                disabled={loading}
              >
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p style={{ marginTop: "var(--space-6)", textAlign: "center", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
