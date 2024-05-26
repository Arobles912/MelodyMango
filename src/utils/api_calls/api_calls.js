import { refreshSpotifyToken } from "../spotify_calls/spotify_calls";

export async function saveSpotifyTokenToDatabase(accessToken, refreshToken, username) {
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
  
  export async function fetchSpotifyTokenFromDatabase(username, setSpotifyToken, setRefreshToken) {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/username/${username}`);
      if (response.ok) {
        const data = await response.json();
        const tokenFromDatabase = data.spotifyToken;
        const refreshTokenFromDatabase = data.refreshToken;
        if (tokenFromDatabase) {
          const tokenExpirationTime = 3600 * 1000; 
          const tokenStoredTime = localStorage.getItem('spotifyTokenStoredTime') || Date.now();
  
          if (Date.now() - tokenStoredTime >= tokenExpirationTime) {
            const newTokens = await refreshSpotifyToken(refreshTokenFromDatabase);
            if (newTokens) {
              setSpotifyToken(newTokens.access_token);
              localStorage.setItem("spotifyToken", newTokens.access_token);
              localStorage.setItem("spotifyTokenStoredTime", Date.now());
              if (newTokens.refresh_token) {
                setRefreshToken(newTokens.refresh_token);
                localStorage.setItem("spotifyRefreshToken", newTokens.refresh_token);
              }
            }
          } else {
            setSpotifyToken(tokenFromDatabase);
            localStorage.setItem("spotifyTokenStoredTime", tokenStoredTime);
          }
        }
        if (refreshTokenFromDatabase) {
          setRefreshToken(refreshTokenFromDatabase);
          localStorage.setItem("spotifyRefreshToken", refreshTokenFromDatabase);
        }
      }
    } catch (error) {
      console.error("Error fetching Spotify token from database:", error);
    }
  }
  