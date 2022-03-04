const express = require('express');
const fs = require('fs');
const app = express();

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

app.use(express.json()); //this serves as middleware

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: newTour,
      });
    }
  );
});

const port = 5000;
// listening to server
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
