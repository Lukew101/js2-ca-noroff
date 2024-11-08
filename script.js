const isUserLoggedIn = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken !== null;
};

const handleLoggedInUser = () => {
  const isLoggedIn = isUserLoggedIn();
  if (isLoggedIn) {
    displayProfilePicture();

    const signOut = displaySignout();
    signOut.addEventListener("click", function () {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("profile");
    });
  } else {
    document.location.href = "/";
  }
};

handleLoggedInUser();

function displayProfilePicture() {
  const profilePicture = document.querySelectorAll(".profile-pic");
  const profile = JSON.parse(localStorage.getItem("profile"));
  profilePicture.forEach((pic) => {
    pic.src = profile.avatar.url;
    pic.alt = profile.avatar.alt;
  });
}

function displaySignout() {
  const navbar = document.querySelector(".navbar-nav");
  const signOut = document.createElement("a");
  signOut.classList.add("nav-link", "signout-nav-link", "fs-5");
  signOut.innerHTML = "Sign out";
  signOut.href = "/";
  navbar.appendChild(signOut);
  return signOut;
}
