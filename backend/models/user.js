const mongoose = require('mongoose'); // Зададим схему для пользователя через Mongoose
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Жак-Ив Кусто', // по умолчанию
  },
  about: {
    type: String, // это строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина  — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Исследователь', // по умолчанию
  },
  avatar: {
    type: String, // это строка
    required: true, // обязательное поле
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png', // по умолчанию
    validate: validator.isURL,
  },
  email: {
    type: String, // это строка
    required: true, // обязательное поле
    unique: true, // уникальность
    minlength: 5, // минимальная длина  — 8 символов
    validate: validator.isEmail,
  },
  password: {
    type: String, // это строка
    required: true, // обязательное поле
    select: false, // API не возвращает хеш пароля
  },
});

module.exports = mongoose.model('user', userSchema);
