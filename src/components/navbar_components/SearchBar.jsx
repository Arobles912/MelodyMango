import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar({ setSearchTerm }) {
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        id="searchbar"
        name="searchbar"
        className="search-bar-input"
        placeholder="Search songs, profiles, artists..."
        onChange={handleSearchChange}
      />
      <span className="search-icon">
        <FontAwesomeIcon icon={faSearch} />
      </span>
    </div>
  );
}
