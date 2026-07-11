const User = require('../models/User');

const getUsers = async (req, res) => {
  res.status(200).json({ message: 'Get users' });
};

const updateUser = async (req, res) => {
  res.status(200).json({ message: `Update user ${req.params.id}` });
};

const deleteUser = async (req, res) => {
  res.status(200).json({ message: `Delete user ${req.params.id}` });
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
};
