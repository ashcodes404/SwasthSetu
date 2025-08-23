import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  name: { type: String, required: true },
  specialty: { type: String },
  phone: { type: String },
  email: { type: String },
  // Add other fields as needed
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
