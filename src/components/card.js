// Функция создания карточки
export const createCard = (
  cardData,
  {
    cardTemplate,
    handleLikeCard,
    handleDeleteCard,
    handleImageClick 
  }
) => {
  // Клонируем шаблон
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  // Находим элементы карточки
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeButton = cardElement.querySelector('.card__like-button');

  // Заполняем данные
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Добавляем слушатели событий
  cardDeleteButton.addEventListener('click', () => handleDeleteCard(cardElement));
  cardLikeButton.addEventListener('click', () => handleLikeCard(cardLikeButton));
  cardImage.addEventListener('click', () => handleImageClick(cardData));

  // Возвращаем готовую карточку
  return cardElement;
};

// Обработчики
export const handleLikeCard = (button) => button.classList.toggle('card__like-button_is-active');

export const handleDeleteCard = (card) => card.remove();