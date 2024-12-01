import { displayPosts, sortPosts, handleInitialFilter, handleObserverFilter, toggleLoader } from "./feedUtils.mjs";
import filterPosts from "../post/http-requests/filterPosts.mjs";

const searchInput = document.querySelector('.form-control[type="search"]');
const feedSearchForm = document.querySelector(".feed-search-form");

let posts = [];
let activeFilteredPosts = [];

let currentPage = 1;
let currentFilterPage = 1;
let isSearching = false;
let isFetching = false;
let queryValue = "";
let sortByValue = "";

const fetchFeedPosts = async (page = 1, clearDisplayedPosts = false) => {
  if (isFetching) return;
  isFetching = true;

  try {
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
          queryValue
        );
        activeFilteredPosts = await filterPosts(queryValue);
        handleInitialFilter(activeFilteredPosts);
      } else {
        displayPosts(posts);
      }
      currentPage++;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isFetching = false;
  }
};

if (document.querySelector(".form-select")) {
  document.querySelector(".form-select").addEventListener("change", (event) => {
    sortByValue = event.target.value;
    activeFilteredPosts = sortPosts(
      posts,
      activeFilteredPosts,
      sortByValue,
      queryValue
    );
  });
}

if (feedSearchForm) {
  feedSearchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;
    if (query !== queryValue) currentFilterPage = 1;
    queryValue = query;
    isSearching = true;
    activeFilteredPosts = await filterPosts(queryValue);
    handleInitialFilter(activeFilteredPosts);
  });
}

if (feedSearchForm) {
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      queryValue = "";
      currentFilterPage = 1;
      isSearching = false;
      if (sortByValue) {
        activeFilteredPosts = [];
        activeFilteredPosts = sortPosts(
          posts,
          activeFilteredPosts,
          sortByValue,
          queryValue
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
        toggleLoader(true);
        if (queryValue) {
          currentFilterPage++;
          const filteredPosts = await filterPosts(queryValue, currentFilterPage);
          handleObserverFilter(filteredPosts);
        } else {
          await fetchFeedPosts(currentPage);
        }
      } catch (error) {
        console.error("Error fetching posts during scroll:", error);
      } finally {
        toggleLoader(false);
      }
    }
  },
  {
    rootMargin: "300px",
  }
);

export { observer, posts };
