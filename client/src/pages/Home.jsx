import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../services/api";

import Spinner from "../components/Spinner";

function Home() {
  const [cars, setCars] = useState([]);

  const [loading, setLoading] = useState(true);

  const getCars = async () => {
    try {
      const response = await api.get("/cars");

      setCars(response.data.cars.slice(0, 3));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white transition">
      {/* HERO SECTION */}

      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-6xl md:text-7xl font-black leading-tight">
              Rent Luxury Cars
              <span className="block text-gray-500">Anytime Anywhere</span>
            </h1>

            <p className="text-xl mt-8 text-gray-600 dark:text-gray-400 leading-relaxed">
              Choose from hundreds of premium cars at the best prices with easy
              booking and instant confirmation.
            </p>

            <div className="flex gap-6 mt-10">
              <Link
                to="/cars"
                className="bg-black dark:bg-white dark:text-black text-white px-10 py-4 rounded-2xl text-lg font-bold"
              >
                Explore Cars
              </Link>

              <Link
                to="/register"
                className="border-2 border-black dark:border-white px-10 py-4 rounded-2xl text-lg font-bold"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
              alt="car"
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-5xl font-black">Featured Cars</h2>

              <p className="text-gray-500 mt-4 text-lg">
                Explore our most popular luxury cars
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {cars.map((car) => (
              <div
                key={car._id}
                className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition duration-300"
              >
                <img
                  src={car.image}
                  alt={car.name}
                  className="h-72 w-full object-cover"
                />

                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-3xl font-bold">{car.name}</h3>

                      <p className="text-gray-500">{car.brand}</p>
                    </div>

                    <p className="text-2xl font-bold">
                      ₹ {car.pricePerDay}/day
                    </p>
                  </div>

                  <Link
                    to={`/cars/${car._id}`}
                    className="mt-6 inline-block bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-xl font-bold"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}

      <section className="px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black">Why Choose Us</h2>

            <p className="text-gray-500 mt-6 text-xl">
              Premium experience with the best luxury cars
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-xl">
              <div className="text-6xl mb-6">🚗</div>

              <h3 className="text-3xl font-bold mb-4">Premium Cars</h3>

              <p className="text-gray-500 text-lg leading-relaxed">
                Choose from top luxury brands including BMW, Audi, Mercedes,
                Porsche and more.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-xl">
              <div className="text-6xl mb-6">⚡</div>

              <h3 className="text-3xl font-bold mb-4">Instant Booking</h3>

              <p className="text-gray-500 text-lg leading-relaxed">
                Book your dream car instantly with secure payments and easy
                confirmation.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-xl">
              <div className="text-6xl mb-6">💎</div>

              <h3 className="text-3xl font-bold mb-4">Best Prices</h3>

              <p className="text-gray-500 text-lg leading-relaxed">
                Affordable pricing with premium service and zero hidden charges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="bg-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div>
            <h2 className="text-4xl font-black">CarRental</h2>

            <p className="text-gray-400 mt-6 leading-relaxed">
              Premium luxury car rental platform with the best prices and
              seamless booking.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">Quick Links</h3>

            <div className="space-y-4 text-gray-400">
              <Link to="/" className="block hover:text-white">
                Home
              </Link>

              <Link to="/cars" className="block hover:text-white">
                Cars
              </Link>

              <Link to="/favorites" className="block hover:text-white">
                Favorites
              </Link>

              <Link to="/dashboard" className="block hover:text-white">
                Dashboard
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">Support</h3>

            <div className="space-y-4 text-gray-400">
              <Link to="/help-center" className="block hover:text-white">
                Help Center
              </Link>

              <Link to="/terms" className="block hover:text-white">
                Terms & Conditions
              </Link>

              <Link to="/privacy-policy" className="block hover:text-white">
                Privacy Policy
              </Link>

              <Link to="/contact" className="block hover:text-white">
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">Follow Us</h3>

            <div className="space-y-4 text-gray-400">
              <p>Instagram</p>
              <p>Twitter</p>
              <p>LinkedIn</p>
              <p>YouTube</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-500">
          © 2026 CarRental. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
