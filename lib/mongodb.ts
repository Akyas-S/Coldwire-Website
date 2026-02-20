import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

// Module-level flag to track whether a connection already exists.
// In Next.js, each API route runs in a long-lived Node.js process (not a fresh
// process per request), so we reuse the single connection instead of opening a
// new one on every call. Without this guard every hot-reload or concurrent
// request would spawn an extra connection and exhaust the MongoDB pool limit.
let isConnected = false;

async function dbConnect() {
  if (isConnected) {
    console.log("Reusing existing MongoDB connection");
    return;
  }

  // bufferCommands: false means Mongoose will throw immediately if a query is
  // attempted before the connection is ready, rather than queuing it silently.
  // This surfaces connection errors early instead of hanging indefinitely.
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  isConnected = true;
  console.log("Connected to MongoDB");
}

export default dbConnect;
