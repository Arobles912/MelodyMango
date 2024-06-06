import "./styles/ArtistTopTracks.css";
import CardArrows from "../profile_components/CardArrows";
import { useState } from "react";

const tracks = [
  { name: "Song 1", img: "https://via.placeholder.com/150" },
  { name: "Song 2", img: "https://via.placeholder.com/150" },
  { name: "Song 3", img: "https://via.placeholder.com/150" },
  { name: "Song 4", img: "https://via.placeholder.com/150" },
  { name: "Song 5", img: "https://via.placeholder.com/150" },
  { name: "Song 6", img: "https://via.placeholder.com/150" },
  { name: "Song 7", img: "https://via.placeholder.com/150" },
  { name: "Song 8", img: "https://via.placeholder.com/150" },
  { name: "Song 9", img: "https://via.placeholder.com/150" },
  { name: "Song 10", img: "https://via.placeholder.com/150" },
  { name: "Song 11", img: "https://via.placeholder.com/150" },
  { name: "Song 12", img: "https://via.placeholder.com/150" },
];

export default function ArtistTopTracks() {
  const [currentListenerIndex, setCurrentListenerIndex] = useState(0);

  const renderTracks = () => {
    const rows = [];
    for (let i = 0; i < tracks.length; i += 10) {
      const rowTracks = tracks.slice(i, i + 10);
      rows.push(
        <div className="top-tracks-list" key={i}>
          {rowTracks.map((track, index) => (
            <div className="top-track-list" key={index}>
              <img src={track.img} alt={`top-track-${index}`} />
              <div className="top-track-info">
                <p className="top-track-title">{track.name}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="top-tracks-div">
      <h2>Top tracks</h2>
      {renderTracks()}
    </div>
  );
}
