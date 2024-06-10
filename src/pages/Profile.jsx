import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./styles/Profile.css";
import {
  getTokensFromUrl,
  fetchSpotifyTokenFromDatabase,
  refreshSpotifyToken,
  spotifyApiInstance as spotifyApi,
} from "../utils/spotify_utils";
import { fetchUserProfileState, fetchUserId } from "../utils/api_calls";
import SongsCard from "../components/profile_components/SongsCard";
import ArtistsCard from "../components/profile_components/ArtistsCard";
import GenresCard from "../components/profile_components/GenresCard";
import UserInfo from "../components/profile_components/UserInfo";

export default function Profile() {
  const { username } = useParams();
  const storedUsername = localStorage.getItem("username");
  const [usernameId, setUsernameId] = useState();
  const [storedUsernameId, setStoredUsernameId] = useState();
  const [spotifyToken, setSpotifyToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [timeRange, setTimeRange] = useState("short_term");
  const [profileState, setProfileState] = useState("");
  const [existingFriendship, setExistingFriendship] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState("PENDING");

  const initialRender = useRef(true);

  async function checkFriendship(user1Id, user2Id) {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/friendships/exists?user1Id=${user1Id}&user2Id=${user2Id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setExistingFriendship(data);
      } else {
        console.error(
          "Failed to check friendship status:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error checking friendship status:", error);
    }
  }

  async function getFriendshipDetails(user1Id, user2Id) {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/friendships/details?user1Id=${user1Id}&user2Id=${user2Id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFriendshipStatus(data.status);
      } else {
        console.error(
          "Failed to check friendship status:",
          response.statusText
        );
        return "PENDING";
      }
    } catch (error) {
      console.error("Error checking friendship status:", error);
      return "PENDING";
    }
  }

  useEffect(() => {
    const fetchTokens = async () => {
      await getTokensFromUrl(username, setSpotifyToken, setRefreshToken);
      await fetchSpotifyTokenFromDatabase(
        username,
        setSpotifyToken,
        setRefreshToken
      );
    };

    if (initialRender.current) {
      initialRender.current = false;
      fetchTokens();
    } else {
      setSpotifyToken("");
      setRefreshToken("");
      fetchTokens();
    }
  }, [username]);

  useEffect(() => {
    const fetchProfileState = async () => {
      const state = await fetchUserProfileState(username);
      setProfileState(state);
    };

    if (username !== "null") {
      fetchProfileState();
    }
  }, [username]);

  useEffect(() => {
    async function fetchData() {
      const user1Id = await fetchUserId(storedUsername);
      const user2Id = await fetchUserId(username);

      setStoredUsernameId(user1Id);
      setUsernameId(user2Id);

      if (user1Id && user2Id) {
        await checkFriendship(user1Id, user2Id);
        await getFriendshipDetails(user1Id, user2Id);
      }
    }

    fetchData();
  }, [storedUsername, username]);

  async function handleClickAddButton(user1Id, user2Id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/friendships`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user1Id,
            user2Id,
          }),
        }
      );
      if (response.ok) {
        setExistingFriendship(true);
        console.log("Friendship created");
      } else {
        console.error("Failed to create friendship:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error creating friendship:", error);
    }
  }

  if (profileState === "PRIVATE" && username !== storedUsername) {
    if (!existingFriendship) {
      return (
        <main>
          <div className="bg-div-profile">
            <div className="main-profile-div">
              <p className="private-profile-p">This profile is private.</p>
              <div className="add-friend-div-private">
                <button
                  className="add-friend-button-private"
                  onClick={() =>
                    handleClickAddButton(storedUsernameId, usernameId)
                  }
                >
                  Add friend
                </button>
                </div>
            </div>
          </div>
        </main>
      );
    } else {
      if (friendshipStatus === "PENDING") {
        return (
          <main>
            <div className="bg-div-profile">
              <div className="main-profile-div">
                <p className="private-profile-p">This profile is private.</p>
              </div>
            </div>
          </main>
        );
      } else {
        return (
          <main>
            <div className="bg-div-profile">
              <div className="main-profile-div">
                {username !== "null" && (
                  <div>
                    <UserInfo
                      username={username}
                      spotifyToken={spotifyToken}
                      spotifyApi={spotifyApi}
                    />
                    <div className="time-period-div">
                      <button
                        className="time-period-button"
                        type="button"
                        onClick={() => setTimeRange("short_term")}
                      >
                        4 weeks
                      </button>
                      <button
                        className="time-period-button"
                        type="button"
                        onClick={() => setTimeRange("medium_term")}
                      >
                        6 months
                      </button>
                      <button
                        className="time-period-button-3"
                        type="button"
                        onClick={() => setTimeRange("long_term")}
                      >
                        1 year
                      </button>
                    </div>
                    <SongsCard
                      key={username + "songs"}
                      spotifyToken={spotifyToken}
                      timeRange={timeRange}
                      spotifyApi={spotifyApi}
                    />
                    <ArtistsCard
                      key={username + "artists"}
                      spotifyToken={spotifyToken}
                      timeRange={timeRange}
                      spotifyApi={spotifyApi}
                    />
                    <GenresCard
                      key={username + "genres"}
                      spotifyToken={spotifyToken}
                      timeRange={timeRange}
                      spotifyApi={spotifyApi}
                    />
                  </div>
                )}
              </div>
            </div>
          </main>
        );
      }
    }
  } else {
    return (
      <main>
        <div className="bg-div-profile">
          <div className="main-profile-div">
            {username !== "null" && (
              <div>
                <UserInfo
                  username={username}
                  spotifyToken={spotifyToken}
                  spotifyApi={spotifyApi}
                />
                <div className="time-period-div">
                  <button
                    className="time-period-button"
                    type="button"
                    onClick={() => setTimeRange("short_term")}
                  >
                    4 weeks
                  </button>
                  <button
                    className="time-period-button"
                    type="button"
                    onClick={() => setTimeRange("medium_term")}
                  >
                    6 months
                  </button>
                  <button
                    className="time-period-button-3"
                    type="button"
                    onClick={() => setTimeRange("long_term")}
                  >
                    1 year
                  </button>
                </div>
                <SongsCard
                  key={username + "songs"}
                  spotifyToken={spotifyToken}
                  timeRange={timeRange}
                  spotifyApi={spotifyApi}
                />
                <ArtistsCard
                  key={username + "artists"}
                  spotifyToken={spotifyToken}
                  timeRange={timeRange}
                  spotifyApi={spotifyApi}
                />
                <GenresCard
                  key={username + "genres"}
                  spotifyToken={spotifyToken}
                  timeRange={timeRange}
                  spotifyApi={spotifyApi}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }
}
