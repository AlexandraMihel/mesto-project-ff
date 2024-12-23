import {
  addLike,
  removeLike,
  deleteCard
} from './api.js';

export const createCard = (
  cardData, {
    cardTemplate,
    handleLikeCard,
    handleDeleteCard,
    handleImageClick,
    userId
  }
) => {
  if (!cardData._id || !cardData.name || !cardData.link) {
    return;
  }

  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeButton = cardElement.querySelector('.card__like-button');
  const cardLikeCounter = cardElement.querySelector('.card__like-counter');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  cardLikeCounter.textContent = (cardData.likes || []).length;

  // Проверяем, принадлежит ли карточка текущему пользователю
  if (cardData.owner._id === userId) {
    cardDeleteButton.classList.remove('card__delete-button_disabled');
    cardDeleteButton.style.display = 'block';
    cardDeleteButton.addEventListener('click', () => handleDeleteCard(cardElement, cardData));
  } else {
    cardDeleteButton.classList.add('card__delete-button_disabled');
    cardDeleteButton.style.display = 'none';
  }

  cardLikeButton.addEventListener('click', () => handleLikeCard(cardData._id, cardLikeButton));

  cardImage.addEventListener('click', () => handleImageClick(cardData));

  return cardElement;
};


// Обработчик лайка карточки
export function handleLikeCard(cardId, likeButton) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const likePromise = isLiked ? removeLike(cardId) : addLike(cardId);

  likePromise
    .then((updatedCard) => {
      likeButton.classList.toggle('card__like-button_is-active', !isLiked);
      const likeCounter = likeButton.nextElementSibling;
      likeCounter.textContent = updatedCard.likes.length;
    })
    .catch((err) => console.error('Ошибка при обновлении лайка:', err));
}

// Обработчик для удаления карточки
export const handleDeleteCard = (cardElement, cardData) => {
  deleteCard(cardData._id)
    .then(() => {
      cardElement.remove();
    })
    .catch(err => console.error('Ошибка при удалении карточки:', err));
};