const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error'); // код 404
const ServerError = require('../errors/server-error'); // код 500
const ValidationError = require('../errors/validation-error'); // код 400
const EmailExistsError = require('../errors/email-exists-error'); // код 409
const AuthorizationError = require('../errors/authorization-error'); // код 401

/* Создать пользователя */
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then(() => {
      res.send({
        name, about, avatar, email,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      }
      if (error.code === 11000) {
        return next(new EmailExistsError('Email уже существует'));
      }
      return next(error);
    });
};

/* Получить всех пользователей */
module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next(new ServerError('Ошибка на стороне сервера')));
};

/* Получить о пользователе информацию */
module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      } res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new NotFoundError('Некорректный id пользователя'));
      }
      return next(error);
    });
};

/* Обновить информацию о пользователе */
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then(() => {
      res.status(200).send({ name, about });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(error);
    });
};

/* Обновить аватар пользователя */
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then(() => {
      res.status(200).send({ avatar });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении аватара'));
      }
      return next(error);
    });
};

/* Получает из запроса почту и пароль и проверяет их */
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password') // в случае аутентификации хеш пароля нужен
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // сравниваем переданный пароль и хеш из базы
      return Promise.all([bcrypt.compare(password, user.password), user]);
    })
    .then(([isPasswordCorrect, user]) => {
      if (!isPasswordCorrect) {
        return Promise.reject(new Error('Неправильная почта или пароль'));
      }
      const token = jwt.sign(
        { _id: user._id },
        `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`,
        { expiresIn: '7d' }, // токен будет просрочен через 7 дней после создания
      );
      return res.send({ token });
    })
    .catch(() => new AuthorizationError('Передан неверный логин или пароль'));
};

/* Получение информации о пользователе */
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('Некорректный id пользователя'));
      }
      return next(error);
    });
};
