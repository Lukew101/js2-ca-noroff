import { getPosts } from "./fetchPosts.mjs";
import { createPost } from "./createPost.mjs";

const createPostForm = document.querySelector("#createPostForm");

createPostForm.addEventListener("submit", (event) => {
  createPost(event);
});

getPosts();
