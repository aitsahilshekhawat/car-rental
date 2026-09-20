import prisma from "../config/prisma.js";

export const addReview = async (req, res) => {
  try {
    const { carId, rating, comment } = req.body;

    // Check if user has a completed booking for this car
    const booking = await prisma.booking.findFirst({
      where: {
        userId: req.user.id,
        carId,
        status: "COMPLETED",
      },
    });

    if (!booking) {
      return res.status(400).json({
        message: "You can only review cars you have completed a booking for",
      });
    }

    // Check if user already reviewed this car
    const existingReview = await prisma.review.findUnique({
      where: { userId_carId: { userId: req.user.id, carId } },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this car" });
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        carId,
        rating: Number(rating),
        comment,
      },
    });

    // Update car's average rating
    const allReviews = await prisma.review.findMany({ where: { carId } });
    const totalReviews = allReviews.length;
    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    await prisma.car.update({
      where: { id: carId },
      data: { averageRating, totalReviews },
    });

    res.status(201).json({
      message: "Review Added Successfully",
      review: { ...review, _id: review.id },
    });
  } catch (error) {
    console.log("ADD REVIEW ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCarReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { carId: req.params.carId },
      include: {
        user: {
          select: { id: true, name: true, profilePicture: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      reviews: reviews.map((r) => ({
        ...r,
        _id: r.id,
        user: r.user ? { ...r.user, _id: r.user.id } : null,
      })),
    });
  } catch (error) {
    console.log("GET REVIEWS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
