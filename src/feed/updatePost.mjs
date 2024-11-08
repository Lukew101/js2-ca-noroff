import { getPosts } from "./fetchPosts.mjs";
import { deletePost } from "./deletePost.mjs";

const updatePost = async (postId, updatedPost) => {
  const UPDATE_POST_URL = `https://v2.api.noroff.dev/social/posts/${postId}`;

  try {
    const response = await fetch(UPDATE_POST_URL, {
      method: "PUT",
      body: JSON.stringify(updatedPost),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": "51c023ca-d672-4f25-b71a-0c5e1489b5f9",
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      getPosts();
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

const createEditPostModalHTML = (post) => {
  return `
      <div class="modal fade" id="editPostModal" tabindex="-1" aria-labelledby="editPostModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editPostModalLabel">Edit Post</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="editPostForm">
                <div class="mb-3">
                  <label for="editPostTitle" class="form-label">Title</label>
                  <input type="text" class="form-control" id="editPostTitle" value="${post.title}">
                </div>
                <div class="mb-3">
                  <label for="editPostContent" class="form-label">Content</label>
                  <textarea class="form-control" id="editPostContent" rows="3">${post.body}</textarea>
                </div>
                <div class="d-flex justify-content-between">
                  <button type="submit" class="btn btn-custom btn-lg" id="postButton">Save Changes</button>
                  <button type="button" class="btn btn-danger btn-lg" id="deleteButton">Delete</button>
                </div>          
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
};

const openEditForm = (post) => {
  const existingEditModal = document.querySelector("#editPostModal");
  if (existingEditModal) existingEditModal.remove();

  document.body.insertAdjacentHTML("beforeend", createEditPostModalHTML(post));

  const editModal = new bootstrap.Modal(
    document.querySelector("#editPostModal")
  );
  editModal.show();

  const deleteButton = document.querySelector("#deleteButton");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => deletePost(post.id, editModal));
  }

  document
    .querySelector("#editPostForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const updatedPost = {
        title: document.querySelector("#editPostTitle").value,
        body: document.querySelector("#editPostContent").value,
      };
      updatePost(post.id, updatedPost);
      editModal.hide();
    });
};

export { openEditForm };
