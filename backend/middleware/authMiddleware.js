import jwt from "jsonwebtoken";
import Hospital from "../models/hospital.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch hospital from DB (excluding password)
    const hospital = await Hospital.findById(decoded.id).select("-password");

    if (!hospital) {
      return res.status(401).json({ message: "Hospital not found" });
    }

    req.hospital = hospital; // ✅ full hospital object
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ message: "Token failed" });
  }
};
