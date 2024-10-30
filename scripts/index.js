// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM-узлы
const cardContainer = document.querySelector('.places__list');

// Функция создания карточки
function createCard(cardData, cardDelete) {
  // Клонируем содержимое шаблона
  const cardElement = cardTemplate.cloneNode(true);
  
  // Устанавливаем значения для карточки
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Добавляем обработчик для кнопки удаления
  deleteButton.addEventListener('click', cardDelete);
  
  return cardElement;
}

// Функция для удаления карточки
function cardDelete(evt) {
  evt.target.closest('.card').remove();
}

// Выводим карточки на страницу
initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, cardDelete);
  cardContainer.append(cardElement);
});
