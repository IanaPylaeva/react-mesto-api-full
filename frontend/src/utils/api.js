class Api {
  constructor(options) {
    this._serverUrl = options.serverUrl;
    this._headers = options.headers;
  };

  /* Ответ от сервера всегда проверяется на корректность */
  _checkCorrectness(res) {
    if (res.ok) {
      return res.json();
    }
    // если ошибка, отклоняем промис
    return Promise.reject(`Ошибка: ${res.status}`);
  };
  
  /* Получить карточки с сервера */
  getInitialCards() {
    return fetch(`${this._serverUrl}/cards`, {
      method: 'GET',
      headers: this._headers,
    })
    .then(this._checkCorrectness);
  };
 
  /* Получить информацию о пользователе с сервера */
  getUserData() {
    return fetch(`${this._serverUrl}/users/me`, {
      method: 'GET',
      headers: this._headers,
    })
    .then(this._checkCorrectness);
  };

  /* Установить обновленные данные пользователя на сервер */
  patchUserInfo(data) {
    return fetch(`${this._serverUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      })
    })
    .then(this._checkCorrectness);
  };

  /* Установить аватар пользователя на сервере */
  patchUserAvatar(data) {
    return fetch(`${this._serverUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      })
    })
    .then(this._checkCorrectness);
  };

  /* Отправить данные новой карточки на сервер */
  postCard(card) {
    return fetch(`${this._serverUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: card.name,
        link: card.link,
      })
    })
    .then(this._checkCorrectness);
  };

  /* Удалить карточку с сервера */
  deleteCard(id) {
    return fetch(`${this._serverUrl}/cards/${id}`, {
    method: 'DELETE',
    headers: this._headers,
    })
    .then(this._checkCorrectness);
  };

  /* Поставить лайк */
  putLike(id) {
    return fetch(`${this._serverUrl}/cards/${id}/likes`, {
    method: 'PUT',
    headers: this._headers,
    })
    .then(this._checkCorrectness);
  };

  /* Удалить лайк */
  deleteLike(id) {
    return fetch(`${this._serverUrl}/cards/${id}/likes`, {
    method: 'DELETE',
    headers: this._headers,
    })
    .then(this._checkCorrectness);
  };
};

export const api = new Api({
  serverUrl: 'https://mesto.nomoreparties.co/v1/cohort-39',//Адрес сервера проекта Mesto
  headers: {
    authorization: 'a8870c90-962a-4e80-9995-2681c6a34a53',//Мой токен
    'Content-Type': 'application/json'
  }
})