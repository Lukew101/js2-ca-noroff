import buildPost from "../post/buildPost.mjs";

export const displayPosts = (posts) => {
  const feedContainer = document.querySelector(".posts-feed");
  feedContainer.innerHTML = "";

  posts.forEach((post) => {
    const postElement = buildPost(post);
    feedContainer.appendChild(postElement);
  });
};

export const sortPosts = (posts, activeFilteredPosts, sortBy, queryValue) => {
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
  return sortedPosts;
};

export const handleInitialFilter = (filteredPosts) => {
  displayPosts(filteredPosts);
};

export const handleObserverFilter = (filteredPosts) => {
  const feedContainer = document.querySelector(".posts-feed");
  filteredPosts.forEach((post) => {
    const postElement = buildPost(post);
    feedContainer.appendChild(postElement);
  });
};

export const toggleLoader = (show) => {
  const feedContainer = document.querySelector(".posts-feed");
  let loadingSpinner = document.querySelector(".spinner-grow");
  if (show) {
    if (!loadingSpinner) {
      loadingSpinner = document.createElement("div");
      loadingSpinner.classList.add("spinner-grow");
      loadingSpinner.setAttribute("role", "status");
      feedContainer.appendChild(loadingSpinner);
    }
  } else {
    if (loadingSpinner) {
      loadingSpinner.remove();
    }
  }
};
