import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
  const [placeName, setPlaceName] = React.useState('');
  const [placeLink, setPlaceLink] = React.useState('');

  function handlePlaceNameAdd(evt) {
    setPlaceName(evt.target.value);
  }

  function handlePlaceLinkAdd(evt) {
    setPlaceLink(evt.target.value);
  }
  
  /* Отправляет форму*/
  function handleSubmit(evt) {
    evt.preventDefault();// Запрещаем браузеру переходить по адресу формы - страница не перезагружается
    
    // Передаём значения управляемых компонентов во внешний обработчик
    props.onAddNewPlace({
      name: placeName,
      link: placeLink
    })
  }
  
  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  React.useEffect(() => {
    if(props.isOpen) {
      setPlaceName('');
      setPlaceLink('');
    }
  }, [props.isOpen]);

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      popupType="card-add"
      title="Новое место"
      popupNameForm="addForm"
      submitButtonText="Создать"
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <div className="popup__input-container">
        <input
          id="popup__text_name"
          type="text"
          className="popup__text popup__text_type_place"
          name="name"
          placeholder="Название"
          minLength="2" 
          maxLength="30"
          value={placeName}
          onChange={handlePlaceNameAdd}
          required
        />
        <span className="popup__text-error popup__text_name-error"></span>
        <input
          id="popup__text_link"
          type="url"
          className="popup__text popup__text_type_link"
          name="link"
          placeholder="Ссылка на картинку"
          value={placeLink}
          onChange={handlePlaceLinkAdd}
          required
        />
        <span className="popup__text-error popup__text_link-error"></span>
      </div>
    </PopupWithForm>
  )
}

export default AddPlacePopup;