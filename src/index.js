import './pages/index.css'; // импорт главного файла стилей

import { initialCards } from './components/cards.js';  // импорт массива с карточками

import { createCard, handleLikeCard, handleDeleteCard } from './components/card.js';  // импорт функций создания карточек, их удаления и лайков

import { openPopup, closePopup } from './components/modal.js';  // импорт закрытия и открытия попапа 

//Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;


// DOM-узлы
const cardContainer = document.querySelector('.places__list'); //куда добавляем карточки

// попап редактирования профиля
const editPopup = document.querySelector(".popup_type_edit");
const profileEditButton = document.querySelector('.profile__edit-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const editProfileForm = document.forms['edit-profile'];

//Добавление карточки 
const addCardPopup = document.querySelector('.popup_type_new-card');
const openAddButton = document.querySelector('.profile__add-button');
const addCardForm = document.forms['new-place'];

// Попап для открытия изображения и его элементы
const popupTypeImage = document.querySelector('.popup_type_image');
const imagePopup = popupTypeImage.querySelector('.popup__image'); 
const captionPopup = popupTypeImage.querySelector('.popup__caption'); 


// Рендеринг карточек
const renderCard = (cardData, method = 'prepend') => {
  const cardElement = createCard(cardData, {
    cardTemplate,
    handleLikeCard,
    handleDeleteCard,
    handleImageClick
  });
  cardContainer[method](cardElement);
};


// Функция обработки новой карточки
function handleNewCardFormSubmit(evt) {
  evt.preventDefault();
  const placeNameInput = addCardForm.querySelector('[name="place-name"]');
  const linkInput = addCardForm.querySelector('[name="link"]');

  const newCardData = {
    name: placeNameInput.value,
    link: linkInput.value
  };

  renderCard(newCardData);
  closePopup(addCardPopup);
  addCardForm.reset();
}

// Функция обработки отправки формы профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const nameInput = editProfileForm.querySelector('[name="name"]');
  const jobInput = editProfileForm.querySelector('[name="description"]');

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closePopup(editPopup);
}

// Функция открытия попапа с изображением
const handleImageClick = (cardData) => {
  imagePopup.src = cardData.link;
  imagePopup.alt = cardData.name;
  captionPopup.textContent = cardData.name;
  openPopup(popupTypeImage);
};

// Слушатели событий
profileEditButton.addEventListener('click', () => {
  const nameInput = editProfileForm.querySelector('[name="name"]');
  const jobInput = editProfileForm.querySelector('[name="description"]');

  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;

  openPopup(editPopup);
});

openAddButton.addEventListener('click', () => openPopup(addCardPopup));
editProfileForm.addEventListener('submit', handleProfileFormSubmit);
addCardForm.addEventListener('submit', handleNewCardFormSubmit);

// Инициализация карточек
initialCards.forEach((cardData) => renderCard(cardData, 'append'));