import React from "react";
import { Link } from "react-router-dom";
import "./styles/SongTop.css";

export default function SongTop({ songInfo }) {

  function convertMsToMinutesAndSeconds(durationInMs) {
    const minutes = Math.floor(durationInMs / 60000);
    const seconds = ((durationInMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
  }
  
  
  return (
    <div className="song-top-div-container">
      <h1>Song Info</h1>
      <div className="song-top-div">
        <div className="song-img-div">
          <img src={songInfo.album.images[0]?.url} alt={songInfo.name} />
          <p>{songInfo.name}</p>
        </div>
        <div className="song-info-div">
          <div className="song-info-artists-div">
            <p className="info-section-title">Artists:</p>
            {songInfo.artists.map((artist, index) => (
              <div key={artist.id} className="info-section-artist">
                <Link to={`/artist/${artist.id}`} className="info-section-name-link">{artist.name}</Link>
                {index !== songInfo.artists.length - 1 && <div className="separation-div-info"></div>}
              </div>
            ))}
          </div>
          <div className="song-info-albums-div">
            <p className="info-section-title">Album:</p>
            <p className="info-section-name">{songInfo.album.name}</p>
          </div>
          <div className="song-info-duration-div">
            <p className="info-section-title">Duration:</p>
            <p className="info-section-name">{convertMsToMinutesAndSeconds(songInfo.duration_ms)}</p>
          </div>
          <div className="song-info-date-div">
            <p className="info-section-title">Release date:</p>
            <p className="info-section-name">{songInfo.album.release_date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}