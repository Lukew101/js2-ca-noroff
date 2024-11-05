// document
//   .querySelector("#loginForm")
//   .addEventListener("submit", function (event) {
//     event.preventDefault();
//     if (this.checkValidity()) {
//       window.location.href = "/profile/index.html";
//     }
//   });

document
  .querySelector("#registerButton")
  .addEventListener("click", function () {
    window.location.href = "/src/signup";
  });
