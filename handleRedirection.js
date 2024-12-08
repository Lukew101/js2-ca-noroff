const handleRedirectionIfLoggedIn = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  if (user) {
    window.location.href = "/src/feed";
  }
};

handleRedirectionIfLoggedIn();
