import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

import toast from "react-hot-toast";

import Spinner from "../components/Spinner";

function EditCar() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    pricePerDay: "",
    fuelType: "",
    transmission: "",
    seatingCapacity: "",
    location: "",
    image: "",
  });

  const getCar = async () => {
    try {
      const response = await api.get(`/cars/${id}`);

      setFormData(response.data.car);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCar();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/cars/${id}`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      toast.success("Car Updated");

      navigate("/cars");
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
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-xl">
        <h1 className="text-5xl font-bold mb-10">Edit Car</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Car Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-4 rounded-xl bg-transparent placeholder-gray-500"
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full border p-4 rounded-xl bg-transparent placeholder-gray-500"
          />

          <input
            type="number"
            name="pricePerDay"
            placeholder="Price"
            value={formData.pricePerDay}
            onChange={handleChange}
            className="w-full border p-4 rounded-xl bg-transparent placeholder-gray-500"
          />

          <input
            type="text"
            name="fuelType"
            placeholder="Fuel Type"
            value={formData.fuelType}
            onChange={handleChange}
            className="w-full border p-4 rounded-xl bg-transparent placeholder-gray-500"
          />

          <input
            type="text"
            name="transmission"
            placeholder="Transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="w-full border p-4 rounded-xl bg-transparent placeholder-gray-500"
          />

          <input
            type="number"
            name="seatingCapacity"
            placeholder="Seats"
            value={formData.seatingCapacity}
            onChange={handleChange}
            className="w-full border p-4 rounded-xl bg-transparent placeholder-gray-500"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border p-4 rounded-xl bg-transparent placeholder-gray-500"
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="w-full border p-4 rounded-xl bg-transparent placeholder-gray-500"
          />

          <button
            type="submit"
            className="w-full bg-black dark:bg-white dark:text-black text-white py-4 rounded-xl text-xl font-bold hover:scale-105 transition"
          >
            Update Car
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCar;
