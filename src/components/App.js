import React from "react";
import { useState, useEffect } from "react";
import { Routes, Link, Route, Navigate, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { AppContext } from "../contexts/AppContext";
import { usePopupClose } from "../hooks/usePopupClose";
import "../index.css";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "../components/PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/api.js";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";
import PageNotFound from "./PageNotFound";
import InfoToolTip from "./InfoToolTip";
import auth from "../utils/auth.js";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoToolTipPopupOpen, setIsInfoToolTipPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  // const [deletedCard, setDeletedCard] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      api
        .getUserData()
        .then((data) => {
          setCurrentUser(data);
        })
        .catch((error) => {
          console.error(
            `ошибка загрузки данных с апи: ${error} - ${error.statusText}`
          );
        });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      api
        .getInitialCards()
        .then((cardData) => {
          setCards(cardData);
        })
        .catch((error) => {
          console.error(
            `ошибка загрузки карточек с апи: ${error} - ${error.statusText}`
          );
        });
    }
  }, [isLoggedIn]);

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  function handleUpdateUser({ name, about }) {
    setIsLoading(true);
    api
      .editProfileInfo({ name, about })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((error) => {
        console.error(`ошибка: ${error} - ${error.statusText}`);
      })
      .finally(() => setIsLoading(false));
  }

  function handleAvatarUpdate(avatarUrl) {
    setIsLoading(true);
    api
      .editUserAvatar(avatarUrl)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closeAllPopups();
        console.log(newAvatar);
      })
      .catch((error) => {
        console.error(`ошибка: ${error} - ${error.statusText}`);
      })
      .finally(() => setIsLoading(false));
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    (!isLiked ? api.putUserLike(card._id) : api.deleteUserLike(card._id))
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((error) => {
        console.error(`ошибка: ${error} - ${error.statusText}`);
      });
  }

  function handleDeleteCard(card) {
    setIsLoading(true);
    api
      .deleteCard(card._id)
      .then((newCard) => {
        const newCards = cards.filter((c) =>
          c._id === card._id ? null : newCard
        );
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((error) => {
        console.error(`ошибка: ${error} - ${error.statusText}`);
      })
      .finally(() => setIsLoading(false));
  }

  function handleAddPlaceSubmit({ name, link }) {
    setIsLoading(true);
    api
      .setNewCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.error(`ошибка: ${error} - ${error.statusText}`);
      })
      .finally(() => setIsLoading(false));
  }

  // !!!!!!!РЕГИСТРАЦИЯ!!!!!!!
  // !!!!!!!РЕГИСТРАЦИЯ!!!!!!!
  // !!!!!!!РЕГИСТРАЦИЯ!!!!!!!
  function handleRegister(password, email) {
    auth
      .register(password, email)
      .then(() => {
        setIsRegistered(true);
        setIsInfoToolTipPopupOpen(true);
      })
      .catch((error) => {
        console.log(error);
        setIsRegistered(false);
        setIsInfoToolTipPopupOpen(false);
      });
  }
  // !!!!!!!РЕГИСТРАЦИЯ!!!!!!!
  // !!!!!!!РЕГИСТРАЦИЯ!!!!!!!
  // !!!!!!!РЕГИСТРАЦИЯ!!!!!!!

  // !!!!!!!!!логин!!!!!!!
  // !!!!!!!!!логин!!!!!!!
  // !!!!!!!!!логин!!!!!!!

  function handleLogin(password, email) {
    auth
      .login(password, email)
      .then((res) => {
        setIsRegistered(false);
        setEmail(email);
        localStorage.setItem("token", res.token);
        setIsLoggedIn(true);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.log(error);
        setIsRegistered(false);
        setIsLoggedIn(false);
        setIsInfoToolTipPopupOpen(true);
      });
  }
  // !!!!!!!!!логин!!!!!!!
  // !!!!!!!!!логин!!!!!!!
  // !!!!!!!!!логин!!!!!!!

  const tokenCheck = React.useCallback(() => {
    const token = localStorage.getItem("token");
    auth
      .checkToken(token)
      .then((res) => {
        if (!res) {
          return;
        }
        setEmail(res.data.email);
        setIsLoggedIn(true);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [navigate]);

  useEffect(() => {
    tokenCheck();
  }, []);

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
    setIsInfoToolTipPopupOpen(false);
  }
  function handleEscClose(e) {
    if (e.key === "Escape") {
      closeAllPopups();
    }
  }
  function handleSignOut() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }
  return (
    <AppContext.Provider value={{ isLoading, closeAllPopups }}>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="App">
          <div className="pages">
            <Header
              isLoggedIn={isLoggedIn}
              email={email}
              onSignOut={handleSignOut}
            />
            {
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute
                      isLoggedIn={isLoggedIn}
                      element={Main}
                      onEditProfile={handleEditProfileClick}
                      onAddPlace={handleAddPlaceClick}
                      onEditAvatar={handleEditAvatarClick}
                      onCardClick={handleCardClick}
                      cards={cards}
                      onCardLike={handleCardLike}
                      onCardDelete={handleDeleteCard}
                    />
                  }
                />
                <Route
                  path="/sign-up"
                  element={
                    <Register
                      onRegister={handleRegister}
                      isRegistered={isRegistered}
                    />
                  }
                />
                <Route
                  path="/sign-in"
                  element={<Login onLogin={handleLogin} />}
                />
                <Route path="*" element={<PageNotFound />} />
                <Route
                  path="/react-mesto-auth"
                  element={
                    isLoggedIn ? (
                      <Navigate to="/" />
                    ) : (
                      <Navigate to="/sign-in" />
                    )
                  }
                />
              </Routes>
            }
            <Footer />
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onUpdateUser={handleUpdateUser}
            />
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onAddPlace={handleAddPlaceSubmit}
            />
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleAvatarUpdate}
              isLoading={isLoading}
            />
            <InfoToolTip
              isOpen={isInfoToolTipPopupOpen}
              onClose={closeAllPopups}
              onEscClose={handleEscClose}
              isRegistered={isRegistered}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </CurrentUserContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
