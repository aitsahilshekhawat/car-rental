import { useEffect, useState } from "react";

import api from "../services/api";

import Spinner from "../components/Spinner";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const getBookings = async () => {
    try {
      const response = await api.get("/bookings/my", {
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

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white p-10">
      <h1 className="text-5xl font-bold mb-10">My Bookings</h1>

      {bookings?.length === 0 && (
        <div className="text-center py-32">
          <h2 className="text-5xl font-bold">No Bookings Yet 🚗</h2>

          <p className="text-gray-500 mt-6 text-xl">
            Start booking your dream cars.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {bookings?.map((booking) => (
          <div
            key={booking._id}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg overflow-hidden"
          >
            <img
              src={booking.car?.image}
              alt={booking.car?.name}
              className="h-64 w-full object-cover"
            />

            <div className="p-6">
              <h2 className="text-3xl font-bold">{booking.car?.name}</h2>

              <p className="text-gray-500 mt-2">{booking.car?.brand}</p>

              <p className="mt-4">
                Start: {new Date(booking.pickupDate).toLocaleDateString()}
              </p>

              <p className="mt-2">
                End: {new Date(booking.returnDate).toLocaleDateString()}
              </p>

              <p className="mt-4 text-2xl font-bold">₹ {booking.totalPrice}</p>

              <p className="mt-4 font-bold">
                Status:
                <span
                  className={`ml-3 px-4 py-1 rounded-full text-white text-sm

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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;
