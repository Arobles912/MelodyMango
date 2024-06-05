import { useState } from "react";
import CardArrows from "../profile_components/CardArrows";

// Uses the genres card css style

export default function SongGenres() {
    const [currentGenreIndex, setCurrentGenreIndex] = useState(0);

  return (
    <div className="song-genres-div">
      <h2 className="genres-title">Genres</h2>
      <div className="genres-list">
        <div className="genre-list">
          <div className="genre-info">
            <p className="genre-title">Test</p>
          </div>
        </div>
        <div className="genre-list">
          <div className="genre-info">
            <p className="genre-title">Test</p>
          </div>
        </div>
        <div className="genre-list">
          <div className="genre-info">
            <p className="genre-title">Test</p>
          </div>
        </div>
      </div>
      <CardArrows
        currentIndex={currentGenreIndex}
        setIndex={setCurrentGenreIndex}
        length={10}
      />
    </div>
  );
}
