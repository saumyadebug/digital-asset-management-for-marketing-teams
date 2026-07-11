const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const {
  uploadAsset,
  getAllAssets,
  deleteAsset,
  downloadAsset,
  getStats,
} = require("../controllers/assetController");

// Upload File
router.post(
  "/upload",
  upload.single("file"),
  uploadAsset
);

// Get All Assets
router.post("/upload", upload.single("file"), uploadAsset);

router.get("/", getAllAssets);

router.delete("/:id", deleteAsset);
router.get("/download/:id", downloadAsset);
router.get("/stats", getStats);

module.exports = router;