import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import { Heart } from "lucide-react";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
function CarDetails() {
  const { id } = useParams();

  const { token } = useAuth();

  const [car, setCar] = useState(null);

  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  const getCar = async () => {
    try {
      const response = await api.get(`/cars/${id}`);

      setCar(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getReviews = async () => {
    try {
      const response = await api.get(`/reviews/${id}`);

      setReviews(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCar();

    getReviews();
  }, []);

  const toggleFavorite = async () => {
    try {
      await api.post(
        "/favorites/toggle",
        {
          carId: car._id,
        },
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

  const submitReview = async () => {
    try {
      await api.post(
        "/reviews/add",
        {
          carId: id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      toast.success("Review Added");

      setComment("");

      getReviews();
    } catch (error) {
      console.log(error);

      toast.error(error.response.data.message);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="relative max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={toggleFavorite}
            className="bg-white p-4 rounded-full shadow-xl"
          >
            <Heart size={32} />
          </button>
        </div>

        <img
          src={car.image}
          alt={car.name}
          className="w-full h-[500px] object-cover"
        />

        <div className="p-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold">{car.name}</h1>

              <p className="text-2xl text-gray-500 mt-3">{car.brand}</p>
            </div>

            <div className="text-3xl font-bold">₹ {car.pricePerDay}/day</div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div className="bg-gray-100 p-6 rounded-2xl">
              <h3 className="text-xl font-bold">Fuel Type</h3>

              <p className="mt-3 text-gray-600">{car.fuelType}</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-2xl">
              <h3 className="text-xl font-bold">Transmission</h3>

              <p className="mt-3 text-gray-600">{car.transmission}</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-2xl">
              <h3 className="text-xl font-bold">Seating Capacity</h3>

              <p className="mt-3 text-gray-600">{car.seatingCapacity}</p>
            </div>
          </div>

          <Link to={`/booking/${car._id}`}>
            <button className="mt-10 bg-black text-white px-10 py-4 rounded-2xl text-xl hover:bg-gray-800 transition">
              Book Now
            </button>
          </Link>

          {/* REVIEWS SECTION */}

          <div className="mt-16">
            <h2 className="text-4xl font-bold mb-8">Reviews</h2>

            <div className="bg-gray-100 p-6 rounded-2xl">
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full border p-4 rounded-xl mb-4"
              >
                <option value="5">5 Stars</option>

                <option value="4">4 Stars</option>

                <option value="3">3 Stars</option>

                <option value="2">2 Stars</option>

                <option value="1">1 Star</option>
              </select>

              <textarea
                placeholder="Write Review"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border p-4 rounded-xl h-32"
              />

              <button
                onClick={submitReview}
                className="mt-4 bg-black text-white px-8 py-3 rounded-xl"
              >
                Submit Review
              </button>
            </div>

            <div className="space-y-6 mt-10">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white p-6 rounded-2xl shadow"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{review.user.name}</h3>

                    <div className="text-yellow-500 text-xl">
                      ⭐ {review.rating}
                    </div>
                  </div>

                  <p className="mt-4 text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetails;
