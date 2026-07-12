const { sql } = require("../config/db");

// ===========================
// Get All Users
// ===========================
const getUsers = async (req, res) => {
  try {

    const result = await sql.query`
      SELECT
        U.UserID,
        U.Name,
        U.Email,
        U.Role,
        U.IsActive,
        COUNT(A.AssetID) AS Assets
      FROM Users U
      LEFT JOIN Assets A
      ON U.UserID = A.UploadedBy
      GROUP BY
        U.UserID,
        U.Name,
        U.Email,
        U.Role,
        U.IsActive
      ORDER BY U.Name
    `;

    res.status(200).json({
      success: true,
      count: result.recordset.length,
      data: result.recordset,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===========================
// Update User
// ===========================
const updateUser = async (req, res) => {

  try {

    const { Name, Role, IsActive } = req.body;

    await sql.query`
      UPDATE Users
      SET
        Name = ${Name},
        Role = ${Role},
        IsActive = ${IsActive}
      WHERE UserID = ${req.params.id}
    `;

    res.json({
      success: true,
      message: "User updated successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===========================
// Delete User
// ===========================
const deleteUser = async (req, res) => {

  try {

    await sql.query`
      DELETE FROM Users
      WHERE UserID = ${req.params.id}
    `;

    res.json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
};