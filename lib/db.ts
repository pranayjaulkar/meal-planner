import mongoose from "mongoose";

const { MONGODB_URI, NODE_ENV } = process.env;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cache;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("Missing required environment variable: MONGODB_URI");
  }

  if (!NODE_ENV) {
    console.warn("[db] NODE_ENV is not set. Defaulting to production behavior.");
  }

  if (cache.conn) {
    console.info("[db] Reusing cached MongoDB connection");
    return cache.conn;
  }

  if (!cache.promise) {
    console.info("[db] Initializing MongoDB connection");

    mongoose.set("strictQuery", true);

    if (NODE_ENV === "development") {
      mongoose.set("debug", true);
    }

    cache.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        console.error("[db] MongoDB connection failed:", error);
        cache.promise = null;
        throw error;
      });
  }

  cache.conn = await cache.promise;
  console.info("[db] MongoDB connected");

  return cache.conn;
}
