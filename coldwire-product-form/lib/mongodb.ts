import mongoose from "mongoose";

// Get the MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

// We cache the connection so we don't create a new one on every request
// (this is important during development with hot reloading)
/* eslint-disable no-var */
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

async function dbConnect() {
  // If we already have a connection, reuse it
  if (global.mongooseCache.conn) {
    return global.mongooseCache.conn;
  }

  // If there's no connection promise yet, create one
  if (!global.mongooseCache.promise) {
    global.mongooseCache.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("✅ Connected to MongoDB");
        return mongoose;
      });
  }

  // Wait for the connection and cache it
  try {
    global.mongooseCache.conn = await global.mongooseCache.promise;
  } catch (e) {
    global.mongooseCache.promise = null;
    throw e;
  }

  return global.mongooseCache.conn;
}

export default dbConnect;
