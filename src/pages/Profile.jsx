import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./styles/Profile.css";
import {
  handleLogin,
  getTokensFromUrl,
  fetchSpotifyTokenFromDatabase,
  spotifyApiInstance as spotifyApi,
} from "../utils/spotify_utils";
import SongsCard from "../components/profile_components/SongsCard";
import ArtistsCard from "../components/profile_components/ArtistsCard";
import GenresCard from "../components/profile_components/GenresCard";
import UserInfo from "../components/profile_components/UserInfo";

export default function Profile() {
  const { username } = useParams();
  const [spotifyToken, setSpotifyToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [timeRange, setTimeRange] = useState("short_term");

  const initialRender = useRef(true);

  useEffect(() => {
    const fetchTokens = async () => {
      await getTokensFromUrl(username, setSpotifyToken, setRefreshToken);
      await fetchSpotifyTokenFromDatabase(username, setSpotifyToken, setRefreshToken);
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
    const refreshIfNeeded = async () => {
      const tokenStoredTime = localStorage.getItem('spotifyTokenStoredTime') || 0;
      const tokenExpirationTime = 3600 * 1000; 
      if (Date.now() - tokenStoredTime >= tokenExpirationTime) {
        await refreshSpotifyToken(username, refreshToken, setSpotifyToken, setRefreshToken);
      }
    };

    const intervalId = setInterval(refreshIfNeeded, 60000); 

    return () => clearInterval(intervalId);
  }, [username, refreshToken]);

  return (
    <main>
      <div className="bg-div-profile">
        <div className="main-profile-div">
        {username === "null" && (
            <div className="login-spotify-div">
              <button className="login-spotify-button" onClick={handleLogin}>
                Login with Spotify
              </button>
            </div>
          )}
          {username !== "null" &&(
            <div>
              <UserInfo username={username} spotifyToken={spotifyToken} spotifyApi={spotifyApi} />
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
