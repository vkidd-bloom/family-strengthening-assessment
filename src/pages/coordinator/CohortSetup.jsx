import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";
import "../../styles/global.css";

export default function CohortSetup() {
  const { user } = useAuth();
  const [label, setLabel] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createdCohort, setCreatedCohort] = useState(null); // set after successful creation
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Look up the coordinator's organization
    const { data: orgs, error: orgError } = await supabase
      .from("organizations")
      .select("id")
      .eq("created_by", user.id)
      .limit(1);

    if (orgError || !orgs?.length) {
      setError("We couldn't find your organization. Please sign out and sign back in.");
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("cohorts")
      .insert({
        label: label.trim(),
        organization_id: orgs[0].id,
        created_by: user.id,
      })
      .select("id, label, token")
      .single();

    if (insertError) {
      setError("Something went wrong creating your assessment. Please try again.");
      setLoading(false);
      return;
    }

    setCreatedCohort(data);
    setLoading(false);
  }

  function getShareableLink(token) {
    return `${window.location.origin}/assess/${token}`;
  }

  async function handleCopy(token) {
    await navigator.clipboard.writeText(getShareableLink(token));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  // ─── Confirmation screen ───────────────────────────────────────────────────
  if (createdCohort) {
    return (
      <>
        <a href="#main-content" className="skip-link">Skip to main content</a>

        <div className="page-header">
          <div className="container">
            <h1 style={{ fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-bold)" }}>
              Family Strengthening Assessment
            </h1>
          </div>
        </div>

        <main id="main-content">
          <div className="container container--narrow" style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-16)" }}>
            <div className="card" style={{ textAlign: "center", padding: "var(--space-10) var(--space-8)" }}>
              <div style={{ marginBottom: "var(--space-6)" }}>
                {/* Checkmark icon */}
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" style={{ margin: "0 auto" }}>
                  <circle cx="24" cy="24" r="24" fill="var(--color-primary-light)" />
                  <path d="M14 24l8 8 12-14" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-3)" }}>
                Your assessment is ready
              </h2>
              <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)" }}>
                <strong style={{ color: "var(--color-text)" }}>{createdCohort.label}</strong> has been created.
                Share the link below with everyone you'd like to include in this assessment.
                All responses are anonymous.
              </p>

              {/* Shareable link */}
              <div style={{ background: "var(--color-bg-subtle)", border: "1.5px solid var(--color-border)", borderRadius: "var(--border-radius-md)", padding: "var(--space-4)", marginBottom: "var(--space-4)", wordBreak: "break-all", textAlign: "left", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
                {getShareableLink(createdCohort.token)}
              </div>

              <button
                onClick={() => handleCopy(createdCohort.token)}
                className="btn btn--primary btn--full-width"
                style={{ marginBottom: "var(--space-4)" }}
              >
                {copied ? "Copied!" : "Copy link"}
              </button>

              <Link to="/dashboard" className="btn btn--secondary btn--full-width">
                Go to dashboard
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ─── Setup form ───────────────────────────────────────────────────────────
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div className="page-header">
        <div className="container">
          <h1 style={{ fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-bold)" }}>
            Family Strengthening Assessment
          </h1>
        </div>
      </div>

      <main id="main-content">
        <div className="container container--narrow" style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-16)" }}>
          <div className="card" style={{ maxWidth: "480px", margin: "0 auto" }}>
            <Link
              to="/dashboard"
              style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "var(--space-1)", marginBottom: "var(--space-6)" }}
            >
              ← Back to dashboard
            </Link>

            <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-2)" }}>
              Create a new assessment
            </h2>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)" }}>
              Give this assessment a label so you can tell it apart from others on your dashboard — for example, "Whole Agency" or "Intake Team Q1 2026."
            </p>

            {error && (
              <div className="alert alert--error" role="alert" style={{ marginBottom: "var(--space-6)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              <div className="form-group">
                <label htmlFor="label" className="form-label">Assessment label</label>
                <input
                  id="label"
                  type="text"
                  className="form-input"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Whole Agency or Intake Team Q1 2026"
                  required
                  aria-required="true"
                />
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--full-width"
                disabled={loading || !label.trim()}
              >
                {loading ? "Creating…" : "Create assessment"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
