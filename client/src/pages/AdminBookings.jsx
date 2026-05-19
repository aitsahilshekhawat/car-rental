import { useEffect, useState } from "react";

import api from "../services/api";

import toast from "react-hot-toast";

import Spinner from "../components/Spinner";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const getBookings = async () => {
    try {
      const response = await api.get("/bookings", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      setBookings(response.data.bookings);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(
        `/bookings/status/${id}`,
        { status },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      );

      toast.success("Status Updated");

      getBookings();
    } catch (error) {
      console.log(error);

      toast.error(error.response.data.message);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white p-10">
      <h1 className="text-5xl font-bold mb-10">Manage Bookings</h1>

      <div className="space-y-8">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl"
          >
            <h2 className="text-3xl font-bold">{booking.car?.name}</h2>

            <p className="mt-3 text-gray-500">
              User:
              {booking.user?.name}
            </p>

            <p className="mt-2">₹ {booking.totalPrice}</p>

            <p className="mt-2 font-bold">
              Status:
              <span
                className={`ml-2 px-4 py-1 rounded-full text-white text-sm

      ${
        booking.status === "Approved"
          ? "bg-green-500"
          : booking.status === "Rejected"
            ? "bg-red-500"
            : booking.status === "Completed"
              ? "bg-blue-500"
              : "bg-yellow-500"
      }
    `}
              >
                {booking.status}
              </span>
            </p>

            <div className="flex gap-4 mt-6 flex-wrap">
              <button
                onClick={() => updateStatus(booking._id, "Approved")}
                className="bg-green-500 text-white px-6 py-3 rounded-xl"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(booking._id, "Rejected")}
                className="bg-red-500 text-white px-6 py-3 rounded-xl"
              >
                Reject
              </button>

              <button
                onClick={() => updateStatus(booking._id, "Completed")}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl"
              >
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminBookings;
