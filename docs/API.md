# API Documentation

Base URL: `http://localhost:5000`

Authentication uses an httpOnly cookie named `pm_token`. Send `credentials: include` from the frontend.

## Auth

| Method | Endpoint | Body | Notes |
| --- | --- | --- | --- |
| POST | `/auth/register` | `{ name, email, password, role }` | Creates user and sets cookie. |
| POST | `/auth/login` | `{ email, password }` | Sets JWT cookie. |
| GET | `/auth/me` | none | Returns current user. |
| POST | `/auth/logout` | none | Clears cookie. |

## Projects

| Method | Endpoint | Permission | Notes |
| --- | --- | --- | --- |
| GET | `/projects?page=1&limit=10&search=` | Authenticated | Admin sees all; members see joined projects. |
| POST | `/projects` | Admin | Body: `{ name, description }`. |
| GET | `/projects/:id` | Project member/admin | Includes owner, members, and recent tasks. |
| PATCH | `/projects/:id` | Project admin | Body: `{ name?, description? }`. |
| DELETE | `/projects/:id` | Project admin | Cascades project tasks/members/comments. |
| POST | `/projects/:id/members` | Project admin | Body: `{ email, role }`. |
| DELETE | `/projects/:id/members/:userId` | Project admin | Owner cannot be removed. |

## Tasks

| Method | Endpoint | Permission | Notes |
| --- | --- | --- | --- |
| GET | `/tasks?page=1&limit=10&projectId=&assignedTo=&status=&search=` | Authenticated | Members see assigned tasks only. |
| POST | `/tasks` | Project admin | Body: `{ projectId, assignedTo, title, description, status, priority, dueDate }`. |
| GET | `/tasks/:id` | Assigned member/project admin | Includes comments. |
| PATCH | `/tasks/:id` | Project admin | Updates task metadata/assignment. |
| PATCH | `/tasks/:id/status` | Assigned member/project admin | Body: `{ status }`. |
| DELETE | `/tasks/:id` | Project admin | Deletes task. |
| POST | `/tasks/:id/comments` | Project member | Body: `{ comment }`. |

## Dashboard

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/dashboard` | Returns `totalProjects`, `totalTasks`, `completedTasks`, `overdueTasks`, `completionRate`. |
