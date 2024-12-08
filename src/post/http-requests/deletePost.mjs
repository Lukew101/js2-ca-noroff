import { posts } from "../../feed/handleFeedPosts.mjs";

const deletePost = async (postId, editModal) => {
  const DELETE_POST_URL = `https://v2.api.noroff.dev/social/posts/${postId}`;

  try {
    const response = await fetch(DELETE_POST_URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": "51c023ca-d672-4f25-b71a-0c5e1489b5f9",
      },
    });
    if (response.ok) {
      const post = document.getElementById(postId);
      if (posts) {
        const postIndex = posts.findIndex((post) => post.id === postId);
        if (postIndex !== -1) {
          posts.splice(postIndex, 1);
        }
      }
      post.remove();
      editModal.hide();
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

export default deletePost;
