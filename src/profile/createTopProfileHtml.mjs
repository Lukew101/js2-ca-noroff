export const createTopProfileHTML = (profile) => {
  const profileTopContainer = document.querySelector(".profile-container");
  profileTopContainer.innerHTML += `
      <section class="row">
        <div class="card mb-3 p-0">
          <img
            src="${
              profile.banner.url || "../util/pictures/mock-cover-photo.jpg"
            }"
            class="card-img-top"
            alt="${profile.name}'s cover photo"
            onerror="this.src='../util/pictures/default-cover-photo.jpg';"
          />
          <div class="card-body">
            <div
              class="d-flex flex-column align-items-center custom-negative-margin"
            >
              <img
                src="${profile.avatar.url}"
                alt="${profile.avatar.alt}"
                width="160"
                height="160"
                class="rounded-circle profile-pic white-outer-border bg-white border border-2 border-secondary-subtle mt-4"
                onerror="this.src='../util/pictures/default-user.png';"
              />
              <h1 class="m-0">${profile.name}</h1>
              <p class="m-0 fw-medium fst-italic">${profile.email}</p>
              <div class="d-flex gap-3 mb-2">
                <p class="follow-count m-0">${
                  profile._count.followers
                } Followers</p>
                <p class="follow-count m-0">${
                  profile._count.following
                } Following</p>
              </div> 
            </div>
            <div class="d-flex align-items-center border-bottom border-dark-subtle mx-3 my-2"></div>
            <div class="d-flex profile-menu-items gap-4 mx-3">
              <a class="text-decoration-none small-grey-text" href="#about-section">About</a>
              <a class="text-decoration-none small-grey-text" href="#followers-section">Followers</a>
              <a class="text-decoration-none small-grey-text" href="#following-section">Following</a>
              <a class="text-decoration-none small-grey-text" href="#posts-section">Posts</a>
            </div>
          </div>
        </div>
      </section>
    `;
};
