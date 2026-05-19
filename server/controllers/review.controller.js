import Review from "../models/review.model.js";
import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";

export const addReview = async (req, res) => {
  try {
    const { carId, rating, comment } = req.body;

    // check booking
    const booking = await Booking.findOne({
      user: req.user.id,
      car: carId,
      status: "completed",
    });

    if (!booking) {
      return res.status(400).json({
        message: "You can only review completed bookings",
      });
    }

    // prevent duplicate review
    const existingReview = await Review.findOne({
      user: req.user.id,
      car: carId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "Review already added",
      });
    }

    // create review
    const review = await Review.create({
      user: req.user.id,
      car: carId,
      rating,
      comment,
    });

    // calculate average rating
    const reviews = await Review.find({ car: carId });

    const total = reviews.reduce((acc, item) => {
      return acc + item.rating;
    }, 0);

    const average = total / reviews.length;

    await Car.findByIdAndUpdate(carId, {
      averageRating: average,
      totalReviews: reviews.length,
    });

    res.status(201).json({
      message: "Review Added Successfully",
      review,
    });
  } catch (error) {
    console.log("ADD REVIEW ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      car: req.params.carId,
    }).populate("user", "name");

    res.status(200).json(reviews);
  } catch (error) {
    console.log("GET REVIEWS ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
