export const openPopup = (popup) => {
  // Добавляем класс, который делает модальное окно видимым
  popup.classList.add('popup_is-opened');

  // Добавляем обработчик для закрытия окна при нажатии клавиши Escape
  document.addEventListener('keydown', handleEscapeKey);

  // Добавляем обработчик клика на модальное окно
  popup.addEventListener('click', handleOverlayAndCloseButtonClick);
};

export const closePopup = (popup) => {
  // Удаляем класс
  popup.classList.remove('popup_is-opened');

  // Убираем обработчик нажатия клавиши Escape
  document.removeEventListener('keydown', handleEscapeKey);

  // Убираем обработчик клика на оверлей и кнопку закрытия
  popup.removeEventListener('click', handleOverlayAndCloseButtonClick);
};

// Обработчик для закрытия окна при нажатии на клавишу Escape
const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) closePopup(openedPopup);
  }
};

const handleOverlayAndCloseButtonClick = (event) => {
  if (
    event.target.classList.contains('popup') || // клик по оверлею
    event.target.classList.contains('popup__close') // клик по кнопке закрытия
  ) {
    closePopup(event.currentTarget);
  }
};
