import buildPost from "../post/buildPost.mjs";

const user = JSON.parse(localStorage.getItem("profile"));
const FETCH_USER_POSTS_URL = `https://v2.api.noroff.dev/social/profiles/${user.name}/posts?_comments=true&_author=true`;

const fetchUsersPosts = async () => {
    try {
      const response = await fetch(
        FETCH_USER_POSTS_URL,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "X-Noroff-API-Key": "51c023ca-d672-4f25-b71a-0c5e1489b5f9",
          },
        }
      );
      const posts = await response.json();
      return posts.data;
    }
    catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  
  export const createPostsHTML = async () =>  {
    const profilePostsContainer = document.querySelector(".profile-posts-container");
    const posts = await fetchUsersPosts();
    profilePostsContainer.innerHTML = "";
    if (posts.length === 0) {
      profilePostsContainer.innerHTML = "<p>No posts available.</p>";
    }
    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("feed-post", "card", "w-100");
      buildPost(post, profilePostsContainer);
    });
  };
  