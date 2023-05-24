require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./utils/limiter');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');

const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const allowedCors = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://api.expmovies.nomoredomains.rocks',
  'https://expmovies.nomoredomains.rocks',
];
app.use(limiter);
app.use(cors());
app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);
app.use('/', routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.set('strictQuery', false)
mongoose.connect(DB_ADDRESS, () => {
  console.log('Connection successful');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
