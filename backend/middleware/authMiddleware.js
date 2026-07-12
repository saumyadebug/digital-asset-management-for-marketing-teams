const jwt = require("jsonwebtoken");
const { sql } = require("../config/db");

const protect = async (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {

    try {

      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const result = await sql.query`
        SELECT UserID, Name, Email, Role
        FROM Users
        WHERE UserID = ${decoded.id}
      `;

      if (result.recordset.length === 0) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }

      req.user = result.recordset[0];

      next();

    }
    catch (error) {

      return res.status(401).json({
        success: false,
        message: "Invalid Token"
      });

    }

  }

  else {

    return res.status(401).json({
      success: false,
      message: "No Token"
    });

  }

};

const admin = (req, res, next) => {

  if (req.user.Role === "Admin") {

    next();

  }

  else {

    return res.status(403).json({
      success: false,
      message: "Admin Access Only"
    });

  }

};

module.exports = {
  protect,
  admin
};