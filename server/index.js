import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import carRoutes from "./routes/car.route.js";
import bookingRoutes from "./routes/booking.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import userDashboardRoutes from "./routes/userDashboard.route.js";
import favoriteRoutes from "./routes/favorite.route.js";
import reviewRoutes from "./routes/review.route.js";
dotenv.config();
import "./config/cloudinary.js";

connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    credentials: true,
  }),
);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user-dashboard", userDashboardRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reviews", reviewRoutes);
app.get("/", (req, res) => {
  res.send("API Running");
});


