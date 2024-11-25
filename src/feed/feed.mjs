import createPost from "../post/http-requests/createPost.mjs";
import { observer } from "../post/fetchPosts.mjs";

const user = JSON.parse(localStorage.getItem("profile"));
const createPostForm = document.querySelector("#createPostForm");
const sentinel = document.getElementById("sentinel");

document.title = `${user.name}'s Feed | Weave`;

createPostForm.addEventListener("submit", (event) => {
  createPost(event);
});

observer.observe(sentinel);
