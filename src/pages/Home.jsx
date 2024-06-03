import React, { useState, useEffect, useRef } from "react";
import {
  handleLogin,
  getTokensFromUrl,
  fetchSpotifyTokenFromDatabase,
  refreshSpotifyToken,
  spotifyApiInstance as spotifyApi,
} from "../utils/spotify_utils";

export default function Home() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem("spotifyToken") || "");
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("spotifyRefreshToken") || "");

  const initialRender = useRef(true);

  useEffect(() => {
    const fetchTokens = async () => {
      await getTokensFromUrl(username, setSpotifyToken, setRefreshToken);
      await fetchSpotifyTokenFromDatabase(username, setSpotifyToken, setRefreshToken);
    };

    if (initialRender.current) {
      initialRender.current = false;
      fetchTokens();
    }
  }, [username]);

  useEffect(() => {
    const refreshIfNeeded = async () => {
      const tokenStoredTime = localStorage.getItem('spotifyTokenStoredTime') || 0;
      const tokenExpirationTime = 3600 * 1000;
      if (Date.now() - tokenStoredTime >= tokenExpirationTime) {
        console.log("Refreshing Spotify token...");
        await refreshSpotifyToken(username, refreshToken, setSpotifyToken, setRefreshToken);
      }
    };

    const intervalId = setInterval(refreshIfNeeded, 60000); 

    return () => clearInterval(intervalId);
  }, [username, refreshToken]);

  return (
    <main>
      <div>
        {!spotifyToken && (
          <div className="login-spotify-div">
            <button className="login-spotify-button" onClick={handleLogin}>
              Login with Spotify
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
