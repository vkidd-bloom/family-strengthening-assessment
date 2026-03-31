# Product Requirements Document
## Family Strengthening Self-Assessment Tool

---

## Overview

A web-based organizational maturity assessment tool for child welfare agencies. Agencies use it to evaluate where they stand in building a culture of family strengthening, and to identify concrete next steps for improvement.

The tool collects responses from multiple staff members within an agency (or a team or program within an agency), aggregates them, and presents results to a coordinator — showing a maturity level across four themes plus an overall maturity level, and corresponding action items.

---

## Background

The instrument was developed by Bloom Works and is currently in concept testing as a PDF. Testing revealed that the PDF format breaks down when multiple people need to take the assessment and have their results aggregated. This app replaces the PDF with a hosted, multi-respondent web experience.

---

## Guiding Principles

- **No vendor lock-in.** The tool must be open source and self-hostable. Any agency or implementer with technical capacity should be able to run their own instance. The codebase lives on GitHub under a permissive license.
- **Low barrier for end users.** Agencies are unlikely to have strong technical capabilities. They should be able to initiate an assessment, share it with their team, and view results without any technical knowledge.
- **Respondent anonymity.** Individual responses are never attributable to a specific person. Respondents do not create accounts.
- **Instrument agnosticism.** The question format is still being finalized (see Assessment Instrument section). The app architecture must allow the scoring logic and question format to be updated in a single configuration file without touching core application code.

---

## The Assessment Instrument

### Structure
- 19 questions across 4 themes
- 3 maturity levels: **Getting Started**, **Building Momentum**, **Leading the Way**
- Each theme produces its own maturity level independently
- An overall maturity level is calculated across all themes
- Results include a maturity level per theme, an overall maturity level, and 3–5 action items tied to each theme's level

### Themes and Question Counts
1. Leadership & Vision — 6 questions
2. Workforce — 4 questions
3. Family Engagement Practices & Tools — 5 questions
4. Community Partnerships & Resources — 4 questions

### Question Format — TBD

Three question format options have been explored. The current codebase implements Version 1 as a placeholder, but the team is likely moving to either Version 2 or Version 3. That decision is pending.

**Version 1 — Scenario-based (current placeholder)**
Each question presents three paragraph-length scenarios, one per maturity level. The respondent selects the scenario that best describes their agency. Each option maps directly to a maturity level, making scoring straightforward.

**Version 2 — Binary per sub-question**
Each question is broken into 2–3 sub-questions answered with: Yes / Somewhat / Not Yet / I'm not sure. More granular than Version 1 but requires a translation layer to arrive at a maturity level score.

**Version 3 — Likert scale statements**
Each question is broken into 2–3 statements rated on a 5-point scale: Never / Rarely / Sometimes / Often / Always. Provides the richest signal per question and aggregates most cleanly across multiple respondents. Also requires a scoring translation layer.

When the format is finalized, only the assessment configuration file needs to change — both the question/response structure and the scoring translation logic are defined there.

### Scoring
- Each question produces a numeric score
- Theme score = mean of question scores within that theme
- Overall score = mean across all theme scores
- Theme and overall maturity levels are determined by score thresholds
- Score thresholds and the translation logic from raw responses to numeric scores are both defined in the configuration file and should be adjustable there without touching application code
- Action items are scoped to the earned level for each theme

### Configuration
All questions, response options, scoring thresholds, maturity level definitions, and action items live in a single file: `assessment.config.js`. This is the only file that needs to change when the instrument is updated, including changes to question format or scoring logic.

---

## User Flows

### 1. Coordinator Flow

The coordinator is an admin, executive, or program manager at an agency who initiates the assessment and receives results.

**Account creation**
- Coordinator creates an account with email and password (or magic link — TBD)
- Account is required so coordinators can return to view results days or weeks later

**Cohort setup**
- After logging in, coordinator creates a new cohort
- Required fields: agency name, cohort label (e.g. "Whole Agency" or "Intake Team — Q1 2026")
- On creation, the app generates a unique shareable link for that cohort
- The coordinator copies and shares this link with respondents (via email, Slack, etc. — outside the app)
- Coordinator can see how many responses have been submitted but does not see results in real time — results are reviewed when they choose to, not pushed

