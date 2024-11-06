import { validateSignupFormData } from "../util/forms/formValidation.mjs";
import login from "../util/forms/login.mjs";

const API_AUTH_URL = "https://v2.api.noroff.dev/auth";
const API_REGISTER_URL = `${API_AUTH_URL}/register`;

const signupForm = document.querySelector("#signupForm");

document.addEventListener("DOMContentLoaded", function () {
  signupForm.addEventListener("submit", function (event) {
    const name = document.querySelector("#floatingName").value.trim();
    const email = document.querySelector("#floatingEmail").value.trim();
    const password = document.querySelector("#floatingPassword").value;
    const confirmPassword = document.querySelector("#floatingConfirmPassword").value;

    const isFormValid = signupForm.checkValidity();
    const isCustomValidationValid = validateSignupFormData(name, email, password, confirmPassword);

    if (!isFormValid || !isCustomValidationValid) {
      event.preventDefault(); 
    } else {
      const requestData = { name, email, password };
      registerUser(requestData);
      event.preventDefault(); 
    }
  });
});

const registerUser = async (requestData) => {
  try {
    const { name, email, password } = requestData; 
    const response = await fetch(API_REGISTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    if (response.ok) {
      const loginRequestData = { email, password };
      login(loginRequestData);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.errors[0].message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};
