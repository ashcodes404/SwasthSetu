import React from "react";
import { useForm } from "react-hook-form";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function BookAppointmentForm({ isOpen, onClose, hospital }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, hospitalId: hospital._id };

      const res = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to book appointment");

      alert("Appointment booked successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error booking appointment");
    }
  };

  if (!hospital) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="text-xl font-bold mb-4">Book Appointment</h2>

      {/* Hospital Info */}
      <div className="bg-gray-100 p-3 rounded mb-4">
        <strong>Hospital:</strong> {hospital.name} <br />
        <strong>Address:</strong> {hospital.location} <br />
        <strong>Contact:</strong> {hospital.contact || "N/A"}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Name */}
        <input
          placeholder="Patient Name"
          {...register("patientName", { 
            required: "Name is required",
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "Name must contain only letters and spaces"
            }
          })}
          className="w-full border p-2 rounded"
        />
        {errors.patientName && <p className="text-red-500">{errors.patientName.message}</p>}

        {/* Phone */}
        <input
          placeholder="Phone Number"
          type="tel"
          {...register("patientPhone", { 
            required: "Phone number is required",
            pattern: {
              value: /^[6-9]\d{9}$/,
              message: "Enter a valid 10-digit Indian phone number"
            }
          })}
          className="w-full border p-2 rounded"
        />
        {errors.patientPhone && <p className="text-red-500">{errors.patientPhone.message}</p>}

        {/* Address */}
        <input
          placeholder="Address"
          {...register("patientAddress", { required: "Address is required" })}
          className="w-full border p-2 rounded"
        />
        {errors.patientAddress && <p className="text-red-500">{errors.patientAddress.message}</p>}

        {/* Email */}
        <input
          placeholder="Email"
          type="email"
          {...register("patientEmail", { required: "Email is required" })}
          className="w-full border p-2 rounded"
        />
        {errors.patientEmail && <p className="text-red-500">{errors.patientEmail.message}</p>}

        {/* Date */}
        <input
          type="date"
          {...register("appointmentDate", { required: "Date is required" })}
          className="w-full border p-2 rounded"
        />
        {errors.appointmentDate && <p className="text-red-500">{errors.appointmentDate.message}</p>}

        {/* Gender */}
        <div>
          <p className="font-semibold">Gender</p>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input 
                type="radio" 
                value="Male" 
                {...register("gender", { required: "Gender is required" })} 
              />
              <span>Male</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="radio" 
                value="Female" 
                {...register("gender", { required: "Gender is required" })} 
              />
              <span>Female</span>
            </label>
          </div>
          {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-[#262656] text-white px-4 py-2 rounded hover:bg-[#343282] transition"
        >
          Book Reservation
        </button>
      </form>
    </Modal>
  );
}
