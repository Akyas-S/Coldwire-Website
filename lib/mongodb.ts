import mongoose from "mongoose";

// Get the MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

// This variable tracks whether we are already connected to MongoDB.
// It lives as long as the server is running, so we only connect once
// even if many requests come in.
let isConnected = false;

async function dbConnect() {
  // If we already connected before, don't connect again
  if (isConnected) {
    console.log("Reusing existing MongoDB connection");
    return;
  }

  // Connect for the first time
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  isConnected = true;
  console.log("Connected to MongoDB");
}

export default dbConnect;
