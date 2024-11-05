import validateFormData from "../signup/validateSignupForm.mjs";

const signupForm = document.querySelector("#signupForm");

document.addEventListener("DOMContentLoaded", function () {
  signupForm.addEventListener("submit", function (event) {
    const name = document.querySelector("#floatingName").value.trim();
    const email = document.querySelector("#floatingEmail").value.trim();
    const password = document.querySelector("#floatingPassword").value;
    const confirmPassword = document.querySelector("#floatingConfirmPassword").value;

    const isFormValid = signupForm.checkValidity();
    const isCustomValidationValid = validateFormData(name, email, password, confirmPassword);

    if (!isFormValid || !isCustomValidationValid) {
      event.preventDefault(); 
    } else {
      const requestData = { name, email, password };
      // registerUser(requestData);
      event.preventDefault(); 
    }
  });
});

const registerUser = async (requestData) => {
  try {
    const response = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    if (response.ok) {
      console.log("User registered successfully");
      signupForm.reset();
    } else {
      const errorData = await response.json();
      console.log("Error:", errorData.message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};
