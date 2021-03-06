const express = require('express');

const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

/*
// Create Route
app.get('/', (req, res) => {
  //   res.status(200).send('Hello world...at the root');
  //   res.send(req.params);

  res.status(200).json({
    user: 'Anuoluwapo',
    password: '091683Anu',
    email: 'oderinloanuoluwapo@gmail.com',
    result: {
      cgpa: '4.88',
      'course-title': 'Cyber war',
      'course-code': 'cy-111',
    },
  });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});
*/

console.log(process.env.NODE_ENV);

//Use to set security HTTPS headers
app.use(helmet());

// Limit the amount of request from same IP
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: 'Too many request via this IP, please try again after an hour',
});
app.use('/api', limiter);

//Development loggin
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Body parser, to read data into req.body
app.use(express.json({ limit: '10kb' })); //express.json() is a  middleware, you need it for POST and PUT/PATCH request, you dont need it for GET request

//Data sanitization against Nosql injection
app.use(mongoSanitize());

//Data sanitization against XSS attack
app.use(xss());
//Serving static files
app.use(express.static(`${__dirname}/public`)); //this for static files

// app.use((req, res, next) => {
//   console.log('hello from Middleware');
//   next();
// });

// Prevent Parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
      'maxGroupSize',
    ],
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// this should be the last middleware in order.
// this sends an error message if the URL or route is not defined in the app
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl}`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // res.status(404).json({
  //   status: 'Fail',
  //   message: `Can't find ${req.originalUrl}`,
  // });

  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

// Global handling error
app.use(globalErrorHandler);

module.exports = app;
