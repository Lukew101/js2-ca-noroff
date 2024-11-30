import { displayPosts, sortPosts, filterPosts } from "./feedUtils.mjs";

const searchInput = document.querySelector('.form-control[type="search"]');
const feedSearchForm = document.querySelector(".feed-search-form");

let posts = [];
let activeFilteredPosts = [];

let currentPage = 1;
let isSearching = false;
let queryValue = "";
let sortByValue = "";

const fetchFeedPosts = async (page = 1, clearDisplayedPosts = false) => {
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
        activeFilteredPosts = sortPosts(
          posts,
          activeFilteredPosts,
          sortByValue,
          queryValue,
          displayPosts
        );
        activeFilteredPosts = filterPosts(posts, queryValue, displayPosts);
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

if (document.querySelector(".form-select")) {
  document.querySelector(".form-select").addEventListener("change", (event) => {
    sortByValue = event.target.value;
    activeFilteredPosts = sortPosts(
      posts,
      activeFilteredPosts,
      sortByValue,
      queryValue,
      displayPosts
    );
  });
}

if (feedSearchForm) {
  feedSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;
    queryValue = query;
    isSearching = true;
    activeFilteredPosts = filterPosts(posts, queryValue, displayPosts);
  });
}

if (feedSearchForm) {
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      queryValue = "";
      isSearching = false;
      if (sortByValue) {
        activeFilteredPosts = [];
        activeFilteredPosts = sortPosts(
          posts,
          activeFilteredPosts,
          sortByValue,
          queryValue,
          displayPosts
        );
      } else {
        activeFilteredPosts = [];
        displayPosts(posts);
      }
    }
  });
}

const observer = new IntersectionObserver(
  async (entries) => {
    const entry = entries[0];
    if (
      entry.isIntersecting &&
      (!isSearching || activeFilteredPosts.length !== 0)
    ) {
      try {
        await fetchFeedPosts(currentPage, false);
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

export { observer, posts };
