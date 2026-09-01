import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -resetPasswordToken -resetPasswordExpire",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("GET PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.status(200).json({
      message: "Profile Updated Successfully",
      user,
    });
  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
