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
      const errorData = await response.json();
      const errorMessage = errorData.errors[0].message;
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessageElement = document.querySelector(
      ".password-invalid-feedback"
    );
    errorMessageElement.innerHTML = error.message || "Network error";
  }
};

export default login;
