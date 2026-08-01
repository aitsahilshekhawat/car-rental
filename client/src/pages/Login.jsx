import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", formData);

      login(response.data.token, response.data.user.role);

      toast.success("Login Successful");

      navigate("/");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-black transition-all duration-300 px-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl p-10 transition-all duration-300"
      >
        <h1 className="text-4xl font-bold text-center mb-8 text-black dark:text-white">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-4 mb-5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-4 mb-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white outline-none"
        />

        <div className="flex justify-end mb-6">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black dark:bg-white dark:text-black text-white py-4 rounded-xl font-semibold transition hover:opacity-90"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
