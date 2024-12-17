import "./pages/index.css"; // Импорт главного файла стилей

import {
  createCard,
  likeCard,
  getCardForDeletion
} from "./components/card.js";

import {
  openPopup,
  closePopup
} from "./components/modal.js";

import {
  enableValidation,
  clearValidation
} from "./components/validation.js";

import {
  getUserInfo,
  getInitialCards,
  getInitialInfo,
  deleteMyCard,
  editProfile,
  postNewCard,
  updateNewAvatar,
} from "./components/api.js";

import {
  validationConfig
} from "./components/validation.js";

// Элементы DOM
const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");

// Функции для работы с карточками
function addCard(card, placesList, cardTemplate, createCard, likeCard, showImgPopup, openDeletePopup, profileId) {
  const cardElement = createCard(card, cardTemplate, likeCard, showImgPopup, openDeletePopup, profileId);
  placesList.append(cardElement);
}

function fillCards(initialCards, profileId) {
  initialCards.forEach((card) => {
    addCard(card, placesList, cardTemplate, createCard, likeCard, showImgPopup, openDeletePopup, profileId);
  });
}

// Функции для загрузки и обработки данных
const showLoadingBtn = (isLoading, button) => {
  button.textContent = isLoading ? "Сохранение..." : "Сохранить";
};

// Функции для работы с попапами

// Редактирование профиля
const editPopup = document.querySelector(".popup_type_edit");
const profileEditButton = document.querySelector(".profile__edit-button");
const closeEditButton = editPopup.querySelector(".popup__close");
const editForm = document.querySelector('form[name="edit-profile"]');
const nameInput = editForm.querySelector(".popup__input_type_name");
const jobInput = editForm.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const editSaveButton = editPopup.querySelector(".popup__button");

profileEditButton.addEventListener("click", () => {
  openPopup(editPopup);
  fillPopupEditInputs();
  clearValidation(editForm, validationConfig);
});

closeEditButton.addEventListener("click", () => closePopup(editPopup));

function fillPopupEditInputs() {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
}

function handleEditForm(evt) {
  evt.preventDefault();
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;
  showLoadingBtn(true, editPopup.querySelector(".popup__button"));
  editSaveButton.disabled = true;
  editProfile(nameValue, jobValue)
    .then((res) => {
      profileTitle.textContent = res.name;
      profileDescription.textContent = res.about;
      closePopup(editPopup);
    })
    .catch(console.log)
    .finally(() => showLoadingBtn(false, editPopup.querySelector(".popup__button")));
}

editForm.addEventListener("submit", handleEditForm);

// Добавление карточки
const addCardPopup = document.querySelector(".popup_type_new-card");
const openAddButton = document.querySelector(".profile__add-button");
const closeAddButton = addCardPopup.querySelector(".popup__close");
const addForm = document.querySelector('form[name="new-place"]');
const cardInput = addForm.querySelector(".popup__input_type_card-name");
const linkInput = addForm.querySelector(".popup__input_type_url");
const addSaveButton = addCardPopup.querySelector(".popup__button");

openAddButton.addEventListener("click", () => {
  openPopup(addCardPopup);
  addForm.reset();
  clearValidation(addForm, validationConfig);
});

closeAddButton.addEventListener("click", () => closePopup(addCardPopup));

function handleAddForm(evt) {
  evt.preventDefault();
  const cardValue = cardInput.value;
  const linkValue = linkInput.value;
  showLoadingBtn(true, addForm.querySelector(".popup__button"));
  addSaveButton.disabled = true;
  postNewCard(cardValue, linkValue)
    .then((card) => {
      const newCard = createCard(card, cardTemplate, likeCard, showImgPopup, openDeletePopup, profileId);
      placesList.prepend(newCard);
      closePopup(addCardPopup);
    })
    .catch(console.log)
    .finally(() => {
      addForm.reset();
      showLoadingBtn(false, addForm.querySelector(".popup__button"));
    });
}

addForm.addEventListener("submit", handleAddForm);

// Увеличение картинок
const imgPopup = document.querySelector(".popup_type_image");
const closePhotoButton = imgPopup.querySelector(".popup__close");
const zoomedPopupImage = imgPopup.querySelector(".popup__image");
const imgPopupCaption = imgPopup.querySelector(".popup__caption");

closePhotoButton.addEventListener("click", () => closePopup(imgPopup));

function showImgPopup(evt) {
  openPopup(imgPopup);
  zoomedPopupImage.setAttribute("src", evt.target.src);
  zoomedPopupImage.setAttribute("alt", evt.target.alt);
  imgPopupCaption.textContent = evt.target.alt;
}

// Редактирование аватара
const profileImageButton = document.querySelector(".profile__image_cover");
const profileImage = document.querySelector(".profile__image");
const profilePopup = document.querySelector(".popup_type_avatar");
const closeProfileButton = profilePopup.querySelector(".popup__close");
const profileForm = document.forms["avatar_edit"];
const profileLinkInput = profileForm.querySelector(".popup__input_type_url");
const profileSaveButton = profilePopup.querySelector(".popup__button");

profileImageButton.addEventListener("click", () => {
  openPopup(profilePopup);
  profileForm.reset();
  clearValidation(profileForm, validationConfig);
});

closeProfileButton.addEventListener("click", () => closePopup(profilePopup));

function handleProfileForm(evt) {
  evt.preventDefault();
  const linkValue = profileLinkInput.value;
  profileImage.style.backgroundImage = linkValue;
  showLoadingBtn(true, profilePopup.querySelector(".popup__button"));
  profileSaveButton.disabled = true;
  updateNewAvatar(linkValue)
    .then((res) => {
      profileImage.style.backgroundImage = `url('${res.avatar}')`;
      closePopup(profilePopup);
    })
    .catch(console.log)
    .finally(() => {
      profileForm.reset();
      showLoadingBtn(false, profileForm.querySelector(".popup__button"));
    });
}

profileForm.addEventListener("submit", handleProfileForm);

// Удаление карточки
const deletePopup = document.querySelector(".popup_type_delete");
const closeDeleteButton = deletePopup.querySelector(".popup__close");
const deleteForm = document.querySelector('form[name="delete-card"');

const openDeletePopup = () => openPopup(deletePopup);
const closeDeletePopup = () => closePopup(deletePopup);

closeDeleteButton.addEventListener("click", closeDeletePopup);

function deleteThisCard({ cardId, deleteButton }) {
  deleteMyCard(cardId)
    .then(() => {
      const deleteItem = deleteButton.closest(".places__item");
      deleteItem.remove();
      closeDeletePopup();
    })
    .catch(console.log);
}

function handleDeleteForm(evt) {
  evt.preventDefault();
  deleteThisCard(getCardForDeletion());
}

deleteForm.addEventListener("submit", handleDeleteForm);

// Загрузка данных
let profileId;

getInitialInfo();
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userList, initialCards]) => {
    profileTitle.textContent = userList.name;
    profileDescription.textContent = userList.about;
    profileId = userList._id;
    profileImage.style.backgroundImage = `url(${userList.avatar})`;
    fillCards(initialCards, profileId);
  })
  .catch(console.log);

// Включаем валидацию
enableValidation(validationConfig);
