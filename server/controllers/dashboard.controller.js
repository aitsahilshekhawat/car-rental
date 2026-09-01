import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";
import User from "../models/user.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();

    const bookings = await Booking.find();

    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0,
    );

    const recentBookings = await Booking.find()
      .populate("car")
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalCars,
      totalBookings,
      totalUsers,
      totalRevenue,
      recentBookings,
    });
  } catch (error) {
    console.log("DASHBOARD ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
