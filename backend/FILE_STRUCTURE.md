# Backend File Structure

## Authentication Implementation

```
backend/
├── src/
│   ├── middleware/
│   │   └── auth.ts                    # JWT verification middleware
│   │
│   ├── config/
│   │   └── env.ts                     # Environment config (includes Supabase)
│   │
│   ├── types/
│   │   └── index.ts                   # TypeScript types (AuthUser, AuthRequest)
│   │
│   ├── controllers/
│   │   ├── healthController.ts        # Health check handler
│   │   └── userController.ts          # User handlers
│   │
│   ├── services/
│   │   └── userService.ts             # User business logic
│   │
│   ├── routes/
│   │   ├── health.ts                  # Health check routes
│   │   ├── users.ts                   # User routes
│   │   └── index.ts                   # Main router
│   │
│   ├── app.ts                          # Express app setup
│   └── server.ts                      # Server entry point
│
├── AUTH.md                             # Authentication documentation
├── FILE_STRUCTURE.md                   # This file
│   │   ├── aiService.ts               # Rule-based hazard classifier & fraud checks
│   │   ├── confirmationService.ts     # Handles report evidence + points
│   │   ├── datasetService.ts          # Creates public dataset views
│   │   ├── dataStore.ts               # In-memory persistence & seed data
│   │   ├── pinService.ts              # Pin CRUD + verification state
│   │   ├── pointsService.ts           # Points/levels/badges logic
│   │   └── userService.ts             # User business logic
│   │
│   ├── routes/
│   │   ├── ai.ts                      # AI helper endpoint
│   │   ├── confirmations.ts           # Evidence upload routes
│   │   ├── dataset.ts                 # Public dataset export
│   │   ├── health.ts                  # Health check routes
│   │   ├── leaderboard.ts             # Leaderboard routes
│   │   ├── pins.ts                    # Hazard lifecycle routes
│   │   ├── points.ts                  # Points API
│   │   ├── users.ts                   # User routes
│   │   └── verifications.ts           # Voting routes
│   │
└── package.json                        # Dependencies (includes @supabase/supabase-js)
```

## Key Files

### Authentication Middleware

- **`src/middleware/auth.ts`**: Validates `Authorization: Bearer <token>` header, verifies JWT with Supabase, attaches `req.auth` with user info

### Configuration

- **`src/config/env.ts`**: Loads Supabase URL and anon key from environment variables

### Types

- **`src/types/index.ts`**: Central home for every shared type (pins, users, confirmations, points, auth, etc.)

### Usage

- Import `authenticate` from `middleware/auth` when an endpoint should only run for logged-in users.
- Feature controllers focus on validation + formatting responses; services hold the domain logic so swapping data stores later is simple.

## Environment Variables Required

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=4000
NODE_ENV=development
```
