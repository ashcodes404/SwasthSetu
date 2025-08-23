import express from "express";
import Department from "../models/department.js";

const router = express.Router();

// GET /api/departments?hospitalId=...
router.get("/", async (req, res) => {
  try {
    const { hospitalId } = req.query;
    let filter = {};

    if (hospitalId) {
      filter.hospitalId = hospitalId;
    }

    // Find departments filtered by hospitalId (if provided)
    const departments = await Department.find(filter).select("name hospitalId");

    res.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

export default router;
