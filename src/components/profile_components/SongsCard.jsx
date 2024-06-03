import { useEffect, useState, useRef } from "react";
import CardArrows from "./CardArrows";
import "./styles/SongsCard.css"

export default function SongsCard({ spotifyToken, timeRange, spotifyApi }) {
  const [topTracks, setTopTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  const songsListRef = useRef(null);

  useEffect(() => {
    const fetchSongData = async () => {
      try {
        const response = await spotifyApi.getMyTopTracks({
          limit: 50,
          time_range: timeRange,
        });
        setTopTracks(response.items);
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    };

    if (spotifyToken) {
      fetchSongData();
    } else{

    }
  }, [spotifyToken, timeRange]);

  useEffect(() => {
    if (songsListRef.current) {
      songsListRef.current.scrollTo({
        left: currentTrackIndex * songsListRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, [currentTrackIndex]);

  return (
    <div className="songs-div">
      <h2>
        Top Tracks from the past{" "}
        {timeRange === "medium_term"
          ? "6 months"
          : timeRange === "long_term"
          ? "1 year"
          : "4 weeks"}
      </h2>
      <div className="songs-list" ref={songsListRef}>
        {topTracks.map((track, index) => (
          <div key={track.id} className="song-list">
            <img src={track.album.images[0].url} alt={track.name} />
            <div className="song-info">
              <p className="song-title">
                {index + 1}.{" "}
                {track.name.length > 20
                  ? track.name.substring(0, 20) + "..."
                  : track.name}
              </p>
              <p className="song-artists">
                {track.artists.map((artist) => artist.name).join(", ").length >
                20
                  ? track.artists
                      .map((artist) => artist.name)
                      .join(", ")
                      .substring(0, 20) + "..."
                  : track.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
      <CardArrows
        currentIndex={currentTrackIndex}
        setIndex={setCurrentTrackIndex}
        length={topTracks.length}
      />
    </div>
  );
}
