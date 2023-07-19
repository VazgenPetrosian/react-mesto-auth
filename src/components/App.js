import React from "react";
import { useState, useEffect } from "react";
import "../index.css";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "../components/PopupWithForm";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/api.js";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { AppContext } from "../contexts/AppContext";

function App() {
  useEffect(() => {
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
  }, []);

  useEffect(() => {
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
  }, []);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  // const [deletedCard, setDeletedCard] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
  }
  return (
    <AppContext.Provider value={{ isLoading, closeAllPopups }}>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="App">
          <div className="pages">
            <Header />
            <Main
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleDeleteCard}
            />
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
          </div>
        </div>
      </CurrentUserContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
