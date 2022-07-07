function InfoTooltip(props) {
  return (
    <div
    className={`popup popup_type_auth ${props.isOpen ? "popup_opened" : ''}`}
    >
      <div className="popup__info">
        <img
          className="popup__status"
          src={props.image}
          alt={props.title}
        />
        <h2 className="popup__message">{props.title}</h2>
        <button
          className="popup__button-close"
          type="button"
          title="Закрыть"
          onClick={props.onClose}
        />
      </div>
    </div>
  )
}

export default InfoTooltip;