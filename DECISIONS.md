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

## Respondent Link — One Per Cohort

**Current:** A single shareable link is generated per cohort. All respondents use the same link — no individual unique links.
**Decision:** Keeps distribution simple. Coordinators copy one link and share it however they like (email, Slack, etc.).
**Revisit:** If there's a future need to track which specific individuals responded (e.g. to send reminders or prevent duplicate submissions), individual links would be needed. For now, respondents are fully anonymous and the shared link model is intentional.

---
