/**
 * Results.jsx
 *
 * Aggregated results view for a cohort. Accessible to the coordinator at any time
 * from the dashboard. Requires a minimum of 5 responses before results are shown.
 *
 * Flow:
 *   Step 0 — Results: overall maturity level + 4 collapsible theme cards
 *   Step 1 — What to do with your results: guidance page before returning to dashboard
 */

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { MATURITY_LEVELS, scoreAssessment } from "../../assessment_config.js";
import "../../styles/global.css";

const MIN_RESPONSES = 5;

const BADGE_CLASS = {
  getting_started: "badge badge--getting-started",
  building_momentum: "badge badge--building-momentum",
  leading_the_way: "badge badge--leading-the-way",
};

function levelIdToNumber(levelId) {
  return Object.entries(MATURITY_LEVELS).find(([, v]) => v.id === levelId)?.[0];
}

export default function Results() {
  const { id: cohortId } = useParams();
  const [cohort, setCohort] = useState(null);
  const [results, setResults] = useState(null);
  const [responseCount, setResponseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0); // 0 = results, 1 = what to do next

  // Track which theme cards are expanded (none by default)
  const [expandedThemes, setExpandedThemes] = useState({});

  useEffect(() => {
    async function fetchResults() {
      const { data: cohortData, error: cohortError } = await supabase
        .from("cohorts")
        .select("id, label")
        .eq("id", cohortId)
        .single();

      if (cohortError || !cohortData) {
        setError("We couldn't load this cohort. Please return to your dashboard and try again.");
        setLoading(false);
        return;
      }

      setCohort(cohortData);

      const { data: responses, error: responsesError } = await supabase
        .from("responses")
        .select("answers")
        .eq("cohort_id", cohortId);

      if (responsesError) {
        setError("We couldn't load responses for this cohort. Please try again.");
        setLoading(false);
        return;
      }

      setResponseCount(responses.length);

      if (responses.length >= MIN_RESPONSES) {
        const aggregated = {};
        responses.forEach(({ answers }) => {
          Object.entries(answers).forEach(([qId, value]) => {
            if (!aggregated[qId]) aggregated[qId] = [];
            aggregated[qId].push(Number(value));
          });
        });

        const averaged = {};
        Object.entries(aggregated).forEach(([qId, values]) => {
          averaged[qId] = values.reduce((a, b) => a + b, 0) / values.length;
        });

        setResults(scoreAssessment(averaged));
      }

      setLoading(false);
    }

    fetchResults();
  }, [cohortId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function toggleTheme(themeId) {
    setExpandedThemes((prev) => ({ ...prev, [themeId]: !prev[themeId] }));
  }

  // ─── Loading / error ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-16)" }}>
        <span className="sr-only">Loading results…</span>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <ResultsHeader cohortLabel="" />
        <main>
          <div className="container container--narrow" style={{ paddingTop: "var(--space-12)" }}>
            <div className="alert alert--error" role="alert">{error}</div>
            <Link to="/dashboard" className="btn btn--secondary" style={{ marginTop: "var(--space-6)" }}>
              Back to dashboard
            </Link>
          </div>
        </main>
      </>
    );
  }

  // ─── Not enough responses ─────────────────────────────────────────────────

  if (responseCount < MIN_RESPONSES) {
    return (
      <>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ResultsHeader cohortLabel={cohort.label} />
        <main id="main-content">
          <div className="container container--narrow" style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-16)" }}>
            <div className="card card--sage" style={{ maxWidth: "520px", textAlign: "center", padding: "var(--space-10) var(--space-8)" }}>
              <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-4)" }}>
                Not enough responses yet
              </h2>
              <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
                Results will be available once at least {MIN_RESPONSES} people have completed the assessment.
              </p>
              <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)" }}>
                <strong style={{ color: "var(--color-text)" }}>{responseCount} of {MIN_RESPONSES}</strong> responses received so far.
              </p>
              <Link to="/dashboard" className="btn btn--secondary">Back to dashboard</Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ─── Step 1: What to do with your results ────────────────────────────────

  if (step === 1) {
    return (
      <>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ResultsHeader cohortLabel={cohort.label} />
        <main id="main-content">
          <div className="container container--narrow" style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-16)" }}>
            <h2 style={{ fontSize: "var(--font-size-3xl)", marginBottom: "var(--space-6)" }}>
              What to do with your results
            </h2>

            {/* Placeholder content — replace with final copy when ready */}
            <div className="card" style={{ marginBottom: "var(--space-6)" }}>
              <p style={{ color: "var(--color-text-secondary)", fontStyle: "italic", lineHeight: "var(--line-height-relaxed)" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p style={{ color: "var(--color-text-secondary)", fontStyle: "italic", lineHeight: "var(--line-height-relaxed)", marginTop: "var(--space-4)" }}>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-4)" }}>
              <button className="btn btn--secondary" onClick={() => setStep(0)}>
                Back to results
              </button>
              <Link to="/dashboard" className="btn btn--primary">
                Back to dashboard
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ─── Step 0: Results ──────────────────────────────────────────────────────

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ResultsHeader cohortLabel={cohort.label} />
      <main id="main-content">
        <div className="container container--narrow" style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-16)" }}>

          <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
            Based on {responseCount} responses
          </p>
          <h2 style={{ fontSize: "var(--font-size-3xl)", marginBottom: "var(--space-6)" }}>
            Your results
          </h2>

          {/* Overall maturity level */}
          <div className="card card--sage" style={{ marginBottom: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <p style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Overall maturity level
            </p>
            <span className={BADGE_CLASS[results.overall.level]} style={{ alignSelf: "flex-start", fontSize: "var(--font-size-base)", padding: "var(--space-2) var(--space-4)" }}>
              {results.overall.levelLabel}
            </span>
            <p style={{ color: "var(--color-text-secondary)", lineHeight: "var(--line-height-relaxed)" }}>
              {MATURITY_LEVELS[levelIdToNumber(results.overall.level)]?.description}
            </p>
          </div>

          {/* Collapsible theme cards */}
          <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
            Expand each theme below to see your maturity level and recommended next steps.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {results.themes.map((themeResult) => {
              const isExpanded = !!expandedThemes[themeResult.themeId];
              return (
                <div key={themeResult.themeId} className="card" style={{ padding: 0, overflow: "hidden" }}>
                  {/* Accordion trigger */}
                  <button
                    onClick={() => toggleTheme(themeResult.themeId)}
                    aria-expanded={isExpanded}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "var(--space-4)",
                      padding: "var(--space-5)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: "var(--font-weight-semibold)", fontSize: "var(--font-size-base)" }}>
                        {themeResult.themeLabel}
                      </span>
                      <span className={BADGE_CLASS[themeResult.level]}>
                        {themeResult.levelLabel}
                      </span>
                    </div>
                    {/* Chevron icon — rotates when expanded */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform var(--transition-base)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Expandable content */}
                  {isExpanded && (
                    <div style={{ padding: "0 var(--space-5) var(--space-5)", borderTop: "1px solid var(--color-border)" }}>
                      <p style={{ color: "var(--color-text-secondary)", lineHeight: "var(--line-height-relaxed)", margin: "var(--space-4) 0" }}>
                        {MATURITY_LEVELS[levelIdToNumber(themeResult.level)]?.description}
                      </p>
                      <h4 style={{ fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)", marginBottom: "var(--space-4)" }}>
                        Recommended next steps
                      </h4>
                      <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", paddingLeft: 0 }}>
                        {themeResult.actionItems.map((item, index) => (
                          <li key={index} style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
                            <span aria-hidden="true" style={{ flexShrink: 0, width: "24px", height: "24px", borderRadius: "50%", background: "var(--color-primary-light)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-bold)", marginTop: "1px" }}>
                              {index + 1}
                            </span>
                            <span style={{ lineHeight: "var(--line-height-relaxed)", fontSize: "var(--font-size-sm)" }}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-8)" }}>
            <button className="btn btn--primary" onClick={() => setStep(1)}>
              What to do with your results
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function ResultsHeader({ cohortLabel }) {
  return (
    <div className="page-header">
      <div className="container container--narrow">
        <p style={{ fontSize: "var(--font-size-sm)", color: "rgba(255,255,255,0.75)", marginBottom: "var(--space-1)" }}>
          Family Strengthening Assessment
        </p>
        <h1 style={{ fontSize: "var(--font-size-2xl)", fontWeight: "var(--font-weight-bold)" }}>
          {cohortLabel ? `${cohortLabel} — Results` : "Results"}
        </h1>
      </div>
    </div>
  );
}
