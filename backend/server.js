import fs from "fs";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Hospital from "./models/hospital.js"; // Hospital schema
import Feedback from "./models/feedback.js"; // Feedback schema

console.log("CWD:", process.cwd());
console.log("ENV file exists?", fs.existsSync(".env"));

dotenv.config();

console.log("Mongo URI:", process.env.MONGO_URI); // Debug

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
} catch (err) {
  console.error("Error connecting to MongoDB:", err);
  process.exit(1);
}

/**
 * ROUTES
 */

// GET: Fetch all hospitals
app.get("/api/hospitals", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Receive feedback
app.post("/feedback", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email, and message are required.",
      });
    }

    const newFeedback = new Feedback({ name, email, subject, message });
    await newFeedback.save();

    res.json({ message: "Feedback received successfully!" });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ message: "Error saving feedback" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
