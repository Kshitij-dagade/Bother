# BOTHER — Next.js Landing Page

Waitlist landing page for **BOTHER**, built with Next.js (App Router, Tailwind CSS, TypeScript, and Firebase).

## Tech Stack
- **Framework:** Next.js 14 (App Router, Static Export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with Warm Humanist tokens
- **Database / Backend:** Firebase (Firestore)
- **Deployment / Hosting:** GitHub Pages (Automated via GitHub Actions)

---

## Hosting on GitHub Pages

This project is pre-configured for automated deployment to **GitHub Pages** using GitHub Actions:

### Step 1: Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g. `bother-landing` or `bother`).
3. Leave it empty (do **not** initialize with README or license).

### Step 2: Push your code
In your terminal, run:

```bash
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.

That's it! GitHub will automatically trigger the workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), build the static Next.js site, and deploy it to:
`https://<YOUR-GITHUB-USERNAME>.github.io/<YOUR-REPO-NAME>/`

---

## Local Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Building & Static Export

```bash
npm run build
```

The static site bundle is exported to the `out/` folder.
