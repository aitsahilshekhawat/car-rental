import mongoose from "mongoose";
import dotenv from "dotenv";
import Car from "./models/car.model.js";

dotenv.config();

const updateCarImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Migration...");

    const cars = await Car.find({});

    const genericLuxuryImages = [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80", // Exterior side
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80", // Action shot
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80", // Back/Side
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80", // Interior Dash
      "https://images.unsplash.com/photo-1550508139-2b0e41793740?auto=format&fit=crop&w=800&q=80", // Interior Steering/Seats
      "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=800&q=80", // Details/Alloy
    ];

    for (let car of cars) {
      const imagesArray = [car.image, ...genericLuxuryImages]; // Main image + 6 others
      await Car.findByIdAndUpdate(car._id, { images: imagesArray });
    }

    console.log(`Updated ${cars.length} cars with multi-image arrays!`);
    process.exit();
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

updateCarImages();
