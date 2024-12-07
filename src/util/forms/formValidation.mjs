import setValidationState from "./setValidationState.mjs";

const validateName = (name) => {
  const namePattern = /^[a-zA-Z0-9_]+$/;

  if (name === "" || !namePattern.test(name) || name.length > 20) {
    setValidationState("#floatingName", false);
    return false;
  } else {
    setValidationState("#floatingName", true);
    return true;
  }
};

const validateEmail = (email) => {
  const emailPattern = /^[a-z0-9._%+-]+@(noroff\.no|stud\.noroff\.no)$/i;

  if (email === "" || !emailPattern.test(email)) {
    setValidationState("#floatingEmail", false);
    return false;
  } else {
    setValidationState("#floatingEmail", true);
    return true;
  }
};

const validatePassword = (password) => {
  if (password === "" || password.length < 8) {
    setValidationState("#floatingPassword", false);
    return false;
  } else {
    setValidationState("#floatingPassword", true);
    return true;
  }
};

const validateConfirmPassword = (password, confirmPassword) => {
  if (confirmPassword === "" || confirmPassword !== password) {
    setValidationState("#floatingConfirmPassword", false);
    return false;
  } else {
    setValidationState("#floatingConfirmPassword", true);
    return true;
  }
};

/**
 * Checks if signup form data is valid.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {boolean}
 */
export const validateSignupFormData = (
  name,
  email,
  password,
  confirmPassword
) => {
  let isValid = true;

  if (!validateName(name)) isValid = false;
  if (!validateEmail(email)) isValid = false;
  if (!validatePassword(password)) isValid = false;
  if (!validateConfirmPassword(password, confirmPassword)) isValid = false;

  return isValid;
};
