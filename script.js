const isUserLoggedIn = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken !== null;
};

const handleLoggedInUser = () => {
  const isLoggedIn = isUserLoggedIn();
  if (isLoggedIn) {
    const navbar = document.querySelector(".navbar-nav");
    const signOut = document.createElement("a");
    signOut.classList.add("nav-link");
    signOut.classList.add("signout-nav-link");
    signOut.classList.add("fs-5");
    signOut.innerHTML = "Sign out";
    signOut.href = "/";
    navbar.appendChild(signOut);
    signOut.addEventListener("click", function () {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("profile");
    });
  } else {
    document.location.href = "/";
  }
};

handleLoggedInUser();