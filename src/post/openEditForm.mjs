import deletePost from "./http-requests/deletePost.mjs";
import updatePost from "./http-requests/updatePost.mjs";
import buildPost from "./buildPost.mjs";
import { posts } from "../feed/handleFeedPosts.mjs";

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

const openEditForm = (postData) => {
  const existingEditModal = document.querySelector("#editPostModal");
  if (existingEditModal) existingEditModal.remove();

  document.body.insertAdjacentHTML(
    "beforeend",
    createEditPostModalHTML(postData)
  );

  const editModal = new bootstrap.Modal(
    document.querySelector("#editPostModal")
  );
  editModal.show();

  const deleteButton = document.querySelector("#deleteButton");
  if (deleteButton) {
    deleteButton.addEventListener("click", () =>
      deletePost(postData.id, editModal)
    );
  }

  document
    .querySelector("#editPostForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const updatedPost = {
        title: document.querySelector("#editPostTitle").value,
        body: document.querySelector("#editPostContent").value,
      };
      const updatedPostData = await updatePost(postData.id, updatedPost);
      const postElement = document.getElementById(postData.id);

      postData.title = updatedPostData.title;
      postData.body = updatedPostData.body;

      if (posts) {
        const postIndex = posts.findIndex((post) => post.id === postData.id);
        if (postIndex !== -1) {
          posts[postIndex] = postData;
        }
      }

      const updatedPostElement = buildPost(postData);
      console.log(updatedPostElement);
      postElement.replaceWith(updatedPostElement);

      editModal.hide();
    });
};

export default openEditForm;
