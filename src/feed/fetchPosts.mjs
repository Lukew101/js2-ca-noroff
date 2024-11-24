import { createPostInnerHTML, createPostModalHTML } from "./post.mjs";
import { getPost } from "./fetchPost.mjs";

const searchInput = document.querySelector('.form-control[type="search"]');
const feedSearchForm = document.querySelector(".feed-search-form");

let posts = [];
let activeFilteredPosts = [];

let currentPage = 1;
let isSearching = false;
let isFetching = false;
let searchPerformed = false;
let queryValue = "";
let sortByValue = "";

export const getPosts = async (
  page = 1,
  clearDisplayedPosts = false
) => {
  const feedContainer = document.querySelector(".posts-feed");
  const loadingSpinner = document.createElement("div");
  loadingSpinner.classList.add("spinner-grow");
  loadingSpinner.setAttribute("role", "status");

  const showLoading = () => feedContainer.appendChild(loadingSpinner);
  const hideLoading = () => loadingSpinner.remove();

  try {
    showLoading();
    const response = await fetch(
      `https://v2.api.noroff.dev/social/posts?limit=20&page=${page}&_author=true`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "X-Noroff-API-Key": "51c023ca-d672-4f25-b71a-0c5e1489b5f9",
        },
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      if (responseData.data.length === 0) {
        throw new Error("No more posts to fetch");
      }

      if (clearDisplayedPosts) {
        activeFilteredPosts = [];
        posts = [...responseData.data];
      } else {
        posts = [...posts, ...responseData.data];
      }

      if (activeFilteredPosts && activeFilteredPosts.length > 0) {
        activeFilteredPosts = [...activeFilteredPosts, ...responseData.data];
        sortPosts(sortByValue);
        filterPosts(queryValue);
        displayPosts(activeFilteredPosts);
      } else {
        displayPosts(posts);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    hideLoading();
  }
};

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

        let existingModal = document.querySelector("#dynamicPostModal");
        if (existingModal) {
          existingModal.remove();
        }
        document.body.insertAdjacentHTML("beforeend", modalHTML);
        const dynamicModal = new bootstrap.Modal(
          document.querySelector("#dynamicPostModal")
        );
        dynamicModal.show();
      });
    });
  });
};

const sortPosts = (sortBy) => {
  const sourcePosts =
  searchPerformed && activeFilteredPosts.length === 0 && queryValue ? [] : (activeFilteredPosts.length > 0 ? activeFilteredPosts : posts);
  const sortedPosts = [...sourcePosts];

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
  activeFilteredPosts = sortedPosts;
};

if (document.querySelector(".form-select")) {
  document.querySelector(".form-select").addEventListener("change", (event) => {
    sortByValue = event.target.value;
    sortPosts(sortByValue);
  });
}

const filterPosts = (query) => {
  searchPerformed = true;
  const sourcePosts =
    activeFilteredPosts.length > 0 ? activeFilteredPosts : posts;
  activeFilteredPosts = sourcePosts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  );
  displayPosts(activeFilteredPosts);
};

if (feedSearchForm) {
  feedSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;
    queryValue = query;
    isSearching = true;
    filterPosts(queryValue);
  });
}

if (feedSearchForm) {
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      queryValue = "";
      isSearching = false;
      if (sortByValue) {
        activeFilteredPosts = [];
        sortPosts(sortByValue);
      } else {
        activeFilteredPosts = [];
        displayPosts(posts);
      };
    }
  });
}

export const observer = new IntersectionObserver(
  async (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && !isFetching  && (!isSearching || activeFilteredPosts.length !== 0)) {
      isFetching = true;
      try {
        await getPosts(currentPage, false);
        currentPage++;
      } catch (error) {
        console.error("Error fetching posts during scroll:", error);
      } finally {
        isFetching = false;
      }
    }
  },
  {
    rootMargin: "300px",
  }
);
