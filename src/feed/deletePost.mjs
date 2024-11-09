import { getPosts } from "./fetchPosts.mjs";

const deletePost = async (postId, editModal) => {
  const CREATE_POST_URL = `https://v2.api.noroff.dev/social/posts/${postId}`;

  try {
    const response = await fetch(CREATE_POST_URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": "51c023ca-d672-4f25-b71a-0c5e1489b5f9",
      },
    });
    if (response.ok) {
      getPosts();
      editModal.hide();
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

export { deletePost };