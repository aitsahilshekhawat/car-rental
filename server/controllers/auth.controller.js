import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "../config/mail.js";
import { setTokenCookie, clearTokenCookie } from "../config/cookie.js";
export const register = async (req, res) => {
  try {
    console.log(req.body);

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User Registered",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || "",
      },
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "7d",
      },
    );

    // H1: Set JWT in HttpOnly cookie
    setTokenCookie(res, token);

    // H4: Only return safe user fields
    res.status(200).json({
      message: "Login Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || "",
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// H1: Logout — clear HttpOnly cookie
export const logout = async (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -resetPasswordToken -resetPasswordExpire -__v"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("GET ME ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

   const message = `
Hi ${user.name},

We received a request to reset your password for your Car Rental account.

Click the link below to create a new password:

${resetUrl}

This link will expire in 15 minutes.

If you didn't request a password reset, you can safely ignore this email.

Regards,
Car Rental Team
`;

    await transporter.verify();

    console.log("✅ SMTP Connected");
    await transporter.sendMail({
      from: `"Car Rental" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Password Reset",
      text: message,
    });

    res.status(200).json({
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};