import {
  putLike,
  deleteLike
} from "./api.js";

export function likeCard(cardLikeButton, likeCounter, cardId) {
  const likeMethod = cardLikeButton.classList.contains("card__like-button_is-active") ?
    deleteLike :
    putLike;

  likeMethod(cardId)
    .then((updatedCard) => {
      cardLikeButton.classList.toggle("card__like-button_is-active");
      likeCounter.textContent = updatedCard.likes.length;
    })
    .catch((error) => {
      console.error("Error updating like:", error);
    });
}

export function createCard(card, cardTemplate, likeCard, showImgPopup, openDeletePopup, profileId) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-count");
  const cardId = card._id;

  // Установка данных
  cardImage.src = card.link;
  cardImage.alt = card.name;
  cardTitle.textContent = card.name;
  likeCounter.textContent = card.likes.length;

  // Проверка лайка
  if (card.likes.some(like => like._id === profileId)) {
    cardLikeButton.classList.add("card__like-button_is-active");
  }

  // Обработчик лайка
  cardLikeButton.addEventListener("click", () => likeCard(cardLikeButton, likeCounter, cardId));

  // Открытие попапа с изображением
  cardImage.addEventListener("click", showImgPopup);

  // Проверка на авторство карточки и удаление
  if (card.owner._id !== profileId) {
    cardDeleteButton.classList.add("card__delete-button-unactive");
  } else {
    cardDeleteButton.addEventListener("click", () => openDeletePopup(cardId, cardDeleteButton));
  }

  return cardElement;
}

export function getCardForDeletion(cardId, cardDeleteButton) {
  return {
    cardId,
    cardDeleteButton
  };
}