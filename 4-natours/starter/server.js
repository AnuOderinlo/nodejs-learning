const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;
// listening to server

const server = app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhadled...shutting down');

  server.close(() => {
    process.exit(1);
  });
});
