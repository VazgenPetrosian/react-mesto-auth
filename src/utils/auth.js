class Auth {
  constructor(url) {
    this._url = url;
  }

  _checkApiResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Код ошибки : ${res.status}`);
    }
  }

  register(password, email) {
    return fetch(`${this._url}signup`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ password, email }),
    }).then((res) => {
      return this._checkApiResponse(res);
    });
  }

  login(password, email) {
    return fetch(`${this._url}signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email }),
    }).then((res) => {
      return this._checkApiResponse(res);
    });
  }

  checkToken(token) {
    return fetch(`${this._url}users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      return this._checkApiResponse(res);
    });
  }
}
const auth = new Auth("https://auth.nomoreparties.co/");

export default auth;
