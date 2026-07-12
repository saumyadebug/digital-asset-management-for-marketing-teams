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

router.get(
  "/",
  protect,
  getAllAssets
);

router.delete(
  "/:id",
  protect,
  deleteAsset
);

router.get(
  "/download/:id",
  protect,
  downloadAsset
);

router.get(
  "/stats",
  protect,
  getStats
);

module.exports = router;