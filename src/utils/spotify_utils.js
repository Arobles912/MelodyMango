import SpotifyWebApi from "spotify-web-api-js";
import { fetchUserId, fetchSpotifyDataByUserId } from "./api_calls";

const spotifyApi = new SpotifyWebApi();

export const handleLogin = () => {
  window.location = `https://accounts.spotify.com/authorize?client_id=${
    import.meta.env.VITE_SPOTIFY_CLIENT_ID
  }&response_type=code&redirect_uri=${
    import.meta.env.VITE_SPOTIFY_REDIRECT_URI
  }&scope=user-top-read user-read-currently-playing user-read-playback-state user-read-email user-read-private`;
};

export const saveSpotifyTokenToDatabase = async (username, accessToken, refreshToken) => {
  try {
    const userId = await fetchUserId(username);
    let dataId = await fetchSpotifyDataByUserId(userId);

    if (!dataId) {
      console.log("Creating new entry in spotify-data for user:", username);
      const createResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/spotify-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            spotifyToken: accessToken,
            refreshToken: refreshToken,
          }),
        }
      );

      if (!createResponse.ok) {
        throw new Error(`Error creating Spotify data: ${createResponse.statusText}`);
      }

      const createData = await createResponse.json();
      dataId = createData.id;
    }

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/spotify-data/${dataId}`,
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
      throw new Error(`Error updating Spotify token: ${response.statusText}`);
    }

    console.log("Spotify token saved to database for user:", username);
  } catch (error) {
    console.error("Error saving Spotify token to database:", error);
  }
};

export const saveSpotifyProfileToDatabase = async (username, spotifyUsername, spotifyEmail, spotifyImage) => {
  try {
    const userId = await fetchUserId(username);
    const dataId = await fetchSpotifyDataByUserId(userId);

    if (!dataId) {
      console.log("Creating new profile entry in spotify-data for user:", username);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/spotify-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            spotifyUsername: spotifyUsername,
            spotifyEmail: spotifyEmail,
            spotifyImage: spotifyImage,
            userId: userId
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error creating Spotify profile: ${response.statusText}`);
      }

      console.log("Spotify profile saved to database for user:", username);
    }
  } catch (error) {
    console.error("Error saving Spotify profile to database:", error);
  }
};

export const fetchSpotifyUserProfile = async (accessToken) => {
  spotifyApi.setAccessToken(accessToken);
  try {
    const data = await spotifyApi.getMe();
    let image = null;
    if (data.images && data.images.length > 1 && data.images[1].url) {
      image = data.images[1].url;
    }
    return { username: data.id, email: data.email, image: image };
  } catch (error) {
    console.error("Error fetching Spotify user profile:", error);
    return null;
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

    const userProfile = await fetchSpotifyUserProfile(access_token);
    const spotifyUsername = userProfile?.username;
    const spotifyEmail = userProfile?.email;
    const spotifyImage = userProfile?.image;

    if (newRefreshToken) {
      setRefreshToken(newRefreshToken);
      localStorage.setItem("spotifyRefreshToken", newRefreshToken);
      await saveSpotifyTokenToDatabase(username, access_token, newRefreshToken);
    } else {
      await saveSpotifyTokenToDatabase(username, access_token, refreshToken);
    }

    if (spotifyUsername && spotifyEmail) {
      await saveSpotifyProfileToDatabase(username, spotifyUsername, spotifyEmail, spotifyImage);
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

      const userProfile = await fetchSpotifyUserProfile(access_token);
      if (userProfile && userProfile.username && userProfile.email) {
        await saveSpotifyProfileToDatabase(username, userProfile.username, userProfile.email, userProfile.image);
      } else {
        console.error("Failed to fetch Spotify user profile.");
      }

      await saveSpotifyTokenToDatabase(username, access_token, refresh_token);
      
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  }
};

export const fetchSpotifyTokenFromDatabase = async (username, setSpotifyToken, setRefreshToken) => {
  try {
    const userId = await fetchUserId(username);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/spotify-data/user/${userId}`);
    if (response.ok) {
      const data = await response.json();
      const refreshTokenFromDatabase = data[0].refreshToken;
      if (refreshTokenFromDatabase) {
        await refreshSpotifyToken(username, refreshTokenFromDatabase, setSpotifyToken, setRefreshToken);
      }
    }
  } catch (error) {
    console.error("Error fetching Spotify token from database:", error);
  }
};

export const spotifyApiInstance = spotifyApi;
