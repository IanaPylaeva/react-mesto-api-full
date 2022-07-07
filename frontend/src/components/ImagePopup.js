import React from "react";

const ImagePopup = (props) => {
  const propsCardName = props.card ? props.card.name : '';
  return(
    <div 
      className={`popup popup_type_picture ${props.card.link !== '' && "popup_opened"}`}
    >
      <article className="popup__pic-container">
        <img
          src={props.card ? props.card.link : ''}
          alt={propsCardName}
          className="popup__zoom"
        />
        <p className="popup__caption">{propsCardName}</p>
        <button
          type="button"
          aria-label="Закрыть"
          className="popup__button-close popup__button-close_type_zoom"
          onClick={props.onClose}></button>
      </article>
    </div>
  )
}

export default ImagePopup;