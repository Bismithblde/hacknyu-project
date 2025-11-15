# Postman Authentication Test Guide

Complete guide for testing authentication through your backend API. All auth operations are handled by your backend, which communicates with Supabase internally.

## Prerequisites

1. **Backend server running**: `npm run dev` (should be on port 4000)
2. **Supabase credentials**: Set in `.env` file:
   - `SUPABASE_URL` (e.g., `https://xxxxx.supabase.co`)
   - `SUPABASE_ANON_KEY` (your anon/public key)

## Complete Auth Flow

All requests go to your backend API at `http://localhost:4000/api/v1/auth/*`

---

## Step 1: Sign Up a New User

### Request Configuration

**Method:** `POST`

**URL:**

```
http://localhost:4000/api/v1/auth/signup
```

**Headers:**

- Key: `Content-Type`
- Value: `application/json`

**Body (raw JSON):**

```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123!",
  "name": "Test User"
}
```

**Expected Success Response (201):**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600,
    "refresh_token": "...",
    "user": {
      "id": "user-uuid-here",
      "email": "testuser@example.com"
    }
  },
  "message": "User created successfully"
}
```

**Copy the `access_token`** from `data.access_token` - you'll need it for protected routes!

**Expected Error Response (400):**

```json
{
  "success": false,
  "message": "Email and password are required"
}
```

---

## Step 2: Sign In (Existing User)

### Request Configuration

**Method:** `POST`

**URL:**

```
http://localhost:4000/api/v1/auth/signin
```

**Headers:**

- Key: `Content-Type`
- Value: `application/json`

**Body (raw JSON):**

```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123!"
}
```

**Expected Success Response (200):**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600,
    "refresh_token": "...",
    "user": {
      "id": "user-uuid-here",
      "email": "testuser@example.com"
    }
  },
  "message": "Signed in successfully"
}
```

**Copy the `access_token`** from `data.access_token`.

**Expected Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid login credentials"
}
```

---

## Step 3: Test Authentication (Protected Route)

### Request Configuration

**Method:** `GET`

**URL:**

```
http://localhost:4000/api/v1/auth/test
```

**Headers:**

- Key: `Authorization`
- Value: `Bearer YOUR_ACCESS_TOKEN_HERE`

Replace `YOUR_ACCESS_TOKEN_HERE` with the `access_token` from Step 1 or 2.

**Expected Success Response (200):**

```json
{
  "success": true,
  "data": {
    "userId": "user-uuid-here",
    "email": "testuser@example.com"
  },
  "message": "Authentication successful!"
}
```

**Expected Error Response (401) - No Token:**

```json
{
  "success": false,
  "message": "Missing or invalid Authorization header. Expected: Bearer <token>"
}
```

**Expected Error Response (401) - Invalid Token:**

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

## Step 4: Sign Out (Optional)

### Request Configuration

**Method:** `POST`

**URL:**

```
http://localhost:4000/api/v1/auth/signout
```

**Headers:**

- Key: `Authorization`
- Value: `Bearer YOUR_ACCESS_TOKEN_HERE`

**Expected Success Response (200):**

```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

---

## Complete Postman Collection

### Collection Variables

Create a Postman Environment with these variables:

| Variable       | Initial Value           | Current Value              |
| -------------- | ----------------------- | -------------------------- |
| `backend_url`  | `http://localhost:4000` | `http://localhost:4000`    |
| `access_token` | (leave empty)           | (will be set after signup) |

### Request 1: Sign Up

**Method:** `POST`

**URL:**

```
{{backend_url}}/api/v1/auth/signup
```

**Headers:**

- `Content-Type`: `application/json`

**Body (raw JSON):**

```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123!",
  "name": "Test User"
}
```

**Tests Tab (to auto-save token):**

```javascript
if (pm.response.code === 201) {
  const jsonData = pm.response.json();
  if (jsonData.success && jsonData.data.access_token) {
    pm.environment.set("access_token", jsonData.data.access_token);
    pm.environment.set("user_id", jsonData.data.user.id);
    console.log("Token saved to environment");
  }
}
```

### Request 2: Sign In

**Method:** `POST`

**URL:**

```
{{backend_url}}/api/v1/auth/signin
```

**Headers:**

- `Content-Type`: `application/json`

**Body (raw JSON):**

```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123!"
}
```

**Tests Tab (to auto-save token):**

```javascript
if (pm.response.code === 200) {
  const jsonData = pm.response.json();
  if (jsonData.success && jsonData.data.access_token) {
    pm.environment.set("access_token", jsonData.data.access_token);
    pm.environment.set("user_id", jsonData.data.user.id);
    console.log("Token saved to environment");
  }
}
```

### Request 3: Auth Test (Protected)

**Method:** `GET`

**URL:**

```
{{backend_url}}/api/v1/auth/test
```

**Headers:**

- `Authorization`: `Bearer {{access_token}}`

### Request 4: Sign Out

**Method:** `POST`

**URL:**

```
{{backend_url}}/api/v1/auth/signout
```

**Headers:**

- `Authorization`: `Bearer {{access_token}}`

### Request 5: Auth Test - No Token (Should Fail)

**Method:** `GET`

**URL:**

```
{{backend_url}}/api/v1/auth/test
```

