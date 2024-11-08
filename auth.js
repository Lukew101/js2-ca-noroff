import login from "./src/util/forms/login.mjs";

const loginForm = document.querySelector("#loginForm");

const handleLoggedInUser = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  if (user) {
    window.location.href = "/src/feed";
  }
};

document.addEventListener("DOMContentLoaded", function () {
  loginForm.addEventListener("submit", function (event) {
    const email = document.querySelector("#floatingEmail").value.trim();
    const password = document.querySelector("#floatingPassword").value;

    const isFormValid = loginForm.checkValidity();

    if (!isFormValid) {
      event.preventDefault();
    } else {
      const requestData = { email, password };
      login(requestData);
      event.preventDefault();
    }
  });
});

document
  .querySelector("#registerButton")
  .addEventListener("click", function () {
    window.location.href = "/src/signup";
  });

handleLoggedInUser();
