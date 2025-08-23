import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  gender: { type: String },
  dob: { type: Date },
  // add other patient fields if needed
}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);
