# School Parking API

REST API built with NestJS, Prisma, and PostgreSQL. All routes except `GET /api/health` and `POST /api/auth/login` require a JWT bearer token.

## Requirements

- Node.js 20+
- PostgreSQL 15+
- npm

## Local setup

1. Create a PostgreSQL database named `school_parking`.
2. Copy `.env.example` to `.env`. Set `DATABASE_URL`, generate a unique `JWT_SECRET` of at least 32 characters, and set unique passwords of at least 12 characters for the seed users.
3. Install dependencies and apply the migration:

   ```powershell
   npm install
   npm run prisma:generate
   npm run prisma:deploy
   npm run prisma:seed
   ```

4. Start the API:

   ```powershell
   npm run start:dev
   ```

The API listens on port `3000` by default. Swagger documentation is available at `http://localhost:3000/api/docs`; database health is at `http://localhost:3000/api/health`.

The seed inserts a small set of development records and creates the admin/staff accounts only when their credentials are set in `.env`. It is idempotent and does not delete database records. Do not use demo seed credentials or seed data in production.

## Frontend connection

Set `frontend/.env` from `frontend/.env.example`, keeping `VITE_DEMO_MODE=false` and setting `VITE_API_URL=http://localhost:3000/api`. Set the API `FRONTEND_ORIGIN` to the frontend origin. Restart Vite after changing environment variables.

## Routes

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | API and PostgreSQL health |
| POST | `/api/auth/login` | Public | Sign in and receive a JWT |
| POST | `/api/auth/register` | Public | Create a staff account and receive a JWT |
| GET | `/api/auth/me` | Signed in | Current user and role |
| GET | `/api/dashboard` | Signed in | Dashboard counts |
| GET/POST | `/api/students` | Signed in / admin | List and create students |
| PATCH/DELETE | `/api/students/:id` | Admin | Update or remove a student |
| GET/POST | `/api/vehicles` | Signed in / admin | List and register vehicles |
| PATCH/DELETE | `/api/vehicles/:id` | Admin | Update or remove a vehicle |
| GET/POST | `/api/movements` | Signed in | List and record vehicle movements |
| GET | `/api/tickets` | Admin | List parking permits |
| PUT | `/api/tickets/:studentId/renew` | Admin | Renew a parking permit |
| GET | `/api/settings` | Signed in | Read parking settings |
| PUT | `/api/settings` | Admin | Update parking settings |

Requests that change vehicle movement and occupancy run in a database transaction. Validation rejects unknown request properties and invalid input.

## Checks

```powershell
npm run prisma:generate
npm run build
npm run lint
```
