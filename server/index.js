import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import carRoutes from "./routes/car.route.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(process.env.PORT, () => {
  console.log("Server Running");
});
