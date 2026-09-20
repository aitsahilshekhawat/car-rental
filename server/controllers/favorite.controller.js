import prisma from "../config/prisma.js";

export const toggleFavorite = async (req, res) => {
  try {
    const { carId } = req.body;

    if (!carId) {
      return res.status(400).json({ message: "Car ID is required" });
    }

    // Check if car exists
    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      return res.status(404).json({ message: "Car Not Found" });
    }

    // Check if already favorited
    const existing = await prisma.favoriteCar.findUnique({
      where: { userId_carId: { userId: req.user.id, carId } },
    });

    if (existing) {
      // Remove from favorites
      await prisma.favoriteCar.delete({ where: { id: existing.id } });
      return res.status(200).json({ message: "Car removed from favorites" });
    } else {
      // Add to favorites
      await prisma.favoriteCar.create({
        data: { userId: req.user.id, carId },
      });
      return res.status(200).json({ message: "Car added to favorites" });
    }
  } catch (error) {
    console.log("TOGGLE FAVORITE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await prisma.favoriteCar.findMany({
      where: { userId: req.user.id },
      include: { car: true },
    });

    res.status(200).json({
      favoriteCars: favorites.map((f) => ({ ...f.car, _id: f.car.id })),
    });
  } catch (error) {
    console.log("GET FAVORITES ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
