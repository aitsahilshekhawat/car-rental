import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { Heart } from "lucide-react";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

import toast from "react-hot-toast";

import Spinner from "../components/Spinner";

function Cars() {
  const [cars, setCars] = useState([]);

  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState("");

  const [fuelType, setFuelType] = useState("");

  const [transmission, setTransmission] = useState("");

  const [sortBy, setSortBy] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const { token, role } = useAuth();

  const isAdmin = role === "admin";

  const getCars = async () => {
    try {
      const response = await api.get(
        `/cars?location=${location}&fuelType=${fuelType}&transmission=${transmission}&sortBy=${sortBy}&page=${page}`,
      );

      setCars(response.data.cars);

      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, [location, fuelType, transmission, sortBy, page]);

  const toggleFavorite = async (carId) => {
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

      toast.success("Updated Favorites");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCar = async (id) => {
    try {
      await api.delete(`/cars/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      toast.success("Car Deleted");

      setCars(cars.filter((car) => car._id !== id));
    } catch (error) {
      console.log(error);

      toast.error(error.response.data.message);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white p-10 transition">
      <h1 className="text-5xl font-bold mb-10">Available Cars</h1>

      {/* FILTERS */}

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow mb-10 grid md:grid-cols-4 gap-6">
        <input
          type="text"
          placeholder="Search Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-4 rounded-xl bg-transparent"
        />

        <select
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
          className="border p-4 rounded-xl bg-transparent"
        >
          <option value="">All Fuel Types</option>

          <option value="Petrol">Petrol</option>

          <option value="Diesel">Diesel</option>

          <option value="Electric">Electric</option>
        </select>

        <select
          value={transmission}
          onChange={(e) => setTransmission(e.target.value)}
          className="border p-4 rounded-xl bg-transparent"
        >
          <option value="">All Transmission</option>

          <option value="Manual">Manual</option>

          <option value="Automatic">Automatic</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-4 rounded-xl bg-transparent"
        >
          <option value="">Sort By</option>

          <option value="low">Price Low to High</option>

          <option value="high">Price High to Low</option>
        </select>
      </div>

      {/* EMPTY STATE */}

      {cars.length === 0 && (
        <div className="text-center py-32">
          <h2 className="text-5xl font-bold">No Cars Found 🚗</h2>

          <p className="text-gray-500 mt-6 text-xl">
            Try changing filters or search.
          </p>
        </div>
      )}

      {/* CARS */}

      {cars.length > 0 && (
        <div className="grid md:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car._id}
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition duration-300"
            >
              <button
                onClick={() => toggleFavorite(car._id)}
                className="absolute top-4 right-4 bg-white text-black p-3 rounded-full shadow-lg"
              >
                <Heart />
              </button>

              <img
                src={car.image}
                alt={car.name}
                className="h-60 w-full object-cover"
              />

              <div className="p-6">
                <h2 className="text-2xl font-bold">{car.name}</h2>

                <p className="text-gray-500 mt-2">{car.brand}</p>

                <p className="mt-4 text-lg">₹ {car.pricePerDay} / day</p>

                <Link to={`/cars/${car._id}`}>
                  <button className="mt-6 w-full bg-black dark:bg-white dark:text-black text-white py-3 rounded-xl hover:bg-gray-800 transition">
                    View Details
                  </button>
                </Link>

                {isAdmin && (
                  <>
                    <Link to={`/edit-car/${car._id}`}>
                      <button className="mt-4 w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition">
                        Edit Car
                      </button>
                    </Link>

                    <button
                      onClick={() => deleteCar(car._id)}
                      className="mt-4 w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition"
                    >
                      Delete Car
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}

      <div className="flex justify-center gap-4 mt-16">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-black text-white px-6 py-3 rounded-xl disabled:opacity-50"
        >
          Previous
        </button>

        <p className="text-xl font-bold">
          Page {page} of {totalPages}
        </p>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-black text-white px-6 py-3 rounded-xl disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Cars;
