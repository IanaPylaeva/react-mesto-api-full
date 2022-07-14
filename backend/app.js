require('dotenv').config();

const express = require('express');

const app = express();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const helmet = require('helmet');

const { PORT = 3000 } = process.env;

const { celebrate, Joi, errors } = require('celebrate');

const cors = require('./middlewares/cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const auth = require('./middlewares/auth');

const { login, createUser } = require('./controllers/users');

const NotFoundError = require('./errors/not-found-error'); // код 404

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(helmet());
app.use(bodyParser.json());

app.use(cors);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-._~:/?#[\]@!$&'()*+,;=]{2,}#?$/),
  }),
}), createUser);

app.use(auth);

app.use('/', auth, require('./routes/users'));
app.use('/', auth, require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страницы не существует'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка сервера' : message });
  next();
});

// Слушаем 3000 порт
app.listen(PORT);
