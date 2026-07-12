const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sql } = require("../config/db");

// ===============================
// Generate JWT
// ===============================
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// ===============================
// Register User
// ===============================
const registerUser = async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    // Check if email already exists
    const existingUser = await sql.query`
      SELECT *
      FROM Users
      WHERE Email = ${email}
    `;

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await sql.query`
      INSERT INTO Users
      (
        Name,
        Email,
        Password,
        Role
      )
      VALUES
      (
        ${name},
        ${email},
        ${hashedPassword},
        ${role}
      )
    `;

    // Get inserted user
    const newUser = await sql.query`
      SELECT TOP 1 *
      FROM Users
      WHERE Email = ${email}
    `;

    const user = newUser.recordset[0];

    res.status(201).json({
      success: true,
      token: generateToken(user.UserID),
      user: {
        id: user.UserID,
        name: user.Name,
        email: user.Email,
        role: user.Role
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// ===============================
// Login User
// ===============================
const loginUser = async (req, res) => {

  try {

    const {
    email,
    password
} = req.body;

    const result = await sql.query`
      SELECT *
      FROM Users
      WHERE Email = ${email}
    `;

    if (result.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email"
      });
    }

    const user = result.recordset[0];

    const isMatch = await bcrypt.compare(
      password,
      user.Password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password"
      });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user.UserID),
      user: {
        id: user.UserID,
        name: user.Name,
        email: user.Email,
        role: user.Role
      }
    });

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ===============================
// Get Current User
// ===============================
const getMe = async (req, res) => {

  try {

    const result = await sql.query`
      SELECT UserID, Name, Email, Role
      FROM Users
      WHERE UserID = ${req.user.UserID}
    `;

    res.status(200).json({
      success: true,
      data: result.recordset[0]
    });

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

module.exports = {
  registerUser,
  loginUser,
  getMe
};