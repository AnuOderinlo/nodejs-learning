const User = require('./../model/userModel');
// const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.user.id);
  // 1. If you users POST password data, send error
  if (req.body.password || req.body.passwordConfirm) {
    next(
      new AppError(
        'Wrong route for password update, use /updatePassword route',
        400
      )
    );
  }

  // 2. Update user data

  const filterBody = filterObj(req.body, 'name', 'email');

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  // response
  res.status(200).json({
    status: 'success',
    user: updateUser,
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
