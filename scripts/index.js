// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM-узлы
const cardContainer = document.querySelector('.places__list');

// Функция создания карточки
function createCard(cardData, deleteHandler) {
  // Клонируем конкретный элемент разметки
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  
  // Устанавливаем значения для карточки
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', () => deleteHandler(cardElement));
  
  return cardElement;
}

// Функция для удаления карточки
function deleteCard(card) { 
  card.remove(); 
}

// Выводим карточки на страницу
initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, deleteCard);
  cardContainer.append(cardElement);
});
