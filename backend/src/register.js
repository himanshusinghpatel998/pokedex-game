// register.js
const express = require("express");
const router = express.Router();
const pool = require("./config/trainerdb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  const { name, email, gender, password } = req.body;

  if (!name || !email || !gender || !password) {
    return res.status(400).json({
      success: false,
      error: "All fields are required.",
    });
  }

  try {
    // Check if email already exists
    const [existingRows] = await pool.query(
      "SELECT trainer_id FROM trainers WHERE email = ?",
      [email]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "A trainer with this email already exists. Please log in.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert trainer
    const [insertResult] = await pool.query(
      "INSERT INTO trainers (name, email, gender, password) VALUES (?, ?, ?, ?)",
      [name, email, gender, hashedPassword]
    );

    const trainerId = insertResult.insertId;

    // Fetch trainer
    const [rows] = await pool.query(
      "SELECT trainer_id, name, email, gender, level, created_at FROM trainers WHERE trainer_id = ?",
      [trainerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Trainer not found after registration.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      { trainer_id: rows[0].trainer_id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      user: rows[0],
      token,
    });
  } catch (err) {
    console.error("========== REGISTRATION ERROR ==========");
    console.error(err);
    console.error("========================================");

    return res.status(500).json({
      success: false,
      error: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage,
    });
  }
});

// ================= TRAINER COUNT =================
router.get("/register", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS count FROM trainers"
    );

    return res.status(200).json({
      success: true,
      count: rows[0].count,
    });
  } catch (err) {
    console.error("Trainer Count Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
      code: err.code,
      sqlMessage: err.sqlMessage,
    });
  }
});

module.exports = router;