**Results view**
- Coordinator visits their dashboard, selects a cohort, and views aggregated results
- Results show: maturity level per theme, overall maturity level, response count, distribution of responses, and action items for each theme's level
- Results can optionally be filtered by role or unit (if respondents provided that information)
- Results are not real-time — the page tallies current responses on load
- **Results must be shareable** — the coordinator should be able to share a results view with others in leadership (e.g. via a shareable link or export). The sharing mechanism is TBD.
- **Minimum response threshold** — if a coordinator filters or drills down to a specific unit or role slice, that filtered view must not be shown unless the slice meets the minimum response threshold. Responses from small units are still included in overall cohort aggregation — the threshold only applies to isolated/filtered views. The minimum threshold is TBD but must be enforced, not just flagged.

---

### 2. Respondent Flow

The respondent is a staff member who receives the shareable link from a coordinator.

- Lands on assessment via shared link — no account required
- Optionally selects their **role** (e.g. Line Staff, Supervisor, Manager, Director) and **unit** (free text or dropdown — TBD) before beginning
- Completes all 19 questions across 4 themes
- Submits
- Cannot re-submit via the same browser session (soft prevention — not cryptographically enforced)

**Note:** Whether and how respondents should see results is an open question. See Open Questions.

---

### 3. Results View

Accessible to the coordinator after logging in, subject to the minimum response threshold.

**Per theme:**
- Maturity level earned (Getting Started / Building Momentum / Leading the Way)
- Visual representation of response distribution across the 3 levels
- 3–5 action items corresponding to the earned level

**Overall:**
- A single overall maturity level calculated across all themes
- Summary view showing all 4 theme levels at a glance
- Response count and optional breakdown by role or unit

**Full journey view:**
- The action items shown in the main results view are scoped to the earned level only
- A separate component of the app (not part of the assessment flow itself) should allow users to see the full set of action items across all three maturity levels for each theme — useful for understanding the complete arc of development

**Shareability:**
- The coordinator must be able to share results with others in leadership
- The sharing mechanism is TBD (options include a shareable read-only link, a PDF export, or both)

**Future consideration:** ability to compare results across cohorts over time (e.g. a repeat assessment 12–18 months later) — not required in v1 but the data model should not preclude it.

---

## Technical Requirements

### Stack
- **Frontend:** React
- **Backend/Database:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Hosting:** Vercel or Netlify
- **Repository:** GitHub, MIT open source license

### Data Model

**`organizations`**
- `id` (uuid)
- `name` (text)
- `created_at`

**`cohorts`**
- `id` (uuid)
- `organization_id` → organizations
- `label` (text)
- `token` (text, unique) — used in shareable respondent link
- `created_by` → auth.users
- `created_at`

**`responses`**
- `id` (uuid)
- `cohort_id` → cohorts
- `role` (text, nullable)
- `unit` (text, nullable)
- `answers` (jsonb) — keyed by question ID, values depend on scoring format
- `submitted_at`

### Security
- Row Level Security (RLS) enabled on all tables
- Coordinators can only read cohorts and responses they created
- Respondents insert responses without an account — handled via a server function or Supabase service role, not direct table access
- No personal data collected from respondents
- Results must not be shown to coordinators until the minimum response threshold is met

### Constraints
- No localStorage or sessionStorage
- Instrument logic lives in `assessment.config.js` — not in the database
- Questions are not user-generated and do not need a CMS

---

## Out of Scope for V1

- Real-time result updates for coordinators
- Multi-language support
- White-labeling for individual agencies
- Comparison across cohorts over time (data model should allow for it; UI not required)
- Self-service question editing by coordinators

---

## Open Questions

1. **Auth method:** Email/password vs. magic link for coordinator accounts
2. **Respondent unit field:** Free text vs. predefined dropdown (predefined would enable cleaner aggregation but requires coordinators to configure it)
3. **Hosting responsibility:** Who runs the hosted instance — Bloom Works, a fiscal sponsor, or a partner? This has implications for sustainability and the open source story
4. **Question format:** Version 2 (binary) vs. Version 3 (Likert) — team decision in progress
5. **Minimum response threshold:** What is the minimum number of responses required before results are shown to a coordinator?
6. **Respondent results:** Should respondents see any results after submitting? If so, what — individual results, a summary, or something else? Or should results be visible only to coordinators?
7. **Results sharing mechanism:** Should the coordinator share results via a read-only link, a PDF export, or both?
