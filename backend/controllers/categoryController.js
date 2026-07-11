const Category = require('../models/Category');

const getCategories = async (req, res) => {
  res.status(200).json({ message: 'Get categories' });
};

const createCategory = async (req, res) => {
  res.status(200).json({ message: 'Create category' });
};

const updateCategory = async (req, res) => {
  res.status(200).json({ message: `Update category ${req.params.id}` });
};

const deleteCategory = async (req, res) => {
  res.status(200).json({ message: `Delete category ${req.params.id}` });
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
