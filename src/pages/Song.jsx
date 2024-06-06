import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongTop from "../components/song_components/SongTop";
import SongGenres from "../components/song_components/SongGenres";
import SongAnalysis from "../components/song_components/SongAnalysis";
import SongListeners from "../components/song_components/SongListeners";
import { getTokensFromUrl, fetchSpotifyTokenFromDatabase, refreshSpotifyToken } from "../utils/spotify_utils";
import "./styles/Song.css";

export default function Song() {
  const { songId } = useParams();
  const username = localStorage.getItem("username");
  const [spotifyToken, setSpotifyToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [tokensLoaded, setTokensLoaded] = useState(false);
  const [songInfo, setSongInfo] = useState(null);
  const [songGenres, setSongGenres] = useState([]);
  const [songAnalysis, setSongAnalysis] = useState(null);
  const [songFeatures, setSongFeatures] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      await getTokensFromUrl(username, setSpotifyToken, setRefreshToken);
      await fetchSpotifyTokenFromDatabase(username, setSpotifyToken, setRefreshToken);
      setTokensLoaded(true);
    };

    fetchTokens();
  }, [username]);

  useEffect(() => {
    const fetchSongInfo = async () => {
      try {
        if (tokensLoaded && songId && spotifyToken) {
          const response = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
            headers: {
              Authorization: `Bearer ${spotifyToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setSongInfo(data);
            fetchArtistGenres(data.artists);
            fetchSongAnalysis(data.id);
            fetchSongFeatures(data.id);
          } else {
            console.error("Failed to fetch song info:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching song info:", error);
      }
    };

    fetchSongInfo();
  }, [songId, spotifyToken, refreshToken, username, tokensLoaded]);

  const fetchArtistGenres = async (artists) => {
    let uniqueGenres = [];
    for (const artist of artists) {
      try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artist.id}`, {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
        });
        if (response.ok) {
          const artistData = await response.json();
          uniqueGenres = [...new Set([...uniqueGenres, ...artistData.genres])];
        } else {
          console.error("Failed to fetch artist info:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching artist info:", error);
      }
    }
    setSongGenres(uniqueGenres);
  };

  const fetchSongAnalysis = async (songId) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/audio-analysis/${songId}`, {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSongAnalysis(data);
      } else {
        console.error("Failed to fetch song analysis:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching song analysis:", error);
    }
  };

  const fetchSongFeatures = async (songId) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/audio-features/${songId}`, {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSongFeatures(data);
      } else {
        console.error("Failed to fetch song features:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching song features:", error);
    }
  };

  return (
    <div className="bg-div-song">
      {!songInfo && (
        <div className="no-song-div">
          <h1 className="no-song-h1">Loading...</h1>
        </div>
      )}
      {songInfo && (
        <div className="main-song-div">
          <SongTop songInfo={songInfo}/>
          <SongGenres songGenres={songGenres}/>
          <SongAnalysis songAnalysis={songAnalysis} songFeatures={songFeatures}/>
          <SongListeners songInfo={songInfo}/>
        </div>
      )}
    </div>
  );
}
