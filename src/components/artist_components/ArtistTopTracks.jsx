import React, { useState, useRef, useEffect } from "react";
import "./styles/ArtistTopTracks.css";
import CardArrows from "../profile_components/CardArrows";
import { Link } from "react-router-dom";

export default function ArtistTopTracks({ topTracks }) {
  const [currentTopTrackIndex, setCurrentTopTrackIndex] = useState(0);

  const topTracksListRef = useRef(null);

  useEffect(() => {
    if (topTracksListRef.current) {
      topTracksListRef.current.scrollTo({
        left: currentTopTrackIndex * topTracksListRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, [currentTopTrackIndex]);

  return (
    <div className="top-tracks-div">
      <h2>Top tracks</h2>
      <div className="top-tracks-list" ref={topTracksListRef}>
        {topTracks.length > 0 ? (
          topTracks.map((track, index) => (
            <Link to={`/song/${track.id}`} key={track.id} className="top-track-list">
              <img src={track.album.images[0].url} alt={track.name} />
              <div className="top-track-info">
                <p className="top-track-title">{track.name}</p>
                <p className="top-track-number">{index + 1}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No top tracks information available</p>
        )}
      </div>
      <CardArrows
        currentIndex={currentTopTrackIndex}
        setIndex={setCurrentTopTrackIndex}
        length={topTracks.length}
      />
    </div>
  );
}
