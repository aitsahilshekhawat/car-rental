import prisma from "../config/prisma.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [totalCars, totalBookings, totalUsers, revenueResult, recentBookings] =
      await Promise.all([
        prisma.car.count(),
        prisma.booking.count(),
        prisma.user.count(),
        prisma.booking.aggregate({
          _sum: { totalPrice: true },
          where: { status: { in: ["APPROVED", "COMPLETED"] } },
        }),
        prisma.booking.findMany({
          include: {
            car: true,
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    const totalRevenue = revenueResult._sum.totalPrice || 0;

    res.status(200).json({
      totalCars,
      totalBookings,
      totalUsers,
      totalRevenue,
      recentBookings: recentBookings.map((b) => ({
        ...b,
        _id: b.id,
        car: b.car ? { ...b.car, _id: b.car.id } : null,
        user: b.user ? { ...b.user, _id: b.user.id } : null,
      })),
    });
  } catch (error) {
    console.log("DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
