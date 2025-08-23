import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    hospitalId: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
  const res = await axios.post(
    "http://localhost:3000/api/hospitals/login",
    formData
  );

  console.log("✅ Full login response:", res.data);

  // Save token
  localStorage.setItem("token", res.data.token);

  // Save hospital info
  if (res.data.hospital) {
    localStorage.setItem("hospital", JSON.stringify(res.data.hospital));

    // ✅ Always prefer _id from hospital object
    localStorage.setItem("hospitalId", res.data.hospital.id);
  }

  // Redirect to dashboard
  window.location.href = "/dashboard";
} catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      setError("Invalid Hospital ID or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg w-[350px] h-[370px]"
    >
      {/* Logo */}
      <div className="relative top-[-20px]">
        <img
          className="w-20 mx-auto"
          src="/SS_logo-removebg-preview.png"
          alt="Hospital Logo"
        />
      </div>

      {/* Heading */}
      <h2 className="text-[#212a37] text-2xl font-bold text-center mb-4 relative top-[-20px]">
        Hospital Login
      </h2>

      {/* Hospital ID */}
      <div className="mb-3 relative top-[-20px]">
        <label htmlFor="hospitalId" className="block mb-1 font-medium">
          Hospital ID
        </label>
        <input
          type="text"
          id="hospitalId"
          name="hospitalId"
          placeholder="Enter hospital ID"
          value={formData.hospitalId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Password */}
      <div className="mb-3 relative top-[-20px]">
        <label htmlFor="password" className="block mb-1 font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="relative top-[-20px] w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center mt-3 relative top-[-20px]">
          {error}
        </p>
      )}
    </form>
  );
};

export default LoginForm;
