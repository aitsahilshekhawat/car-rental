import prisma from "../config/prisma.js";

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalBookings, activeBookings, completedBookings, totalSpentResult] =
      await Promise.all([
        prisma.booking.count({ where: { userId } }),
        prisma.booking.count({ where: { userId, status: "APPROVED" } }),
        prisma.booking.count({ where: { userId, status: "COMPLETED" } }),
        prisma.booking.aggregate({
          _sum: { totalPrice: true },
          where: { userId, status: { in: ["APPROVED", "COMPLETED"] } },
        }),
      ]);

    const totalSpent = totalSpentResult._sum.totalPrice || 0;

    res.status(200).json({
      totalBookings,
      activeBookings,
      completedBookings,
      totalSpent,
    });
  } catch (error) {
    console.log("USER DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
