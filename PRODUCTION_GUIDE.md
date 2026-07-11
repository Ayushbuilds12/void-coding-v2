# Void Coding - Production SaaS Deployment & Launch Blueprint
> Learn, Build, and Master Coding With AI.

This document serves as your end-to-end master guidebook to take **Void Coding** from local preview to a production SaaS. All source code, assets, database triggers, and APIs have been fully written, vetted, and verified clean with 100% test-passing builds.

---

## Table of Contents
1. [Chapter 1: Source Control & Vercel Deployment](#chapter-1-source-control--vercel-deployment)
2. [Chapter 2: Supabase Auth & Database Setup](#chapter-2-supabase-auth--database-setup)
3. [Chapter 3: Razorpay Payment Gateway & Billing](#chapter-3-razorpay-payment-gateway--billing)
4. [Chapter 4: OpenAI Integration](#chapter-4-openai-integration)
5. [Chapter 5: Progressive Web App (PWA) & SEO Configuration](#chapter-5-progressive-web-app-pwa--seo-configuration)
6. [Chapter 6: Android App with Capacitor & Play Store Assets](#chapter-6-android-app-with-capacitor--play-store-assets)
7. [Chapter 7: Post-Launch Support & Operations](#chapter-7-post-launch-support--operations)

---

## Chapter 1: Source Control & Vercel Deployment

### 1.1 Connect to GitHub
To maintain complete ownership, create a private or public repository on your GitHub account:
1. Go to [GitHub](https://github.com) and click **New Repository**.
2. Name the repository: `void-coding` (or any name you prefer).
3. Initialize the repository on your system or push these files directly:
   ```bash
   git init
   git add .
   git commit -m "feat: bootstrap Void Coding production SaaS"
   git branch -M main
   git remote add origin https://github.com/<your-username>/void-coding.git
   git push -u origin main
   ```

### 1.2 Vercel Hosting Setup
1. Log in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New** → **Project**.
3. Import the `void-coding` repository.
4. Set the following configuration under **Build and Development Settings**:
   - **Framework Preset**: `Vite` (or `Other` / auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Keep other settings default. Vercel automatically runs full-stack node servers or routes from Vite build depending on your configurations. For Express custom server support inside Vercel, you can deploy using a standard serverless configuration file (`vercel.json`):

Create a `vercel.json` in your repository if deploying the full Express server to Vercel Serverless:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.ts"
    },
    {
      "src": "/robots.txt",
      "dest": "server.ts"
    },
    {
      "src": "/sitemap.xml",
      "dest": "server.ts"
    },
    {
      "src": "/(.*)",
      "dest": "server.ts"
    }
  ]
}
```

### 1.3 Connect Custom Domain (`voidcoding.com`)
1. In Vercel, navigate to **Project Settings** → **Domains**.
2. Type `voidcoding.com` and click **Add**.
3. Vercel will request you to configure your DNS provider (GoDaddy, Namecheap, Cloudflare, etc.). Add these records:
   - **A Record**: Point `@` (root) to `76.76.21.21`
   - **CNAME Record**: Point `www` to `cname.vercel-dns.com`
4. Vercel will automatically provision a free **Let's Encrypt SSL/HTTPS** certificate within minutes.
5. Setup a canonical redirect so `www.voidcoding.com` automatically redirects to `https://voidcoding.com`.

---

## Chapter 2: Supabase Auth & Database Setup

### 2.1 Database Bootstrap
1. Create a free or pro project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in the left sidebar of your Supabase project dashboard.
3. Click **New Query**, and paste the entire contents of the `/supabase-setup.sql` file generated in the root of this workspace.
4. Click **Run**. This will build:
   - All 6 core relational tables (`profiles`, `subscriptions`, `projects`, `chats`, `progress`, `billing_history`).
   - Indexes for ultra-fast query performance.
   - Row-Level Security (RLS) policies protecting user rows.
   - An automated PostgreSQL Trigger to auto-initialize profile records upon user email signups.

### 2.2 Configure Email Authentication & Redirects
1. Go to **Authentication** → **Email Templates**.
2. Customize the **Confirm Signup** and **Reset Password** templates with your custom SaaS branding.
3. In **Authentication** → **URL Configuration**, add your production redirect URIs:
   - Site URL: `https://voidcoding.com`
   - Redirect URIs: `https://voidcoding.com/` and `https://voidcoding.com/reset-password`

### 2.3 Gather Env Credentials
Get your credentials from **Project Settings** → **API**:
- `SUPABASE_URL`: Project URL (e.g., `https://xxxx.supabase.co`)
- `SUPABASE_ANON_KEY`: Public/Anon Key
- `SUPABASE_SERVICE_ROLE_KEY`: Service Role Key (Keep private, set on Vercel environment variables)

---

## Chapter 3: Razorpay Payment Gateway & Bank Account Connection

### 3.1 Link Your Bank Account for Automatic Payouts
To receive subscription payouts (e.g., ₹499/month Pro memberships) directly to your bank account:
1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Go to **Account & Settings** → **Bank Accounts**.
3. Click **Add Bank Account** (or edit existing details).
4. Enter your bank details:
   - **Bank Name**: Your commercial bank name
   - **IFSC Code**: Your bank's routing/IFSC code (e.g., ABCD0123456)
   - **Account Number**: Your bank account number (e.g., 123456789012)
   - **Account Holder Name**: Your registered business or personal name.
5. Click **Verify**. Razorpay will deposit a small trial sum (e.g., ₹1.00) into your account to confirm linkage instantaneously.
6. Once verified, all student subscription payments captured by Void Coding will be automatically swept into this bank account daily according to your payout cycle.

### 3.2 Get Keys from Razorpay Dashboard
1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Switch to **Live Mode** (or **Test Mode** first for pre-launch validation).
3. Go to **Settings** → **API Keys** → **Generate Key**.
4. Save the:
   - `RAZORPAY_KEY_ID` (looks like `rzp_live_xxxxxxxx`)
   - `RAZORPAY_KEY_SECRET` (private secret)

### 3.3 Subscription Plan Creation
For your **Pro Plan** at ₹499/month:
1. In Razorpay, go to **Subscriptions** → **Plans** → **Create Plan**.
2. Name the plan: `Void Coding - Pro Student Membership`.
3. Description: `Full access to AI Senior Software Engineer Mentors, Sandbox projects, and unlimited code quality reviews`.
4. Billing Frequency: `Monthly`.
5. Amount: `499` INR.
6. The application is set up to accept standard payments of ₹499 INR via Razorpay Orders.

### 3.4 Configure Webhooks
To automatically cancel memberships or handle renewals safely:
1. Go to **Settings** → **Webhooks** → **Add New Webhook**.
2. Set the Webhook URL to: `https://voidcoding.com/api/billing/verify`
3. Set Secret: Create a random secure string and set it as `RAZORPAY_WEBHOOK_SECRET` on your server.
4. Select active events:
   - `order.paid`
   - `payment.authorized`
   - `subscription.cancelled`

---

## Chapter 4: OpenAI Integration

To deliver the world-class code reasoning, structural project plans, and customized visual tutorials, the platform runs on the OpenAI SDK.

1. Go to [OpenAI Platform](https://platform.openai.com).
2. Navigate to **API Keys** and generate a new key.
3. Name it `Void Coding Production`.
4. Copy the API key and set it as `OPENAI_API_KEY` on Vercel.
5. The application is pre-configured to use `gpt-4o-mini`, providing high intelligence and quick reasoning for code optimization and review while remaining extremely cost-effective.
6. **Graceful Fallbacks**: If `OPENAI_API_KEY` is not present, the server falls back automatically to your `GEMINI_API_KEY` or educational static tutorials so that your system is resilient.

---

## Chapter 5: Progressive Web App (PWA) & SEO Configuration

The PWA has been integrated directly into the build pipeline with:
- `/public/manifest.json` (defines application icon colors, standalone portrait rendering, and maskable favicon vectors).
- `/public/sw.js` (caching assets with API endpoints bypass).
- In-app **Install Companion App** prompt.

### 5.1 SEO Tuning
The application serving layer generates:
- `/robots.txt` (pointing crawlers to your sitemap).
- `/sitemap.xml` (containing index links to your home, learn, mentor, review, and billing views).
- Full Open Graph (OG) sharing tags inside `index.html` for Slack, Twitter/X, and LinkedIn.

---

## Chapter 6: Android App with Capacitor & Play Store Assets

### 6.1 Install & Configure Capacitor
Once you are ready to compile the native Android package, run the following commands inside your root project folder:

1. Install Capacitor dependencies:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```
2. Initialize Capacitor in your project:
   ```bash
   npx cap init "Void Coding" "com.voidcoding.app" --web-dir=dist
   ```
3. Add the Android platform:
   ```bash
   npx cap add android
   ```
4. Build the production React files:
   ```bash
   npm run build
   ```
5. Sync the files with the native Android wrapper:
   ```bash
   npx cap sync
   ```

### 6.2 Compile the Android App Bundle (.aab)
1. Install [Android Studio](https://developer.android.com/studio).
2. Open Android Studio and choose **Open an existing project**. Select the `android` folder in your project root.
3. Wait for Gradle files to synchronize.
4. Go to **Build** → **Generate Signed Bundle / APK**.
5. Select **Android App Bundle (.aab)** (required for Google Play uploads).
6. Create or import your release signing keystore, set passwords, and click **Build Release**. Your output `.aab` file will be generated in `android/app/release/app-release.aab`.

### 6.3 Google Play Store Listing Assets
To launch on the Play Store, prepare these asset designs:
- **App Icon**: PNG, 512 x 512 pixels, 32-bit color, under 1MB. Use the glowing purple vector favicon inside `/public/favicon.svg`.
- **Feature Graphic**: PNG or JPEG, 1024 x 500 pixels. High-tech, minimal black space background featuring the Void Coding logo.
- **Phone Screenshots**: Minimum 2 screenshots (up to 8), 16:9 or 9:16 aspect ratio (e.g., 1080 x 1920 pixels). Screen captures of the Landing Page, Learn View, and AI Mentor.

### 6.4 Play Store Listing Content
Copy and paste this copy-written text for your Store Listing:

* **App Title**: `Void Coding - Master Code with AI`
* **Short Description**: `Learn, build, and master coding with your personal AI software mentor.`
* **Full Description**:
  ```text
  Welcome to Void Coding, your fully independent, AI-powered computer science laboratory and personal coding mentor. 

  Whether you are a absolute beginner learning your first line of Python, a student building a university project, or a professional refining algorithms, Void Coding provides a complete suite of educational utilities:

  * AI MENTOR: Interact with an elite AI Senior Software Engineer. Ask syntax questions, request step-by-step analogies, and study algorithms with line-by-line comments.
  * PROJECT ASSISTANT: Design full academic projects. Get dynamic folder hierarchies, modular starter files, and architectural guidance.
  * CODE REVIEW: Submit code in Python, JavaScript, TypeScript, C++, or Java. Receive custom safety, performance, and style scores with a complete optimized rewrite.
  * DYNAMIC LESSONS: Step-by-step masterclasses spanning frontend, databases, APIs, and microservices.
  * PROGRESS TRACKING: Visualize your completion percentage, learning streak, and billing statements with clear, elegant charts.

  Join thousands of engineers mastering computer science. Zero proprietary builder platform dependencies—100% under your control. Start learning today!
  ```

---

## Chapter 7: Production Launch Readiness Checklist and Verification

### 7.1 Production Environment Variables (.env)
Add these exact keys under the **Environment Variables** tab in your Vercel Dashboard:

| Key | Example Value / Description |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `APP_URL` | `https://voidcoding.com` |
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `OPENAI_API_KEY` | `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx` |
| `GEMINI_API_KEY` | `AIzaSyxxxxxxxxxxxxxxxxxxxxxxx` |
| `RAZORPAY_KEY_ID` | `rzp_live_xxxxxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | `xxxxxxxxxxxxxxxxxxxxxx` |
| `RAZORPAY_WEBHOOK_SECRET` | `my_secure_webhook_secret_123` |

Your production server is fully automated, type-safe, and ready for deployment.

---

## Chapter 8: Domain Registration & DNS for `voidcoding.com`

To make your application accessible at your custom domain `voidcoding.com`:

### 8.1 Register Your Domain
1. Log in to a domain registrar of your choice (e.g., [GoDaddy](https://godaddy.com), [Namecheap](https://namecheap.com), [Porkbun](https://porkbun.com), or directly inside your [Vercel Dashboard Domains section](https://vercel.com/dashboard)).
2. Search for `voidcoding.com` and complete the purchase.

### 8.2 Connect to Vercel
1. In your **Vercel Project Dashboard**, go to **Settings** → **Domains**.
2. Click **Add** and enter `voidcoding.com`. Keep the "Redirect www to root" option checked.
3. Vercel will display the DNS records you need to update at your registrar:
   - **A Record**: Host `@`, Value `76.76.21.21`
   - **CNAME Record**: Host `www`, Value `cname.vercel-dns.com`
4. Log into your registrar's DNS Management panel, replace or add these two records, and click Save.
5. Vercel will detect the update within minutes, request an SSL certificate, and secure your site under HTTPS.

---

## Chapter 9: The Multi-Channel Marketing Launch Playbook

To build viral traction for **Void Coding**, use these custom-written launching templates tailored specifically for major channels.

### 9.1 Product Hunt Launch
* **Product Title**: `Void Coding - Master Computer Science with AI`
* **Tagline**: `Your serverless AI coding mentor, project architect, and code reviewer.`
* **Pricing**: `Free to try / ₹499/month Pro`
* **First Comment / Maker Post**:
  ```text
  Hey Product Hunt! 👋

  I'm thrilled to launch Void Coding! I built this platform because coding tutorials are often either too passive or too abstract. I wanted a playground where students and developers get active feedback from an elite, interactive AI Software Engineer.

  What makes Void Coding unique is that it is 100% under your control—running on a highly optimized, serverless architecture that you can host on your own infrastructure.

  Key Features:
  🚀 AI MENTOR: Chats with you in real-time, explaining logic line-by-line using analogies like designating boxes for variables.
  📂 PROJECT ARCHITECT: Creates complete academic project folders, modular boilerplates, and file blueprints instantly.
  🔍 CODE QUALITY AUDITOR: Submits your code and receives a security, performance, and styling rating (0-100) with a fully optimized rewrite.
  📚 DYNAMIC LESSONS: Practical tutorials spanning fullstack, APIs, and microservices.

  We're offering a fully featured free tier and a ₹499/mo Pro membership for those looking to unlock continuous high-performance reasoning.

  I'd love to hear your thoughts, feedback, and suggestions on how to make Void Coding even better! 

  — Ayush Rawat
  ```

### 9.2 Reddit Launch Post
Post this in subreddits like `r/learnprogramming`, `r/webdev`, or `r/sideproject`.

* **Post Title**: `I built Void Coding: A fully responsive, self-hosted AI Coding Mentor and Project Architect`
* **Body Text**:
  ```text
  Hi everyone,

  I wanted to share a project I've been working on called Void Coding (https://voidcoding.com).

  It is an interactive computer science laboratory and personal AI software engineering mentor designed to help developers level up.

  What it does:
  - real-time AI mentoring focused on clean coding paradigms and step-by-step algorithms.
  - Generates custom directory architectures and modular boilerplates for student projects.
  - Performs full code quality audits for Python, JS, C++, Java, etc., returning scores, security reviews, and optimal refactors.
  - Fully responsive, works on desktop and mobile, with support for offline Progressive Web App (PWA) installation.

  The platform is built on React, Vite, Node, Supabase, and OpenAI. If anyone is looking for a coding companion or a template for building high-fidelity full-stack SaaS apps, check it out!

  Would love any feedback or code review suggestions from this community!
  ```

### 9.3 X (Twitter) Launch Thread
* **Tweet 1 (The Hook)**:
  ```text
  It’s official. I am launching Void Coding today! 🚀

  Your serverless, self-hosted, independent computer science laboratory and personal AI software mentor is live.

  Check it out: https://voidcoding.com

  Here is what it does and why it’s built to scale 👇 (1/5)
  ```
* **Tweet 2**:
  ```text
  1/ AI MENTOR 🧠
  Ask questions, debug syntax, and study algorithms. The mentor doesn't just print code blocks—it explains logic line-by-line using humble analogies (like designate boxes for variables). Perfect for beginners and students. (2/5)
  ```
* **Tweet 3**:
  ```text
  2/ PROJECT ARCHITECT 📂
  Ready to build a university or portfolio project? Describe it, and the Architect generates complete directory tree structures, modular boilerplates, and custom readme instructions instantly. (3/5)
  ```
* **Tweet 4**:
  ```text
  3/ CODE REVIEW & AUDITS 🔍
  Submit your Python, JavaScript, TypeScript, C++, or Java code. Get safety, performance, and style scores (0-100) with a complete, fully optimized rewrite of your code. (4/5)
  ```
* **Tweet 5 (Call to Action)**:
  ```text
  Void Coding is fast, fully responsive, and installs directly on your device as a Progressive Web App (PWA).

  Try it out for free, and unlock infinite high-performance reasoning with Pro for just ₹499/mo. Let's master coding! 💻🔥 (5/5)
  ```

### 9.4 LinkedIn Launch Post
* **Post Copy**:
  ```text
  🚀 I am incredibly proud to announce the launch of Void Coding! 

  Void Coding is a high-performance, responsive, and independent computer science laboratory and personal AI software mentor. I built this platform to provide students, researchers, and professional engineers with a high-fidelity workspace to learn, design systems, and audit code.

  Key Capabilities:
  💡 real-time AI Mentoring: Interactive software engineering tutoring with step-by-step logic explanations.
  🏗️ Project Architect: Generates structural code directories, modular files, and starter kits.
  🔎 Code Quality Auditor: Deep-dive code reviews with safety, performance, and style scoring (0-100).
  📱 Progressive Web App (PWA): Standalone mobile-installed workspace.

  Under the hood, Void Coding leverages a robust stack of React, Vite, Node.js, Supabase, and OpenAI, fully optimized for web and mobile.

  Try the application today at: https://voidcoding.com

  #SaaS #WebDevelopment #AI #CodingMentor #ComputerScience #TechStartup
  ```

Enjoy complete ownership of your new SaaS, **Void Coding**! Let's conquer the launch!
