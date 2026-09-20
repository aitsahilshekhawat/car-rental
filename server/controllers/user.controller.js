import prisma from "../config/prisma.js";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        googleId: true,
        authProvider: true,
        profilePicture: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      users: users.map((u) => ({ ...u, _id: u.id })),
    });
  } catch (error) {
    console.log("GET USERS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const callerRole = req.user.role;

    if (!["user", "admin", "manager"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Must be user, admin, or manager." });
    }

    if (req.user.id === req.params.id) {
      return res
        .status(400)
        .json({ message: "You cannot change your own role" });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role === "manager" && callerRole !== "manager") {
      return res
        .status(403)
        .json({ message: "Only managers can promote someone to manager" });
    }

    if (targetUser.role === "manager" && callerRole !== "manager") {
      return res.status(403).json({
        message: "Only managers can change another manager's role",
      });
    }

    if (callerRole === "admin") {
      if (targetUser.role === "admin" && role === "user") {
        return res.status(403).json({
          message:
            "Admins cannot demote other admins. Only a manager can do this.",
        });
      }
    }

    if (targetUser.role === "manager" && role !== "manager") {
      const managerCount = await prisma.user.count({
        where: { role: "manager" },
      });
      if (managerCount <= 1) {
        return res.status(400).json({
          message:
            "At least one manager must exist. Promote another user to manager first.",
        });
      }
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
    });

    res.status(200).json({
      message: `User role updated to ${role}`,
      user: {
        _id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        createdAt: updated.createdAt,
      },
    });
  } catch (error) {
    console.log("UPDATE ROLE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
