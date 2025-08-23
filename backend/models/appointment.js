import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  { 
  userId: { type: String, required: true },
    tokenNumber: {
      type: Number,
      required: false, // will be assigned later
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid phone number"],
    },
    patientAddress: {
      type: String,
      required: true,
    },
    patientEmail: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
 
    patientImage: {
      type: String,
      required: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
    admitted: {
      type: Boolean,
      default: false,
    },
    emergency: {
      type: Boolean,
      default: false,
    },
    ICU: {
      type: Boolean,
      default: false,
    },
    ongoing: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
