import prisma from "../config/prisma.js";

// Allows hosts and admins
export const hostOrAdminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== "host" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access Denied. Host or Admin role required." });
    }
    next();
  } catch (error) {
    console.log("HOST MIDDLEWARE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Allows owner of the car or admin
export const ownerOrAdminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role === "admin") return next();

    const car = await prisma.car.findUnique({ where: { id: req.params.id } });
    if (!car) return res.status(404).json({ message: "Car Not Found" });

    if (car.ownerId && car.ownerId === req.user.id) return next();

    return res
      .status(403)
      .json({ message: "Access Denied. You can only manage your own cars." });
  } catch (error) {
    console.log("OWNER MIDDLEWARE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
