import { getPosts } from "./fetchPosts.mjs";
import { createPost } from "./createPost.mjs";

const user = JSON.parse(localStorage.getItem("profile"));
const createPostForm = document.querySelector("#createPostForm");

document.title = `${user.name}'s Feed | Weave`;

createPostForm.addEventListener("submit", (event) => {
  createPost(event);
});

getPosts();
