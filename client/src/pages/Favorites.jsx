import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
function Favorites() {
  const { token } = useAuth();

  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(true);

  const getFavorites = async () => {
    try {
      const response = await api.get("/favorites", {
        headers: {
          Authorization: token,
        },
      });

      setFavorites(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavorites();
  }, []);

  const removeFavorite = async (carId) => {
    try {
      await api.post(
        "/favorites/toggle",
        { carId },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      getFavorites();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-5xl font-bold mb-10">Favorite Cars</h1>

      {favorites.length === 0 ? (
        <div className="text-2xl text-gray-500">No Favorite Cars Yet</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {favorites.map((car) => (
            <div
              key={car._id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-60 object-cover"
              />

              <div className="p-6">
                <h2 className="text-2xl font-bold">{car.name}</h2>

                <p className="text-gray-500 mt-2">{car.brand}</p>

                <p className="mt-4 text-lg">₹ {car.pricePerDay} / day</p>

                <div className="flex gap-4 mt-6">
                  <Link to={`/cars/${car._id}`} className="flex-1">
                    <button className="w-full bg-black text-white py-3 rounded-xl">
                      View
                    </button>
                  </Link>

                  <button
                    onClick={() => removeFavorite(car._id)}
                    className="bg-red-500 text-white px-5 rounded-xl"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
