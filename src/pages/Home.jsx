import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  handleLogin,
  getTokensFromUrl,
  fetchSpotifyTokenFromDatabase,
  refreshSpotifyToken,
  spotifyApiInstance as spotifyApi,
} from "../utils/spotify_utils";
import "./styles/Home.css";
import mainImg from "../assets/bg_images/main-home-image4.jpg";
import { fetchSpotifyLoggedDataByUserId, fetchUserId } from "../utils/api_calls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [userId, setUserId] = useState("");
  const [spotifyToken, setSpotifyToken] = useState(
    localStorage.getItem("spotifyToken") || ""
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("spotifyRefreshToken") || ""
  );
  const navigate = useNavigate();
  const initialRender = useRef(true);

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
    }
  }, [username]);

  useEffect(() => {
    const refreshIfNeeded = async () => {
      const tokenStoredTime =
        localStorage.getItem("spotifyTokenStoredTime") || 0;
      const tokenExpirationTime = 3600 * 1000;
      if (Date.now() - tokenStoredTime >= tokenExpirationTime) {
        console.log("Refreshing Spotify token...");
        await refreshSpotifyToken(
          username,
          refreshToken,
          setSpotifyToken,
          setRefreshToken
        );
      }
    };

    const intervalId = setInterval(refreshIfNeeded, 60000);
    return () => clearInterval(intervalId);
  }, [username, refreshToken]);

  async function handleHomeButton() {
    navigate(`/profile/${username}`);
  }

  useEffect(() => {
    async function fetchData() {
      const user_id = await fetchUserId(username);
      if (user_id) {
        setUserId(user_id);
        await fetchSpotifyLoggedDataByUserId(user_id);
      }
    }

    fetchData();
  }, [username]);

  return (
    <main>
      <div className="bg-div-home">
        <div className="main-home-div">
          {/* {!spotifyToken && (
            <div className="login-spotify-div">
              <button className="login-spotify-button" onClick={handleLogin}>
                Login with Spotify
              </button>
            </div>
          )} */}
            <div className="entry-home-div-container">
              <h1>Unveil your inside melody.</h1>
              <div className="entry-home-div">
                <img src={mainImg} alt="entry-img" />
                <div className="entry-home-content-div">
                  <p className="entry-home-content-phrase">
                    Discover the tracks and make them known to the world.
                  </p>
                  <p
                    className="entry-home-content-link"
                    onClick={handleHomeButton}
                  >
                    Take me to my profile <FontAwesomeIcon icon={faArrowRight} className="arrow-home-icon" />
                  </p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </main>
  );
}
