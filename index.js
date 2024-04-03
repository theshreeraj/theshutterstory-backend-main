import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
// import doctorRoute from "./Routes/doctor.js";
import photographerRoute from "./Routes/photographer.js";
import reviewRoute from "./Routes/review.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

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

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/photographers", photographerRoute);
app.use("/api/v1/reviews", reviewRoute);

app.listen(port, () => {
  connectDB();
  console.log("Server is running on " + port);
});
