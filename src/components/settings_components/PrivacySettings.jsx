// PrivacySettings.js
import React, { useState, useEffect } from "react";

export default function PrivacySettings() {
  const username = localStorage.getItem("username");
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

  useEffect(() => {
    const checkPrivacy = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/username/${username}`);
        if (response.ok) {
          const userData = await response.json();
          setIsPrivacyChecked(userData.profileState === "PRIVATE");
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    checkPrivacy();
  }, [username]);

  async function handleCheckboxChange() {
    const confirmation = window.confirm("Are you sure you want to change this setting?");
    if (confirmation) {
      setIsPrivacyChecked(!isPrivacyChecked);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/username/${username}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profileState: isPrivacyChecked ? "PUBLIC" : "PRIVATE" }),
        });
        if (!response.ok) {
          throw new Error('Failed to update profile privacy');
        }
      } catch (error) {
        console.error('Error updating profile privacy:', error);
      }
    }
  }

  return (
    <div>
      <div className="option-div">
        <p>Make profile private</p>
        <input
          type="checkbox"
          id="checkboxInput"
          onChange={handleCheckboxChange}
          checked={isPrivacyChecked}
        />
        <label htmlFor="checkboxInput" className="toggleSwitch"></label>
      </div>
    </div>
  );
}
