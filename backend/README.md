# Backend API

A modern Express.js backend with TypeScript.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with Supabase credentials:

```bash
PORT=4000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get your Supabase credentials from your project dashboard (Settings → API).

## Development

Run the development server with hot reload:

```bash
npm run dev
```

## Production

Build the TypeScript code:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Routes

## Feature Modules & Routes

> Authentication endpoints live under `/api/v1/auth` (see [AUTH.md](./AUTH.md)).  
> Everything below scaffolds the rest of the civic hazard platform.

### Health & Diagnostics

- `GET /api/v1/health` — heartbeat payload with uptime
- `GET /api/v1/test-route` — simple connectivity test

### Users

- `GET /api/v1/users` — list seeded demo users
- `GET /api/v1/users/:id` — fetch a single user
- `POST /api/v1/users` — create a user (stored in memory)

### Pins & Hazard Lifecycle

- `GET /api/v1/pins` — list hazards, including AI metadata and verification stats
- `POST /api/v1/pins` — create a pin; runs the request through `aiService` for category/agency heuristics and awards creator points
- `GET /api/v1/pins/:id` — fetch a single pin
- `POST /api/v1/pins/:id/resolve` — mark a pin as resolved and reward the acting user

### AI Assist

- `POST /api/v1/ai/analyze` — lightweight rule-based classifier that returns severity, recommended agency, and fraud flags for a description/photo

### Community Verification

- `POST /api/v1/verifications` — cast a validity vote on a pin; updates verification stats and awards points
- `GET /api/v1/confirmations` — list supplemental evidence, optionally filtered by `?pinId=`
- `POST /api/v1/confirmations` — upload official reports or confirmations (earns higher points for official documentation)

### Gamification & Reputation

- `GET /api/v1/points/rules` — expose the server-side `PointsAction` → value map
- `POST /api/v1/points` — manually trigger a points award (useful for automated jobs/tests)
- `GET /api/v1/leaderboard` — sorted leaderboard derived from user stats

### Open Data

- `GET /api/v1/dataset` — sanitized dataset export of all pins, suitable for public sharing

All non-auth routes currently run against an in-memory data store (`services/dataStore.ts`) so the API works out-of-the-box for demos. Swap in a persistent store later by re-implementing the same interface.

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware (auth)
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic
│   ├── types/          # TypeScript type definitions
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
├── dist/               # Compiled JavaScript (generated)
├── AUTH.md             # Authentication guide
└── package.json
```
