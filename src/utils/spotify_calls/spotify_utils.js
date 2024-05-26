// spotifyUtils.js
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

export const handleLogin = () => {
  window.location = `https://accounts.spotify.com/authorize?client_id=${
    import.meta.env.VITE_SPOTIFY_CLIENT_ID
  }&response_type=code&redirect_uri=${
    import.meta.env.VITE_SPOTIFY_REDIRECT_URI
  }&scope=user-top-read user-read-currently-playing user-read-playback-state`;
};

export const saveSpotifyTokenToDatabase = async (username, accessToken, refreshToken) => {
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
          refreshToken: refreshToken,
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
};

export const refreshSpotifyToken = async (username, refreshToken, setSpotifyToken, setRefreshToken) => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error refreshing token: ${response.statusText}`);
    }

    const data = await response.json();
    const { access_token, refresh_token: newRefreshToken } = data;

    setSpotifyToken(access_token);
    localStorage.setItem("spotifyToken", access_token);
    spotifyApi.setAccessToken(access_token);

    if (newRefreshToken) {
      setRefreshToken(newRefreshToken);
      localStorage.setItem("spotifyRefreshToken", newRefreshToken);
      await saveSpotifyTokenToDatabase(username, access_token, newRefreshToken);
    } else {
      await saveSpotifyTokenToDatabase(username, access_token, refreshToken);
    }

    console.log("Spotify token refreshed:", access_token);

    return access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export const getTokensFromUrl = async (username, setSpotifyToken, setRefreshToken) => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (code) {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching tokens: ${response.statusText}`);
      }

      const data = await response.json();
      const { access_token, refresh_token } = data;

      setSpotifyToken(access_token);
      setRefreshToken(refresh_token);
      localStorage.setItem("spotifyToken", access_token);
      localStorage.setItem("spotifyRefreshToken", refresh_token);

      spotifyApi.setAccessToken(access_token);
      saveSpotifyTokenToDatabase(username, access_token, refresh_token);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  }
};

export const fetchSpotifyTokenFromDatabase = async (username, setSpotifyToken, setRefreshToken) => {
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
          const newAccessToken = await refreshSpotifyToken(username, refreshTokenFromDatabase, setSpotifyToken, setRefreshToken);
          if (newAccessToken) {
            setSpotifyToken(newAccessToken);
            localStorage.setItem("spotifyToken", newAccessToken);
            localStorage.setItem("spotifyTokenStoredTime", Date.now());
            spotifyApi.setAccessToken(newAccessToken);
          }
        } else {
          setSpotifyToken(tokenFromDatabase);
          spotifyApi.setAccessToken(tokenFromDatabase);
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
};

export const spotifyApiInstance = spotifyApi;
