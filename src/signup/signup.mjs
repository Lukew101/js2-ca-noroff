import { validateSignupFormData } from "../util/forms/formValidation.mjs";
import login from "../util/forms/login.mjs";

const API_REGISTER_URL = "https://v2.api.noroff.dev/auth/register";

const signupForm = document.querySelector("#signupForm");

document.addEventListener("DOMContentLoaded", function () {
  signupForm.addEventListener("submit", function (event) {
    const name = document.querySelector("#floatingName").value.trim();
    const email = document.querySelector("#floatingEmail").value.trim();
    const password = document.querySelector("#floatingPassword").value;
    const confirmPassword = document.querySelector(
      "#floatingConfirmPassword"
    ).value;

    const isFormValid = signupForm.checkValidity();
    const isCustomValidationValid = validateSignupFormData(
      name,
      email,
      password,
      confirmPassword
    );

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
      const errorResponseDisplay = document.querySelector(
        ".error-response-display"
      );
      const errorData = await response.json();
      errorResponseDisplay.innerHTML = errorData.errors[0].message;
      errorResponseDisplay.classList.add("alert", "alert-danger");

      setTimeout(() => {
        errorResponseDisplay.innerHTML = "";
        errorResponseDisplay.classList.remove("alert", "alert-danger");
      }, 6000);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};
