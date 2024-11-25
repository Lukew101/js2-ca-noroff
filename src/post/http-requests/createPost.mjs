import { fetchFeedPosts } from "../../feed/handleFeedPosts.mjs";

const createPostForm = document.querySelector("#createPostForm");

const createPost = async (event) => {
  event.preventDefault();
  const title = document.querySelector("#postTitle").value;
  const body = document.querySelector("#postContent").value;
  const CREATE_POST_URL = "https://v2.api.noroff.dev/social/posts";

  try {
    const requestData = { title, body };
    const response = await fetch(CREATE_POST_URL, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": "51c023ca-d672-4f25-b71a-0c5e1489b5f9",
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      createPostForm.reset();
      fetchFeedPosts(1, true);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

export default createPost;
