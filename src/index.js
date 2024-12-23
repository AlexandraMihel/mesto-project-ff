import './pages/index.css';

import {
  loadUserInfo,
  loadCards,
  updateAvatar,
  createCardOnServer,
  updateUserProfile
} from './components/api.js';

import {
  createCard,
  handleLikeCard,
  handleDeleteCard
} from './components/card.js';

import {
  openPopup,
  closePopup
} from './components/modal.js';

import {
  enableValidation
} from './components/validation.js';

// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM-узлы
const cardContainer = document.querySelector('.places__list');

// попап редактирования профиля
const editPopup = document.querySelector(".popup_type_edit");
const profileEditButton = document.querySelector('.profile__edit-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const editProfileForm = document.forms['edit-profile'];

// Поля ввода для редактирования профиля
const nameInput = editProfileForm.querySelector('[name="name"]');
const jobInput = editProfileForm.querySelector('[name="description"]');

// Добавление карточки
const addCardPopup = document.querySelector('.popup_type_new-card');
const openAddButton = document.querySelector('.profile__add-button');
const addCardForm = document.forms['new-place'];

// Поля ввода для добавления карточки
const placeNameInput = addCardForm.querySelector('[name="place-name"]');
const linkInput = addCardForm.querySelector('[name="link"]');

// Попап для открытия изображения
const popupTypeImage = document.querySelector('.popup_type_image');
const imagePopup = popupTypeImage.querySelector('.popup__image');
const captionPopup = popupTypeImage.querySelector('.popup__caption');

const profileImage = document.querySelector('.profile__image');
const popupNewAvatar = document.querySelector('.popup_new-avatar');
const avatarInput = document.querySelector('#avatar__type-url_input');

// Переменная для хранения userId
let userId;

// Функция для рендеринга карточки
const renderCard = (cardData, method = 'prepend') => {
  if (!cardTemplate) {
    return;
  }

  const cardElement = createCard(cardData, {
    cardTemplate,
    handleLikeCard,
    handleDeleteCard,
    handleImageClick,
    userId
  });

  // Проверяем, ставил ли пользователь лайк
  const likeButton = cardElement.querySelector('.card__like-button');
  if (cardData.likes.some(user => user._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Обновляем счетчик лайков
  const likeCounter = cardElement.querySelector('.card__like-counter');
  likeCounter.textContent = cardData.likes.length;

  if (cardElement) {
    cardContainer[method](cardElement);
  }
};

function handleNewCardFormSubmit(evt) {
  evt.preventDefault();

  const newCardData = {
    name: placeNameInput.value,
    link: linkInput.value,
  };

  createCardOnServer(newCardData)
    .then((createdCard) => {
      renderCard(createdCard, 'prepend');
      closePopup(addCardPopup);
      addCardForm.reset();
    })
    .catch((error) => {
      console.error('Ошибка при создании карточки:', error);
    });
}

// Функция обработки  формы профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const updatedUserInfo = {
    name: nameInput.value,
    about: jobInput.value,
  };

  updateUserProfile(updatedUserInfo)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closePopup(editPopup);
    })
    .catch((err) => console.error('Ошибка при обновлении профиля:', err));
}

// Функция открытия попапа с изображением
const handleImageClick = (cardData) => {
  imagePopup.src = cardData.link;
  imagePopup.alt = cardData.name;
  captionPopup.textContent = cardData.name;
  openPopup(popupTypeImage);
};

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;

  openPopup(editPopup);
});

openAddButton.addEventListener('click', () => openPopup(addCardPopup));
editProfileForm.addEventListener('submit', handleProfileFormSubmit);
addCardForm.addEventListener('submit', handleNewCardFormSubmit);

// Загружаем информацию о пользователе и карточках
Promise.all([loadUserInfo(), loadCards()])
  .then(([userData, cardsData]) => {
    userId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;

    // Обновляем аватар
    if (userData.avatar) {
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
    }
    profileImage.style.display = 'block';

    // Рендерим карточки
    cardsData.forEach(cardData => renderCard(cardData, 'append'));
  })
  .catch(err => console.error('Ошибка при загрузке данных:', err));

// Настройки валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// Включение валидации
enableValidation(validationConfig);

profileImage.addEventListener('click', () => {
  avatarInput.value = profileImage.style.backgroundImage.slice(5, -2);
  openPopup(popupNewAvatar);
});

const avatarForm = popupNewAvatar.querySelector('.popup__form');
avatarForm.addEventListener('submit', handleAvatarFormSubmit);

// Функция отправки нового аватара
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const newAvatarUrl = avatarInput.value;
  const profileImage = document.querySelector('.profile__image');
  profileImage.style.backgroundImage = `url(${newAvatarUrl})`;
  updateAvatar(newAvatarUrl)
    .then((data) => {
      closePopup(popupNewAvatar);
      loadUserInfo()
        .then((userData) => {
          if (userData.avatar !== newAvatarUrl) {
            profileImage.style.backgroundImage = `url('${userData.avatar}')`;
          }
          profileTitle.textContent = userData.name;
          profileDescription.textContent = userData.about;
        })
        .catch((err) => console.error('Ошибка при загрузке данных пользователя:', err));
    })
    .catch((err) => console.error('Ошибка при обновлении аватара:', err));
}