import fs from "fs";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Hospital from "./models/hospital.js"; 
import Feedback from "./models/feedback.js"; 
import hospitalRoutes from "./routes/hospitalRoutes.js"; 
import appointment from "./routes/appointment.js"; // ✅ new
import { protect } from "./middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import dashboardRouter from "./routes/dashboard.js";
import departmentsRouter from "./routes/department.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});
const upload = multer({ storage });


console.log("CWD:", process.cwd());
console.log("ENV file exists?", fs.existsSync(".env"));

dotenv.config();

console.log("Mongo URI:", process.env.MONGO_URI);

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));


// Connect to MongoDB
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");
} catch (err) {
  console.error("❌ Error connecting to MongoDB:", err);
  process.exit(1);
}

/**
 * ROUTES
 */

// ✅ Hospital authentication routes
app.use("/api/hospitals", hospitalRoutes);

// ✅ Appointment routes
app.use("/api/appointments", appointment);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/department", departmentsRouter);

// ✅ Protected route (only logged-in hospitals can access)
app.get("/api/hospitals/profile", protect, async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ hospitalId: req.hospital.hospitalId });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.json({
      name: hospital.name,
      hospitalId: hospital.hospitalId,
      createdAt: hospital.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching hospital profile" });
  }
});
app.post("/test-upload", upload.single("patientImage"), (req, res) => {
  console.log("Received file on test-upload:", req.file);
  if (!req.file) return res.status(400).send("No file uploaded");
  res.json({ success: true, filename: req.file.filename });
});

// ✅ Public: Get all hospitals
app.get("/api/hospitals/all", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Public: Submit feedback
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
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
