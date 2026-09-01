import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { setTokenCookie } from "../config/cookie.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user already exists
    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      // Update Google ID and profile pic if missing
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = user.authProvider === "local" ? "local" : "google";
      }
      if (!user.profilePicture && picture) {
        user.profilePicture = picture;
      }
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture: picture || "",
        authProvider: "google",
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
      message: "Google Login Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.log("GOOGLE LOGIN ERROR:", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
};
