import User from "../models/user.model.js";

export const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    const { carId } = req.body;

    const alreadyFavorite = user.favoriteCars.some(
      (id) => id.toString() === carId,
    );

    if (alreadyFavorite) {
      user.favoriteCars = user.favoriteCars.filter(
        (id) => id.toString() !== carId,
      );

      await user.save();

      return res.status(200).json({
        message: "Removed From Favorites",
      });
    }

    user.favoriteCars.push(carId);

    await user.save();

    res.status(200).json({
      message: "Added To Favorites",
    });
  } catch (error) {
    console.log("FAVORITE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favoriteCars");

    res.status(200).json(user.favoriteCars);
  } catch (error) {
    console.log("GET FAVORITES ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
