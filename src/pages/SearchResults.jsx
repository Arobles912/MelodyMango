import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./styles/SearchResults.css";
import placeHolderImage from "../assets/icon_images/user-icon.png";

export default function SearchResults({ spotifyApi }) {
  const [searchTracks, setSearchTracks] = useState([]);
  const [searchArtists, setSearchArtists] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [userImages, setUserImages] = useState({});
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await spotifyApi.search(query, ["track", "artist"], {
          limit: 20,
        });
        setSearchTracks(response.tracks.items);
        setSearchArtists(response.artists.items);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query, spotifyApi]);

  useEffect(() => {
    const fetchUsersFromDatabase = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users/search/${query}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          setSearchUsers(data);
          data.forEach(user => fetchSpotifyImageForUser(user.userId));
        } else {
          console.error("Error: Expected a user object");
          setSearchUsers([]);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setSearchUsers([]);
      }
    };

    if (query) {
      fetchUsersFromDatabase();
    }
  }, [query]);

  const fetchSpotifyImageForUser = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/spotify-data/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].spotifyImage) {
          setUserImages(prevImages => ({
            ...prevImages,
            [userId]: data[0].spotifyImage
          }));
        }
      } else {
        console.error("Failed to fetch Spotify image:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching Spotify image:", error);
    }
  };

  return (
    <div className="bg-div-search">
      <div className="search-results-container">
        <h2 className="search-results-h2">Search Results for "{query}"</h2>
        <div className="results-list">
          <div className="tracks-section">
            <h3>Tracks</h3>
            {searchTracks.length > 0 ? (
              searchTracks.map((track) => (
                <Link to={`/song/${track.id}`} key={track.id} className="result-item">
                  <img src={track.album.images[0]?.url} alt={track.name} />
                  <div className="result-info-track">
                    <p className="result-title">{track.name}</p>
                    <p className="result-artists">
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No tracks found</p>
            )}
          </div>
          <div className="artists-section">
            <h3>Artists</h3>
            {searchArtists.length > 0 ? (
              searchArtists.map((artist) => (
                <Link to={`/artist/${artist.id}`} key={artist.id} className="result-item">
                  {artist.images[0] ? (
                    <img src={artist.images[0].url} alt={artist.name} />
                  ) : (
                    <img
                      className="placeholder-artist-img"
                      src={placeHolderImage}
                      alt={artist.name}
                    />
                  )}
                  <div className="result-info">
                    <p className="result-title">{artist.name}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No artists found</p>
            )}
          </div>
          <div className="users-section">
            <h3>Users</h3>
            {searchUsers.length > 0 ? (
              searchUsers.map((user) => (
                <Link key={user.userId} to={`/profile/${user.username}`} className="result-item">
                  <img
                    src={userImages[user.userId] || placeHolderImage}
                    alt={user.username}
                  />
                  <div className="result-info-user">
                    <p className="result-title">{user.username}</p>
                    <p className="result-email">{user.email}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
