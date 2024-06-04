import "./styles/Settings.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUser, faLock, faBars } from "@fortawesome/free-solid-svg-icons";
import { optionData } from "../utils/options";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [selectedLink, setSelectedLink] = useState("General");
  const [currentOptions, setCurrentOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const newOptions = optionData[selectedLink] || []; 
    setCurrentOptions(newOptions);
  }, [selectedLink]);

  async function handleReturnButton(){
    navigate("/home");
  }

  return (
    <div className="bg-div-settings">
      <div className="main-settings-div">
        <div className="settings-top-div-container">
          <div className="return-top-div">
            <button type="button" onClick={handleReturnButton}> {"<--"}</button>
            <h4>{selectedLink}</h4>
          </div>
          <div className="settings-top-div">
            <h2>Settings</h2>
          </div>
        </div>
        <div className="body-container-settings">
          <aside>
            <div
              className={`aside-link ${
                selectedLink === "General" ? "active" : ""
              }`}
              onClick={() => setSelectedLink("General")}
            >
              <FontAwesomeIcon icon={faGear} className="aside-link-icon" />
              <span>General</span>
            </div>
            <div
              className={`aside-link ${
                selectedLink === "Profile" ? "active" : ""
              }`}
              onClick={() => setSelectedLink("Profile")}
            >
              <FontAwesomeIcon icon={faUser} className="aside-link-icon" />
              <span>Profile</span>
            </div>
            <div
              className={`aside-link ${
                selectedLink === "Privacy" ? "active" : ""
              }`}
              onClick={() => setSelectedLink("Privacy")}
            >
              <FontAwesomeIcon icon={faLock} className="aside-link-icon" />
              <span>Privacy</span>
            </div>
            <div
              className={`aside-link ${selectedLink === "Other" ? "active" : ""}`}
              onClick={() => setSelectedLink("Other")}
            >
              <FontAwesomeIcon icon={faBars} className="aside-link-icon" />
              <span>Other</span>
            </div>
          </aside>
          <div className="options-div-container">
            {currentOptions.map((option) => (
              <div className="option-div" key={option.id}>
                <p>{option.label}</p>
                <input type="checkbox" id={option.id} />
                <label for={option.id} class="toggleSwitch"></label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
