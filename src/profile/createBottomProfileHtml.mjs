export const createBottomProfileHTML = () => {
  const profileMainContainer = document.querySelector(".profile-container");

  const sectionHTML = `
        <section class="row d-flex">
          <div class="col-12 col-md-6 profile-card">
            <div class="row">
              <div class="col-12">
                <div class="card mb-3" id="bio-section">
                </div>
              </div>
              <div class="col-12">
                <div class="card mb-3" id="followers-section">
                  <div class="card-body">
                    <h2 class="card-title fs-5 fw-medium mb-3">Followers</h2>
                    <div class="d-flex gap-3 flex-wrap followers-container"></div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="card mb-3" id="following-section">
                  <div class="card-body">
                    <h2 class="card-title fs-5 fw-medium mb-3">Following</h2>
                    <div class="d-flex gap-3 flex-wrap following-container"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 profile-card">
            <div class="card mb-3 border-0" id="posts-section">
              <div class="card-body">
                <h2 class="card-title fs-5 fw-medium mb-3">Posts</h2>
                <div class="d-flex flex-column gap-3 profile-posts-container">
                </div>              
              </div>
            </div>
          </div>
        </section>
    `;
  profileMainContainer.innerHTML += sectionHTML;
};

export const createBioHTML = (profile) => {
  const bioContainer = document.querySelector("#bio-section");
  bioContainer.innerHTML = `
                  <div class="card-body">
                    <h2 class="card-title fs-5 fw-medium mb-3">Bio</h2>
                    <p class="profile-about-p">
                      ${profile.bio ? profile.bio : "No bio available."}
                    </p>
                  </div>
  `;
};

export const createFollowHTML = (people, followQuerySelector) => {
  const followContainer = document.querySelector(followQuerySelector);
  followContainer.innerHTML = "";

  if (people.length === 0) {
    followContainer.innerHTML = "<p>No people to show.</p>";
  }
  people.forEach((person) => {
    const followElement = document.createElement("div");
    followElement.classList.add(
      "d-flex",
      "gap-3",
      "align-items-center",
      "mb-2"
    );
    followElement.innerHTML = `
                    <div class="d-flex flex-column pointer">
                        <img
                          src="${person.avatar.url}"
                          alt="${person.avatar.alt}"
                          width="65"
                          height="60"
                          class="rounded"

                        />
                        <p class="m-0 follow-name-font">${person.name}</p>
                      </div>
    `;
    followContainer.appendChild(followElement);
  });
};
