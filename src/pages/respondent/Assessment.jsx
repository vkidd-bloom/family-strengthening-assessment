/**
 * Assessment.jsx
 *
 * Respondent-facing assessment flow. Accessed via a unique cohort token link.
 * No account required. Responses are fully anonymous.
 *
 * Flow:
 *   Step 0 — Role & unit selection (optional)
 *   Steps 1–4 — One theme per step, questions rendered from assessment_config.js
 *   Submission — Writes to Supabase responses table, redirects to /submitted
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { THEMES } from "../../assessment_config.js";
import "../../styles/global.css";

// Placeholder role options — replace with final values when confirmed
const ROLE_OPTIONS = [
  "Line Staff / Caseworker",
  "Supervisor",
  "Manager",
  "Director / Executive",
  "Other",
];

// Placeholder unit options — replace with agency-specific values when confirmed
const UNIT_OPTIONS = [
  "Intake",
  "Investigation",
  "Family Services",
  "Foster Care",
  "Adoption",
  "Administration",
  "Other",
];

// Total steps = 1 intro step + number of themes
const TOTAL_STEPS = 1 + THEMES.length;

export default function Assessment() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [cohort, setCohort] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Step 0 = role/unit, steps 1–N = themes
  const [step, setStep] = useState(0);

  // Role and unit selections (optional)
  const [role, setRole] = useState("");
  const [unit, setUnit] = useState("");

  // Answers keyed by question ID: { q1: 2, q2: 1, ... }
  const [answers, setAnswers] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Look up the cohort by token on mount
  useEffect(() => {
    async function fetchCohort() {
      const { data, error } = await supabase
        .from("cohorts")
        .select("id, label")
        .eq("token", token)
        .single();

      if (error || !data) {
        setLoadError("This assessment link doesn't seem to be valid. Please check the link and try again.");
      } else {
        setCohort(data);
      }
      setLoading(false);
    }

    fetchCohort();
  }, [token]);

  function handleAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function currentTheme() {
    return THEMES[step - 1];
  }

  function isThemeComplete(theme) {
    return theme.questions.every((q) => answers[q.id] !== undefined);
  }

  function canAdvance() {
    if (step === 0) return true; // role/unit are optional
    return isThemeComplete(currentTheme());
  }

  function progressPercent() {
    return Math.round((step / TOTAL_STEPS) * 100);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("responses").insert({
      cohort_id: cohort.id,
      role: role || null,
      unit: unit || null,
      answers,
    });

    if (error) {
      setSubmitError("Something went wrong submitting your response. Please try again.");
      setSubmitting(false);
      return;
    }

    navigate("/submitted");
  }

  // ─── Loading / error states ───────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-16)" }}>
        <span className="sr-only">Loading assessment…</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <>
        <div className="page-header">
          <div className="container container--narrow">
            <h1 style={{ fontSize: "var(--font-size-2xl)" }}>Family Strengthening Self-Assessment</h1>
          </div>
        </div>
        <main>
          <div className="container container--narrow" style={{ paddingTop: "var(--space-12)" }}>
            <div className="alert alert--error" role="alert">{loadError}</div>
          </div>
        </main>
      </>
    );
  }

  // ─── Step 0: Role & unit ──────────────────────────────────────────────────

  if (step === 0) {
    return (
      <>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <AssessmentHeader cohortLabel={cohort.label} />
        <main id="main-content">
          <div className="container container--narrow" style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-16)" }}>
            <ProgressBar percent={progressPercent()} step={step} total={TOTAL_STEPS} />

            <div className="card" style={{ marginTop: "var(--space-6)" }}>
              <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-3)" }}>
                Before you begin
              </h2>
              <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-8)" }}>
                These questions are optional and help your coordinator understand how responses vary across roles and teams. Your answers are completely anonymous.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                <div className="form-group">
                  <label htmlFor="role" className="form-label">What is your role?</label>
                  <select
                    id="role"
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Prefer not to say</option>
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="unit" className="form-label">What unit or team are you part of?</label>
                  <select
                    id="unit"
                    className="form-select"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option value="">Prefer not to say</option>
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                className="btn btn--primary"
                style={{ marginTop: "var(--space-8)" }}
                onClick={() => setStep(1)}
              >
                Start assessment
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ─── Steps 1–4: Theme question pages ─────────────────────────────────────

  const theme = currentTheme();
  const isLastStep = step === THEMES.length;

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <AssessmentHeader cohortLabel={cohort.label} />
      <main id="main-content">
        <div className="container container--narrow" style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-16)" }}>
          <ProgressBar percent={progressPercent()} step={step} total={TOTAL_STEPS} />

          {/* Theme header */}
          <div style={{ marginTop: "var(--space-6)", marginBottom: "var(--space-6)" }}>
            <p style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-primary-mid)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-2)" }}>
              Theme {step} of {THEMES.length}
            </p>
            <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-3)" }}>
              {theme.label}
            </h2>
            <p style={{ color: "var(--color-text-secondary)", lineHeight: "var(--line-height-relaxed)" }}>
              {theme.description}
            </p>
          </div>

          {/* Questions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            {theme.questions.map((question, qIndex) => (
              <div key={question.id} className="card">
                <p style={{ fontWeight: "var(--font-weight-semibold)", marginBottom: "var(--space-4)", lineHeight: "var(--line-height-base)" }}>
                  {qIndex + 1}. {question.text}
                </p>
                <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                  <legend className="sr-only">{question.text}</legend>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    {question.options.map((option) => {
                      const isSelected = answers[question.id] === option.value;
                      return (
                        <label
                          key={option.value}
                          style={{
                            display: "flex",
                            gap: "var(--space-3)",
                            alignItems: "flex-start",
                            padding: "var(--space-4)",
                            border: `2px solid ${isSelected ? "var(--color-primary)" : "var(--color-border)"}`,
                            borderRadius: "var(--border-radius-md)",
                            background: isSelected ? "var(--color-primary-light)" : "var(--color-bg)",
                            cursor: "pointer",
                            transition: "border-color var(--transition-fast), background var(--transition-fast)",
                          }}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option.value}
                            checked={isSelected}
                            onChange={() => handleAnswer(question.id, option.value)}
                            style={{ marginTop: "3px", accentColor: "var(--color-primary)", flexShrink: 0 }}
                          />
                          <span style={{ lineHeight: "var(--line-height-relaxed)", fontSize: "var(--font-size-sm)" }}>
                            {option.text}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            ))}
          </div>

          {/* Navigation */}
          {submitError && (
            <div className="alert alert--error" role="alert" style={{ marginTop: "var(--space-6)" }}>
              {submitError}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-8)", gap: "var(--space-4)" }}>
            <button
              className="btn btn--secondary"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </button>

            {isLastStep ? (
              <button
                className="btn btn--primary"
                onClick={handleSubmit}
                disabled={!canAdvance() || submitting}
              >
                {submitting ? "Submitting…" : "Submit assessment"}
              </button>
            ) : (
              <button
                className="btn btn--primary"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance()}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function AssessmentHeader({ cohortLabel }) {
  return (
    <div className="page-header">
      <div className="container container--narrow">
        <p style={{ fontSize: "var(--font-size-sm)", color: "rgba(255,255,255,0.75)", marginBottom: "var(--space-1)" }}>
          Family Strengthening Self-Assessment
        </p>
        <h1 style={{ fontSize: "var(--font-size-2xl)", fontWeight: "var(--font-weight-bold)" }}>
          {cohortLabel}
        </h1>
      </div>
    </div>
  );
}

function ProgressBar({ percent, step, total }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
        <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          {step === 0 ? "Getting started" : `Step ${step} of ${total}`}
        </span>
        <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          {percent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Assessment progress"
        style={{
          height: "8px",
          background: "var(--color-border)",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            background: "var(--color-primary)",
            borderRadius: "999px",
            transition: "width var(--transition-base)",
          }}
        />
      </div>
    </div>
  );
}
