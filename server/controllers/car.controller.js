import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";
import cloudinary from "../config/cloudinary.js";

// M6/M7: Whitelist of fields allowed in car create/update
const ALLOWED_CAR_FIELDS = [
  "name", "brand", "type", "image", "images", "pricePerDay",
  "fuelType", "transmission", "seatingCapacity", "location",
];

// Extract only whitelisted fields from request body
const pickAllowedFields = (body) => {
  const sanitized = {};
  for (const key of ALLOWED_CAR_FIELDS) {
    if (body[key] !== undefined) sanitized[key] = body[key];
  }
  return sanitized;
};

export const addCar = async (req, res) => {
  try {
    const carData = pickAllowedFields(req.body);

    // Always set the logged-in user as the owner
    carData.owner = req.user.id;

    const car = await Car.create(carData);

    res.status(201).json({
      message: "Car Added Successfully",
      car,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const getCars = async (req, res) => {
  try {
    const query = {};

    if (req.query.location) {
      query.location = {
        $regex: req.query.location,
        $options: "i",
      };
    }

    if (req.query.fuelType) {
      query.fuelType = req.query.fuelType;
    }

    if (req.query.type) {
      query.type = req.query.type;
    }

    if (req.query.transmission) {
      query.transmission = req.query.transmission;
    }

    let sortOption = {};

    if (req.query.sortBy === "low") {
      sortOption = {
        pricePerDay: 1,
      };
    }

    if (req.query.sortBy === "high") {
      sortOption = {
        pricePerDay: -1,
      };
    }

    const cars = await Car.find(query).sort(sortOption).populate("owner", "name email");

    res.status(200).json({
      cars,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: "Car Not Found",
      });
    }

    // Managers have global access; hosts and admins can only delete their own cars
    if (req.user.role !== "manager" && (!car.owner || car.owner.toString() !== req.user.id)) {
      return res.status(403).json({ message: "You can only delete your own cars." });
    }

    await car.deleteOne();

    res.status(200).json({
      message: "Car Deleted Successfully",
    });
  } catch (error) {
    console.log("DELETE CAR ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: "Car Not Found",
      });
    }

    // Managers have global access; hosts and admins can only edit their own cars
    if (req.user.role !== "manager" && (!car.owner || car.owner.toString() !== req.user.id)) {
      return res.status(403).json({ message: "You can only edit your own cars." });
    }

    // M6: Only allow whitelisted fields to be updated
    const updates = pickAllowedFields(req.body);

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Car Updated Successfully",
      car: updatedCar,
      updatedCar,
    });
  } catch (error) {
    console.log("UPDATE CAR ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: "Car Not Found",
      });
    }

    res.status(200).json(car);
  } catch (error) {
    console.log("GET SINGLE CAR ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
