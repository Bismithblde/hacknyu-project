# Frontend Authentication Guide

This guide explains how to use the authentication system in the frontend, including automatic token refresh to prevent expiration during demos.

## Features

✅ **Automatic Token Refresh** - Tokens refresh automatically before expiring  
✅ **No Expiration During Demos** - Tokens stay valid throughout your demo  
✅ **Easy to Use** - Simple hooks and utilities  
✅ **Secure** - Tokens stored securely in localStorage

## Quick Start

### 1. Install Dependencies (if needed)

The auth utilities use only built-in browser APIs, no extra packages needed!

### 2. Use the Auth Hook

```typescript
import { useAuth } from "./hooks/useAuth";

function MyComponent() {
  const { user, loading, signIn, signUp, signOut, isAuth } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuth) {
    return (
      <div>
        <button onClick={() => signIn("email@example.com", "password")}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>Welcome, {user?.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### 3. Make Authenticated API Calls

```typescript
import { authenticatedFetch } from "./utils/auth";

// Automatically handles token refresh
const response = await authenticatedFetch(
  "http://localhost:4000/api/v1/auth/me"
);
const data = await response.json();
```

## How It Works

### Automatic Token Refresh

1. **Token Expiry Check**: Before each request, checks if token expires within 5 minutes
2. **Auto Refresh**: If expiring soon, automatically refreshes using refresh token
3. **Retry on 401**: If request fails with 401, tries refreshing once and retries
4. **Background Refresh**: Token refreshes every 50 minutes in the background

### Token Storage

- `access_token` - Stored in localStorage
- `refresh_token` - Stored in localStorage (lasts 30 days)
- `token_expiry` - Expiry timestamp stored for checking

## API Reference

### `useAuth()` Hook

Returns:
- `user` - Current user object or null
- `loading` - Loading state
- `signUp(email, password, name?)` - Sign up new user
- `signIn(email, password)` - Sign in existing user
- `signOut()` - Sign out current user
- `isAuth` - Boolean indicating if user is authenticated

### `authenticatedFetch(url, options)`

Makes authenticated API requests with automatic token refresh.

```typescript
const response = await authenticatedFetch(
  "http://localhost:4000/api/v1/protected-route",
  {
    method: "POST",
    body: JSON.stringify({ data: "example" }),
  }
);
```

### Manual Token Management

```typescript
import {
  getValidAccessToken,
  storeTokens,
  clearTokens,
  isTokenExpired,
} from "./utils/auth";

// Get token (refreshes if needed)
const token = await getValidAccessToken();

// Check if expired
if (isTokenExpired()) {
  // Token will be refreshed automatically
}

// Clear tokens (logout)
clearTokens();
```

## Demo Preparation

### Before Your Demo:

1. **Test Sign In**: Make sure sign in works
2. **Check Token Refresh**: Let it sit for a few minutes, make a request, verify it refreshes
3. **Test Protected Routes**: Make sure authenticated requests work

### During Demo:

- Tokens will automatically refresh
- No need to manually handle token expiration
- Users stay logged in for up to 30 days (refresh token lifetime)

## Troubleshooting

### Token Still Expiring?

1. Check browser console for errors
2. Verify refresh token is stored: `localStorage.getItem('refresh_token')`
3. Check network tab to see if refresh requests are being made

### 401 Errors?

- Token might be completely expired
- Refresh token might be expired (30 days)
- User needs to sign in again

### Clear Everything

```typescript
import { clearTokens } from "./utils/auth";
clearTokens(); // Clears all auth data
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:4000/api/v1
```

## Example: Complete Auth Flow

```typescript
import { useAuth } from "./hooks/useAuth";
import { authenticatedFetch } from "./utils/auth";

function App() {
  const { user, signIn, signOut, isAuth } = useAuth();

  const handleProtectedAction = async () => {
    // This automatically refreshes token if needed
    const response = await authenticatedFetch(
      "http://localhost:4000/api/v1/protected-route",
      {
        method: "POST",
        body: JSON.stringify({ action: "example" }),
      }
    );

    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      {isAuth ? (
        <>
          <p>Logged in as {user?.email}</p>
          <button onClick={handleProtectedAction}>
            Do Protected Action
          </button>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={() => signIn("email@example.com", "password")}>
          Sign In
        </button>
      )}
    </div>
  );
}
```

## Security Notes

- ✅ Tokens stored in localStorage (secure for hackathon)
- ✅ Automatic refresh prevents expiration
- ✅ Refresh tokens last 30 days
- ⚠️ For production, consider httpOnly cookies instead of localStorage

