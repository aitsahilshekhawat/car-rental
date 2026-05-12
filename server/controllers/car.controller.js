import Car from "../models/car.model.js";

export const addCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);

    res.status(201).json({
      message: "Car Added Successfully",
      car,
    });
  } catch (error) {
    console.log("ADD CAR ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getCars = async (req, res) => {
  try {
    const cars = await Car.find();

    res.status(200).json(cars);
  } catch (error) {
    console.log("GET CARS ERROR:", error);

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