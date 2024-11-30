import openEditForm from "./openEditForm.mjs";
import getPost from "./http-requests/fetchPost.mjs";

/**
 * Create the inner HTML for a post element
 * @param {HTMLElement} element
 * @param {Object} post
 * @param {boolean} isModal
 * @returns {HTMLElement}
 * @example
 * ```js
 * Create a post element, create the inner HTML and append it to the feed container
 * const feedContainer = document.querySelector(".posts-feed");
 * const feedPost = document.createElement("div");
 * feedPost.classList.add("feed-post", "card", "w-100");
 * createPostInnerHTML(feedPost, post);
 * feedContainer.appendChild(feedPost);
 * ```
 */
const createPostInnerHTML = (element, post, isModal = false) => {
  const likes = post._count.reactions === 1 ? "like" : "likes";
  const comments = post._count.comments === 1 ? "comment" : "comments";
  const timePostedAgo = postCreatedTime(post);

  const isAuthor =
    post.author.email === JSON.parse(localStorage.getItem("profile")).email;

  element.innerHTML = `
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <img
                        src="${post.author.avatar.url}"
                        alt="${post.author.avatar.alt}"
                        width="45"
                        height="45"
                        class="rounded-circle profile-pic bg-white border border-1 border-light"
                        onerror="this.src='../util/pictures/default-user.png';"
                      />
                      <div class="d-flex flex-column">
                        <p class="mt-2 m-0 fw-bolder text-start trending-weave-text">
                          ${post.author.name}
                        </p>
                        <p class="m-0 post-posted-time text-start">
                          ${timePostedAgo}
                        </p>
                      </div>
                    </div>
                    ${
                      isAuthor && !isModal
                        ? `
                        <div class="d-flex align-items-center gap-2 pointer edit-post">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                          </svg>
                        </div>
                      `
                        : ""
                    }
                  </div>
                  <p class="card-title text-start my-4 fw-bolder fs-5">${
                    post.title
                  }</p>
                  <p class="card-text text-start">
                    ${post.body}
                  </p>
                  <div class="d-flex small-grey-text justify-content-between">
                    <p class="m-0 pointer">${post._count.reactions} ${likes}</p>
                    <p class="m-0 pointer post-comments">${
                      post._count.comments
                    } ${comments}</p>
                  </div>
                  <div
                    class="d-flex align-items-center border-bottom border-dark-subtle mx-3 my-2"
                  ></div>
                  <div
                    class="post-icons d-flex justify-content-between align-items-center"
                  >
                    <div class="d-flex align-items-center gap-2 pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                              <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                            </svg>
                      <p class="m-0 pointer">Like</p>
                    </div>
                    <div class="d-flex align-items-center gap-2 pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-chat"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"
                        />
                      </svg>
                      <p class="m-0 pointer post-comments">Comment</p>
                    </div>
                  </div>
                </div>`;

  const editButton = element.querySelector(".edit-post");
  if (editButton) {
    editButton.addEventListener("click", () => openEditForm(post));
  }

  return element;
};

const createPostModalHTML = (post) => {
  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body", "p-4");

  const originalPost = createPostInnerHTML(modalBody, post, true);

  const postComments = post.comments;
  const commentSection = document.createElement("div");
  commentSection.classList.add("mt-2", "ms-2", "comment-container");

  postComments.forEach((comment) => {
    const commentElement = document.createElement("div");
    commentElement.classList.add(
      "d-flex",
      "align-items-center",
      "gap-2",
      "mb-2"
    );
    commentElement.innerHTML = `
      <img
        src="${comment.author.avatar.url}"
        alt="${comment.author.avatar.alt}"
        width="35"
        height="35"
        class="rounded-circle profile-pic bg-white border border-1 border-light"
        onerror="this.src='../util/pictures/default-user.png';"
      />
      <div class="d-flex flex-column">
        <p class="mt-2 m-0 fw-bolder text-start trending-weave-text">
          ${comment.author.name}
        </p>
        <p class="m-0 post-posted-time text-start">
          ${postCreatedTime(comment)}
        </p>
      </div>
      <p class="card-text text-start ms-1 comment-bubble">
        ${comment.body}
      </p>`;

    commentSection.appendChild(commentElement);
  });

  return `
  <div class="modal fade" id="dynamicPostModal" tabindex="-1" aria-labelledby="dynamicPostModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="dynamicPostModalLabel">${post.title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        ${originalPost.outerHTML}
        ${commentSection.outerHTML}
        <div>
      </div>
    </div>
  </div>`;
};

const postCreatedTime = (post) => {
  const createdDate = new Date(post.created);
  const currentTime = new Date();

  const timeDifference = currentTime - createdDate;
  const timeDifferenceInMinutes = timeDifference / (1000 * 60);

  if (timeDifferenceInMinutes < 60) {
    return `${Math.floor(timeDifferenceInMinutes)} minutes ago`;
  } else {
    const timeDifferenceInHours = timeDifferenceInMinutes / 60;
    return `${Math.floor(timeDifferenceInHours)} hours ago`;
  }
};

const buildPost = (post) => {
  const feedPost = document.createElement("div");
  feedPost.classList.add("feed-post", "card", "w-100");
  feedPost.id = post.id;
  createPostInnerHTML(feedPost, post);

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

  return feedPost;
};

export default buildPost;
