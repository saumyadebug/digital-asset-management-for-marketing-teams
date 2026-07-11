const sendNotification = async (userId, message) => {
  console.log(`Notification for ${userId}: ${message}`);
};

module.exports = {
  sendNotification,
};
