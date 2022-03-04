const express = require('express');
const app = express();

const port = 5000;

// Create Route
app.get('/', (req, res) => {
  //   res.status(200).send('Hello world...at the root');
  //   res.send(req.params);

  res.status(200).json({
    user: 'Anuoluwapo',
    password: '091683Anu',
    email: 'oderinloanuoluwapo@gmail.com',
    result: {
      cgpa: 4.88,
      'course-title': 'Cyber war',
      'course-code': 'cy-111',
    },
  });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});

// listening to server
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
