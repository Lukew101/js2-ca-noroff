import { displayPosts } from "../feed/feedUtils.mjs";

const searchInput = document.querySelector('.form-control[type="search"]');
const feedSearchForm = document.querySelector(".feed-search-form");

let posts = [];
let activeFilteredPosts = [];

let currentPage = 1;
let isSearching = false;
let queryValue = "";
let sortByValue = "";

export const getPosts = async (page = 1, clearDisplayedPosts = false) => {
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

const sortPosts = (sortBy) => {
  const sourcePosts =
    activeFilteredPosts.length === 0 && queryValue
      ? []
      : activeFilteredPosts.length > 0
      ? activeFilteredPosts
      : posts;
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
  activeFilteredPosts = posts.filter((post) =>
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
      }
    }
  });
}

export const observer = new IntersectionObserver(
  async (entries) => {
    const entry = entries[0];
    if (
      entry.isIntersecting &&
      (!isSearching || activeFilteredPosts.length !== 0)
    ) {
      try {
        await getPosts(currentPage, false);
        currentPage++;
      } catch (error) {
        console.error("Error fetching posts during scroll:", error);
      }
    }
  },
  {
    rootMargin: "300px",
  }
);
