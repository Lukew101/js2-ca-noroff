/**
 * Display an error message below a specified input field
 * @param {string} inputId - The ID of the input field
 * @param {string} message - The error message to display
 */
const setValidationState = (inputId, isValid) => {
  const inputElement = document.querySelector(inputId);
  if (isValid) {
    inputElement.classList.remove("is-invalid");
  } else {
    inputElement.classList.add("is-invalid");
  }
};

export default setValidationState;
