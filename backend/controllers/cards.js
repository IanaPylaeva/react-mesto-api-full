const Card = require('../models/card');
const ValidationError = require('../errors/validation-error'); // код 400
const NotFoundError = require('../errors/not-found-error'); // код 404
const ForbiddenError = require('../errors/forbidden-error'); // код 403

/* Получить все карточки */
module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((error) => next(error));
};

/* Создать карточку */
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании карточки'));
      }
      return next(error);
    });
};

/* Удалить карточку */
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Нельзя удалить чужую карточку'));
      }
      return card.remove()
        .then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new NotFoundError('Переданы некорректные данные'));
      }
      return next(error);
    });
};

/* Поставить лайк на карточку */
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      return res.status(201).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new NotFoundError('Переданы некорректные данные карточки для постановки лайка'));
      }
      return next(error);
    });
};

/* Удалить лайк с карточки */
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      return res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new NotFoundError('Переданы некорректные данные карточки для снятия лайка'));
      }
      return next(error);
    });
};
