# School Parking API

REST API built with NestJS, Prisma, and PostgreSQL. All routes except `GET /api/health`, `POST /api/auth/login`, and `POST /api/auth/register` require a JWT bearer token.

## Requirements

- Node.js 20+
- PostgreSQL 15+
- npm

## Local setup

1. Create a PostgreSQL database named `school_parking`.
2. Copy `.env.example` to `.env`. Set `DATABASE_URL` and generate a unique `JWT_SECRET` of at least 32 characters. To seed a sign-in account, set `SEED_USER_EMAIL` and a `SEED_USER_PASSWORD` of at least 12 characters.
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

The seed creates the default parking settings and optionally one account when its credentials are set in `.env`. It does not insert sample parking records or delete database records.

The app uses one account type; there are no admin/staff roles. Apply the included Prisma migration with `npm run prisma:deploy` before starting the updated API.

## AI assistant

The authenticated `POST /api/assistant/chat` endpoint connects to an OpenAI-compatible chat-completions API. Configure `AI_API_KEY` and `AI_MODEL` in the backend `.env`; `AI_API_URL` defaults to `https://api.openai.com/v1/chat/completions` and can be changed for a compatible provider. Keep the key on the server and never add it to frontend environment variables. The assistant can explain Parkly workflows in Vietnamese, is limited to 12 messages per request and 1,500 characters per message, and does not have access to live parking records or account credentials. AI configuration is optional; the remaining API routes work without it.

## Frontend connection

Set `frontend/.env` from `frontend/.env.example` with `VITE_API_URL=http://localhost:3000/api`. Set the API `FRONTEND_ORIGIN` to the frontend origin. Restart Vite after changing environment variables.

## Routes

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | API and PostgreSQL health |
| POST | `/api/auth/login` | Public | Sign in and receive a JWT |
| POST | `/api/auth/register` | Public | Create an account and receive a JWT |
| GET | `/api/auth/me` | Signed in | Current account |
| GET | `/api/dashboard` | Signed in | Dashboard counts |
| GET/POST | `/api/students` | Signed in | List and create students |
| PATCH/DELETE | `/api/students/:id` | Signed in | Update or remove a student |
| GET/POST | `/api/vehicles` | Signed in | List and register vehicles |
| PATCH/DELETE | `/api/vehicles/:id` | Signed in | Update or remove a vehicle |
| GET/POST | `/api/movements` | Signed in | List and record vehicle movements |
| GET | `/api/tickets` | Signed in | List parking permits |
| PUT | `/api/tickets/:studentId/renew` | Signed in | Renew a parking permit |
| GET | `/api/settings` | Signed in | Read parking settings |
| PUT | `/api/settings` | Signed in | Update parking settings |
| POST | `/api/assistant/chat` | Signed in | Chat with the AI assistant |

Requests that change vehicle movement and occupancy run in a database transaction. Validation rejects unknown request properties and invalid input.

## Checks

```powershell
npm run prisma:generate
npm run build
npm run lint
```
