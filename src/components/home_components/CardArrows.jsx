import React from 'react';
import "./styles/CardArrows.css"

export default function CardArrows({ currentIndex, setIndex, length }) {
  const handleMoveRight = () => {
    setIndex((prevIndex) => (prevIndex < length - 1 ? prevIndex + 1 : 0));
  };

  const handleMoveLeft = () => {
    setIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : length - 1));
  };

  return (
    <div className="info-lists-buttons">
      <button
        className="arrow-button"
        onClick={handleMoveLeft}
        disabled={length <= 1}
      >
        {"<"}
      </button>
      <button
        className="arrow-button"
        onClick={handleMoveRight}
        disabled={length <= 1}
      >
        {">"}
      </button>
    </div>
  );
}
