import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        id="searchbar"
        name="searchbar"
        className="search-bar-input"
        placeholder="Search songs, profiles, artists..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
      />
      <span className="search-icon">
        <FontAwesomeIcon icon={faSearch} />
      </span>
    </div>
  );
}
