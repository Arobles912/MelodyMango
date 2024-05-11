import { useState, useEffect } from "react";
import Navbar from "../components/navbar_components/Navbar";
import "./styles/Home.css";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

export default function Home({ setIsLoggedIn }) {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [spotifyToken, setSpotifyToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [topTracks, setTopTracks] = useState([]);

  const handleLogin = () => {
    window.location = `https://accounts.spotify.com/authorize?client_id=${
      import.meta.env.VITE_SPOTIFY_CLIENT_ID
    }&redirect_uri=${
      import.meta.env.VITE_SPOTIFY_REDIRECT_URI
    }&scope=user-top-read&response_type=token`;
  };

  useEffect(() => {
    const getAccessTokenFromUrl = () => {
      const hash = window.location.hash.substring(1);
      const params = hash.split("&").reduce((acc, item) => {
        const [key, value] = item.split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});
      return params.access_token;
    };
    const accessToken = getAccessTokenFromUrl();

    if (accessToken) {
      setSpotifyToken(accessToken);
      spotifyApi.setAccessToken(accessToken);
      window.history.pushState({}, document.title, window.location.pathname);

      localStorage.setItem("spotifyToken", accessToken);
      const expiresIn = Number(
        localStorage.getItem("spotifyTokenExpiresIn") || 0
      );
      const expirationTime = expiresIn * 0.95 * 1000;
      setTimeout(refreshToken, expirationTime);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await spotifyApi.getMyTopTracks({
          limit: 10,
          time_range: "short_term",
        });
        setTopTracks(response.items);
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    };

    if (spotifyToken) {
      fetchData();
    }
  }, [spotifyToken]);

  const refreshToken = async () => {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(
            `${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${
              import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
            }`
          )}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: localStorage.getItem("spotifyRefreshToken"),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setSpotifyToken(data.access_token);
        spotifyApi.setAccessToken(data.access_token);
        localStorage.setItem("spotifyToken", data.access_token);
        localStorage.setItem("spotifyTokenExpiresIn", data.expires_in);
        const expiresIn = Number(data.expires_in) * 0.95 * 1000;
        setTimeout(refreshToken, expiresIn);
      } else {
        console.error("Error refreshing token:", response.statusText);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  return (
    <main>
      <div className="bg-div-home">
        <Navbar
          username={username}
          setUsername={setUsername}
          setToken={setToken}
          setIsLoggedIn={setIsLoggedIn}
          setSearchTerm={setSearchTerm}
        />
        <div className="main-home-div">
          <div className="time-period-div">
            <button className="time-period-button" type="button">
              4 weeks
            </button>
            <button className="time-period-button" type="button">
              6 months
            </button>
            <button className="time-period-button" type="button">
              1 year
            </button>
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
            <div className="songs-div">
              <h2>Top Tracks from the past 4 weeks</h2>
              <ul className="songs-list">
                {topTracks.map((track) => (
                  <li key={track.id} className="song-list">
                    <img src={track.album.images[0].url} alt={track.name} />
                    <div className="song-info">
                      <p>{track.name}</p>
                      <p>
                        {track.artists.map((artist) => artist.name).join(", ")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
