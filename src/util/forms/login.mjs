const API_AUTH_URL = "https://v2.api.noroff.dev/auth";
const API_LOGIN_URL = `${API_AUTH_URL}/login`;

const saveToLocalStorage = (key, tokenValue) => {
  localStorage.setItem(key, tokenValue);
};

const login = async (requestData) => {
  try {
    const response = await fetch(API_LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    if (response.ok) {
      const responseData = await response.json();
      const { accessToken, ...profile } = responseData.data;
      saveToLocalStorage("accessToken", accessToken);
      saveToLocalStorage("profile", JSON.stringify(profile));
      window.location.href = "/src/feed/";
    } else {
      const errorResponseDisplay = document.querySelector(".error-response-display");
      const errorData = await response.json();
      errorResponseDisplay.innerHTML = errorData.errors[0].message;
      errorResponseDisplay.classList.add("alert", "alert-danger");

      setTimeout(() => {
        errorResponseDisplay.innerHTML = "";
        errorResponseDisplay.classList.remove("alert", "alert-danger");
      }, 5000);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

export default login;
