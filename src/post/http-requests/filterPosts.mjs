const filterPosts = async (query, page = 1) => {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/social/posts/search?q=${query}&limit=20&page=${page}&_author=true`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "X-Noroff-API-Key": "51c023ca-d672-4f25-b71a-0c5e1489b5f9",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      const filteredPosts = data.data;
      return filteredPosts;
    } else {
      throw new Error("Could not fetch posts.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default filterPosts;
