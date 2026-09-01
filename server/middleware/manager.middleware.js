const managerMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({
        message: "Access Denied. Manager role required.",
      });
    }

    next();
  } catch (error) {
    console.log("MANAGER ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export default managerMiddleware;
