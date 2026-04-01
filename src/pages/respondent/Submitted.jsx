/**
 * Submitted.jsx
 *
 * Confirmation screen shown after a respondent submits the assessment.
 * Respondents do not see aggregated results — this is coordinator-only.
 */

import "../../styles/global.css";

export default function Submitted() {
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
          <div className="card" style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center", padding: "var(--space-10) var(--space-8)" }}>

            {/* Checkmark icon */}
            <div style={{ marginBottom: "var(--space-6)" }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" style={{ margin: "0 auto" }}>
                <circle cx="24" cy="24" r="24" fill="var(--color-primary-light)" />
                <path d="M14 24l8 8 12-14" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 style={{ fontSize: "var(--font-size-2xl)", marginBottom: "var(--space-4)" }}>
              Thank you for completing the assessment
            </h2>
            <p style={{ color: "var(--color-text-secondary)", lineHeight: "var(--line-height-relaxed)" }}>
              Your response has been recorded. Your answers are completely anonymous and will be combined with your colleagues' responses to give your agency a picture of where it stands.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
