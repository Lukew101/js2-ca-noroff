/**
 * Checks if form data is valid.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {boolean}
 */
const validateFormData = (name, email, password, confirmPassword) => {
  let isValid = true;
  const emailPattern = /^[a-z0-9._%+-]+@(noroff\.no|stud\.noroff\.no)$/i;

  // Name validation
  if (name === "") {
    displayErrorMessage("floatingName", "Name is required.");
    isValid = false;
  }

  // Email validation
  if (email === "") {
    displayErrorMessage("floatingEmail", "Email is required.");
    isValid = false;
  } else if (!emailPattern.test(email)) {
    displayErrorMessage("floatingEmail", "Please enter a valid Noroff email.");
    isValid = false;
  }

  // Password validation
  if (password === "") {
    displayErrorMessage("floatingPassword", "Password is required.");
    isValid = false;
  } else if (password.length < 8) {
    displayErrorMessage(
      "floatingPassword",
      "Password must be at least 8 characters."
    );
    isValid = false;
  }

  // Confirm password validation
  if (confirmPassword === "") {
    displayErrorMessage(
      "floatingConfirmPassword",
      "Please confirm your password."
    );
    isValid = false;
  } else if (confirmPassword !== password) {
    displayErrorMessage("floatingConfirmPassword", "Passwords do not match.");
    isValid = false;
  }

  if (!isValid) setTimeout(clearErrorMessages, 5000);

  return isValid;
};

export default validateFormData;

/**
 * Display an error message below a specified input field
 * @param {string} inputId - The ID of the input field
 * @param {string} message - The error message to display
 */
const displayErrorMessage = (inputId, message) => {
  const inputElement = document.getElementById(inputId);
  const errorElement = document.createElement("div");
  errorElement.className = "text-danger mt-1";
  errorElement.textContent = message;
  inputElement.parentElement.appendChild(errorElement);
};

const clearErrorMessages = () => {
  const errorMessages = document.querySelectorAll(".text-danger");
  errorMessages.forEach((element) => element.remove());
};
