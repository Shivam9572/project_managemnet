# ProjectFlow - Full-Stack Project Management App

This folder contains a complete project management web app:

- `backend`: Node.js, Express.js, Sequelize, MySQL, JWT httpOnly-cookie auth, RBAC middleware.
- `frontend`: Next.js App Router, TypeScript, Tailwind CSS, Axios, protected routes, role-based UI.
- `docs`: SQL schema and REST API reference.
- Railway deployment guide: `docs/RAILWAY_DEPLOYMENT.md`.

## Quick Start

1. Create a MySQL database:

```sql
CREATE DATABASE project_management;
```

2. Install backend dependencies:

```bash
cd backend
npm install
copy .env.example .env
```

Edit `backend/.env` with your MySQL username/password and a strong `JWT_SECRET`.

3. Sync the database tables:

```bash
npm run db:sync
npm run dev
```

The backend runs at `http://localhost:5000`.

4. Install frontend dependencies in a second terminal:

```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

The frontend runs at `http://localhost:3000`.

## Folder Structure

```text
backend/
  src/config        database and environment config
  src/controllers   request/response handlers
  src/middlewares   auth, RBAC, validation, rate limiting, errors
  src/models        Sequelize models and associations
  src/routes        REST route definitions
  src/services      business logic and permission checks
  src/validators    express-validator rules
frontend/
  app               Next.js App Router pages
  components        reusable UI and protected shell
  context           auth provider
  lib               Axios API client
  types             shared API TypeScript types
docs/
  schema.sql        relational MySQL schema
  API.md            endpoint documentation
```

## Roles

Admin users can create projects, manage project members, create/assign/delete tasks, and view project data.

Member users can view their joined projects, view their assigned tasks, update task status, and comment on tasks.

## Notes

- Auth is stored in an httpOnly JWT cookie.
- Auth routes are rate-limited.
- Inputs are validated with `express-validator`.
- Sequelize parameterized queries protect against SQL injection.
- Task/project listing APIs include pagination and search support.
- Project members are added by registered user email from the project detail page.
