import {
  putLike,
  deleteLike
} from "./api.js";

let currentCardId, currentDeleteButton;

export function likeCard(likeButton, likeCounter, cardId) {
  const likeMethod = likeButton.classList.contains("card__like-button_is-active") ?
    deleteLike :
    putLike;

  likeMethod(cardId)
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like-button_is-active");
      likeCounter.textContent = updatedCard.likes.length;
    })
    .catch(console.log); // Упростил обработку ошибки
}

export function createCard(
  card,
  cardTemplate,
  likeCard,
  showImgPopup,
  openDeletePopup,
  profileId
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-count");
  const cardId = card._id;

  // Установка атрибутов карточки
  cardImage.src = card.link;
  cardImage.alt = card.name;
  cardTitle.textContent = card.name;
  likeCounter.textContent = card.likes.length;

  // Установка состояния кнопки лайка
  if (card.likes.some((like) => like._id === profileId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  likeButton.addEventListener("click", () => likeCard(likeButton, likeCounter, cardId));

  cardImage.addEventListener("click", showImgPopup);

  // Проверка авторства карточки
  if (card.owner._id === profileId) {
    deleteButton.addEventListener("click", () => {
      currentCardId = cardId;
      currentDeleteButton = deleteButton;
      openDeletePopup();
    });
  } else {
    deleteButton.classList.add("card__delete-button-unactive");
  }

  return cardElement;
}

export function getCardForDeletion() {
  return {
    cardId: currentCardId,
    deleteButton: currentDeleteButton
  };
}