//dotenv
import dotenv from "dotenv";
dotenv.config();

//imports
import express from "express";
import connectDB from "./src/config/connectDB.js";
import authRouter from "./src/routers/auth.route.js";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import sendOtp from "./src/utils/sendOtp.js"

//creating express app
const app = express();

//middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

//routers

app.use("/api/auth", authRouter);

//root
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

//not found middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

//error middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

//port
const port = process.env.PORT || 4500;

app.listen(port, () => {
  connectDB();
  console.log("Server is started at: ", port);
});
