# Setup

## Prerequisites

- Node.js 20+
- npm 10+

## Backend

```bash
cd apps/server
npm install
npm run dev
# → http://localhost:3001/health
```

Default store is **in-memory** (no PostgreSQL required).  
For production: set `DATABASE_URL`, run Prisma migrate against `prisma/schema.prisma`.

## Mobile

```bash
cd apps/mobile
npm install
export EXPO_PUBLIC_API_URL=http://localhost:3001
npx expo start --web
```

## Tests

```bash
node apps/mobile/src/map/geo.test.mjs
cd apps/server && npm install && npm test
```

## Two-user flow

1. Start server.
2. Register User A → Create Ride → note join code.
3. Register User B → Join with code.
4. Owner starts ride → both enter Live Ride.
5. Locations stream over Socket.IO (simulated GPS on web).
