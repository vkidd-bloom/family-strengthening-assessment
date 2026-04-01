# Decision Log

Decisions made during the initial build that should be revisited before launch or as the product matures. Flagged by the team for future consideration.

---

## Account Creation Fields

**Current:** Sign-up form collects agency name, email, and password only.
**Decision:** Additional fields (e.g. role, phone, organization type) were deferred to keep onboarding simple.
**Revisit:** What information do we need from coordinators at account creation? Are there fields that would improve the results experience or coordinator management?

---

## Email Confirmation on Sign-Up

**Current:** Email confirmation is disabled. Coordinators can sign in immediately after creating an account.
**Decision:** Disabled to reduce friction during early development and testing.
**Revisit:** Before launch, decide whether to enable email confirmation for security and to verify coordinator email addresses are valid. Consider the tradeoff between friction and data quality.

---

## Answer Option Colors in Respondent Flow

**Current:** Each answer option is color-coded by maturity level (purple = Getting Started, teal = Building Momentum, green = Leading the Way) using a colored left border.
**Decision:** Color coding matches the branding and helps respondents visually connect options to maturity levels.
**Revisit:** Respondents who recognize the color pattern may self-select toward "better" colors rather than answering honestly. Consider whether to remove colors, randomize option order, or hide color until after submission in future iterations.

---

## Results — Response Distribution

**Current:** Response distribution (how many respondents chose each option per question) is not shown.
**Decision:** Keeps the results view focused on maturity level and action items. Reduces complexity for the initial build.
**Revisit:** Distribution data could help coordinators spot disagreement or outlier teams. Consider adding a per-question breakdown or a simple chart once the core results view is validated with real users.

---

## Results Page Layout

**Current:** Results are shown one theme at a time, with navigation between themes.
**Decision:** Keeps each theme focused and avoids an overwhelming wall of information.
**Revisit:** A single scrollable page may be easier to print or share. Consider once real users have interacted with the results view.

---

## Respondent Link — One Per Cohort

**Current:** A single shareable link is generated per cohort. All respondents use the same link — no individual unique links.
**Decision:** Keeps distribution simple. Coordinators copy one link and share it however they like (email, Slack, etc.).
**Revisit:** If there's a future need to track which specific individuals responded (e.g. to send reminders or prevent duplicate submissions), individual links would be needed. For now, respondents are fully anonymous and the shared link model is intentional.

---
