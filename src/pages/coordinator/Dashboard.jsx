import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";
import "../../styles/global.css";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCohorts() {
      const { data, error } = await supabase
        .from("cohorts")
        .select("id, label, token, created_at, responses(count)")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError("We couldn't load your cohorts. Please refresh and try again.");
      } else {
        setCohorts(data);
      }
      setLoading(false);
    }

    fetchCohorts();
  }, [user.id]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Page header */}
      <div className="page-header">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-4)" }}>
          <h1 style={{ fontSize: "var(--font-size-xl)", fontWeight: "var(--font-weight-bold)" }}>
            Family Strengthening Assessment
          </h1>
          <button
            onClick={handleSignOut}
            className="btn btn--secondary"
            style={{ borderColor: "rgba(255,255,255,0.5)", color: "var(--color-text-on-primary)" }}
          >
            Sign out
          </button>
        </div>
      </div>

      <main id="main-content">
        <div className="container" style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-16)" }}>

          {/* Page title row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
            <h2 style={{ fontSize: "var(--font-size-3xl)" }}>Your assessments</h2>
            {cohorts.length > 0 && (
              <Link to="/cohort/new" className="btn btn--primary">
                Create new assessment
              </Link>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <p style={{ color: "var(--color-text-secondary)" }}>Loading your assessments…</p>
          )}

          {/* Error state */}
          {error && (
            <div className="alert alert--error" role="alert">{error}</div>
          )}

          {/* Empty state — first-time coordinator */}
          {!loading && !error && cohorts.length === 0 && (
            <div className="card card--sage" style={{ maxWidth: "600px", textAlign: "center", padding: "var(--space-12) var(--space-8)" }}>
              <h3 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-4)" }}>
                Welcome — let's get started
              </h3>
              <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)", lineHeight: "var(--line-height-relaxed)" }}>
                You're all set up. Create your first assessment to get a shareable link you can send to your team. Their responses will be aggregated here so you can see where your agency stands.
              </p>
              <Link to="/cohort/new" className="btn btn--primary">
                Create your first assessment
              </Link>
            </div>
          )}

          {/* Cohort list */}
          {!loading && !error && cohorts.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {cohorts.map((cohort) => {
                const responseCount = cohort.responses?.[0]?.count ?? 0;
                const hasEnoughResponses = responseCount >= 5;

                return (
                  <div key={cohort.id} className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-4)" }}>
                    <div>
                      <h3 style={{ fontSize: "var(--font-size-lg)", marginBottom: "var(--space-1)" }}>
                        {cohort.label}
                      </h3>
                      <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
                        {responseCount} {responseCount === 1 ? "response" : "responses"}
                        {!hasEnoughResponses && (
                          <span> · Results available after 5 responses</span>
                        )}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/assess/${cohort.token}`;
                          navigator.clipboard.writeText(url);
                        }}
                        className="btn btn--secondary"
                        style={{ fontSize: "var(--font-size-sm)" }}
                      >
                        Copy link
                      </button>
                      {hasEnoughResponses ? (
                        <Link
                          to={`/cohort/${cohort.id}/results`}
                          className="btn btn--primary"
                          style={{ fontSize: "var(--font-size-sm)" }}
                        >
                          View results
                        </Link>
                      ) : (
                        <button
                          className="btn btn--primary"
                          disabled
                          style={{ fontSize: "var(--font-size-sm)" }}
                          aria-disabled="true"
                          title="Results will be available once 5 or more responses have been submitted"
                        >
                          View results
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
