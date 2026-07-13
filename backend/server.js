// ===============================
// CloudVault DAM Backend
// server.js
// ===============================

// Load Environment Variables FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// Azure SQL
const { sql, dbConfig } = require("./config/db");

// Middleware
const { errorHandler } = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");

// ===============================
// Initialize Express
// ===============================

const app = express();

// ===============================
// Connect Azure SQL Database
// ===============================

(async () => {
  try {
    await sql.connect(dbConfig);
    console.log("✅ Connected to Azure SQL Database");
  } catch (err) {
    console.error(err);
  }
})();

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// API Routes
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

// ===============================
// Root Route
// ===============================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// Error Handler
// ===============================

app.use(errorHandler);

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("------------------------------------");
  console.log(`🚀 Server running on Port ${PORT}`);
  console.log("------------------------------------");
});