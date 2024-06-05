import React from "react";
import { useState, useRef, useEffect } from "react";
import CardArrows from "../profile_components/CardArrows";

export default function SongGenres({ songGenres }) {
  const [currentGenreIndex, setCurrentGenreIndex] = useState(0);
  const genresListRef = useRef(null);

  useEffect(() => {
    if (genresListRef.current) {
      genresListRef.current.scrollTo({
        left: currentGenreIndex * genresListRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, [currentGenreIndex]);

  return (
    <div className="song-genres-div">
      <h2 className="genres-title">Genres</h2>
      <div className="genres-list" ref={genresListRef}>
        {songGenres && songGenres.length > 0 ? (
          songGenres.map((songGenre, index) => (
            <div key={index} className="genre-list">
              <div className="genre-info">
                <p className="genre-title">{songGenre}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No genre information available</p>
        )}
      </div>
      <CardArrows
        currentIndex={currentGenreIndex}
        setIndex={setCurrentGenreIndex}
        length={songGenres.length} 
      />
    </div>
  );
}
