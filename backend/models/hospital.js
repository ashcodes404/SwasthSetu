import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  // Basic details
  name: { type: String, required: true },
  description: { type: String, required: true },

  // Address & contact

  location: { type: String, required: true },
  contact: { type: String, required: true },

  // Departments as references to Department collection
  departments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",  // Reference to Department model
      required: true,
    },
  ],

  // Hospital timing
  hospitalTiming: { type: String, required: false },
 currentToken: {
    type: Number,
    default: 0, // starting token number
  },
  // Doctors list
  doctors: [
    {
      name: { type: String, required: true },
      department: { type: String, required: true },
      timing: { type: String, required: true },
    },
  ],

  // Ratings
  rating: { type: Number, min: 0, max: 5, default: 0 },

  // 🔑 Login credentials (used only for authentication, not relations)
  hospitalId: { type: String, required: true, unique: true }, // e.g. "HOSP123"
  password: { type: String, required: true }, // Hashed password
}, { timestamps: true }); // Automatically adds createdAt, updatedAt fields

export default mongoose.model("Hospital", hospitalSchema);
