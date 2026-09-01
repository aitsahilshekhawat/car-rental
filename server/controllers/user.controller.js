import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -resetPasswordToken -resetPasswordExpire -__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.log("GET USERS ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const callerRole = req.user.role;

    if (!["user", "admin", "manager"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Must be user, admin, or manager.",
      });
    }

    // Cannot change your own role
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        message: "You cannot change your own role",
      });
    }

    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // --- Permission rules ---

    // Only managers can assign/remove the manager role
    if (role === "manager" && callerRole !== "manager") {
      return res.status(403).json({
        message: "Only managers can promote someone to manager",
      });
    }

    // Only managers can demote another manager
    if (targetUser.role === "manager" && callerRole !== "manager") {
      return res.status(403).json({
        message: "Only managers can change another manager's role",
      });
    }

    // Admins can promote users → admin, but cannot demote admins
    if (callerRole === "admin") {
      if (targetUser.role === "admin" && role === "user") {
        return res.status(403).json({
          message: "Admins cannot demote other admins. Only a manager can do this.",
        });
      }
    }

    // Ensure at least one manager always exists
    if (targetUser.role === "manager" && role !== "manager") {
      const managerCount = await User.countDocuments({ role: "manager" });
      if (managerCount <= 1) {
        return res.status(400).json({
          message: "At least one manager must exist. Promote another user to manager first.",
        });
      }
    }

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json({
      message: `User role updated to ${role}`,
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        createdAt: targetUser.createdAt,
      },
    });
  } catch (error) {
    console.log("UPDATE ROLE ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
