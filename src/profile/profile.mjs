import { createPostsHTML } from "./createProfilePosts.mjs";

const user = JSON.parse(localStorage.getItem("profile"));
const FETCH_PROFILE_URL = `https://v2.api.noroff.dev/social/profiles/${user.name}?_following=true&_followers=true&`;

const fetchFullProfile = async () => {
  try {
    const response = await fetch(FETCH_PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": "51c023ca-d672-4f25-b71a-0c5e1489b5f9",
      },
    });
    if (response.ok) {
      const profile = await response.json();
      console.log(profile.data);
      createProfileHTML(profile.data);
      createBioHTML(profile.data);
      createPostsHTML();
      return profile.data;
    } else {
      throw new Error("Could not fetch profile data.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

fetchFullProfile();

const createProfileHTML = (profile) => {
  const profileTopContainer = document.querySelector(".profile-top-container");
  profileTopContainer.innerHTML = `
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
                  <p class="follow-count m-0">${profile._count.followers} Followers</p>
                  <p class="follow-count m-0">${profile._count.following} Following</p>
                </div> 
  `;
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
