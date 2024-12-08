/**
 * Fetches a feed post
 * @param {string} fetchURL - URL to fetch the post
 * @returns {Promise} -  Returns the post with comments
 * @example
 * ```js
 * // Fetch a post with comments and author
 * const fetchURL = "https://v2.api.noroff.dev/social/posts/1?_comments=true&_author=true";
 * const postWithComments = await getPost(fetchURL);
 * displayPost(postWithComments);
 * // Expect singular post to be returned with the Post model, comments and author
 * ```
 */
const getPost = async (fetchPostURL) => {
  try {
    const response = await fetch(fetchPostURL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": "51c023ca-d672-4f25-b71a-0c5e1489b5f9",
      },
    });
    if (response.ok) {
      const responseData = await response.json();
      const postWithComments = responseData.data;
      return postWithComments;
    } else {
      throw new Error("Failed to fetch post");
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

export default getPost;
