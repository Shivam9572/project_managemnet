# Frontend Deploy Checklist (Railway)

This file documents the steps to deploy the Next.js frontend to Railway and how to clear remote build cache if a Turbopack/Next build fails.

## Quick summary
- Ensure the latest code is committed and pushed to the branch Railway builds from.
- Ensure `NEXT_PUBLIC_API_URL` points to your deployed backend (not `http://localhost:8080`).
- Clear Railway build cache and trigger a fresh redeploy if a previously cached build caused the error.

## Commit & push
Run these commands from the repository root (replace `main` with your branch):

```bash
git add frontend/DEPLOY.md
git commit -m "docs(frontend): add Railway deploy checklist"
git push origin main
```

## Railway — set service variables (UI)
1. Open your Railway project and select the frontend service.
2. Go to the `Variables` (Environment) tab.
3. Set `NEXT_PUBLIC_API_URL` to your backend URL, for example `https://my-backend.up.railway.app`.
4. Save the variable.

Note: Using `http://localhost:8080` will cause the deployed frontend to try to contact a non-routable URL and fail at runtime.

## Railway — clear remote build cache & redeploy (UI)
1. Open the frontend service in Railway.
2. Navigate to the `Deployments` (or `Deploy`) page.
3. Click the three-dot / More Actions menu for the latest deployment.
4. Choose `Redeploy` (or `Trigger Redeploy`). Look for a `Clear cache` or `Rebuild from scratch` checkbox/toggle and enable it.
5. Confirm redeploy. This forces a fresh build and avoids using any stale `.next` cache.

If you use the GitHub integration, pushing to the branch will also trigger a new build automatically.

## Node version and engines
- Ensure the remote Node version matches what you used locally. Two options:
  - Add an `engines` field to `package.json`, e.g.:

```json
"engines": {
  "node": ">=18 <=20"
}
```

  - Or set the Node version in Railway service settings (Environment / Runtime).

## What to check if you see the `ssr: false` error again
- The error occurs when `next/dynamic(..., { ssr: false })` is used inside a Server Component (app route). Fixes:
  1. Move the dynamic import into a Client Component (add `"use client"` at top) or
  2. Import the client component directly from the server component's parent layout (no `ssr: false` there).

Example: `components/ClientProviders.tsx` should start with `"use client"` and be imported normally in `app/layout.tsx` (no `next/dynamic` with `ssr: false` in `app/layout.tsx`).

## Smoke test (after deploy)
1. Open the frontend URL provided by Railway.
2. Log in with a test account (or register).
3. Open `/dashboard` and confirm charts and data load.
4. Create a project and a task to verify API connectivity.

## Troubleshooting
- If the build fails on the remote host with the same error but your local build succeeded:
  - Confirm the branch being built contains the same code (no older commits). 
  - Clear remote build cache and redeploy (see steps above). 
  - Confirm `NEXT_PUBLIC_API_URL` is set to the deployed backend URL.
  - Confirm Node version and dependency versions match.

If you want, I can produce the exact Railway UI steps with screenshots or a short script using the Railway CLI (if you use it).
