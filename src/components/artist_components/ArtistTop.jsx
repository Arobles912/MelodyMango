import React from "react";
import "./styles/ArtistTop.css";
import placeholderImage from "../../assets/icon_images/user-icon.png"

export default function ArtistTop() {

  return (
    <div className="artist-top-div-container">
      <h1>Artist Info</h1>
      <div className="artist-top-div">
        <div className="artist-img-div">
          <img src={placeholderImage} alt="test" />
          <p>Artist name</p>
        </div>
        <div className="artist-info-div">
          <div className="artist-info-genres-div">
            <p className="info-section-title">Genres:</p>
              <div className="info-section-artist">
                <p className="info-section-name">EDM</p>
                <div className="separation-div-info"></div>
                <p className="info-section-name">Pop</p>
                <div className="separation-div-info"></div>
                <p className="info-section-name">Rock</p>
              </div>
          </div>
          <div className="artist-info-followers-div">
            <p className="info-section-title">Followers:</p>
            <p className="info-section-name">5.342.119</p>
          </div>
          <div className="artist-info-popularity-div">
            <p className="info-section-title">Popularity:</p>
            <p className="info-section-name">100</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // return (
  //   <div className="artist-top-div-container">
  //     <h1>artist Info</h1>
  //     <div className="artist-top-div">
  //       <div className="artist-img-div">
  //         <img src={artistInfo.images[0]?.url} alt={artistInfo.name} />
  //         <p>{artistInfo.name}</p>
  //       </div>
  //       <div className="artist-info-div">
  //         <div className="artist-info-genres-div">
  //           <p className="info-section-title">Genres:</p>
  //             <div key={genres.id} className="info-section-artist">
  //               <p className="info-section-name">EDM</p>
  //               <div className="separation-div-info"></div>
  //               <p className="info-section-name">Pop</p>
  //               <div className="separation-div-info"></div>
  //               <p className="info-section-name">Rock</p>
  //             </div>
  //         </div>
  //         <div className="artist-info-followers-div">
  //           <p className="info-section-title">Followers:</p>
  //           <p className="info-section-name">{artistInfo.followers.total}</p>
  //         </div>
  //         <div className="artist-info-popularity-div">
  //           <p className="info-section-title">Popularity:</p>
  //           <p className="info-section-name">{artistInfo.popularity}</p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
