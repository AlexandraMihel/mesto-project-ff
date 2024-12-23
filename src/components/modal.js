export const openPopup = (popup) => {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscapeKey);
  popup.addEventListener('click', handleOverlayAndCloseButtonClick);
};

export const closePopup = (popup) => {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscapeKey);
  popup.removeEventListener('click', handleOverlayAndCloseButtonClick);
};

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
