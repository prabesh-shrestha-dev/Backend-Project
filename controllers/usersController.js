const User = require('../model/User');

const getAllUsers = async (req, res) => {
  const users = await User.find().exec();
  if (!users) return res.status(204).json({ 'message': 'No users found' });
  res.json(users);
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ 'message': 'User ID required' });
  const deletedUser = await User.findOneAndDelete({
    _id: req.body.id
  }).exec();
  if (!deletedUser) return res.status(204).json({ 'message': `User ID ${req.body.id} not found.` });
  res.json(deletedUser);
};

const getUser = async (req, res) => {
  if (!req?.params?.id) return res.status(404).json({ 'message': 'No users found' });
  const user = await User.findOne({
    _id: req.params.id
  }).exec();
  if (!user) return res.status(404).json({ 'message': `User ID ${req.params.id} not found` });
  res.json(user);
};

module.exports = {getAllUsers, deleteUser, getUser };