import Car from "../models/car.model.js";

// Allows hosts and admins
export const hostOrAdminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== "host" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied. Host or Admin role required." });
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

    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car Not Found" });

    if (car.owner && car.owner.toString() === req.user.id) return next();

    return res.status(403).json({ message: "Access Denied. You can only manage your own cars." });
  } catch (error) {
    console.log("OWNER MIDDLEWARE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
