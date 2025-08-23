// backend/scripts/addHospitalIds.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Hospital from "../models/hospital.js";

dotenv.config();

const addHospitalIds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const hospitals = await Hospital.find();

    for (let i = 0; i < hospitals.length; i++) {
      const hospital = hospitals[i];

      // Skip if hospitalId already exists
      if (hospital.hospitalId) continue;

      const hospitalId = `HOSP${1000 + i + 1}`;
      const rawPassword = "hospital123"; // default password for all
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      // Update only hospitalId and password
      await Hospital.updateOne(
        { _id: hospital._id },
        { $set: { hospitalId, password: hashedPassword } }
      );

      console.log(`✅ Updated: ${hospital.name} -> ID: ${hospitalId}, Pass: ${rawPassword}`);
    }

    console.log("🎉 Hospital IDs and passwords added successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

addHospitalIds();
