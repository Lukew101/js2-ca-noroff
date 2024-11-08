const getPost = async (fetchURL) => {
  try {
    const response = await fetch(fetchURL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": "51c023ca-d672-4f25-b71a-0c5e1489b5f9",
      },
    });
    if (response.ok) {
      const responseData = await response.json();
      const postWithComments = responseData.data;
      return postWithComments;
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

export { getPost };
