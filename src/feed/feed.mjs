import createPost from "../post/http-requests/createPost.mjs";
import { observer } from "./handleFeedPosts.mjs";

const user = JSON.parse(localStorage.getItem("profile"));
const createPostForm = document.querySelector("#createPostForm");
const sentinel = document.getElementById("sentinel");
const postsContainer = document.querySelector(".posts-feed");

document.title = `${user.name}'s Feed | Weave`;

createPostForm.addEventListener("submit", (event) => {
  createPost(event, postsContainer);
});

observer.observe(sentinel);
