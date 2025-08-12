import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Hospital name
  description: { type: String, required: true }, // Short intro about hospital
  
  // Hospital details
  address: { type: String, required: true }, // Full address
  city: { type: String, required: true }, // City name
  phone: { type: String, required: true }, // Hospital contact number (with +countrycode)
  
  // Departments (list)
  departments: [{ type: String, required: true }], // e.g. ["Cardiology", "Neurology"]
  
  // Hospital timing
  hospitalTiming: { type: String, required: true }, // e.g. "Mon-Sat: 9AM - 8PM"
  
  // Doctor details
  doctors: [
    {
      name: { type: String, required: true },
      department: { type: String, required: true },
      timing: { type: String, required: true }, // e.g. "10AM - 2PM"
    }
  ],
  
  // Ratings
  rating: { type: Number, min: 0, max: 5, default: 0 },
});

export default mongoose.model("Hospital", hospitalSchema);
