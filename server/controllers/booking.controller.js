import prisma from "../config/prisma.js";

export const getBookedDates = async (req, res) => {
  try {
    const { carId } = req.params;

    const bookings = await prisma.booking.findMany({
      where: {
        carId,
        status: { in: ["PENDING", "APPROVED"] },
      },
      select: { pickupDate: true, returnDate: true },
    });

    res.status(200).json({ bookedDates: bookings });
  } catch (error) {
    console.log("GET BOOKED DATES ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const bookCar = async (req, res) => {
  try {
    const { carId, pickupDate, returnDate, totalPrice } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // Check for overlapping bookings
      const overlapping = await tx.booking.findFirst({
        where: {
          carId,
          status: { in: ["PENDING", "APPROVED"] },
          OR: [
            {
              pickupDate: { lte: new Date(returnDate) },
              returnDate: { gte: new Date(pickupDate) },
            },
          ],
        },
      });

      if (overlapping) {
        throw new Error("OVERLAP");
      }

      const booking = await tx.booking.create({
        data: {
          userId: req.user.id,
          carId,
          pickupDate: new Date(pickupDate),
          returnDate: new Date(returnDate),
          totalPrice: Number(totalPrice),
          status: "PENDING",
        },
      });

      return booking;
    });

    res.status(201).json({
      message: "Car Booked Successfully",
      booking: { ...result, _id: result.id },
    });
  } catch (error) {
    if (error.message === "OVERLAP") {
      return res
        .status(400)
        .json({ message: "Car is already booked for these dates" });
    }
    console.log("BOOK CAR ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        car: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      bookings: bookings.map((b) => ({
        ...b,
        _id: b.id,
        car: b.car ? { ...b.car, _id: b.car.id } : null,
      })),
    });
  } catch (error) {
    console.log("GET MY BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You can only cancel your own bookings" });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: "CANCELLED" },
    });

    res.status(200).json({
      message: "Booking Cancelled",
      booking: { ...updated, _id: updated.id },
    });
  } catch (error) {
    console.log("CANCEL BOOKING ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        car: true,
        user: {
          select: { id: true, name: true, email: true },
        },
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
    console.log("GET ALL BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.status(200).json({
      message: "Booking Status Updated",
      booking: { ...updated, _id: updated.id },
    });
  } catch (error) {
    console.log("UPDATE BOOKING STATUS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
