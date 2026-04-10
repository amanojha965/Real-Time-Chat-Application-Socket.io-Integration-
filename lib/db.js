import mongoose from "mongoose";

/**
 * Connect to MongoDB Database
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/chat-app";
    
    console.log("🔄 Connecting to MongoDB...");
    
    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB Connected Successfully");
    return true;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error.message);
  }
};
