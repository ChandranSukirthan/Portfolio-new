import mongoose from "mongoose";
import seedDatabase from "../config/seed";

const primaryUri = process.env.MONGO_URI;
const fallbackUri = "mongodb://127.0.0.1:27017/portfolio";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("Connecting to MongoDB Atlas...");
    cached.promise = mongoose
      .connect(primaryUri, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB Atlas connected successfully...");
        // Auto-seed defaults if needed
        seedDatabase().catch((err) =>
          console.error("Database seeding failed:", err.message)
        );
        return mongooseInstance;
      })
      .catch(async (err) => {
        console.error("MongoDB Atlas connection failed:", err.message);

        if (process.env.NODE_ENV === "production") {
          throw new Error("MongoDB Atlas connection failed in production");
        }

        console.log("Attempting fallback connection to local MongoDB...");
        try {
          const localConn = await mongoose.connect(fallbackUri, opts);
          console.log("Local MongoDB connected successfully!");
          // Auto-seed defaults if needed
          seedDatabase().catch((err) =>
            console.error("Database seeding failed:", err.message)
          );
          return localConn;
        } catch (localErr) {
          console.error("Local MongoDB fallback also failed:", localErr.message);
          console.error("\n=========================================================================");
          console.error("DATABASE CONNECTION ERROR:");
          console.error("Could not connect to MongoDB Atlas or local MongoDB.");
          console.error("1. Please check your internet connection.");
          console.error("2. Verify that your MONGO_URI in backend/.env is correct.");
          console.error("3. If using local MongoDB, ensure the service is running.");
          console.error("=========================================================================\n");
          throw new Error("Database connection failed");
        }
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
