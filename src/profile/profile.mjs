import { createProfilePostsHTML } from "./createProfilePosts.mjs";
import { createTopProfileHTML } from "./createTopProfileHtml.mjs";
import {
  createBottomProfileHTML,
  createBioHTML,
  createFollowHTML,
} from "./createBottomProfileHtml.mjs";

const user = JSON.parse(localStorage.getItem("profile"));
const FETCH_PROFILE_URL = `https://v2.api.noroff.dev/social/profiles/${user.name}?_following=true&_followers=true&`;

document.title = `${user.name}'s Profile | Weave`;

const fetchFullProfile = async () => {
  const profileTopContainer = document.querySelector(".profile-container");
  const loadingSpinner = document.querySelector(".spinner-container");

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
      createBottomProfileHTML(profile.data);
      createBioHTML(profile.data);
      createFollowHTML(profile.data.followers, ".followers-container");
      createFollowHTML(profile.data.following, ".following-container");
      createProfilePostsHTML();
      return profile.data;
    } else {
      throw new Error("Could not fetch profile data.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    profileTopContainer.style.display = "block";
    loadingSpinner.remove();
  }
};

fetchFullProfile();
