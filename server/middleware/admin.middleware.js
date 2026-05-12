const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    next();
  } catch (error) {
    console.log("ADMIN ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export default adminMiddleware;
