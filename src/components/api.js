const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-29',
  headers: {
    authorization: '69509e42-1ed2-4c50-b6c2-e1d5c047291a',
    'Content-Type': 'application/json'
  }
};

// Запрос данных о пользователе
export function loadUserInfo() {
  return fetch(`${config.baseUrl}/users/me`, {
      headers: config.headers
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Ошибка при запросе данных пользователя: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      return data;
    })
    .catch((error) => {
      console.error('Ошибка при загрузке данных о пользователе:', error);
      throw error;
    });
}

// Запрос карточек
export function loadCards() {
  return fetch(`${config.baseUrl}/cards`, {
      headers: config.headers
    })
    .then(res => res.json())
    .catch((error) => {
      console.error('Ошибка при загрузке карточек:', error);
    });
}


// Функция для отправки данных на сервер для создания карточки
export function createCardOnServer(cardData) {
  return fetch(`${config.baseUrl}/cards`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify(cardData),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Ошибка при создании карточки');
      }
      return res.json();
    })
    .catch((error) => {
      console.error('Ошибка при запросе создания карточки:', error);
    });
}


// Удаление карточки
export function deleteCard(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: config.headers
    })
    .then(res => res.json())
    .catch((error) => {
      console.error('Ошибка при удалении карточки:', error);
    });
}

// Добавить лайк
export function addLike(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: config.headers
    })
    .then(res => res.json()) 
    .catch((error) => {
      console.error('Ошибка при добавлении лайка:', error);
    });
}

// Удалить лайк
export function removeLike(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: config.headers
    })
    .then(res => res.json()) 
    .catch((error) => {
      console.error('Ошибка при удалении лайка:', error);
    });
}

// Обновление аватара пользователя
export function updateAvatar(avatarUrl) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({
        avatar: avatarUrl
      })
    })
    .then(res => res.json())
    .catch((error) => {
      console.error('Ошибка при обновлении аватара:', error);
    });
}

// Обновление данных профиля
export function updateUserProfile({
  name,
  about
}) {
  return fetch(`${config.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Ошибка при обновлении профиля');
      }
      return res.json();
    })
    .catch((error) => {
      console.error('Ошибка при обновлении профиля:', error);
      throw error;
    });
}