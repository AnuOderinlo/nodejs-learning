const express = require('express');

const app = express();
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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

app.use(morgan('dev'));

app.use(express.json()); //express.json() is a  middleware, you need it for POST and PUT/PATCH request, you dont need it for GET request

app.use((req, res, next) => {
  console.log('hello from Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use(express.static(`${__dirname}/public`));

module.exports = app;
