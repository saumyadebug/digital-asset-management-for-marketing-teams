// utils/logger.js

const logger = (message) => {
    console.log(`[LOG] ${new Date().toISOString()} : ${message}`);
};

module.exports = logger;