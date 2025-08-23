import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Hospital from "../models/hospital.js";

const router = express.Router();

// Hospital Login
router.post("/login", async (req, res) => {
  const { hospitalId, password } = req.body;

  try {
    const hospital = await Hospital.findOne({ hospitalId });
    if (!hospital) return res.status(400).json({ msg: "Invalid Hospital ID" });

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Password" });

    const token = jwt.sign({ id: hospital._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, hospitalId: hospital.hospitalId, name: hospital.name });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

export default router;
