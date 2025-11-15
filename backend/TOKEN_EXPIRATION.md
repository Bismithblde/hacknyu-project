# Token Expiration Configuration

## Setting Token Expiration to 1 Week

Supabase JWT tokens are configured in your Supabase project settings. The setting location may vary by Supabase version.

### Option 1: Find JWT Expiry Setting

Try these locations in your Supabase Dashboard:

**Location A: Authentication Settings**
1. Go to **Authentication** → **Settings**
2. Look for **"JWT Expiry Limit"** or **"JWT expiry"**
3. Set to `604800` seconds (1 week)

**Location B: Project Settings → API**
1. Go to **Settings** → **API**
2. Look for **"JWT Settings"** or **"JWT Expiry"**
3. Set to `604800` seconds

**Location C: Project Settings → Auth**
1. Go to **Settings** → **Auth**
2. Scroll down to **"JWT Expiry"** section
3. Set to `604800` seconds

### Option 2: Use Refresh Tokens (Recommended for Hackathon)

Refresh tokens typically last **30 days** by default, which is longer than 1 week. Your frontend can:
1. Store both `access_token` (1 hour) and `refresh_token` (30 days)
2. When access token expires, automatically refresh it using the refresh token
3. User stays logged in for up to 30 days

### Option 3: Check Supabase Version

If you can't find the setting:
- It might not be available in your Supabase plan/version
- The default might already be longer than 1 hour
- Check your Supabase project's API settings page

### Token Expiration Values:

- **1 Hour**: `3600` seconds
- **1 Day**: `86400` seconds
- **1 Week**: `604800` seconds
- **1 Month**: `2592000` seconds (30 days)

### Important Notes:

- ⚠️ **Existing tokens** will still expire at their original time
- ✅ **New tokens** (from signup/signin) will expire in 1 week
- 🔄 **Refresh tokens** typically last longer (30 days by default)
- 🔒 Longer expiration = less secure but better UX

### Testing:

After changing the setting:
1. Sign up a new user or sign in
2. Check the `expires_in` field in the response
3. It should show `604800` (1 week in seconds)

### Security Consideration:

For a hackathon project, 1 week is reasonable. For production:
- Consider shorter expiration times (1-24 hours)
- Implement automatic token refresh
- Use refresh tokens for long-term sessions

