import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Hospital from "../models/hospital.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route    POST /api/hospitals/register
 * @desc     Register a new hospital
 */
router.post("/register", async (req, res) => {
  try {
    console.log("Hospital registration payload:", req.body);
    const { name, hospitalId, password, address, city, phone, description, hospitalTiming } = req.body;

    // Check if hospital already exists
    const existingHospital = await Hospital.findOne({ hospitalId });
    if (existingHospital) {
      return res.status(400).json({ message: "Hospital already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save hospital with supplied or default values for required fields
    const hospital = new Hospital({
      name,
      hospitalId,
      password: hashedPassword,
      description: description || "Default description",
      address: address || "Default address",
      city: city || "Default city",
      phone: phone || "+0000000000",
      departments: [], // Assuming will be added later
      hospitalTiming: hospitalTiming || "Mon-Sat: 9AM - 5PM",
      doctors: [],
    });

    await hospital.save();

    res.status(201).json({ message: "Hospital registered successfully" });
  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * @route    POST /api/hospitals/login
 * @desc     Login hospital & get token
 */
router.post("/login", async (req, res) => {
  try {
    console.log("Hospital login payload:", req.body);
    const { hospitalId, password } = req.body;

    const hospital = await Hospital.findOne({ hospitalId });
    if (!hospital) {
      return res.status(400).json({ message: "Invalid Hospital ID" });
    }

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // Generate JWT with hospital details
    const token = jwt.sign(
      {
        id: hospital._id,
        hospitalId: hospital.hospitalId,
        name: hospital.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      hospital: {
        _id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        hospitalId: hospital.hospitalId,
      },
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * @route    GET /api/hospitals/dashboard
 * @desc     Protected route (only logged-in hospitals can access)
 */
router.get("/dashboard", protect, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.hospital.id).select("-password");
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.json({
      message: `Welcome ${hospital.name}, you are authenticated!`,
      hospital,
    });
  } catch (err) {
    console.error("Error in dashboard:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * @route    GET /api/hospitals
 * @desc     Get all hospitals with populated departments
 */
router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find().select("-password");
    res.json(hospitals);
  } catch (err) {
    console.error("Error fetching hospitals:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * @route    PUT /api/hospitals/:id
 * @desc     Update hospital info with validation and error logging
 */
router.put("/:id", protect, async (req, res) => {
  try {
    console.log("Hospital update payload:", req.body);
    const updatedHospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedHospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.json(updatedHospital);
  } catch (err) {
    console.error("Hospital update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
