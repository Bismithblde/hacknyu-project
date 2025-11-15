# Authentication Guide

This backend uses **Supabase Auth** for JWT-based authentication. The authentication middleware can be used to protect any route that requires user authentication.

## Setup

1. **Environment Variables**

   Create a `.env` file in the `backend` directory with your Supabase credentials:

   ```env
   PORT=4000
   NODE_ENV=development
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Get Supabase Credentials**

   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Copy the `Project URL` → `SUPABASE_URL`
   - Copy the `anon` `public` key → `SUPABASE_ANON_KEY`

## Authentication Flow

### 1. Frontend Authentication (Client-side)

Users authenticate on the frontend using Supabase Auth:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123",
});

// Get session token
const {
  data: { session },
} = await supabase.auth.getSession();
const token = session?.access_token;
```

### 2. Backend Authentication (Server-side)

Include the JWT token in API requests:

```typescript
// Example: Fetch API
const response = await fetch("http://localhost:4000/api/v1/protected-route", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    // your data
  }),
});
```

## Authentication Middleware

The `authenticate` middleware (`src/middleware/auth.ts`) validates JWT tokens:

- **Validates**: `Authorization: Bearer <token>` header
- **On Success**: Attaches decoded user info to `req.auth`
- **On Failure**: Returns `401 Unauthorized`

### Usage in Routes

```typescript
import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { AuthRequest, Response } from "../types";

const router = Router();

// Protect a single route
router.post("/protected", authenticate, (req: AuthRequest, res: Response) => {
  // req.auth is available here
  res.json({ userId: req.auth?.userId });
});

// Protect all routes in a router
router.use(authenticate);
router.post("/create", createHandler);
router.get("/list", listHandler);
```

## Request Object (`req.auth`)

After authentication, the request object includes:

```typescript
req.auth = {
  userId: string, // Supabase user ID
  email: string, // User email
  // ... other Supabase user properties
};
```

### Example: Using req.auth in a Controller

```typescript
import { Response } from "express";
import { AuthRequest } from "../types";

export const myProtectedHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  // req.auth is guaranteed to exist after authenticate middleware
  const userId = req.auth!.userId;
  const email = req.auth!.email;

  res.json({
    success: true,
    data: {
      userId,
      email,
    },
  });
};
```

## Error Responses

### 401 Unauthorized

**Missing Authorization header:**

```json
{
  "success": false,
  "message": "Missing or invalid Authorization header. Expected: Bearer <token>"
}
```

**Invalid or expired token:**

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

## Example: Complete Request Flow

```typescript
// 1. User signs in (frontend)
const {
  data: { session },
} = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123",
});

const token = session?.access_token;

// 2. Make authenticated request (frontend)
const response = await fetch("http://localhost:4000/api/v1/protected-route", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    data: "your data here",
  }),
});

const result = await response.json();
console.log(result);
```

## Testing Authentication

### Using cURL

```bash
# Get token from Supabase (frontend)
# Then use it in API requests:

curl -X POST http://localhost:4000/api/v1/protected-route \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": "test data"
  }'
```

### Using Postman

1. Set request method and URL
2. Go to **Headers** tab
3. Add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_JWT_TOKEN`
4. Add body (for POST/PUT requests)
5. Send request

## Security Notes

- ✅ JWT tokens are verified using Supabase's public key
- ✅ Tokens are validated on every request
- ✅ Expired tokens are rejected
- ⚠️ **Important**: Store Supabase credentials securely (use environment variables)
- ⚠️ **Important**: In production, use HTTPS to protect tokens in transit
