const {
  uploadToBlob,
  deleteFromBlob,
  getDownloadUrl,
} = require("../services/blobStorage");

const { sql } = require("../config/db");

// ===============================
// Upload Asset
// ===============================
// ===============================
// Upload Asset
// ===============================
const uploadAsset = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    // Upload file to Azure Blob
    const result = await uploadToBlob(req.file);

    // Save metadata in Azure SQL
    const { categoryId } = req.body;

await sql.query`
INSERT INTO Assets
(
FileName,
OriginalFileName,
BlobURL,
FileType,
FileSize,
CategoryID,
UploadedBy
)
VALUES
(
${result.fileName},
${req.file.originalname},
${result.url},
${req.file.mimetype},
${req.file.size},
${categoryId},
${req.user.UserID}
)
`;
    try {

      if (req.file.mimetype.startsWith("image/")) {

        await fetch(
          "https://cloudvault-functions-abacdre2g7dkdph9.centralindia-01.azurewebsites.net/api/ImageProcessor",
          {
            method: "POST",
            headers: {
              "Content-Type": req.file.mimetype
            },
            body: req.file.buffer
          }
        );

        console.log("Azure Function executed.");

      }

    }
    catch (err) {

      console.log("Azure Function Error:", err.message);

    }

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: result
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
// Get All Assets
// ===============================
const getAllAssets = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT
A.*,
U.Name AS UploadedByName,
C.CategoryName
FROM Assets A
LEFT JOIN Users U
ON A.UploadedBy = U.UserID
LEFT JOIN Categories C
ON A.CategoryID = C.CategoryID
ORDER BY A.UploadedAt DESC
    `;

    res.status(200).json({
      success: true,
      count: result.recordset.length,
      data: result.recordset,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Asset
// ===============================
const deleteAsset = async (req, res) => {
  try {
    const assetId = req.params.id;

    // Find asset
    const result = await sql.query`
      SELECT *
      FROM Assets
      WHERE AssetID = ${assetId}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    const asset = result.recordset[0];

    // Delete from Azure Blob Storage
    await deleteFromBlob(asset.FileName);

    // Delete from Azure SQL
    await sql.query`
      DELETE FROM Assets
      WHERE AssetID = ${assetId}
    `;

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Download Asset (Secure SAS URL)
// ===============================
const downloadAsset = async (req, res) => {
  try {
    const assetId = req.params.id;

    const result = await sql.query`
      SELECT *
      FROM Assets
      WHERE AssetID = ${assetId}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    const asset = result.recordset[0];

    // Generate Secure SAS URL
    const downloadUrl = await getDownloadUrl(asset.FileName);

    res.status(200).json({
      success: true,
      data: {
        assetId: asset.AssetID,
        fileName: asset.OriginalFileName,
        fileType: asset.FileType,
        downloadUrl,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Dashboard Statistics
// ===============================
const getStats = async (req, res) => {
  try {

    const totalFiles = await sql.query`
      SELECT COUNT(*) AS totalFiles
      FROM Assets
    `;

    const totalStorage = await sql.query`
      SELECT ISNULL(SUM(FileSize),0) AS totalStorage
      FROM Assets
    `;

    const images = await sql.query`
      SELECT COUNT(*) AS images
      FROM Assets
      WHERE FileType LIKE 'image/%'
    `;

    const documents = await sql.query`
      SELECT COUNT(*) AS documents
      FROM Assets
      WHERE FileType LIKE 'application/%'
    `;

    const videos = await sql.query`
      SELECT COUNT(*) AS videos
      FROM Assets
      WHERE FileType LIKE 'video/%'
    `;

    res.status(200).json({
      success: true,
      data: {
        totalFiles: totalFiles.recordset[0].totalFiles,
        totalStorage: totalStorage.recordset[0].totalStorage,
        images: images.recordset[0].images,
        documents: documents.recordset[0].documents,
        videos: videos.recordset[0].videos,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadAsset,
  getAllAssets,
  deleteAsset,
  downloadAsset,
  getStats,
};