import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },

    googleId: {
      type: String,
      default: null,
    },

    authProvider: {
      type: String,
      enum: ["local", "google", "phone"],
      default: "local",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: null,
    },

    favoriteCars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
      },
    ],

    // Forgot Password Fields

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
