export const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-29",
  headers: {
    authorization: "69509e42-1ed2-4c50-b6c2-e1d5c047291a",
    "Content-Type": "application/json",
  },
};

const checkResponse = (res) => {
  if (res.ok) return res.json();
  return Promise.reject(`Error: ${res.status}`);
};

// Универсальная функция для отправки запросов
const sendRequest = async (url, method = "GET", body = null) => {
  const options = {
    method,
    headers: config.headers,
    ...(body && {
      body: JSON.stringify(body)
    }),
  };

  try {
    const res = await fetch(url, options);
    return checkResponse(res);
  } catch (err) {
    return Promise.reject(`Request failed: ${err}`);
  }
};

// Загрузка информации о пользователе с сервера
export const getUserInfo = () => sendRequest(`${config.baseUrl}/users/me`);

// Загрузка карточек с сервера
export const getInitialCards = () => sendRequest(`${config.baseUrl}/cards`);

// Загрузка информации о пользователе и карточках
export const getInitialInfo = () => Promise.all([getUserInfo(), getInitialCards()]);

// Редактирование профайла
export const editProfile = (userProfileName, userProfileAbout) => {
  return sendRequest(`${config.baseUrl}/users/me`, "PATCH", {
    name: userProfileName,
    about: userProfileAbout,
  });
};

// Добавление новой карточки на сервер
export const postNewCard = (nameCard, linkCard) => {
  return sendRequest(`${config.baseUrl}/cards`, "POST", {
    name: nameCard,
    link: linkCard,
  });
};

// Лайк карточки
export const putLike = (cardId) => sendRequest(`${config.baseUrl}/cards/likes/${cardId}`, "PUT");

// Удаление лайка с карточки
export const deleteLike = (cardId) => sendRequest(`${config.baseUrl}/cards/likes/${cardId}`, "DELETE");

// Удаление карточки
export const deleteMyCard = (cardId) => sendRequest(`${config.baseUrl}/cards/${cardId}`, "DELETE");

// Обновление аватара
export const updateNewAvatar = (avatarLink) => {
  return sendRequest(`${config.baseUrl}/users/me/avatar`, "PATCH", {
    avatar: avatarLink
  });
};