import React from "react";

function PopupWithForm(props) {
  return (
    <section
      className={`popup popup_type_${props.popupType} ${props.isOpen ? "popup_opened" : ''}`}
    >
      <div className={`popup__container popup__container_type_${props.name}`}>          
        <button
          type="button"
          aria-label="Закрыть"
          className="popup__button-close"
          onClick={props.onClose}></button>
        <h2 className="popup__title">{props.title}</h2>
        <form className={`popup__form popup__${props.popupNameForm}`}
          name="popupForm"
          onSubmit={props.onSubmit}
          noValidate
        >
          {props.children}      
          <button
            type="submit"
            className="popup__button-submit"
            data-value={props.submitButtonText}
          >{props.submitButtonText}</button>
        </form>
      </div>
    </section>
  )
}

export default PopupWithForm;