import buildPost from "../post/buildPost.mjs";

export const displayPosts = (posts) => {
  const feedContainer = document.querySelector(".posts-feed");
  feedContainer.innerHTML = "";

  posts.forEach((post) => {
    buildPost(post, feedContainer);
  });
};
