const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

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
  protect,
  upload.single("file"),
  uploadAsset
);

// Get all assets
router.get(
  "/",
  protect,
  getAllAssets
);


// Delete asset
router.delete(
  "/:id",
  protect,
  deleteAsset
);

// Download asset
router.get(
  "/download/:id",
  protect,
  downloadAsset
);

// Dashboard stats
router.get(
  "/stats",
  protect,
  getStats
);

module.exports = router;