
## MongoDB + Mongoose Setup

- `lib/db.ts` exports `connectToDatabase()` and uses a singleton cache so Mongoose reuses the same connection across module reloads.
- `MONGODB_URI` is required for server runtime and should be provided through environment variables.
- `.env.example` shows a local connection example for development.
