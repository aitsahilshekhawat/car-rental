import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    // H1: Read token from HttpOnly cookie first, fall back to Authorization header
    let token = req.cookies?.token;

    // Fallback: check Authorization header (for backward compat / API clients)
    if (!token && req.headers.authorization) {
      token = req.headers.authorization;
      if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        message: "No Token Provided",
      });
    }

    // M5: Pin allowed algorithm to prevent alg:none / alg confusion attacks
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    req.user = decoded;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error);

    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export default authMiddleware;
