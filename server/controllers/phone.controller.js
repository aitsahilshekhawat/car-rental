import admin from "../config/firebase-admin.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { setTokenCookie } from "../config/cookie.js";

export const phoneLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Firebase ID token is required" });
    }

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number not found in token" });
    }

    // Check if user exists with this phone number
    let user = await User.findOne({ phone: phoneNumber });

    if (!user) {
      // Create new user with phone
      user = await User.create({
        name: `User ${phoneNumber.slice(-4)}`,
        email: `${phoneNumber.replace("+", "")}@phone.carrental.com`,
        phone: phoneNumber,
        authProvider: "phone",
        password: "",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: "7d" }
    );

    // H1: Set JWT in HttpOnly cookie
    setTokenCookie(res, token);

    res.status(200).json({
      message: "Phone Login Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.log("PHONE LOGIN ERROR:", error);
    res.status(500).json({ message: "Phone authentication failed" });
  }
};
