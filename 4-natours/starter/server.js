const app = require('./app');
const port = 5000;
// listening to server

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
