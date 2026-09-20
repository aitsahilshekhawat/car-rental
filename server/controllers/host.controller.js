import prisma from "../config/prisma.js";

export const applyForHost = async (req, res) => {
  try {
    const { bio, city } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.hostStatus === "pending") {
      return res
        .status(400)
        .json({ message: "Your host application is already pending" });
    }

    if (user.role === "host") {
      return res.status(400).json({ message: "You are already a host" });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        hostBio: bio,
        hostCity: city,
        hostStatus: "pending",
      },
    });

    res.status(200).json({ message: "Host application submitted successfully" });
  } catch (error) {
    console.log("APPLY FOR HOST ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getHostDashboard = async (req, res) => {
  try {
    const hostId = req.user.id;

    const cars = await prisma.car.findMany({
      where: { ownerId: hostId },
    });

    const carIds = cars.map((c) => c.id);

    const [totalBookings, totalRevenueResult] = await Promise.all([
      prisma.booking.count({
        where: {
          carId: { in: carIds },
          status: { in: ["APPROVED", "COMPLETED"] },
        },
      }),
      prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: {
          carId: { in: carIds },
          status: { in: ["APPROVED", "COMPLETED"] },
        },
      }),
    ]);

    const totalRevenue = totalRevenueResult._sum.totalPrice || 0;

    res.status(200).json({
      totalCars: cars.length,
      totalBookings,
      totalRevenue,
      cars: cars.map((c) => ({ ...c, _id: c.id })),
    });
  } catch (error) {
    console.log("HOST DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getHostBookings = async (req, res) => {
  try {
    const hostId = req.user.id;

    const cars = await prisma.car.findMany({
      where: { ownerId: hostId },
      select: { id: true },
    });

    const carIds = cars.map((c) => c.id);

    const bookings = await prisma.booking.findMany({
      where: { carId: { in: carIds } },
      include: {
        car: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      bookings: bookings.map((b) => ({
        ...b,
        _id: b.id,
        car: b.car ? { ...b.car, _id: b.car.id } : null,
        user: b.user ? { ...b.user, _id: b.user.id } : null,
      })),
    });
  } catch (error) {
    console.log("HOST BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getHostCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      cars: cars.map((c) => ({ ...c, _id: c.id })),
    });
  } catch (error) {
    console.log("HOST CARS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
