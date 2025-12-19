// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const defaultOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = process.env.LOCAL_MONGODB_URI || "mongodb://127.0.0.1:27017/school_project";

  const tryConnect = async (uri) => {
    await mongoose.connect(uri, defaultOptions);
    console.log(`MongoDB connected (${uri.includes("127.0.0.1") ? "local" : "primary"})`);
  };

  try {
    if (primaryUri) {
      await tryConnect(primaryUri);
      return;
    }
    throw new Error("MONGODB_URI not set");
  } catch (primaryErr) {
    console.error("Primary MongoDB connection error:", primaryErr.message || primaryErr);

    // In development, try a local MongoDB fallback
    if (process.env.NODE_ENV !== "production") {
      try {
        await tryConnect(localUri);
        return;
      } catch (localErr) {
        console.error("Local MongoDB connection error:", localErr.message || localErr);
        console.warn("Continuing without DB connection for development. Some features may fail.");
        return;
      }
    }

    console.error("Exiting due to DB connection failure in production.");
    process.exit(1);
  }
};

export default connectDB;