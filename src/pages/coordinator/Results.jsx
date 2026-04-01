/**
 * Results.jsx
 *
 * Aggregated results view for a cohort. Accessible to the coordinator at any time
 * from the dashboard. Requires a minimum of 5 responses before results are shown.
 *
 * Flow:
 *   Step 0 — Overview: overall maturity level + summary table of all 4 themes
 *   Steps 1–4 — One theme per step: maturity badge, description, action items
 */

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { THEMES, MATURITY_LEVELS, scoreAssessment } from "../../assessment_config.js";
import "../../styles/global.css";

const MIN_RESPONSES = 5;

// Maps maturity level ID to CSS class for badge styling
const BADGE_CLASS = {
  getting_started: "badge badge--getting-started",
  building_momentum: "badge badge--building-momentum",
  leading_the_way: "badge badge--leading-the-way",
};

export default function Results() {
  const { id: cohortId } = useParams();
  const [cohort, setCohort] = useState(null);
  const [results, setResults] = useState(null);
  const [responseCount, setResponseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    async function fetchResults() {
      // Load cohort metadata
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

      // Load all responses for this cohort
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
        // Aggregate answers — for each question, average the numeric values across all responses
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

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // ─── Loading / error states ───────────────────────────────────────────────

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

  // ─── Not enough responses yet ─────────────────────────────────────────────

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
              <Link to="/dashboard" className="btn btn--secondary">
                Back to dashboard
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const totalSteps = 1 + THEMES.length; // overview + one per theme

  // ─── Step 0: Overview ─────────────────────────────────────────────────────

  if (step === 0) {
    return (
      <>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ResultsHeader cohortLabel={cohort.label} />
        <main id="main-content">
          <div className="container container--narrow" style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-16)" }}>
            <ResultsProgressBar step={step} total={totalSteps} />

            <div style={{ marginTop: "var(--space-6)" }}>
              <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
                Based on {responseCount} responses
              </p>
              <h2 style={{ fontSize: "var(--font-size-3xl)", marginBottom: "var(--space-6)" }}>
                Results overview
              </h2>

              {/* Overall maturity level */}
              <div className="card card--sage" style={{ marginBottom: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <p style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Overall maturity level
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
                  <span className={BADGE_CLASS[results.overall.level]} style={{ fontSize: "var(--font-size-base)", padding: "var(--space-2) var(--space-4)" }}>
                    {results.overall.levelLabel}
                  </span>
                </div>
                <p style={{ color: "var(--color-text-secondary)", lineHeight: "var(--line-height-relaxed)" }}>
                  {MATURITY_LEVELS[levelIdToNumber(results.overall.level)]?.description}
                </p>
              </div>

              {/* Theme summary table */}
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Theme maturity levels">
                  <thead>
                    <tr style={{ background: "var(--color-bg-subtle)", borderBottom: "1px solid var(--color-border)" }}>
                      <th style={{ padding: "var(--space-3) var(--space-5)", textAlign: "left", fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)" }}>
                        Theme
                      </th>
                      <th style={{ padding: "var(--space-3) var(--space-5)", textAlign: "left", fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)" }}>
                        Maturity level
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.themes.map((theme, index) => (
                      <tr key={theme.themeId} style={{ borderBottom: index < results.themes.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <td style={{ padding: "var(--space-4) var(--space-5)", fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-medium)" }}>
                          {theme.themeLabel}
                        </td>
                        <td style={{ padding: "var(--space-4) var(--space-5)" }}>
                          <span className={BADGE_CLASS[theme.level]}>
                            {theme.levelLabel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-8)" }}>
                <button className="btn btn--primary" onClick={() => setStep(1)}>
                  See theme details
                </button>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ─── Steps 1–4: Theme detail pages ───────────────────────────────────────

  const themeResult = results.themes[step - 1];
  const isLastStep = step === THEMES.length;

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ResultsHeader cohortLabel={cohort.label} />
      <main id="main-content">
        <div className="container container--narrow" style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-16)" }}>
          <ResultsProgressBar step={step} total={totalSteps} />

          <div style={{ marginTop: "var(--space-6)" }}>
            {/* Theme header */}
            <p style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-primary-mid)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-2)" }}>
              Theme {step} of {THEMES.length}
            </p>
            <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-4)" }}>
              {themeResult.themeLabel}
            </h2>

            {/* Maturity level badge */}
            <div className="card card--sage" style={{ marginBottom: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <p style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Maturity level
              </p>
              <span className={BADGE_CLASS[themeResult.level]} style={{ alignSelf: "flex-start", fontSize: "var(--font-size-base)", padding: "var(--space-2) var(--space-4)" }}>
                {themeResult.levelLabel}
              </span>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "var(--line-height-relaxed)" }}>
                {MATURITY_LEVELS[levelIdToNumber(themeResult.level)]?.description}
              </p>
            </div>

            {/* Action items */}
            <div className="card">
              <h3 style={{ fontSize: "var(--font-size-lg)", marginBottom: "var(--space-5)" }}>
                Recommended next steps
              </h3>
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

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-8)", gap: "var(--space-4)" }}>
              <button className="btn btn--secondary" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
              {isLastStep ? (
                <Link to="/dashboard" className="btn btn--primary">
                  Back to dashboard
                </Link>
              ) : (
                <button className="btn btn--primary" onClick={() => setStep((s) => s + 1)}>
                  Next theme
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Converts maturity level ID string to the numeric key used in MATURITY_LEVELS
function levelIdToNumber(levelId) {
  return Object.entries(MATURITY_LEVELS).find(([, v]) => v.id === levelId)?.[0];
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function ResultsHeader({ cohortLabel }) {
  return (
    <div className="page-header">
      <div className="container container--narrow">
        <p style={{ fontSize: "var(--font-size-sm)", color: "rgba(255,255,255,0.75)", marginBottom: "var(--space-1)" }}>
          Family Strengthening Self-Assessment
        </p>
        <h1 style={{ fontSize: "var(--font-size-2xl)", fontWeight: "var(--font-weight-bold)" }}>
          {cohortLabel ? `${cohortLabel} — Results` : "Results"}
        </h1>
      </div>
    </div>
  );
}

function ResultsProgressBar({ step, total }) {
  const percent = Math.round((step / total) * 100);
  const label = step === 0 ? "Overview" : `Theme ${step} of ${total - 1}`;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
        <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>{label}</span>
        <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Results progress"
        style={{ height: "8px", background: "var(--color-border)", borderRadius: "999px", overflow: "hidden" }}
      >
        <div style={{ height: "100%", width: `${percent}%`, background: "var(--color-primary)", borderRadius: "999px", transition: "width var(--transition-base)" }} />
      </div>
    </div>
  );
}
