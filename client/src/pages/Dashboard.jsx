import { useEffect, useState } from "react";

import api from "../services/api";

import Spinner from "../components/Spinner";

function Dashboard() {
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      const response = await api.get("/dashboard", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      setStats(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  if (loading || !stats) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white p-10 transition">
      <h1 className="text-5xl font-bold mb-10">Admin Dashboard</h1>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-bold">Total Cars</h2>

          <p className="text-5xl mt-6 font-bold">{stats.totalCars}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-bold">Total Bookings</h2>

          <p className="text-5xl mt-6 font-bold">{stats.totalBookings}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-bold">Total Revenue</h2>

          <p className="text-5xl mt-6 font-bold">₹ {stats.totalRevenue}</p>
        </div>
      </div>

      
      
    </div>
  );
}

export default Dashboard;
