const mongoose = require('mongoose'); // Зададим схему для карточки через Mongoose
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: { // у карточки есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: {
    type: String, // это строка
    required: true, // обязательное поле
    validate: validator.isURL,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // ссылка на модель автора карточки
    required: true, // обязательное поле
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // ссылка на модель автора карточки
      default: [], // обязательное поле
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
