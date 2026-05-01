# Railway Deployment Guide

This repo is an isolated monorepo with two deployable services:

- `backend`: Express API
- `frontend`: Next.js app

Railway supports monorepos by setting a separate root directory for each service.

## 1. Push Code to GitHub

Create a GitHub repo and push this project:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 2. Create Railway Project

1. Open Railway.
2. Create a new project.
3. Choose **Deploy from GitHub repo**.
4. Select this repository.

## 3. Add MySQL

In the Railway project canvas:

1. Click **+ New**.
2. Choose **Database**.
3. Choose **MySQL**.

Railway MySQL provides these variables automatically:

```text
MYSQLHOST
MYSQLPORT
MYSQLUSER
MYSQLPASSWORD
MYSQLDATABASE
MYSQL_URL
```

The backend is already configured to read Railway's MySQL variables.

## 4. Backend Service

Create or select the backend service.

Set:

```text
Root Directory: /backend
Build Command: npm ci
Start Command: npm run railway:start
```

Add backend environment variables:

```text
NODE_ENV=production
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
COOKIE_NAME=pm_token
FRONTEND_URL=https://YOUR_FRONTEND_DOMAIN
```

The `npm run railway:start` command syncs Sequelize tables and then starts the API.
The same settings are also committed in `backend/railway.json`, so Railway can pick them up automatically when this service root is `/backend`.

After deployment, generate a public domain for the backend service. The API health check is:

```text
https://YOUR_BACKEND_DOMAIN/health
```

## 5. Frontend Service

Create another service from the same GitHub repo.

Set:

```text
Root Directory: /frontend
Build Command: npm ci && npm run build
Start Command: npm start
```

The same settings are also committed in `frontend/railway.json`, so Railway can pick them up automatically when this service root is `/frontend`.

Add frontend environment variable:

```text
NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_DOMAIN
```

Generate a public domain for the frontend service.

## 6. Update Backend CORS

After the frontend domain is generated, go back to backend variables and set:

```text
FRONTEND_URL=https://YOUR_FRONTEND_DOMAIN
```

Redeploy the backend after changing this variable.

## 7. Final Test

1. Open the frontend Railway domain.
2. Register an admin user.
3. Create a project.
4. Register a member user.
5. Add the member to the project by email.
6. Create and complete tasks.

## Notes

- Do not upload `.env` or `.env.local`; use Railway variables instead.
- For production cookies, keep `NODE_ENV=production`.
- If you change environment variables, redeploy the affected service.
