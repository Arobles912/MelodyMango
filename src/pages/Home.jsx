import { useState, useEffect } from "react";
import Navbar from "../components/navbar_components/Navbar";
import "./styles/Home.css";
import SpotifyWebApi from "spotify-web-api-js";
import SongsCard from "../components/home_components/SongsCard";
import ArtistsCard from "../components/home_components/ArtistsCard";
import GenresCard from "../components/home_components/GenresCard";
import CurrentSong from "../components/home_components/CurrentSong";

const spotifyApi = new SpotifyWebApi();

export default function Home({ setIsLoggedIn }) {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [spotifyToken, setSpotifyToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("short_term");

  const handleLogin = () => {
    window.location = `https://accounts.spotify.com/authorize?client_id=${
      import.meta.env.VITE_SPOTIFY_CLIENT_ID
    }&redirect_uri=${
      import.meta.env.VITE_SPOTIFY_REDIRECT_URI
    }&scope=user-top-read user-read-currently-playing user-read-playback-state&response_type=token`;
  };

  async function saveSpotifyTokenToDatabase(accessToken, refreshToken) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/username/${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spotifyToken: accessToken,
            refreshToken: refreshToken
          }),
        }
      );
      if (!response.ok) {
        console.error(
          "Error saving Spotify token to database:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error saving Spotify token to database:", error);
    }
  }

  useEffect(() => {
    const getTokensFromUrl = () => {
      const hash = window.location.hash.substring(1);
      const params = hash.split("&").reduce((acc, item) => {
        const [key, value] = item.split("=");
        acc[key] = decodeURIComponent(value);
        console.log('acc:', acc);
        return acc;
      }, {});
      return {
        accessToken: params.access_token,
        refreshToken: params.refresh_token 
      };
    };
  
    const { accessToken, refreshToken } = getTokensFromUrl();
  
    if (accessToken) {
      setSpotifyToken(accessToken);
      spotifyApi.setAccessToken(accessToken);
      localStorage.setItem("spotifyToken", accessToken);
      if (refreshToken) {
        setSpotifyRefreshToken(refreshToken); 
        localStorage.setItem("spotifyRefreshToken", refreshToken);
      }
      saveSpotifyTokenToDatabase(accessToken, refreshToken);
    }
  }, []);
  

  useEffect(() => {
    async function fetchSpotifyTokenFromDatabase() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users/username/${username}`
        );
        if (response.ok) {
          const data = await response.json();
          const tokenFromDatabase = data.spotify_token;
          const refreshTokenFromDatabase = data.refreshToken;
          if (tokenFromDatabase) {
            setSpotifyToken(tokenFromDatabase);
            spotifyApi.setAccessToken(tokenFromDatabase);
            localStorage.setItem("spotifyToken", tokenFromDatabase);
            if (refreshTokenFromDatabase) {
              localStorage.setItem("spotifyRefreshToken", refreshTokenFromDatabase);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching Spotify token from database:", error);
      }
    }

    if (username) {
      fetchSpotifyTokenFromDatabase();
    }
  }, [username]);

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
            <CurrentSong spotifyToken={spotifyToken} spotifyApi={spotifyApi}/>
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
