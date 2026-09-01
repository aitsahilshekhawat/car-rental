import Booking from "../models/booking.model.js";

export const getUserDashboard = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments({
      user: req.user.id,
    });

    const activeBookings = await Booking.countDocuments({
      user: req.user.id,
      status: "approved",
    });

    const completedBookings = await Booking.countDocuments({
      user: req.user.id,
      status: "completed",
    });

    const recentBookings = await Booking.find({
      user: req.user.id,
    })
      .populate("car")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalBookings,
      activeBookings,
      completedBookings,
      recentBookings,
    });
  } catch (error) {
    console.log("USER DASHBOARD ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
