# Void Studios

**Cinematic Websites. Powerful Ads. More Customers.**

A production-ready SaaS that turns a business brief into a complete go-to-market
kit: premium website content, multi-platform advertising campaigns, and a full
branding system — generated with AI.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **React 19**
- **TailwindCSS** + shadcn-style UI components
- **Firebase Auth** (email/password, Google, GitHub) + **Firestore**
- **OpenAI** for content generation
- **Razorpay** for subscriptions, payments, webhooks & invoices
- **jose** for signed session JWTs

## Features

- Firebase authentication with protected routes and middleware, session cookies,
  CSRF (double-submit), rate limiting, input validation (zod) and audit logs
- 5-step onboarding wizard that saves projects to the database
- Dashboard: Overview, Website / Ad / Brand generators, Projects, Settings, Billing
- Website generator (hero, about, services, testimonials, CTA, contact, SEO) with
  inline editing and save
- Ad generator (Facebook, Instagram, Google, YouTube)
- Brand generator (positioning, palette, typography, voice, logo concepts)
- Projects CRUD with search & pagination
- Settings: change name / email / password, delete account
- Razorpay checkout → verify → subscribe, billing history and downloadable invoices
- Legal pages: privacy, terms, cookies, refund, contact (functional form)

## Local development

```bash
npm install
cp .env.example .env.local   # optional — see below
npm run dev
```

Open http://localhost:3000.

### Environment variables

All variables are **optional** for local development. Without them the app runs
against a local JSON datastore (`.data/store.json`) with deterministic mock
generation and a fully exercisable mock Razorpay checkout. Provide the secrets in
`.env.local` (see [`.env.example`](./.env.example)) to activate the real
integrations:

| Variable | Enables |
| --- | --- |
| `OPENAI_API_KEY` | Real OpenAI content generation |
| `FIREBASE_SERVICE_ACCOUNT` | Firestore + server-side token verification |
| `FIREBASE_WEBAPP_CONFIG` | Client Firebase config (falls back to committed default) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET` | Live payments & webhooks |
| `SESSION_SECRET` | Production session-cookie signing key |

When `FIREBASE_SERVICE_ACCOUNT` is set the app persists to **Firestore**; deploy
[`firestore.rules`](./firestore.rules) to lock down direct client access.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint

## Deployment (Vercel)

1. Import the `void-studios` directory as the project root.
2. Add the environment variables above.
3. Set the Razorpay webhook to `https://<your-domain>/api/razorpay/webhook`.
4. Deploy `firestore.rules` to your Firebase project.
