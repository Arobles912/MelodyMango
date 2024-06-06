import { useEffect, useState, useRef } from "react";
import CardArrows from "./CardArrows";
import "./styles/ArtistsCard.css"
import { Link } from "react-router-dom";

export default function ArtistsCard({ spotifyToken, timeRange, spotifyApi }) {
  const [topArtists, setTopArtists] = useState([]);
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
  
  const artistsListRef = useRef(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await spotifyApi.getMyTopArtists({
          limit: 50,
          time_range: timeRange,
        });
        setTopArtists(response.items);
      } catch (error) {
        console.error("Error fetching top artists:", error);
      }
    };

    if (spotifyToken) {
      fetchArtistData();
    }
  }, [spotifyToken, timeRange]);

  useEffect(() => {
    if (artistsListRef.current) {
      artistsListRef.current.scrollTo({
        left: currentArtistIndex * artistsListRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, [currentArtistIndex]);

  return (
    <div className="artists-div">
      <h2>
        Top Artists from the past{" "}
        {timeRange === "medium_term"
          ? "6 months"
          : timeRange === "long_term"
          ? "1 year"
          : "4 weeks"}
      </h2>
      <div className="artists-list" ref={artistsListRef}>
        {topArtists.map((artist, index) => (
          <Link to={`/artist/${artist.id}`} key={artist.id} className="artist-list">
            <img src={artist.images[0].url} alt={artist.name} />
            <div className="artist-info">
              <p className="artist-title">
                {index + 1}.{" "}
                {artist.name.length > 20
                  ? artist.name.substring(0, 20) + "..."
                  : artist.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <CardArrows
        currentIndex={currentArtistIndex}
        setIndex={setCurrentArtistIndex}
        length={topArtists.length}
      />
    </div>
  );
}
