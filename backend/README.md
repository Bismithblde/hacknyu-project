# Backend API

A modern Express.js backend with TypeScript.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, defaults are provided):
```bash
PORT=4000
NODE_ENV=development
```

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

- `GET /` - Welcome message
- `GET /api/v1/health` - Health check endpoint
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create a new user

## Project Structure

```
backend/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Request handlers
│   ├── routes/       # Route definitions
│   ├── services/     # Business logic
│   ├── types/        # TypeScript type definitions
│   ├── app.ts        # Express app setup
│   └── server.ts     # Server entry point
├── dist/             # Compiled JavaScript (generated)
└── package.json
```

