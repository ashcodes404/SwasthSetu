import express from "express";
import mongoose from "mongoose";
import Appointment from "../models/appointment.js";
import Doctor from "../models/doctor.js";
import Patient from "../models/patient.js";

const router = express.Router();

router.get("/:hospitalId", async (req, res) => {
  try {
    const { hospitalId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
      return res.status(400).json({ message: "Invalid hospital ID" });
    }

    const hospitalObjectId = new mongoose.Types.ObjectId(hospitalId);

    const totalUpcoming = await Appointment.countDocuments({
      hospitalId: hospitalObjectId,
      completed: false,
      cancelled: false,
    });

    const totalCompleted = await Appointment.countDocuments({
      hospitalId: hospitalObjectId,
      completed: true,
    });

    const totalCancelled = await Appointment.countDocuments({
      hospitalId: hospitalObjectId,
      cancelled: true,
    });

    const totalAdmitted = await Appointment.countDocuments({
      hospitalId: hospitalObjectId,
      admitted: true,
    });

    const totalEmergency = await Appointment.countDocuments({
      hospitalId: hospitalObjectId,
      emergency: true,
    });

    const totalICU = await Appointment.countDocuments({
      hospitalId: hospitalObjectId,
      ICU: true,
    });

    const totalDoctors = await Doctor.countDocuments({ hospitalId: hospitalObjectId });
    const totalPatients = await Patient.countDocuments({ hospitalId: hospitalObjectId });

    const daywiseData = await Appointment.aggregate([
      { $match: { hospitalId: hospitalObjectId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          upcoming: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$completed", false] }, { $eq: ["$cancelled", false] }] },
                1,
                0,
              ],
            },
          },
          completed: { $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ["$cancelled", true] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dates = daywiseData.map((item) => item._id);
    const upcomingByDate = daywiseData.map((item) => item.upcoming);
    const completedByDate = daywiseData.map((item) => item.completed);
    const cancelledByDate = daywiseData.map((item) => item.cancelled);

    res.json({
      upcoming: totalUpcoming,
      completed: totalCompleted,
      cancelled: totalCancelled,
      numDoctors: totalDoctors,
      numPatients: totalPatients,
      numAdmitted: totalAdmitted,
      emergency: totalEmergency,
      ICUCount: totalICU,
      daywise: {
        dates,
        upcoming: upcomingByDate,
        completed: completedByDate,
        cancelled: cancelledByDate,
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

export default router;
