// src/spotify_calls/spotify_calls.js

import SpotifyWebApi from "spotify-web-api-js";
import queryString from "query-string";

const spotifyApi = new SpotifyWebApi();

export async function refreshSpotifyToken(refreshToken) {
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

    localStorage.setItem("spotifyToken", access_token);
    spotifyApi.setAccessToken(access_token);

    if (newRefreshToken) {
      localStorage.setItem("spotifyRefreshToken", newRefreshToken);
    }

    console.log("Spotify token refreshed:", access_token);

    return { access_token, refresh_token: newRefreshToken };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

export async function getTokensFromUrl() {
  const params = queryString.parse(window.location.search);
  const code = params.code;

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

      localStorage.setItem("spotifyToken", access_token);
      localStorage.setItem("spotifyRefreshToken", refresh_token);

      spotifyApi.setAccessToken(access_token);

      return { access_token, refresh_token };
    } catch (error) {
      console.error('Error fetching tokens:', error);
      return null;
    }
  }
}

export function handleLogin() {
  window.location = `https://accounts.spotify.com/authorize?client_id=${
    import.meta.env.VITE_SPOTIFY_CLIENT_ID
  }&response_type=code&redirect_uri=${
    import.meta.env.VITE_SPOTIFY_REDIRECT_URI
  }&scope=user-top-read user-read-currently-playing user-read-playback-state`;
}
