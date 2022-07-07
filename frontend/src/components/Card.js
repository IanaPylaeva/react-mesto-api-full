import React from "react";
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const {name, link, owner, likes} = props.card;
  const isOwn = owner._id === currentUser._id;// Определяем, являемся ли мы владельцем текущей карточки
  const isLiked = likes.some(i => i._id === currentUser._id);// Определяем, есть ли у карточки лайк, поставленный текущим пользователем

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = (
    `element__delete ${isOwn ? 'element__delete' : 'element__delete_type_hidden'}`
  );

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = (
    `element__like ${isLiked ? 'element__like_active' : 'element__like'}`
  );

  function handleClick() {
    props.onCardClick(props.card);
  }
  function handleLikeClick() {
    props.onCardLike(props.card)
  }
  function handleDeleteClick() {
    props.onCardDelete(props.card)
  }

  return (
    <div id="elementTemplate">
      <div className="element">
        <img
          src={link}
          alt={name}
          className="element__mask-group"
          onClick={handleClick}
        />
        <button
          type="button"
          aria-label="Удалить"
          className={cardDeleteButtonClassName}
          onClick={handleDeleteClick}></button
        >
        <figcaption className="element__group">
          <h2 className="element__title">{name}</h2>
          <div className="element__likes-counter">
            <button
              type="button"
              aria-label="Лайк"
              className={cardLikeButtonClassName}
              onClick={handleLikeClick}></button>
            <p className="element__likes-number">{likes.length}</p>
          </div>
        </figcaption>
      </div>
    </div>
  );
}

export default Card;