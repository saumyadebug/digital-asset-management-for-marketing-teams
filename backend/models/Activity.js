const mongoose = require('mongoose');

const activitySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String, // uploaded, downloaded, deleted, etc.
      required: true,
    },
    target: {
      type: String, // Name of the asset or category
      required: true,
    },
    details: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Activity', activitySchema);
