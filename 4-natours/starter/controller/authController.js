const crypto = require('crypto');
const { promisify } = require('util');
const JWT = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendmail = require('./../utils/email');

const siginToken = function (id) {
  return JWT.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = siginToken(user._id);

  const cookieOpts = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    // secure: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOpts.secure = true;

  //Send cookie
  res.cookie('jwt', token, cookieOpts);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check if the email and password exist
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  // 2. check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email or password not correct', 401));
  }

  // 3. send token to client if everything is ok
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not login, please login', 401));
  }
  // 2. Verify token is valid
  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

  // console.log(decoded);
  // 3. check if User still exist
  const currentUser = await User.findById(decoded.id);
  // console.log(currentUser);
  if (!currentUser) {
    return next(new AppError('User no longer exist', 401));
  }

  // 4. check if user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    console.log(decoded.iat);
    return next(new AppError('Password has been changed. Please Log in', 401));
  }

  req.user = currentUser;
  next();
});

exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not permitted to access this route!'));
    }

    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1. get the user with the email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('No user with this email!', 404));
  }
  // 2. Create a token to be sent

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // 3. Send the token to the email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/${resetToken}`;

  const message = `Forgot your password? Submit a request to ${resetURL} with your new password and password confirm.\n
  If you didn't initiate this request please kindly ignore`;

  try {
    await sendmail({
      email: req.body.email,
      subject: 'Reset your password. this will expires in the next 10 minutes',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent successfully',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordRestExpires = undefined;

    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError(
        'There was an error sending the email. Please try again later',
        500
      )
    );
  }

  // next();
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get the user with the token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordRestExpires: { $gt: Date.now() },
  });

  // 2. If token has not expired and there is a user
  if (!user) {
    return next(new AppError('Token is invalid or has expired!!!', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordRestExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
  // const token = siginToken(user._id);

  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. get the user from collection
  const user = await User.findById(req.params.id).select('+password');
  console.log(user._id);

  if (!user) {
    return next(new AppError('No user found for this ID!', 401));
  }
  // 2. Check if Posted current password is correct
  const { currentPassword, passwordConfirm, newPassword } = req.body;

  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Password is not correct', 401));
  }

  // 3. If so, update the password

  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  // 4. Log in user send JWT(token)
  // console.log(user._id);
  createSendToken(user, 200, res);
  // const token = siginToken(user._id);

  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
});
