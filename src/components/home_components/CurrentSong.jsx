import React, { useState, useEffect, useRef } from "react";
import "./styles/CurrentSong.css"

export default function CurrentSong({ spotifyToken, spotifyApi }) {
  const [currentSong, setCurrentSong] = useState({
    name: "",
    artist: "",
    albumImage: "",
  });

  const nameRef = useRef(null);
  const artistRef = useRef(null);

  useEffect(() => {
    if (spotifyToken) {
      spotifyApi.setAccessToken(spotifyToken);
      getCurrentSong();
      const interval = setInterval(() => {
        getCurrentSong();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [spotifyToken]);

  useEffect(() => {
    const nameElement = nameRef.current;
    const artistElement = artistRef.current;
    if (nameElement && artistElement) {
      const nameOverflow = nameElement.scrollWidth > nameElement.clientWidth;
      const artistOverflow = artistElement.scrollWidth > artistElement.clientWidth;

      if (nameOverflow) {
        nameElement.classList.add("slide-in");
      } else {
        nameElement.classList.remove("slide-in");
      }

      if (artistOverflow) {
        artistElement.classList.add("slide-in");
      } else {
        artistElement.classList.remove("slide-in");
      }
    }
  }, [currentSong]);

  function getCurrentSong() {
    spotifyApi.getMyCurrentPlayingTrack().then((response) => {
      if (response && response.item) {
        setCurrentSong({
          name: response.item.name,
          artist: response.item.artists[0].name,
          albumImage: response.item.album.images[0].url,
        });
      } else {
        setCurrentSong({
          name: "No song currently playing.",
          artist: "",
          albumImage: "src/assets/logos/melodymango-logo.jpeg",
        });
      }
    }).catch((err) => {
      console.error("Error fetching current song:", err);
    });
  }

  return (
    <div className="container-song-div">
    <div className="main-song-div">
      <div className="img-div">
        {currentSong.albumImage && (
          <img src={currentSong.albumImage} alt="Album Cover" />
        )}
      </div>
      <div
        className="info-background"
        style={{
          backgroundImage: `url(${currentSong.albumImage})`,
        }}
      />
      <div className="info-div">
        <p ref={nameRef} className="name-p">
          {currentSong.name}
        </p>
        <p ref={artistRef} className="artist-p">
          {currentSong.artist}
        </p>
      </div>
      <div className="loader"></div>
    </div>
    </div>
  );
}

