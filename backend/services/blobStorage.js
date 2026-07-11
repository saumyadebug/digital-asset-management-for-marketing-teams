const { v4: uuidv4 } = require("uuid");
const path = require("path");

const {
  blobServiceClient,
  connectionString,
} = require("../config/azure");

const {
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} = require("@azure/storage-blob");

const containerName = process.env.AZURE_STORAGE_CONTAINER;

// Upload File
const uploadToBlob = async (file) => {
  try {
    const containerClient =
      blobServiceClient.getContainerClient(containerName);

    const extension = path.extname(file.originalname);

    const blobName = `${uuidv4()}${extension}`;

    const blockBlobClient =
      containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
    });

    return {
      success: true,
      fileName: blobName,
      url: blockBlobClient.url,
    };
  } catch (error) {
    throw error;
  }
};

// Delete File
const deleteFromBlob = async (blobName) => {
  const containerClient =
    blobServiceClient.getContainerClient(containerName);

  const blobClient =
    containerClient.getBlockBlobClient(blobName);

  console.log("Deleting blob:", blobName);

  const exists = await blobClient.exists();

  console.log("Blob exists:", exists);

  if (!exists) {
    return false;
  }

  await blobClient.delete();

  console.log("Blob deleted successfully");

  return true;
};
const getDownloadUrl = async (blobName) => {

  const accountName = process.env.AZURE_STORAGE_CONNECTION_STRING
    .match(/AccountName=([^;]+)/)[1];

  const accountKey = process.env.AZURE_STORAGE_CONNECTION_STRING
    .match(/AccountKey=([^;]+)/)[1];

  const credential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );

  // Start the SAS 5 minutes in the past
  const startsOn = new Date(Date.now() - 5 * 60 * 1000);

  // Expire after 1 hour
  const expiresOn = new Date(Date.now() + 60 * 60 * 1000);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      startsOn,
      expiresOn,
    },
    credential
  ).toString();

  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
};

module.exports = {
  uploadToBlob,
  deleteFromBlob,
  getDownloadUrl,
};