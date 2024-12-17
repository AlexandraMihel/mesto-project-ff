import "./pages/index.css"; /// добавляем импорт главного файла стилей

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

// Получаем шаблон карточки и список для добавления
const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");

// Функция добавления карточки
function addCard(card, profileId) {
  const cardElement = createCard(card, cardTemplate, likeCard, showImgPopup, openDeletePopup, profileId);
  placesList.append(cardElement);
}

// Функция заполнения страницы карточками
function fillCards(initialCards, profileId) {
  initialCards.forEach((card) => addCard(card, profileId));
}

// Функция для отображения кнопки загрузки
const showLoadingBtn = (isLoading, button) => {
  button.textContent = isLoading ? "Сохранение..." : "Сохранить";
};

// Popup редактирования профиля
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

// Функция сохранения полей ввода формы
function fillPopupEditInputs() {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
}

// Функция редактирования профиля
function handleEditForm(evt) {
  evt.preventDefault();
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;
  showLoadingBtn(true, editSaveButton);
  editSaveButton.disabled = true;

  editProfile(nameValue, jobValue)
    .then((res) => {
      profileTitle.textContent = res.name;
      profileDescription.textContent = res.about;
      closePopup(editPopup);
    })
    .catch(console.error)
    .finally(() => showLoadingBtn(false, editSaveButton));
}

editForm.addEventListener("submit", handleEditForm);

// Popup добавления карточек
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

// Функция загрузки с сервера и добавления карточек на страницу
function handleAddForm(evt) {
  evt.preventDefault();
  const cardValue = cardInput.value;
  const linkValue = linkInput.value;
  showLoadingBtn(true, addSaveButton);
  addSaveButton.disabled = true;

  postNewCard(cardValue, linkValue)
    .then((card) => {
      addCard(card, profileId);
      closePopup(addCardPopup);
    })
    .catch(console.error)
    .finally(() => {
      addForm.reset();
      showLoadingBtn(false, addSaveButton);
    });
}

addForm.addEventListener("submit", handleAddForm);

// Popup увеличения картинок
const imgPopup = document.querySelector(".popup_type_image");
const closePhotoButton = imgPopup.querySelector(".popup__close");
const zoomedPopupImage = imgPopup.querySelector(".popup__image");
const imgPopupCaption = imgPopup.querySelector(".popup__caption");

closePhotoButton.addEventListener("click", () => closePopup(imgPopup));

// Функция показа Popup увеличения картинок
function showImgPopup(evt) {
  openPopup(imgPopup);
  zoomedPopupImage.src = evt.target.src;
  zoomedPopupImage.alt = evt.target.alt;
  imgPopupCaption.textContent = evt.target.alt;
}

// Popup редактирования аватара
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

// Функция смены аватара
function handleProfileForm(evt) {
  evt.preventDefault();
  const linkValue = profileLinkInput.value;
  showLoadingBtn(true, profileSaveButton);
  profileSaveButton.disabled = true;

  updateNewAvatar(linkValue)
    .then((res) => {
      profileImage.style.backgroundImage = `url('${res.avatar}')`;
      closePopup(profilePopup);
    })
    .catch(console.error)
    .finally(() => {
      profileForm.reset();
      showLoadingBtn(false, profileSaveButton);
    });
}

profileForm.addEventListener("submit", handleProfileForm);

// Popup удаления карточки с сервера
const deletePopup = document.querySelector(".popup_type_delete");
const closeDeleteButton = deletePopup.querySelector(".popup__close");
const deleteForm = document.querySelector('form[name="delete-card"]');

const openDeletePopup = () => openPopup(deletePopup);
const closeDeletePopup = () => closePopup(deletePopup);

closeDeleteButton.addEventListener("click", closeDeletePopup);

// Функция удаления карточки
function deleteThisCard({
  cardId,
  cardDeleteButton
}) {
  deleteMyCard(cardId)
    .then(() => {
      const deleteItem = cardDeleteButton.closest(".places__item");
      deleteItem.remove();
      closeDeletePopup();
    })
    .catch(console.error);
}

// Функция подтверждения удаления карточки
function handleDeleteForm(evt) {
  evt.preventDefault();
  deleteThisCard(getCardForDeletion());
}

deleteForm.addEventListener("submit", handleDeleteForm);

// Вызов функции получения информации о пользователе и карточках с сервера и заполнение ими страницы
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
  .catch(console.error);

// Валидация
enableValidation(validationConfig);