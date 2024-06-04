import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faGear } from '@fortawesome/free-solid-svg-icons';
import SearchBar from "./SearchBar";
import "./styles/Navbar.css";
import { spotifyUserImage } from "../../utils/api_calls";
import logo from '../../assets/logos/melodymango-logo-removebg.png';


export default function Navbar({ setIsLoggedIn, setToken, spotifyApi }) {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const dropdownRef = useRef(null);



  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      setToken(null);
      localStorage.removeItem("token");
      setUsername("");
      localStorage.removeItem("username");
      localStorage.removeItem("spotifyToken");
      localStorage.removeItem("spotifyRefreshToken");
      localStorage.removeItem("spotifyUserImage");
      localStorage.removeItem("spotifyLoggedUserImage");
      setIsLoggedIn(false);
      navigate("/");
      const width = 700;
      const height = 500;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const spotifyLogoutWindow = window.open(
        "https://www.spotify.com/logout/",
        "Spotify Logout",
        `width=${width},height=${height},top=${top},left=${left}`
      );
      setTimeout(() => {
        spotifyLogoutWindow.close();
      }, 2000);
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    setUsername(localStorage.getItem("username"))
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <nav>
      <div className="nav-link-div">
        <Link className="nav-link" to="/home">
          Home
        </Link>
        <div className="separation-div"></div>
        <Link className="nav-link" to={`/profile/${username}`}>
          Profile
        </Link>
        <div className="separation-div"></div>
        <Link className="nav-link" to="/browse">
          Browse
        </Link>
        <div className="separation-div"></div>
        <Link className="nav-link" to="/top">
          Top
        </Link>
      </div>
      <div className="logo-container">
        <img
          className="navbar-logo"
          src={logo}
          alt="example-logo"
        />
        <h3>Melody Mango</h3>
      </div>
      <div className="search-bar-div">
        <SearchBar />
      </div>
      <div className="right-side-div">
        <img
          className="user-icon-img"
          src={spotifyUserImage}
          alt="user-icon"
          onClick={toggleMenu}
          ref={dropdownRef}
        ></img>
        <p className="user-name" onClick={toggleMenu} ref={dropdownRef}>
          {username}
        </p>
        <div className={menuVisible ? "dropdown-container show" : "dropdown-container"}>
          <div
            className={menuVisible ? "dropdown-content show" : "dropdown-content"}
          >
            <div>
              <img src={spotifyUserImage} alt="user-icon"></img>
              <span>{username}</span>
            </div>
            <hr />
            <div className="dropdown-link-div">
              <FontAwesomeIcon icon={faUsers} className="link-icon"/>
              <Link to={`/friends`}>Friends</Link>
            </div>
            <div className="dropdown-link-div">
              <FontAwesomeIcon icon={faGear} className="link-icon"/>
              <Link to="/settings">Settings</Link>
            </div>
            <hr id="hr-2"/>
            <button name="logoutbutton" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
