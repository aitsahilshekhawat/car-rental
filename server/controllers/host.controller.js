import User from "../models/user.model.js";
import Car from "../models/car.model.js";
import Booking from "../models/booking.model.js";

// Apply to become a host
export const applyForHost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "host") {
      return res.status(400).json({ message: "You are already a host!" });
    }
    if (user.hostStatus === "pending") {
      return res.status(400).json({ message: "Your application is already under review." });
    }

    const { bio, city } = req.body;
    if (!bio || !city) {
      return res.status(400).json({ message: "Please provide a bio and city." });
    }

    user.hostBio = bio;
    user.hostCity = city;
    user.hostStatus = "pending";
    await user.save();

    res.status(200).json({ message: "Host application submitted successfully! An admin will review it shortly." });
  } catch (error) {
    console.log("APPLY HOST ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get host dashboard stats
export const getHostDashboard = async (req, res) => {
  try {
    const hostId = req.user.id;

    const totalCars = await Car.countDocuments({ owner: hostId });
    const hostCars = await Car.find({ owner: hostId }).select("_id");
    const carIds = hostCars.map((c) => c._id);

    const totalBookings = await Booking.countDocuments({ car: { $in: carIds } });
    const approvedBookings = await Booking.find({
      car: { $in: carIds },
      status: { $in: ["Approved", "Completed"] },
    });
    const totalEarnings = approvedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    const recentBookings = await Booking.find({ car: { $in: carIds } })
      .populate("user", "name email")
      .populate("car", "name image pricePerDay")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      totalCars,
      totalBookings,
      totalEarnings,
      recentBookings,
    });
  } catch (error) {
    console.log("HOST DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all bookings on host's cars
export const getHostBookings = async (req, res) => {
  try {
    const hostCars = await Car.find({ owner: req.user.id }).select("_id");
    const carIds = hostCars.map((c) => c._id);

    const bookings = await Booking.find({ car: { $in: carIds } })
      .populate("user", "name email profilePicture")
      .populate("car", "name image pricePerDay")
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    console.log("HOST BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get host's own cars
export const getHostCars = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ cars });
  } catch (error) {
    console.log("HOST CARS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
