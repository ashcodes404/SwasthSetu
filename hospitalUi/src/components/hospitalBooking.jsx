import React, { useState, useEffect } from "react";
import axios from "axios";

const HospitalBooking = ({ hospitalId, onSuccess }) => {
  const [patientData, setPatientData] = useState({
    patientName: "",
    phone: "",
    patientAddress: "",
    patientEmail: "",
    appointmentDate: "",
    gender: "",
    patientImage: null,
    admitted: false,
    emergency: false,
    ICU: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Removed departments state and fetch useEffect since not needed anymore

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPatientData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setPatientData((prev) => ({
      ...prev,
      patientImage: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    console.log("Submitting phone:", patientData.phone);


    try {
      const formData = new FormData();
      formData.append("hospitalId", hospitalId);
      formData.append("patientName", patientData.patientName);
      formData.append("phone", patientData.phone);
      formData.append("patientAddress", patientData.patientAddress);
      formData.append("patientEmail", patientData.patientEmail);
      formData.append("appointmentDate", patientData.appointmentDate);
      formData.append("gender", patientData.gender);
      formData.append("admitted", patientData.admitted);
      formData.append("emergency", patientData.emergency);
      formData.append("ICU", patientData.ICU);
      if (patientData.patientImage) {
        formData.append("patientImage", patientData.patientImage);
      }

      const res = await axios.post("http://localhost:3000/api/appointments", formData);

      if (res.data.success) {
        setSuccessMessage("Appointment booked successfully!");
        if (onSuccess) onSuccess(res.data.appointment);
        setPatientData({
          patientName: "",
         phone: "",
          patientAddress: "",
          patientEmail: "",
          appointmentDate: "",
          gender: "",
          patientImage: null,
          admitted: false,
          emergency: false,
          ICU: false,
        });
      } else {
        setErrorMessage("Failed to book appointment.");
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg space-y-4 w-full max-w-md"
      encType="multipart/form-data"
    >
      <h2 className="text-xl font-bold text-gray-700">Book Appointment</h2>

      {successMessage && <p className="text-green-600 font-medium">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 font-medium">{errorMessage}</p>}

      <div>
        <label className="block text-gray-600 font-medium mb-1">Patient Name</label>
        <input
          type="text"
          name="patientName"
          value={patientData.patientName}
          onChange={handleChange}
          required
          placeholder="Enter full name"
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Phone</label>
        <input
          type="tel"
          name="phone"
          value={patientData.phone  || "" }
          onChange={handleChange}
          required
          placeholder="Enter phone number"
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Address</label>
        <input
          type="text"
          name="patientAddress"
          value={patientData.patientAddress}
          onChange={handleChange}
          required
          placeholder="Enter address"
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Email</label>
        <input
          type="email"
          name="patientEmail"
          value={patientData.patientEmail}
          onChange={handleChange}
          required
          placeholder="Enter email address"
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Appointment Date</label>
        <input
          type="date"
          name="appointmentDate"
          value={patientData.appointmentDate}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
          min={new Date().toISOString().slice(0, 10)}
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Gender</label>
        <select
          name="gender"
          value={patientData.gender}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Patient Image</label>
        <input
          type="file"
          name="patientImage"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="admitted"
            checked={patientData.admitted}
            onChange={handleChange}
          />
          <span className="text-gray-700">Admitted Patient</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="emergency"
            checked={patientData.emergency}
            onChange={handleChange}
          />
          <span className="text-gray-700">Emergency Case</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="ICU"
            checked={patientData.ICU}
            onChange={handleChange}
          />
          <span className="text-gray-700">ICU Patient</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full transition"
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>
    </form>
  );
};

export default HospitalBooking;
