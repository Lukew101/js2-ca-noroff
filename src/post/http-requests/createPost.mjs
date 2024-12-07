import buildPost from "../buildPost.mjs";
import { posts } from "../../feed/handleFeedPosts.mjs";

const createPostForm = document.querySelector("#createPostForm");

const createPost = async (event) => {
  event.preventDefault();
  const title = document.querySelector("#postTitle").value;
  const body = document.querySelector("#postContent").value;
  const imageUrl = document.querySelector("#postImageUrl").value;
  const imageAlt = document.querySelector("#postImageAlt").value;
  const CREATE_POST_URL = "https://v2.api.noroff.dev/social/posts?_author=true";

  try {
    let requestData;
    let media;
    if ((imageUrl && !imageAlt) || (!imageUrl && imageAlt)) {
      throw new Error("Must provide image url & description together");
    } else {
      media = { url: imageUrl, alt: imageAlt };
    }
    imageUrl && imageAlt ? (requestData = { title, body, media }) : (requestData = { title, body });
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
      const data = await response.json();
      const post = data.data;
      posts.unshift(post);
      const postElement = buildPost(post);
      return postElement;
    }
  } catch (error) {
    const wrapperContainer = document.querySelector(".create-post-inputs-wrapper");
    const errorElement = document.createElement("p");
    errorElement.innerHTML = error.message;
    errorElement.classList.add("error-message", "alert", "alert-danger");
    wrapperContainer.appendChild(errorElement);

    setTimeout(() => {
      wrapperContainer.removeChild(errorElement);
    }, 6000);
  }
};

export default createPost;
