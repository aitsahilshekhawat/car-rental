import { OAuth2Client } from "google-auth-library";
import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";
import { setTokenCookie } from "../config/cookie.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] },
    });

    if (user) {
      const updates = {};
      if (!user.googleId) {
        updates.googleId = googleId;
        if (user.authProvider !== "local") updates.authProvider = "google";
      }
      if (!user.profilePicture && picture) {
        updates.profilePicture = picture;
      }
      if (Object.keys(updates).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updates,
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          profilePicture: picture || "",
          authProvider: "google",
          password: "",
        },
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: "7d" },
    );

    setTokenCookie(res, token);

    res.status(200).json({
      message: "Google Login Successful",
      user: {
        _id: user.id,
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
