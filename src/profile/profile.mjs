import { createPostsHTML } from "./createProfilePosts.mjs";

const user = JSON.parse(localStorage.getItem("profile"));
const FETCH_PROFILE_URL = `https://v2.api.noroff.dev/social/profiles/${user.name}?_following=true&_followers=true&`;

document.title = `${user.name}'s Profile | Weave`;

const fetchFullProfile = async () => {
  const profileTopContainer = document.querySelector(".profile-container");
  const loadingSpinner = document.querySelector(".spinner-grow");

  profileTopContainer.style.display = "none";

  try {
    const response = await fetch(FETCH_PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": "51c023ca-d672-4f25-b71a-0c5e1489b5f9",
      },
    });
    if (response.ok) {
      const profile = await response.json();
      createTopProfileHTML(profile.data);
      createProfileSectionHTML(profile.data);
      createBioHTML(profile.data);
      createFollowHTML(profile.data.followers, ".followers-container");
      createFollowHTML(profile.data.following, ".following-container");
      createPostsHTML();
      return profile.data;
    } else {
      throw new Error("Could not fetch profile data.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    profileTopContainer.style.display = "block";
    loadingSpinner.style.display = "none";
  }
};

fetchFullProfile();

const createTopProfileHTML = (profile) => {
  const profileTopContainer = document.querySelector(".profile-container");
  profileTopContainer.innerHTML += `
    <section class="row">
      <div class="card mb-3 p-0">
        <img
          src="${profile.banner.url || "../util/pictures/mock-cover-photo.jpg"}"
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

const createProfileSectionHTML = () => {
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

const createBioHTML = (profile) => {
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

const createFollowHTML = (people, followQuerySelector) => {
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
