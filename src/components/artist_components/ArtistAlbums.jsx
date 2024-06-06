import "./styles/ArtistAlbums.css";
import listenerImg from "../../assets/bg_images/main-home-image2.jpeg";
import CardArrows from "../profile_components/CardArrows";
import { useState } from "react";

export default function ArtistAlbums() {
  const [currentListenerIndex, setCurrentListenerIndex] = useState(0);

  return (
    <div className="artist-albums-div">
      <h2>Albums</h2>
      <div className="artist-albums-list">
        <div className="artist-album-list">
          <img src="" alt="artist-album-img" />
          <div className="artist-album-info">
            <p className="artist-album-title">Album name</p>
            <p className="artist-album-date">2019</p>
          </div>
        </div>
      </div>
      <CardArrows
        currentIndex={currentListenerIndex}
        setIndex={setCurrentListenerIndex}
        length={10}
      />
    </div>
  );
}
