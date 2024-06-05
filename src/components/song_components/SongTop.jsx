import songImg from "../../assets/bg_images/bg-image3.jpg";
import "./styles/SongTop.css";

export default function SongTop() {
  return (
    <div className="song-top-div-container">
              <h1>Song Info</h1>
    <div className="song-top-div">
      <div className="song-img-div">
        <img src={songImg} alt="song-img" />
        <p>Song title</p>
      </div>
      <div className="song-info-div">
        <div className="song-info-artists-div">
          <p className="info-section-title">Artists:</p>
          <p className="info-section-name">Artist name</p>
          <div className="separation-div-info"></div>
          <p className="info-section-name">Artist name</p>
          <div className="separation-div-info"></div>
          <p className="info-section-name">Artist name</p>
        </div>
        <div className="song-info-albums-div">
          <p className="info-section-title">Albums:</p>
          <p className="info-section-name">Album name</p>
          <div className="separation-div-info"></div>
          <p className="info-section-name">Album name</p>
        </div>
        <div className="song-info-duration-div">
          <p className="info-section-title">Duration:</p>
          <p className="info-section-name">2:45</p>
        </div>
        <div className="song-info-date-div">
          <p className="info-section-title">Release date:</p>
          <p className="info-section-name">12-05-2024</p>
        </div>
      </div>
    </div>
    </div>
  );
}
