import { useState, useEffect } from "react";
import Navbar from "../components/navbar_components/Navbar";
import "./styles/Profile.css";
import {
  handleLogin,
  getTokensFromUrl,
  fetchSpotifyTokenFromDatabase,
  spotifyApiInstance as spotifyApi,
} from "../utils/spotify_calls/spotify_utils";
import SongsCard from "../components/profile_components/SongsCard";
import ArtistsCard from "../components/profile_components/ArtistsCard";
import GenresCard from "../components/profile_components/GenresCard";
import CurrentSong from "../components/profile_components/CurrentSong";

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
  const [timeRange, setTimeRange] = useState("short_term");

  useEffect(() => {
    getTokensFromUrl(username, setSpotifyToken, setRefreshToken);
  }, []);

  useEffect(() => {
    if (username) {
      fetchSpotifyTokenFromDatabase(username, setSpotifyToken, setRefreshToken);
    }
  }, [username]);

  return (
    <main>
      <div className="bg-div-home">
        <div className="main-home-div">
          {!spotifyToken && (
            <div className="login-spotify-div">
              <button className="login-spotify-button" onClick={handleLogin}>
                Login with Spotify
              </button>
            </div>
          )}
          {spotifyToken && (
            <div>
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
                <CurrentSong
                  spotifyToken={spotifyToken}
                  spotifyApi={spotifyApi}
                />
              </div>
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
