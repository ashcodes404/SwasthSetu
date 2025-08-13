import fs from "fs";
console.log("CWD:", process.cwd());
console.log("ENV file exists?", fs.existsSync(".env"));



import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Hospital from "./models/hospital.js"; // schema

dotenv.config();


console.log("Mongo URI:", process.env.MONGO_URI); // Debug

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


// GET route to fetch all hospitals
app.get("/api/hospitals", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
