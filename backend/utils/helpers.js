// utils/helpers.js

const formatDate = (date) => {
    return new Date(date).toLocaleString();
};

const generateFileName = (originalName) => {
    return `${Date.now()}-${originalName}`;
};

module.exports = {
    formatDate,
    generateFileName
};