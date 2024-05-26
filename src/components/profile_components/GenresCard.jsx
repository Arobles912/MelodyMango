import { useEffect, useState, useRef } from "react";
import CardArrows from "./CardArrows";
import "./styles/GenresCard.css";

export default function GenresCard({ spotifyToken, timeRange, spotifyApi }) {
  const [topGenres, setTopGenres] = useState([]);
  const [currentGenreIndex, setCurrentGenreIndex] = useState(0);

  const genresListRef = useRef(null);

  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        const artistsResponse = await spotifyApi.getMyTopArtists({
          limit: 50,
          time_range: timeRange,
        });
        const artists = artistsResponse.items;

        const genreCount = {};
        artists.forEach(artist => {
          artist.genres.forEach(genre => {
            genreCount[genre] = (genreCount[genre] || 0) + 1;
          });
        });

        const sortedGenres = Object.entries(genreCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 50)
          .map(([genre]) => genre);

        setTopGenres(sortedGenres);
      } catch (error) {
        console.error("Error fetching top genres:", error);
      }
    };

    if (spotifyToken) {
      fetchGenreData();
    }
  }, [spotifyToken, timeRange, spotifyApi]);

  useEffect(() => {
    if (genresListRef.current) {
      genresListRef.current.scrollTo({
        left: currentGenreIndex * genresListRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, [currentGenreIndex]);

  return (
    <div className="genres-div">
      <h2>
        Top Genres from the past{" "}
        {timeRange === "medium_term"
          ? "6 months"
          : timeRange === "long_term"
          ? "1 year"
          : "4 weeks"}
      </h2>
      <div className="genres-list" ref={genresListRef}>
        {topGenres.map((genre, index) => (
          <div key={index} className="genre-list">
            <div className="genre-info">
              <p className="genre-title">
                {index + 1}. {genre}
              </p>
            </div>
          </div>
        ))}
      </div>
      <CardArrows
        currentIndex={currentGenreIndex}
        setIndex={setCurrentGenreIndex}
        length={topGenres.length}
      />
    </div>
  );
}
