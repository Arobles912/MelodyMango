import React from "react";
import "./styles/ArtistTop.css";
import placeholderImage from "../../assets/icon_images/user-icon.png";

export default function ArtistTop({ artistInfo }) {
  const { name, images, genres, followers, popularity } = artistInfo;
  const imageUrl = images.length > 0 ? images[0].url : placeholderImage;

  return (
    <div className="artist-top-div-container">
      <h1>Artist Info</h1>
      <div className="artist-top-div">
        <div className="artist-img-div">
          <img src={imageUrl} alt={`${name}`} />
          <p>{name}</p>
        </div>
        <div className="artist-info-div">
          <div className="artist-info-genres-div">
            <p className="info-section-title">Genres:</p>
            <div className="info-section-artist-div">
              {genres.map((genre, index) => (
                <div key={index} className="info-section-artist">
                  <p className="info-section-name">{genre}</p>
                  {index < genres.length - 1 && <div className="separation-div-info"></div>}
                </div>
              ))}
            </div>
          </div>
          <div className="artist-info-followers-div">
            <p className="info-section-title">Followers:</p>
            <p className="info-section-name">{followers.total.toLocaleString()}</p>
          </div>
          <div className="artist-info-popularity-div">
            <p className="info-section-title">Popularity:</p>
            <p className="info-section-name">{popularity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
