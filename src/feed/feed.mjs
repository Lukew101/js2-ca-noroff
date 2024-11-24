import { createPost } from "./createPost.mjs";
import { observer } from "./fetchPosts.mjs";

const user = JSON.parse(localStorage.getItem("profile"));
const createPostForm = document.querySelector("#createPostForm");
const sentinel = document.getElementById('sentinel');

document.title = `${user.name}'s Feed | Weave`;

createPostForm.addEventListener("submit", (event) => {
  createPost(event);
});

observer.observe(sentinel);