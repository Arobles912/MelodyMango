import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ProfileSettings from "../components/settings_components/ProfileSettings";
import PrivacySettings from "../components/settings_components/PrivacySettings";
import "./styles/Settings.css";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const username = localStorage.getItem("username");
  const [selectedLink, setSelectedLink] = useState("Profile");
  const navigate = useNavigate();

  async function handleReturnButton() {
    navigate("/home");
  }

  return (
    <div className="bg-div-settings">
      <div className="main-settings-div">
        <div className="settings-top-div-container">
          <div className="return-top-div">
            <button type="button" onClick={handleReturnButton}>
              <FontAwesomeIcon icon={faArrowLeft} className="arrow-icon" />
            </button>
            <h4>{selectedLink}</h4>
          </div>
          <div className="settings-top-div">
            <h2>Settings</h2>
          </div>
        </div>
        <div className="body-container-settings">
          <aside>
            <div
              className={`aside-link ${selectedLink === "Profile" ? "active" : ""}`}
              onClick={() => setSelectedLink("Profile")}
            >
              <FontAwesomeIcon icon={faUser} className="aside-link-icon" />
              <span>Profile</span>
            </div>
            <div
              className={`aside-link ${selectedLink === "Privacy" ? "active" : ""}`}
              onClick={() => setSelectedLink("Privacy")}
            >
              <FontAwesomeIcon icon={faLock} className="aside-link-icon" />
              <span>Privacy</span>
            </div>
          </aside>
          <div className="options-div-container">
            {selectedLink === "Profile" && <ProfileSettings />}
            {selectedLink === "Privacy" && <PrivacySettings />}
          </div>
        </div>
      </div>
    </div>
  );
}