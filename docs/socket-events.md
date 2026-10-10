# Socket.IO Events

All connections require `auth.token` = JWT access token.

| Event | Direction | Notes |
|-------|-----------|-------|
| `ride:join` | C→S | `{ rideId }` join room `ride:{id}` |
| `ride:leave` | C→S | leave room |
| `location:update` | C→S | validated; rate-limited; userId from session |
| `location:broadcast` | S→C | `{ userId, name, lat, lng, ... }` |
| `rider:online` / `offline` | S→C | presence |
| `heartbeat` | C→S | `{ serverTime }` |
| `safety:sos` | C→S→C | best-effort only |

Unauthorized join or location updates are rejected.
