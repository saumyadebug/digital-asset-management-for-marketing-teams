const mongoose = require('mongoose');

const assetSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add an asset name'],
    },
    type: {
      type: String, // image, video, document, etc.
      required: true,
    },
    extension: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    tags: [String],
    url: {
      type: String,
      required: true,
    },
    blobName: {
      type: String,
      required: true,
    },
    size: {
      type: String, // e.g., "2.4 MB"
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    visibility: {
      type: String,
      enum: ['Public', 'Private'],
      default: 'Public',
    },
    downloads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Asset', assetSchema);
