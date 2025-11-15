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

### Public Routes

- `GET /` - Welcome message
- `GET /api/v1/health` - Health check endpoint
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create a new user

### Protected Routes (Require Authentication)

All protected routes require `Authorization: Bearer <token>` header.

See [AUTH.md](./AUTH.md) for detailed authentication documentation and how to use the `authenticate` middleware.

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
