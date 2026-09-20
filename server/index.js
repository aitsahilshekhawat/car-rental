import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import prisma from "./config/prisma.js";
import authRoutes from "./routes/auth.route.js";
import carRoutes from "./routes/car.route.js";
import bookingRoutes from "./routes/booking.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import userDashboardRoutes from "./routes/userDashboard.route.js";
import favoriteRoutes from "./routes/favorite.route.js";
import reviewRoutes from "./routes/review.route.js";
import userRoutes from "./routes/user.route.js";
import profileRoutes from "./routes/profile.route.js";
import paymentRoutes from "./routes/payment.route.js";
import chatRoutes from "./routes/chat.route.js";
import hostRoutes from "./routes/host.route.js";

dotenv.config();
import "./config/cloudinary.js";

const app = express();

// H3: Security headers (X-Content-Type-Options, X-Frame-Options, HSTS, etc.)
app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL || "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// M2: Body size limits to prevent DoS via large payloads
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// H1: Parse cookies so auth middleware can read HttpOnly JWT cookie
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user-dashboard", userDashboardRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/host", hostRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 10000;

// Verify PostgreSQL connection before starting
try {
  await prisma.$connect();
  console.log("PostgreSQL Connected via Prisma");
} catch (error) {
  console.error("PostgreSQL connection failed:", error);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
