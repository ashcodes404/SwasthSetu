import React, { useState } from "react";
import axios from "axios";

const PatientBookingForm = ({ hospitalId, userId, onSuccess }) => {
  const [patientData, setPatientData] = useState({
    patientName: "",
    phone: "",
    patientEmail: "",
    patientAddress: "",
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

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setPatientData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = e => {
    setPatientData(prev => ({
      ...prev,
      patientImage: e.target.files[0],
    }));
  };

const handleSubmit = async e => {
  e.preventDefault();
  setSuccessMessage("");
  setErrorMessage("");
  setLoading(true);
  try {
    console.log("Submitting appointment with hospitalId:", hospitalId);
    console.log("Submitting appointment with userId:", userId);
    console.log("Patient Data:", patientData);
    
    const formData = new FormData();
    formData.append("hospitalId", hospitalId);
    formData.append("userId", userId);
    for (const [key, value] of Object.entries(patientData)) {
      if (value !== null) {
        formData.append(key, value);
      }
    }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const res = await axios.post("http://localhost:3000/api/appointments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      alert("Appointment booked successfully!");  // Alert success
      setSuccessMessage("Appointment booked successfully!");
      onSuccess && onSuccess(res.data.appointment); // Close modal if onSuccess provided

      // Reset form to empty state
      setPatientData({
        patientName: "",
        phone: "",
        patientEmail: "",
        patientAddress: "",
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
    console.error("Booking error:", err);
    setErrorMessage(err.response?.data?.error || "Failed to book appointment.");
  }
  setLoading(false);
}



  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 rounded shadow space-y-2 text-sm">
      <h2 className="text-lg font-semibold text-center mb-3">Book Appointment</h2>

      {successMessage && <div className="text-green-600 text-center">{successMessage}</div>}
      {errorMessage && <div className="text-red-600 text-center">{errorMessage}</div>}

      <div className="grid grid-cols-2 gap-2">
        <input
          className="p-2 border rounded"
          type="text"
          name="patientName"
          placeholder="Patient Name"
          value={patientData.patientName}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 border rounded"
          type="tel"
          name="phone"
          placeholder="Phone"
          value={patientData.phone}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 border rounded col-span-2"
          type="email"
          name="patientEmail"
          placeholder="Email"
          value={patientData.patientEmail}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 border rounded col-span-2"
          type="text"
          name="patientAddress"
          placeholder="Address"
          value={patientData.patientAddress}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 border rounded"
          type="date"
          name="appointmentDate"
          value={patientData.appointmentDate}
          onChange={handleChange}
          required
          min={new Date().toISOString().slice(0, 10)}
        />
        <select
          className="p-2 border rounded"
          name="gender"
          value={patientData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          className="p-2 border rounded col-span-2"
          type="file"
          name="patientImage"
          onChange={handleFileChange}
          accept="image/*"
        />

        <label className="flex justify-between items-center col-span-2 text-xs">
          <span>Admitted</span>
          <input type="checkbox" name="admitted" checked={patientData.admitted} onChange={handleChange} />
          <span>Emergency</span>
          <input type="checkbox" name="emergency" checked={patientData.emergency} onChange={handleChange} />
          <span>ICU</span>
          <input type="checkbox" name="ICU" checked={patientData.ICU} onChange={handleChange} />
        </label>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm"
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>
    </form>
  );
};

export default PatientBookingForm;
