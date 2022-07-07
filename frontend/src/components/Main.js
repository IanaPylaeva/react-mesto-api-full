import React from "react";
import Card from "./Card.js";
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const {name, about, avatar} = currentUser;

  return (
    <main className="content">
    <section className="profile">
      <div className="profile__grid-container">
        <img
          src={avatar}
          alt={name}
          className="profile__avatar"
        />
        <button
          type="button"
          aria-label="Редактировать аватар"
          className="profile__edit-avatar"
          onClick={props.onEditAvatar}></button>
      </div>
      <div className="profile__profile-info">
        <h1 className="profile__title">{name}</h1>
        <button
          type="button"
          aria-label="Редактировать"
          className="profile__edit-button"
          onClick={props.onEditProfile}></button>
        <p className="profile__subtitle">{about}</p>
      </div>
      <button
        type="button"
        aria-label="Добавить"
        className="profile__add-button"
        onClick={props.onAddPlace}></button>
    </section>
    <section className="elements">
      {props.cards.map((card) => {
        return (
          <Card
            key={card._id}
            card={card}
            link={card.link}
            name={card.name}
            likes={card.likes.length}
            onCardClick={props.onCardClick}
            onCardLike={props.onCardLike}
            onCardDelete={props.onCardDelete}
          />
        )
      })}
    </section>
    </main>
  )
}

export default Main;