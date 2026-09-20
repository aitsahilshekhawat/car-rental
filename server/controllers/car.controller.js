import prisma from "../config/prisma.js";

export const addCar = async (req, res) => {
  try {
    const {
      name,
      brand,
      type,
      pricePerDay,
      fuelType,
      transmission,
      seatingCapacity,
      location,
      image,
    } = req.body;

    const carData = {
      name,
      brand,
      type,
      pricePerDay: Number(pricePerDay),
      fuelType,
      transmission,
      seatingCapacity: Number(seatingCapacity),
      location,
      image,
    };

    // If the user is a host or admin, set them as owner
    if (req.user && (req.user.role === "host" || req.user.role === "admin")) {
      carData.ownerId = req.user.id;
    }

    const car = await prisma.car.create({ data: carData });

    res.status(201).json({
      message: "Car Added Successfully",
      car: { ...car, _id: car.id },
    });
  } catch (error) {
    console.log("ADD CAR ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCars = async (req, res) => {
  try {
    const { location, fuelType, transmission, type, sortBy } = req.query;

    const where = {};

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }
    if (fuelType) where.fuelType = fuelType;
    if (transmission) where.transmission = transmission;
    if (type) where.type = type;

    let orderBy = { createdAt: "desc" };
    if (sortBy === "low") orderBy = { pricePerDay: "asc" };
    if (sortBy === "high") orderBy = { pricePerDay: "desc" };

    const cars = await prisma.car.findMany({
      where,
      orderBy,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(200).json({
      cars: cars.map((c) => ({
        ...c,
        _id: c.id,
        owner: c.owner ? { ...c.owner, _id: c.owner.id } : null,
      })),
    });
  } catch (error) {
    console.log("GET CARS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await prisma.car.findUnique({ where: { id: req.params.id } });

    if (!car) {
      return res.status(404).json({ message: "Car Not Found" });
    }

    // Authorization: only owner or admin can delete
    if (req.user.role !== "admin" && car.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Access Denied. You can only delete your own cars." });
    }

    await prisma.car.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: "Car Deleted Successfully" });
  } catch (error) {
    console.log("DELETE CAR ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateCar = async (req, res) => {
  try {
    const car = await prisma.car.findUnique({ where: { id: req.params.id } });

    if (!car) {
      return res.status(404).json({ message: "Car Not Found" });
    }

    const updatedCar = await prisma.car.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.status(200).json({
      message: "Car Updated Successfully",
      car: { ...updatedCar, _id: updatedCar.id },
    });
  } catch (error) {
    console.log("UPDATE CAR ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await prisma.car.findUnique({
      where: { id: req.params.id },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!car) {
      return res.status(404).json({ message: "Car Not Found" });
    }

    res.status(200).json({
      ...car,
      _id: car.id,
      owner: car.owner ? { ...car.owner, _id: car.owner.id } : null,
    });
  } catch (error) {
    console.log("GET CAR ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
