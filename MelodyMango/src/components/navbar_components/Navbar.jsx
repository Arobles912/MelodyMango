import React from "react";
import "./styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faGear } from '@fortawesome/free-solid-svg-icons';
import SearchBar from "./SearchBar";


export default function Navbar({
  username,
  setIsLoggedIn,
  setToken,
  setUsername,
  setSearchTerm
}) {
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
      setIsLoggedIn(false);
      navigate("/");
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
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <nav>
      <div className="nav-link-div">
        <a className="nav-link" name="addproject" href="/">
          Home
        </a>
        <div className="separation-div"></div>
        <a className="nav-link" name="addcustomer" href="/">
          Account
        </a>
        <div className="separation-div"></div>
        <a className="nav-link" name="addcustomer" href="/">
          Browse
        </a>
        <div className="separation-div"></div>
        <a className="nav-link" name="addcustomer" href="/">
          Top
        </a>
      </div>
      <div className="logo-container">
        <img
          className="navbar-logo"
          src="src/assets/logos/melodymango-logo-removebg.png"
          alt="example-logo"
        />
        <h3>Melody Mango</h3>
      </div>
      <div className="search-bar-div">
        <SearchBar setSearchTerm={setSearchTerm}/>
      </div>
      <div className="right-side-div">
        <img
          className="user-icon-img"
          src="src/assets/icon_images/user-icon.png"
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
              <img src="src/assets/icon_images/user-icon.png" alt="user-icon"></img>
              <span>{username}</span>
            </div>
            <hr />
            <div className="dropdown-link-div">
            <FontAwesomeIcon icon={faUsers}  className="link-icon"/>
              <a href="">Friends</a>
            </div>
            <div className="dropdown-link-div">
            <FontAwesomeIcon icon={faGear}  className="link-icon"/>
              <a href="">Settings</a>
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
