# Family Strengthening Self-Assessment Tool

A web-based organizational maturity assessment for child welfare agencies. Agencies use it to assess where they stand across four themes related to building a family strengthening culture. Multiple staff members complete the assessment anonymously, and their results are aggregated and presented to a coordinator.

---

## About this project

This tool was built by a non-developer using [Claude Code](https://claude.ai/code) by Anthropic. If you're a non-developer who wants to fork, adapt, or self-host this tool for your own organization — you're welcome here. The project is intentionally structured to be readable and modifiable without deep technical expertise.

If you're a developer, the stack is straightforward: React frontend, Supabase for the database and auth, deployed on Vercel.

---

## What it does

**Three user flows:**

1. **Coordinator** — Creates an account, sets up a cohort (one instance of the assessment), gets a unique shareable link, and returns later to view aggregated results.
2. **Respondent** — Opens the link, optionally identifies their role and unit, completes the assessment anonymously, and submits.
3. **Results** — The coordinator sees an overall maturity level, per-theme maturity levels with expandable recommendations, and guidance on what to do next.

**The assessment** covers four themes:
- Leadership & Vision
- Workforce
- Family Engagement Practices & Tools
- Community Partnerships & Resources

Each theme has scenario-based questions with three response options corresponding to maturity levels: Getting Started, Building Momentum, and Leading the Way.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Routing | React Router |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| Hosting | Vercel |
| Source control | GitHub |

---

## Project structure

```
├── src/
│   ├── assessment_config.js      # ← Single source of truth for all questions,
│   │                             #   scoring, maturity levels, and action items.
│   │                             #   This is the only file that changes when the
│   │                             #   assessment instrument is updated.
│   ├── App.jsx                   # Routing
│   ├── main.jsx                  # Entry point
│   ├── lib/
│   │   ├── supabase.js           # Supabase client
│   │   └── AuthContext.jsx       # Auth session provider
│   ├── components/
│   │   └── RequireAuth.jsx       # Redirects unauthenticated users to /login
│   ├── pages/
│   │   ├── coordinator/
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CohortSetup.jsx
│   │   │   └── Results.jsx
│   │   └── respondent/
│   │       ├── Assessment.jsx
│   │       └── Submitted.jsx
│   └── styles/
│       └── global.css            # Design tokens and base styles
├── supabase/
│   └── supabase_schema.sql       # Database schema — run this in Supabase to set up
├── DECISIONS.md                  # Log of deferred design decisions to revisit
├── PRD.md                        # Full product requirements document
└── vercel.json                   # Vercel routing config
```

---

## Setting up your own instance

You'll need accounts with [GitHub](https://github.com), [Supabase](https://supabase.com), and [Vercel](https://vercel.com). All have free tiers that are sufficient for this project.

### 1. Fork and clone the repository

Click **Fork** on GitHub to create your own copy, then clone it to your computer.

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Open the SQL Editor in your project and paste the contents of `supabase/supabase_schema.sql`, then run it
3. In your Supabase Auth settings, turn off **Enable email confirmations** if you want coordinators to be able to sign in immediately after creating an account (recommended for getting started)
4. Note your **Project URL** and **anon public key** from the API settings — you'll need these in the next step

### 3. Set environment variables

Copy `.env.example` to a new file called `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Install dependencies and run locally

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Deploy to Vercel

1. Push your fork to GitHub
2. Go to [vercel.com](https://vercel.com) and create a new project, importing your GitHub repository
3. Add your Supabase environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings before deploying
4. Deploy — Vercel will automatically build and deploy your app, and will create preview deployments for every branch going forward

---

## Customizing the assessment

**All assessment content lives in `src/assessment_config.js`.** This is the only file you need to edit to change questions, response options, scoring thresholds, maturity level descriptions, or action items. The rest of the application reads from this file — nothing is hardcoded elsewhere.

The file is structured and commented to make editing straightforward even if you're not a developer.

---

## Customizing the unit dropdown

The respondent flow includes an optional unit/team dropdown. The placeholder options are defined at the top of `src/pages/respondent/Assessment.jsx` in the `UNIT_OPTIONS` array. Replace those values with the teams or units relevant to your agency.

---

## Contributing

Contributions are welcome. If you're a non-developer, the most valuable contributions are:
- Feedback on the assessment instrument (edit `src/assessment_config.js`)
- Copywriting improvements
- Accessibility issues you've noticed

If you're a developer:
- Open an issue before starting significant work so we can discuss the approach
- Follow the existing code style — readable over clever
- Every PR should include tests for new logic

---

## License

MIT — free to use, fork, and adapt. See [LICENSE](LICENSE) for details.

---

## Built with

This project was built using [Claude Code](https://claude.ai/code) by a non-developer. The AI wrote the code; the humans made the decisions.
