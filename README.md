# Task Tracker

Minimal React + Vite task tracker using Supabase Auth and Postgres (one `tasks` table protected by Row Level Security), deployed to Netlify from GitHub Actions.

## Local development

```bash
npm install
cp .env.example .env   # fill in your Supabase URL and anon/publishable key
npm run dev
npm test
```

Only the public anon/publishable key is used in the frontend. The service_role/secret key is never used.

## Database

The schema and RLS policies live in `supabase/migrations/`. Apply them to a linked project with:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```

## CI/CD

`.github/workflows/ci.yml` runs on every push to `main`: `npm test`, then `npm run build`, then deploys `dist/` to Netlify production. Deployment only runs if tests and build succeed.

The Netlify site is not connected to the Git repository, so Netlify never builds or deploys on its own (`netlify.toml` also cancels any Netlify-side build as a safeguard).

Required GitHub Actions secrets:

| Secret | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL (public, baked into the build) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/publishable key (public, baked into the build) |
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token used by the deploy job |
| `NETLIFY_SITE_ID` | Netlify site ID |
