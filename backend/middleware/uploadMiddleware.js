const multer = require("multer");
const path = require("path");

// ===============================
// Store file in memory
// (File will be uploaded directly
// to Azure Blob Storage)
// ===============================

const storage = multer.memoryStorage();

// ===============================
// Allowed File Types
// ===============================

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".svg",
  ".webp",
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".csv",
  ".txt",
  ".mp4",
  ".mov",
  ".avi",
  ".zip",
  ".rar"
];

// ===============================
// File Filter
// ===============================

const fileFilter = (req, file, cb) => {

  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, videos, PDFs, Office documents, text files and archives are allowed."
      ),
      false
    );
  }
};

// ===============================
// Multer Configuration
// ===============================

const upload = multer({

  storage,

  limits: {
    fileSize: 500 * 1024 * 1024 // 500 MB
  },

  fileFilter

});

module.exports = upload;