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
