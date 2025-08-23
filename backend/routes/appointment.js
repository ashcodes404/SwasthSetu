import express from "express";
import mongoose from "mongoose";
import Appointment from "../models/appointment.js";
import Hospital from "../models/hospital.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists or create it
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// POST - create appointment with patient image upload and token assignment
router.post("/", upload.single("patientImage"), async (req, res) => {
  console.log("Received file: ", req.file);
  try {
    const {
      hospitalId,
      admitted = false,
      emergency = false,
      ICU = false,
      userId, // must come from frontend (Auth0 user.sub)
    } = req.body;

    const otherFields = { ...req.body };
    delete otherFields.hospitalId;
    delete otherFields.admitted;
    delete otherFields.emergency;
    delete otherFields.ICU;
    delete otherFields.userId;

    let hospital;
    if (mongoose.Types.ObjectId.isValid(hospitalId)) {
      hospital = await Hospital.findById(hospitalId);
    } else {
      hospital = await Hospital.findOne({ name: hospitalId });
    }

    if (!hospital) {
      return res.status(404).json({ success: false, error: "Hospital not found" });
    }

    // Assign next token number based on hospital currentToken
    const nextToken = (hospital.currentToken || 0) + 1;

    const patientImage = req.file ? `/uploads/${req.file.filename}` : null;

    const appointment = new Appointment({
      hospitalId: hospital._id,
      userId,
      tokenNumber: nextToken,
      ...otherFields,
      patientImage,
      completed: false,
      cancelled: false,
      ongoing: false,
      admitted: admitted === "true" || admitted === true,
      emergency: emergency === "true" || emergency === true,
      ICU: ICU === "true" || ICU === true,
    });

    await appointment.save();

    // Update hospital's currentToken
 await Hospital.findByIdAndUpdate(
  hospital._id,
  { currentToken: nextToken },
  { runValidators: true }
);


    // Add appointment ID to hospital's appointments array
    await Hospital.findByIdAndUpdate(
   hospital._id,
  { currentToken: nextToken },
  { runValidators: true }
);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointment,
    });
  } catch (err) {
    console.error("❌ Error creating appointment:", err);
    res.status(500).json({ success: false, error: "Failed to create appointment" });
  }
});

// GET - fetch appointments for a hospital with populated hospital info only (no department)
router.get("/hospital/:hospitalId", async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const appointments = await Appointment.find({ hospitalId: hospitalId })
      .populate("hospitalId", "name location specialties contact currentToken")
      .sort({ createdAt: 1 });

    res.json(appointments);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET - fetch upcoming appointments for a specific user with hospital info including currentToken
router.get("/user/:userId/upcoming", async (req, res) => {
  try {
    const { userId } = req.params;

    const appointments = await Appointment.find({
      userId,
      cancelled: false,
      completed: false,
    })
      .populate("hospitalId", "name location specialties contact currentToken")
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error("❌ Error fetching user appointments:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT - cancel appointment
router.put("/:id/cancel", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { cancelled: true, completed: false, ongoing: false },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - delete appointment
router.delete("/:id", async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    await Hospital.findByIdAndUpdate(appointment.hospitalId, {
      $pull: { appointments: appointmentId },
    });

    await Appointment.findByIdAndDelete(appointmentId);

    res.json({ success: true, message: "Appointment deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - mark appointment completed
router.put("/:id/complete", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { completed: true, cancelled: false, ongoing: false },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - mark appointment ongoing
router.put("/:id/ongoing", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ongoing: true, completed: false, cancelled: false },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
