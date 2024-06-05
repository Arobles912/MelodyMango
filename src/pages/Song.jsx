import SongAnalysis from "../components/song_components/SongAnalysis";
import SongGenres from "../components/song_components/SongGenres";
import SongListeners from "../components/song_components/SongListeners";
import SongTop from "../components/song_components/SongTop";
import "./styles/Song.css";

export default function Song() {
  return (
    <div className="bg-div-song">
      <div className="main-song-div">
        <SongTop />
        <SongGenres/>
        <SongAnalysis/>
        <SongListeners/>
      </div>
    </div>
  );
}
