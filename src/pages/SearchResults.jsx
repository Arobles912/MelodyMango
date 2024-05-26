import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./styles/SearchResults.css";

export default function SearchResults({ spotifyApi }) {
  const [searchTracks, setSearchTracks] = useState([]);
  const [searchArtists, setSearchArtists] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]); 
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const username = localStorage.getItem("username");

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
        console.log("User data response:", data); 

        if (response.ok) {
          setSearchUsers(data); 
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

  return (
    <div className="bg-div-search">
      <div className="search-results-container">
        <h2 className="search-results-h2">Search Results for "{query}"</h2>
        <div className="results-list">
          <div className="tracks-section">
            <h3>Tracks</h3>
            {searchTracks.length > 0 ? (
              searchTracks.map((track) => (
                <div key={track.id} className="result-item">
                  <img src={track.album.images[0]?.url} alt={track.name} />
                  <div className="result-info-track">
                    <p className="result-title">{track.name}</p>
                    <p className="result-artists">
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No tracks found</p>
            )}
          </div>
          <div className="artists-section">
            <h3>Artists</h3>
            {searchArtists.length > 0 ? (
              searchArtists.map((artist) => (
                <div key={artist.id} className="result-item">
                  {artist.images[0] ? (
                    <img src={artist.images[0].url} alt={artist.name} />
                  ) : (
                    <img
                      className="placeholder-artist-img"
                      src="src/assets/icon_images/user-icon.png"
                      alt={artist.name}
                    />
                  )}
                  <div className="result-info">
                    <p className="result-title">{artist.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No artists found</p>
            )}
          </div>
          <div className="users-section">
            <h3>Users</h3> {/* Cambiado a plural */}
            {searchUsers.length > 0 ? (
              searchUsers.map((user) => (
                <div key={user.userId} className="result-item">
                  <img
                    src={user.profileImage || "src/assets/icon_images/user-icon.png"}
                    alt={user.username}
                  />
                  <div className="result-info-user">
                    <p className="result-title">{user.username}</p>
                    <p className="result-email">{user.email}</p>
                  </div>
                </div>
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
