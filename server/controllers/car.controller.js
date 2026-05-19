import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";
import cloudinary from "../config/cloudinary.js";

export const addCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);

    res.status(201).json({
      message: "Car Added Successfully",
      car,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
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

    const cars = await Car.find(query).sort(sortOption);

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

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Car Updated Successfully",
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
