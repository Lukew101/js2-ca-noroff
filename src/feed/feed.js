import { createPostInnerHTML, createPostModalHTML } from "./post.mjs";

let posts = [];

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
      posts = responseData.data; 
      displayPosts(responseData.data);
    } 
  } catch (error) {
    console.error("Network error:", error);
  }
};

getPosts();

const getPost = async (fetchURL) => {
  try {
    const response = await fetch(
      fetchURL,
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
  const feedContainer = document.querySelector(".posts-feed");
  feedContainer.innerHTML = "";

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
        const POST_WITH_COMMENTS_URL = `https://v2.api.noroff.dev/social/posts/${postId}?_comments=true&_author=true`;
        
        const postWithComments = await getPost(POST_WITH_COMMENTS_URL);
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

const sortPosts = (sortBy) => {
  const sortedPosts = [...posts];
  switch (sortBy) {
    case "Most popular":
       sortedPosts.sort((a, b) => b._count.reactions - a._count.reactions);
      break;
    case "Newest":
      sortedPosts.sort((a, b) => new Date(b.created) - new Date(a.created));
      break;
    case "Oldest":
      sortedPosts.sort((a, b) => new Date(a.created) - new Date(b.created));
      break;
  }
  displayPosts(sortedPosts);
};

document.querySelector(".form-select").addEventListener("change", (event) => {
  sortPosts(event.target.value);
});

const searchInput = document.querySelector('.form-control[type="search"]');
const feedSearchForm = document.querySelector('.feed-search-form');

const filterPosts = (query) => {
  const filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(query.toLowerCase()));
  displayPosts(filteredPosts);
};

feedSearchForm.addEventListener("submit", (event) => {
  event.preventDefault(); 
  const query = searchInput.value.trim();
  if (query) {
    filterPosts(query);
  } else {
    displayPosts(posts); 
  }
});

searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") {
    displayPosts(posts);
  }
});