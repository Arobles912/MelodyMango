import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongTop from "../components/song_components/SongTop";
import SongGenres from "../components/song_components/SongGenres";
import SongAnalysis from "../components/song_components/SongAnalysis";
import SongListeners from "../components/song_components/SongListeners";
import {
  getTokensFromUrl,
  fetchSpotifyTokenFromDatabase,
  refreshSpotifyToken,
} from "../utils/spotify_utils";
import "./styles/Artist.css";
import ArtistTop from "../components/artist_components/ArtistTop";
import ArtistTopTracks from "../components/artist_components/ArtistTopTracks";
import ArtistAlbums from "../components/artist_components/ArtistAlbums";
import ArtistListeners from "../components/artist_components/ArtistListeners";

export default function Artist() {
  return (
    <div className="bg-div-artist">
      <div className="main-artist-div">
        <ArtistTop/>
        <ArtistTopTracks/>
        <ArtistAlbums/>
        <ArtistListeners/>
      </div>
    </div>
  );
}

// useEffect(() => {
//   const fetchSongFeatures = async () => {
//     try {
//       if (tokensLoaded && songId && spotifyToken) {
//         const response = await fetch(`https://api.spotify.com/v1/audio-features/${songId}`, {
//           headers: {
//             Authorization: `Bearer ${spotifyToken}`,
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setSongFeatures(data);
//         } else {
//           console.error("Failed to fetch song features:", response.statusText);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching song features:", error);
//     }
//   };
//   fetchSongFeatures();
// }, [songId, spotifyToken, refreshToken, username, tokensLoaded]);
