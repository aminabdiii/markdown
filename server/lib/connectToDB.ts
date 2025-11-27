import mongoose from "mongoose";

export const connectDB = async (uri?: string): Promise<void> => {
  try {
    await mongoose.connect(uri || "mongodb://127.0.0.1:27017/myapp");
  } catch (error) {
    console.error("Error connecting to MongoDB:", (error as Error).message);
    process.exit(1);
  }
};
