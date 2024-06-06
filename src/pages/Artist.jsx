import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArtistTop from "../components/artist_components/ArtistTop";
import ArtistTopTracks from "../components/artist_components/ArtistTopTracks";
import ArtistAlbums from "../components/artist_components/ArtistAlbums";
import ArtistListeners from "../components/artist_components/ArtistListeners";
import {
  getTokensFromUrl,
  fetchSpotifyTokenFromDatabase,
  refreshSpotifyToken,
} from "../utils/spotify_utils";
import "./styles/Artist.css";

export default function Artist() {
  const { artistId } = useParams();
  const username = localStorage.getItem("username");
  const [spotifyToken, setSpotifyToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [tokensLoaded, setTokensLoaded] = useState(false);
  const [artistInfo, setArtistInfo] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [artistAlbums, setArtistAlbums] = useState([]);

  useEffect(() => {
    const fetchTokens = async () => {
      await getTokensFromUrl(username, setSpotifyToken, setRefreshToken);
      await fetchSpotifyTokenFromDatabase(username, setSpotifyToken, setRefreshToken);
      setTokensLoaded(true);
    };

    fetchTokens();
  }, [username]);

  useEffect(() => {
    const fetchArtistInfo = async () => {
      try {
        if (tokensLoaded && artistId && spotifyToken) {
          const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
            headers: {
              Authorization: `Bearer ${spotifyToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setArtistInfo(data);
          } else {
            console.error("Failed to fetch artist info:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching artist info:", error);
      }
    };

    fetchArtistInfo();
  }, [artistId, spotifyToken, tokensLoaded]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        if (tokensLoaded && artistId && spotifyToken) {
          const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
            headers: {
              Authorization: `Bearer ${spotifyToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setTopTracks(data.tracks);
          } else {
            console.error("Failed to fetch top tracks:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    };

    fetchTopTracks();
  }, [artistId, spotifyToken, tokensLoaded]);

  useEffect(() => {
    const fetchArtistAlbums = async () => {
      try {
        if (tokensLoaded && artistId && spotifyToken) {
          const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
            headers: {
              Authorization: `Bearer ${spotifyToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setArtistAlbums(data.items);
          } else {
            console.error("Failed to fetch artist albums:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching artist albums:", error);
      }
    };

    fetchArtistAlbums();
  }, [artistId, spotifyToken, tokensLoaded]);

  return (
    <div className="bg-div-artist">
      {!artistInfo && (
        <div className="no-song-div">
          <h1 className="no-song-h1">Loading...</h1>
        </div>
      )}
        {artistInfo && (
                <div className="main-artist-div">
            <ArtistTop artistInfo={artistInfo} />
            <ArtistTopTracks topTracks={topTracks} />
            <ArtistAlbums artistAlbums={artistAlbums} />
            <ArtistListeners artistId={artistId} spotifyToken={spotifyToken} />
            </div>
        )}
    </div>
  );
}
