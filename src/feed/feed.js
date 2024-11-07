import { createPostInnerHTML, createPostModalHTML } from "./post.mjs";

const getPosts = async () => {
  try {
    const response = await fetch(
      "https://v2.api.noroff.dev/social/posts?limit=50&_author=true",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "X-Noroff-API-Key": "51c023ca-d672-4f25-b71a-0c5e1489b5f9",
        },
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      displayPosts(responseData.data);
    } 
  } catch (error) {
    console.error("Network error:", error);
  }
};

const getPost = async (postId) => {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/social/posts/${postId}?_comments=true&_author=true`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "X-Noroff-API-Key": "51c023ca-d672-4f25-b71a-0c5e1489b5f9",
        },
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      const postWithComments = responseData.data;
      return postWithComments;
    } 
  } catch (error) {
    console.error("Network error:", error);
  }
}

const displayPosts = (posts) => {
  const feedContainer = document.querySelector(".feed-container");
  posts.forEach((post) => {
    const feedPost = document.createElement("div");
    feedPost.classList.add("feed-post", "card", "w-100");

    createPostInnerHTML(feedPost, post);
    feedContainer.appendChild(feedPost);
    const postComments = feedPost.querySelectorAll(".post-comments");
    postComments.forEach((postComment) => {
      postComment.addEventListener("click", async (event) => {
        postComment.dataset.postId = post.id;
        const postId = event.currentTarget.dataset.postId;
        const postWithComments = await getPost(postId);
        const modalHTML = createPostModalHTML(postWithComments);

        let existingModal = document.querySelector('#dynamicPostModal');
        if (existingModal) {
          existingModal.remove();
        }
        document.body.insertAdjacentHTML("beforeend", modalHTML);
        const dynamicModal = new bootstrap.Modal(document.querySelector('#dynamicPostModal'));
        dynamicModal.show();
      });
    });
  });
};

getPosts();
