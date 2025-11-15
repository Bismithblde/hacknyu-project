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
└── package.json                        # Dependencies (includes @supabase/supabase-js)
```

## Key Files

### Authentication Middleware

- **`src/middleware/auth.ts`**: Validates `Authorization: Bearer <token>` header, verifies JWT with Supabase, attaches `req.auth` with user info

### Configuration

- **`src/config/env.ts`**: Loads Supabase URL and anon key from environment variables

### Types

- **`src/types/index.ts`**: Defines `AuthRequest` and `AuthUser` interfaces

### Usage

The `authenticate` middleware can be imported and used in any route file to protect endpoints:

```typescript
import { authenticate } from "../middleware/auth";

router.use(authenticate); // Protect all routes
// or
router.post("/protected", authenticate, handler); // Protect single route
```

## Environment Variables Required

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=4000
NODE_ENV=development
```
