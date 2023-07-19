class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkApiResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Код ошибки : ${res.status}`);
    }
  }
  //лайк
  putUserLike(cardId) {
    return fetch(`${this._baseUrl}cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then((res) => {
      return this._checkApiResponse(res);
    });
  }

  deleteUserLike(cardId) {
    return fetch(`${this._baseUrl}cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => {
      return this._checkApiResponse(res);
    });
  }
  //лайк
  editProfileInfo({ name, about }) {
    return fetch(`${this._baseUrl}users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
      return this._checkApiResponse(res);
    });
  }

  editUserAvatar(data) {
    return fetch(`${this._baseUrl}users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then((res) => {
      return this._checkApiResponse(res);
    });
  }
  //методы с картами
  setNewCard(cardData) {
    return fetch(`${this._baseUrl}cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(cardData),
    }).then((res) => {
      return this._checkApiResponse(res);
    });
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => {
      return this._checkApiResponse(res);
    });
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}cards`, { headers: this._headers }).then(
      (res) => {
        return this._checkApiResponse(res);
      }
    );
  }
  //методы с картами

  getUserData() {
    return fetch(`${this._baseUrl}users/me`, { headers: this._headers }).then(
      (res) => {
        return this._checkApiResponse(res);
      }
    );
  }

  getAllData() {
    return Promise.all([this.getInitialCards(), this.getUserData()]);
  }
}

const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-65/",
  headers: {
    authorization: "ce55775e-6fe1-4bd4-a65b-e80c24fd297e",
    "Content-Type": "application/json",
  },
});
export default api;
