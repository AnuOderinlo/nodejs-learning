const AppError = require('./../utils/appError');

const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateErrorDb = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field: ${value}, please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err) => {
  const value = Object.values(err.errors).map((el) => el.message);
  const message = `Validation error: ${value.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorPro = (err, res) => {
  // Operational error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Other error, programming error
  } else {
    console.log('Error', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const handleJWTError = () =>
  new AppError('Invalid token, Please login again!!!', 401);
const handleJWTExpiredError = () => new AppError('Token has expired', 401);

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') {
      error = handleCastErrorDb(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateErrorDb(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDb(error);
    }

    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }
    sendErrorPro(error, res);
  }
};
