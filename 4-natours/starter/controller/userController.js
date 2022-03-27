const User = require('./../model/userModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // Send Response
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Undefined',
    message: 'Route yet to be implemented',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Undefined',
    message: 'Route yet to be implemented',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Undefined',
    message: 'Route yet to be implemented',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Undefined',
    message: 'Route yet to be implemented',
  });
};
