# CLAUDE.md

This file provides guidance to Claude when working in this workspace.

## How I like to work

**Talk before you act.** Before starting any non-trivial task — creating a file, running a process, making a series of edits — briefly describe your intended approach and ask if it sounds right. A sentence or two is enough. Don't ask for permission on simple or obvious steps.

**Surface choices, don't hide them.** If there are two or more reasonable ways to approach something, say so and give me a quick read on the tradeoffs. Let me decide.

**Check in at natural breakpoints.** On longer tasks, pause after completing a meaningful chunk and confirm the direction before continuing. Don't barrel through to the end if something earlier might change what comes next.

**Ask one question at a time.** If you need clarification, ask the most important question rather than listing several at once.

**Be concise.** Short explanations and direct language. No need to narrate every step — just flag what matters.

**Talk through UX before coding it.** Sheri has a deep UX background and cares about elegance, accessibility, and the feel of interactions — not just whether something works. Before implementing user-facing features, have a real conversation about the experience: what the user sees, what the copy says, what happens at edge cases. Don't jump straight to implementation.

**Design for real-world messiness.** When a solution involves matching, lookup, or comparison, think through predictable inconsistencies upfront — punctuation variants, separators, partial data, wrong fields. Handle them gracefully rather than failing silently and requiring manual cleanup.

**Don't guess at external UI navigation.** When helping with third-party tools (Supabase, Vercel, GitHub, etc.), use conceptual and functional terms confidently ("your API keys," "project settings," "environment variables") but avoid specific menu paths, tab names, or icon descriptions — those change frequently and correcting wrong UI guidance wastes tokens. If precise navigation matters, ask what the user sees rather than guessing.

**Explain technical concepts fully, every time.** When referencing features, behaviors, or prior decisions — especially across sessions — don't assume Sheri remembers the context. Describe what something does in plain terms before explaining how it works. This applies especially to component names, logic names, and anything a non-developer wouldn't recognize from the label alone.

**Don't act after saying you're waiting.** If you've told Sheri you're pausing for her input, don't then take action — even if a background hook fires. If a hook triggers action after you've said you're waiting, explain it explicitly before proceeding: what fired, why, and what you're about to do. Silently acting after saying you're waiting is dismissive.

## Design standards

**Elegance matters.** Prefer solutions that feel considered — good copy, appropriate affordances, smooth edge cases. Avoid clunky fallbacks or bare-bones UI.

**Accessibility is non-negotiable.** Use semantic HTML, ARIA where needed, sufficient touch targets (min 44px), and keyboard navigability.

**Security and correctness over cleverness.** Don't introduce subtle bugs or vulnerabilities for the sake of a terse solution.

## Git and deployment

**Always use a branch and PR — no direct pushes to main, even for bug fixes.** Every PR gets a Vercel preview deployment. That preview is how we verify things work before they go live. Pushing directly to main skips that check.

**Test API-backed and admin features on the Vercel preview before merging.** TypeScript and unit tests won't catch mismatched environment variable names, wrong HTTP methods, or auth failures. A quick manual test on the preview deployment will.

## Documentation standards

**Update docs only when it matters.** When finishing a branch, consider whether README, CONTRIBUTING, and CLAUDE.md need updating — but only if the change genuinely affects what a reader needs to know. Don't update for completeness's sake. Share your reasoning and let Sheri decide if the update is warranted.

**Treat CLAUDE.md as a living document.** When a conversation reveals a working preference, a design principle, or a pattern worth repeating, proactively suggest capturing it. Don't ask constantly — only flag genuinely generalizable insights, and say why you think they're worth adding.

**Keep MEMORY.md current throughout the session.** Log what was built or decided, any data changes made, and anything that would otherwise require Vicki to remember or re-explain next time. Update as things are completed — don't wait for a formal session close. This is the primary continuity mechanism between sessions.

## Coding standards

**Always include tests.** When writing new code, include tests alongside it.

**Don't duplicate small helpers across files.** Things like auth checks, shared formatters, or utility functions that are copy-pasted across multiple files will drift. Extract them to a shared module so there's one place to read, fix, and verify.

**Write tolerant matching logic.** When comparing or looking up data, account for common inconsistencies — punctuation differences, separator variations (& vs. and), missing middle initials, partial titles. Prefer broad discovery with human-readable review over narrow matching that silently fails.

## Voice and writing style

@voice/voice-spec.md
@voice/voice-examples.md

## Output preferences

- Save final outputs to the workspace folder so I can access them
- Always use Markdown for written deliverables — content gets brought into Google Docs where company style is applied


## This Project
We are building the Family Strengthening Self-Assessment Tool — a web-based organizational maturity assessment for child welfare agencies.
The full product requirements are in PRD.md. Read that file before starting any work.
What this tool does
Agencies use it to assess where they stand across 4 themes related to building a family strengthening culture. Multiple staff members at an agency complete the assessment, and their results are aggregated and presented to a coordinator.
The three user flows

Coordinator flow — creates an account, sets up a cohort (an instance of the assessment), gets a unique shareable link, returns later to view aggregated results
Respondent flow — receives the link, optionally identifies their role and unit, completes the assessment anonymously, submits
Results view — coordinator sees maturity level per theme, response distribution, and action items

Stack

Frontend: React
Backend/Database: Supabase (PostgreSQL + Auth + Row Level Security)
Hosting: Vercel or Netlify
Repository: GitHub, permissive open source license (MIT)

Key files

PRD.md — full product requirements, constraints, and open questions
supabase/schema.sql — database schema, run this in Supabase to set up the database
src/assessment.config.js — single source of truth for all questions, scoring logic, maturity levels, and action items. This is the only file that should change when the assessment instrument is updated.

Important constraints

Instrument logic lives in assessment.config.js only — never hardcode questions, scoring, or action items elsewhere
Respondents are fully anonymous — no name, email, or identifying information is collected from respondents. Response writes go through a server function or Supabase service role, never direct table access
Open source — code should be clean, well-commented, and readable by someone who wants to fork and self-host it. The README should clearly state that this project was built using Claude Code by a non-developer, and should be written in a way that welcomes other non-developers to contribute, fork, or adapt it.
No localStorage or sessionStorage
Always use a branch and PR — no direct pushes to main
Always surface assumptions — whenever you make a decision that hasn't been explicitly specified, flag it clearly before proceeding. Don't bury it. A short note like "I'm assuming X because Y — let me know if you'd like a different approach" is the right pattern.
Preview environments for everything — every branch should be deployable to a Vercel preview URL. Structure the project and deployment configuration so that any meaningful change can be reviewed in a live preview environment before merging. When a preview is available, share the URL.

Current status

PRD is complete
Database schema is written (supabase/schema.sql)
Assessment configuration is written (src/assessment.config.js) using Version 1 (scenario-based) questions as a placeholder — the question format is still being finalized by the team between Version 2 (binary) and Version 3 (Likert scale)
No application code has been written yet

Where to start
Begin with project scaffolding: initialize a React app, set up the folder structure, install dependencies (React Router, Supabase JS client), and configure environment variables for Supabase. Check in before writing any application code.
Open questions — do not make assumptions about these, ask first

Auth method for coordinators: email/password vs. magic link
Respondent unit field: free text vs. predefined dropdown
Minimum response threshold before showing results
Final question format: Version 2 (binary) vs. Version 3 (Likert)