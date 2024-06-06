import "./styles/SongAnalysis.css";

export default function SongAnalysis({ songAnalysis, songFeatures }) {
  if (!songAnalysis || !songFeatures) {
    return (
      <div className="song-analysis-div-container">
        <h2>Song analysis</h2>
        <div className="song-analysis-data-div">
          <p>Loading analysis...</p>
        </div>
      </div>
    );
  }

  const toScale = (value, min, max) => Math.round(((value - min) / (max - min)) * 10);

  const acousticness = toScale(songFeatures.acousticness, 0, 1);
  const danceability = toScale(songFeatures.danceability, 0, 1);
  const energy = toScale(songFeatures.energy, 0, 1);
  const instrumentalness = toScale(songFeatures.instrumentalness, 0, 1);
  const liveness = toScale(songFeatures.liveness, 0, 1);
  const speechiness = toScale(songFeatures.speechiness, 0, 1);
  const valence = toScale(songFeatures.valence, 0, 1);
  const loudness = toScale(songFeatures.loudness, -60, 0); 

  return (
    <div className="song-analysis-div-container">
      <h2>Song analysis</h2>
      <div className="song-analysis-data-div">
        <div className="song-analysis-column">
          <p><span>BPM:</span> {songFeatures.tempo}</p>
          <p><span>Key:</span> {songFeatures.key}</p>
          <p><span>Mode:</span> {songFeatures.mode === 1 ? "Major" : "Minor"}</p>
          <p><span>Time Signature:</span> {songFeatures.time_signature}</p>
        </div>
        <div className="song-analysis-column">
          <p><span>Acousticness:</span> {acousticness}/10</p>
          <p><span>Danceability:</span> {danceability}/10</p>
          <p><span>Energy:</span> {energy}/10</p>
          <p><span>Instrumentalness:</span> {instrumentalness}/10</p>
        </div>
      </div>
    </div>
  );
}