**Headers:** (none)

---

## Postman Collection JSON (Import Ready)

Copy this JSON and import into Postman:

```json
{
  "info": {
    "name": "Patch Backend Auth Tests",
    "description": "Complete authentication flow through backend API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Sign Up",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"testuser@example.com\",\n  \"password\": \"TestPassword123!\",\n  \"name\": \"Test User\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{backend_url}}/api/v1/auth/signup",
          "host": ["{{backend_url}}"],
          "path": ["api", "v1", "auth", "signup"]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "if (pm.response.code === 201) {",
              "  const jsonData = pm.response.json();",
              "  if (jsonData.success && jsonData.data.access_token) {",
              "    pm.environment.set(\"access_token\", jsonData.data.access_token);",
              "    pm.environment.set(\"user_id\", jsonData.data.user.id);",
              "    console.log(\"Token saved to environment\");",
              "  }",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ]
    },
    {
      "name": "2. Sign In",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"testuser@example.com\",\n  \"password\": \"TestPassword123!\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{backend_url}}/api/v1/auth/signin",
          "host": ["{{backend_url}}"],
          "path": ["api", "v1", "auth", "signin"]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "if (pm.response.code === 200) {",
              "  const jsonData = pm.response.json();",
              "  if (jsonData.success && jsonData.data.access_token) {",
              "    pm.environment.set(\"access_token\", jsonData.data.access_token);",
              "    pm.environment.set(\"user_id\", jsonData.data.user.id);",
              "    console.log(\"Token saved to environment\");",
              "  }",
              "}"
            ],
            "type": "text/javascript"
          }
        }
      ]
    },
    {
      "name": "3. Auth Test (Protected)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}",
            "type": "text"
          }
        ],
        "url": {
          "raw": "{{backend_url}}/api/v1/auth/test",
          "host": ["{{backend_url}}"],
          "path": ["api", "v1", "auth", "test"]
        }
      }
    },
    {
      "name": "4. Sign Out",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{access_token}}",
            "type": "text"
          }
        ],
        "url": {
          "raw": "{{backend_url}}/api/v1/auth/signout",
          "host": ["{{backend_url}}"],
          "path": ["api", "v1", "auth", "signout"]
        }
      }
    },
    {
      "name": "5. Auth Test - No Token (Should Fail)",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{backend_url}}/api/v1/auth/test",
          "host": ["{{backend_url}}"],
          "path": ["api", "v1", "auth", "test"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "backend_url",
      "value": "http://localhost:4000",
      "type": "string"
    },
    {
      "key": "access_token",
      "value": "",
      "type": "string"
    }
  ]
}
```

---

## Quick Test Checklist

### Before Testing:

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] Supabase credentials are set in `.env` file
- [ ] Postman environment variables are configured

### Test Flow:

1. [ ] Run "1. Sign Up" request → Token auto-saved to environment
2. [ ] Run "3. Auth Test (Protected)" → Should return 200 with user info
3. [ ] Run "4. Sign Out" → Should return 200
4. [ ] Run "5. Auth Test - No Token" → Should return 401

---

## API Endpoints Summary

| Endpoint               | Method | Auth Required | Description                             |
| ---------------------- | ------ | ------------- | --------------------------------------- |
| `/api/v1/auth/signup`  | POST   | No            | Create a new user account               |
| `/api/v1/auth/signin`  | POST   | No            | Sign in existing user                   |
| `/api/v1/auth/signout` | POST   | Yes           | Sign out current user                   |
| `/api/v1/auth/test`    | GET    | Yes           | Test authentication (returns user info) |

---

## Troubleshooting

### Sign Up Returns 400 Bad Request

- Check email format is valid
- Password must meet Supabase requirements (usually min 6 characters)
- Verify Supabase credentials in `.env` file are correct
- Check backend logs for detailed error messages

### Sign In Returns 401 Unauthorized

- Verify email and password are correct
- User may not exist - try signing up first
- Check backend logs for detailed error messages

### Auth Test Returns 401 "Invalid or expired token"

- Token may be expired (they expire after 1 hour)
- Run Sign In request again to get a fresh token
- Verify token is correctly formatted: `Bearer <token>` (note the space)
- Check Supabase URL and anon key in backend `.env` match your Supabase project

### Connection Refused on Backend

- Ensure backend server is running: `npm run dev`
- Check port is 4000 (or update `backend_url` variable)
- Verify backend is listening on the correct host

### Token Not Saving in Postman

- Make sure you're using a Postman Environment (not just variables)
- Check the Tests tab script is correct
- Manually copy token from response if auto-save doesn't work

---

## Example Request Bodies

### Sign Up Body:

```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123!",
  "name": "Test User"
}
```

### Sign In Body:

```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123!"
}
```

### Auth Test Header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzA0MTIzNDU2LCJzdWIiOiJ1c2VyLXV1aWQtaGVyZSJ9...
```

---

## Benefits of Backend Auth Routes

✅ **Simplified Frontend**: Frontend only needs to call your backend API  
✅ **Centralized Logic**: All auth logic in one place  
✅ **Security**: Supabase credentials stay on backend  
✅ **Consistency**: Same API structure for all endpoints  
✅ **Easy Testing**: Test everything through Postman without Supabase dashboard
