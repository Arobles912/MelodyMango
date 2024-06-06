import React from "react";
import { useState, useEffect, useRef } from "react";
import "./styles/ArtistAlbums.css";
import CardArrows from "../profile_components/CardArrows";

export default function ArtistAlbums({ artistAlbums }) {
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);

  const artistAlbumsRef = useRef(null);

  useEffect(() => {
    if (artistAlbumsRef.current) {
      artistAlbumsRef.current.scrollTo({
        left: currentAlbumIndex * artistAlbumsRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, [currentAlbumIndex]);

  return (
    <div className="artist-albums-div">
      <h2>Albums</h2>
      <div className="artist-albums-list" ref={artistAlbumsRef}>
        {artistAlbums.length > 0 ? (
          artistAlbums.map((album, index) => (
            <div key={index} className="artist-album-list">
              <img src={album.images[0].url} alt={album.name} />
              <div className="artist-album-info">
                <p className="artist-album-title">{album.name}</p>
                <p className="artist-album-date">{album.release_date}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No albums available</p>
        )}
      </div>
      <CardArrows
        currentIndex={currentAlbumIndex}
        setIndex={setCurrentAlbumIndex}
        length={artistAlbums.length}
      />
    </div>
  );
}
