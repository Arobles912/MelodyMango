// src/pages/Profile.js

import { useState, useEffect } from "react";
import Navbar from "../components/navbar_components/Navbar";
import "./styles/Profile.css";
import SpotifyWebApi from "spotify-web-api-js";
import SongsCard from "../components/profile_components/SongsCard";
import ArtistsCard from "../components/profile_components/ArtistsCard";
import GenresCard from "../components/profile_components/GenresCard";
import CurrentSong from "../components/profile_components/CurrentSong";

import {
  handleLogin,
  getTokensFromUrl,
  refreshSpotifyToken,
} from "../utils/spotify_calls/spotify_calls";
import {
  saveSpotifyTokenToDatabase,
  fetchSpotifyTokenFromDatabase,
} from "../utils/api_calls/api_calls";

const spotifyApi = new SpotifyWebApi();

export default function Profile({ setIsLoggedIn }) {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [spotifyToken, setSpotifyToken] = useState(
    localStorage.getItem("spotifyToken") || ""
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("spotifyRefreshToken") || ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("short_term");

  useEffect(() => {
    async function fetchTokens() {
      const tokens = await getTokensFromUrl();
      if (tokens) {
        setSpotifyToken(tokens.access_token);
        setRefreshToken(tokens.refresh_token);
        saveSpotifyTokenToDatabase(
          tokens.access_token,
          tokens.refresh_token,
          username
        );
      }
    }
    fetchTokens();
  }, []);

  useEffect(() => {
    if (username) {
      fetchSpotifyTokenFromDatabase(username, setSpotifyToken, setRefreshToken);
    }
  }, [username]);

  // useEffect(() => {
  //   const intervalId = setInterval(async () => {
  //     if (refreshToken) {
  //       const newTokens = await refreshSpotifyToken(refreshToken);
  //       if (newTokens) {
  //         setSpotifyToken(newTokens.access_token);
  //         if (newTokens.refresh_token) {
  //           setRefreshToken(newTokens.refresh_token);
  //         }
  //       }
  //     }
  //   }, 3600 * 1000); // Refrescar el token cada hora

  //   return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
  // }, [refreshToken]);

  return (
    <main>
      <div className="bg-div-home">
        <Navbar
          username={username}
          setUsername={setUsername}
          setToken={setToken}
          setIsLoggedIn={setIsLoggedIn}
          setSearchTerm={setSearchTerm}
          spotifyApi={spotifyApi}
        />
        <div className="main-home-div">
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
              className="time-period-button"
              type="button"
              onClick={() => setTimeRange("long_term")}
            >
              1 year
            </button>
            <CurrentSong spotifyToken={spotifyToken} spotifyApi={spotifyApi} />
          </div>
          {!spotifyToken && (
            <div>
              <p>
                Please login with your Spotify account to see your top tracks.
              </p>
              <button onClick={handleLogin}>Login with Spotify</button>
            </div>
          )}
          {spotifyToken && (
            <div>
              <SongsCard
                spotifyToken={spotifyToken}
                timeRange={timeRange}
                spotifyApi={spotifyApi}
              />
              <ArtistsCard
                spotifyToken={spotifyToken}
                timeRange={timeRange}
                spotifyApi={spotifyApi}
              />
              <GenresCard
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
