import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import * as auth from "../utils/auth.js";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import ImagePopup from "./ImagePopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import Login from "./Login.js";
import Register from "./Register.js";
import ProtectedRoute from "./ProtectedRoute.js";
import InfoTooltip from './InfoTooltip.js';
import success from '../images/success.svg';
import fail from '../images/fail.svg';

const defaultSelectedCard = { name: '', link: '' };

function App() {
  const navigate = useNavigate();
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(defaultSelectedCard);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState(null);
  const [popupImage, setPopupImage] = React.useState('');
  const [popupTitle, setPopupTitle] = React.useState('');
  const [infoTooltip, setInfoTooltip] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);

  /* Одновременное получение данных пользователя и карточек */
  useEffect(() => {
    if (isLoggedIn) {
      api.getUserData()
        .then(res => {
          setCurrentUser(res.data);
      })
      .catch(err => {
        console.log(err);
      });        
      api.getInitialCards()
        .then(card => {
          setCards(card);
      })
      .catch(err => {
        console.log(err);
      });
    };
  }, [isLoggedIn]);

  useEffect(() => {
    tockenCheck();    
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  /* Вход */
  function logIn({ email, password }) {
    auth.loginUser({ email, password })
    .then((res) => {
      localStorage.setItem('token', res.token);
      tockenCheck();
      setIsLoggedIn(true);
      navigate('/');
    }).catch(() => {
      setPopupImage(fail);
      setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
      handleInfoTooltip();
    })
  }

  /* Регистрация */
  function register({ email, password }) {
    auth.registerUser({ email, password })
      .then(() => {
        setPopupImage(success);
        setPopupTitle("Вы успешно зарегистрировались!");
        navigate('/sign-in');
    }).catch(() => {
      setPopupImage(fail);
      setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
    }).finally(handleInfoTooltip);
  }  

/* Сохранить токен в локальном хранилище, установить имейл */
  const tockenCheck = () => {
    if (localStorage.getItem('token')) {
      api.getUserData()
        .then((res) => {
          if (res.data) {
            setEmail(res.data.email);
            setIsLoggedIn(true);
          }
        })
        .catch((err) => {
        console.log(err);
      })
    }
  }

  function handleEditProfileClick(){
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick(){
    setIsAddPlacePopupOpen(true);
  }
  function handleEditAvatarClick(){
    setIsEditAvatarPopupOpen(true);
  }
  function handleCardClick(card){
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }
  function handleInfoTooltip(){
    setInfoTooltip(true);
  }

  /* Сброс всех параметров после logout */
  function handleLogOut() {
    localStorage.removeItem('token');//удаление токена из локального хранилища
    setEmail(null);
    setIsLoggedIn(false);
    navigate('/sign-in');
  }

  /* Ставим и убираем лайк на карточке */
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);// Снова проверяем, есть ли уже лайк на этой карточке
    
    const action = !isLiked ? api.putLike(card._id) : api.deleteLike(card._id);
    action
      .then((newCard) => {
        setCards((state) => 
        state.map((c) => c._id === card._id ? newCard : c))
      }).catch((err) => {
        console.error(err)
      });    
  }

  /* Удаляет карточку */
  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then (() => {
        setCards(items => items.filter((i) => i._id !== card._id));
      }).catch((err) => {
        console.error(err);
      })
  }

  /* Обновляет данные пользователя */
  function handleUpdateUser({ name, about }) {
    api.patchUserInfo({ name, about })
      .then(res => {
        setCurrentUser({...currentUser, name, about });
        closeAllPopups();
      }).catch((err) => {
        console.error(err);
      })
  }

  /* Обновляет аватар */
  function handleAvatarUpdate({ avatar }) {
    api.patchUserAvatar({ avatar })
      .then(res => {
        setCurrentUser({...currentUser, avatar });
        closeAllPopups();
      }).catch((err) => {
        console.error(err);
      })
  }

  /* Добавляет карточку */
  function handleAddPlaceSubmit(card) {
    api.postCard(card)
    .then(data => {
      setCards([data, ...cards]);
      closeAllPopups();
    }).catch((err) => {
      console.error(err);
    })
  }

  /* Закрытие всех попапов */
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(defaultSelectedCard);
    setInfoTooltip(false);
    setIsImagePopupOpen(false);
  }
  
  return (
    <CurrentUserContext.Provider value={currentUser}>
    <div className="page">
      <Header mail={email} onClick={handleLogOut} route="" />    
      <Routes>
        <Route exact path="/" element={
          <ProtectedRoute
            component={Main}
            isLogged={isLoggedIn}
            onCardClick={handleCardClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
          ></ProtectedRoute> 
        }></Route> 
        <Route path="/sign-up" element={
          <Register register={register} />
        }></Route>
        <Route path="/sign-in" element={
          <Login logIn={logIn} tockenCheck={tockenCheck} />
        }></Route>
        <Route path="*" element={
          <Navigate to="/" />
        }></Route>
      </Routes>
      <Footer />
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddNewPlace={handleAddPlaceSubmit}
      />      
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleAvatarUpdate}
      />      
      <ImagePopup
        card={selectedCard}
        onClose={closeAllPopups}
        isOpen={isImagePopupOpen}
      />
      <InfoTooltip
        image={popupImage}
        title={popupTitle}
        isOpen={infoTooltip}
        onClose={closeAllPopups}
      />
    </div>
    </CurrentUserContext.Provider>
  );
}

export default App;