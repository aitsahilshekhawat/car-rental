import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
function Booking() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { token } = useAuth();

  const [car, setCar] = useState(null);

  const [pickupDate, setPickupDate] = useState("");

  const [returnDate, setReturnDate] = useState("");

  const [loading, setLoading] = useState(false);

  const getCar = async () => {
    try {
      const response = await api.get(`/cars/${id}`);

      setCar(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCar();
  }, []);

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;

    const start = new Date(pickupDate);

    const end = new Date(returnDate);

    const diff = end - start;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const totalPrice = calculateDays() * (car?.pricePerDay || 0);

  const handleBooking = async () => {
    try {
      setLoading(true);

      await api.post(
        "/bookings/book",
        {
          car: id,
          pickupDate,
          returnDate,
          totalPrice,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      toast.success("Booking Successful");

      navigate("/my-bookings");
    } catch (error) {
      console.log(error);

      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (!car) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-4xl font-bold mb-8">Book {car.name}</h1>

        <img
          src={car.image}
          alt={car.name}
          className="w-full h-80 object-cover rounded-2xl"
        />

        <div className="mt-8">
          <label className="block text-lg font-semibold mb-2">
            Pickup Date
          </label>

          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full border p-4 rounded-xl mb-6"
          />

          <label className="block text-lg font-semibold mb-2">
            Return Date
          </label>

          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full border p-4 rounded-xl"
          />
        </div>

        <div className="mt-8 text-2xl font-bold">
          Total Price:
          <span className="ml-2">₹ {totalPrice}</span>
        </div>

        <button
          onClick={handleBooking}
          disabled={loading}
          className="mt-8 w-full bg-black text-white py-4 rounded-2xl text-xl"
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}

export default Booking;
