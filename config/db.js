import mongoose from "mongoose";

// Connect Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB database is connected");
  } catch (err) {
    console.error("MongoDB database connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
