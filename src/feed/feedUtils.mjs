import buildPost from "../post/buildPost.mjs";

export const displayPosts = (posts) => {
  const feedContainer = document.querySelector(".posts-feed");
  feedContainer.innerHTML = "";

  posts.forEach((post) => {
    const postElement = buildPost(post);
    feedContainer.appendChild(postElement);
  });
};

export const sortPosts = (
  posts,
  activeFilteredPosts,
  sortBy,
  queryValue,
  displayPosts
) => {
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

export const filterPosts = (posts, query, displayPosts) => {
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  );
  displayPosts(filteredPosts);
  return filteredPosts;
};
