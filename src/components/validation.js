// Функция отображения ошибки 
const showError = (form, input, message, config) => { 
  const errorElement = form.querySelector(`.${input.id}-error`); 
  input.classList.add(config.inputErrorClass); 
  errorElement.textContent = message; 
  errorElement.classList.add(config.errorClass); 
}; 
 
// Функция скрытия ошибки 
const hideError = (form, input, config) => { 
  const errorElement = form.querySelector(`.${input.id}-error`); 
  input.classList.remove(config.inputErrorClass); 
  errorElement.classList.remove(config.errorClass); 
  errorElement.textContent = ''; 
}; 
 
// Проверка на валидность поля 
const checkFieldValidity = (form, input, config) => { 
  let errorMessage = input.validationMessage; 
 
  if (input.validity.patternMismatch) { 
    errorMessage = input.dataset.errorMessage || 'Недопустимый формат ввода'; 
  } 
 
  if (!input.validity.valid) { 
    showError(form, input, errorMessage, config); 
  } else { 
    hideError(form, input, config); 
  } 
}; 
 
// Проверка состояния кнопки отправки 
const toggleSubmitButton = (inputs, button, config) => { 
  const hasErrors = inputs.some((input) => !input.validity.valid); 
 
  button.disabled = hasErrors; 
  button.classList.toggle(config.inactiveButtonClass, hasErrors); 
}; 
 
// Установка обработчиков событий на поля формы 
const addFieldListeners = (form, config) => { 
  const inputs = Array.from(form.querySelectorAll(config.inputSelector)); 
  const submitButton = form.querySelector(config.submitButtonSelector); 
 
  inputs.forEach((input) => { 
    input.addEventListener('input', () => { 
      checkFieldValidity(form, input, config); 
      toggleSubmitButton(inputs, submitButton, config); 
    }); 
  }); 
 
  toggleSubmitButton(inputs, submitButton, config); 
}; 
 
// Функция включения валидации 
const enableValidation = (config) => { 
  const forms = Array.from(document.querySelectorAll(config.formSelector)); 
 
  forms.forEach((form) => { 
    addFieldListeners(form, config); 
  }); 
}; 
 
// Функция очистки валидации 
const clearValidation = (form, config) => { 
  const inputs = Array.from(form.querySelectorAll(config.inputSelector)); 
  const submitButton = form.querySelector(config.submitButtonSelector); 
 
  inputs.forEach((input) => { 
    hideError(form, input, config); 
  }); 
 
  toggleSubmitButton(inputs, submitButton, config); 
}; 
 
export { 
  enableValidation, 
  clearValidation 
};
