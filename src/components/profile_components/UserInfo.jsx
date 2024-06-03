import "./styles/UserInfo.css";
import userInfoImg from "../../assets/icon_images/user-icon.png";
import CurrentSong from "./CurrentSong";
import { useEffect, useState } from "react";

export default function UserInfo({ username, spotifyApi, spotifyToken }) {
  const storedUsername = localStorage.getItem("username");
  const [storedUsernameId, setStoredUsernameId] = useState();
  const [usernameId, setUsernameId] = useState();
  const [existingFriendship, setExistingFriendship] = useState(false);
  const [friendCount, setFriendCount] = useState(0);

  async function checkFriendship(user1Id, user2Id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/friendships/exists?user1Id=${user1Id}&user2Id=${user2Id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setExistingFriendship(data);
      } else {
        console.error("Failed to check friendship status:", response.statusText);
      }
    } catch (error) {
      console.error("Error checking friendship status:", error);
    }
  }

  async function fetchUserId(name) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/username/${name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.userId;
      } else {
        console.error("Failed to fetch user ID:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  }

  async function fetchFriendCount(userId) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/friendships/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFriendCount(data.length); 
      } else {
        console.error("Failed to fetch friend count:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching friend count:", error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const [user1Id, user2Id] = await Promise.all([
        fetchUserId(storedUsername),
        fetchUserId(username),
      ]);

      if (user1Id && user2Id) {
        setStoredUsernameId(user1Id);
        setUsernameId(user2Id);
        checkFriendship(user1Id, user2Id);
        fetchFriendCount(user2Id); 
      }
    }

    fetchData();
  }, [storedUsername, username]);

  async function handleClickAddButton(user1Id, user2Id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/friendships`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user1Id,
            user2Id
          }),
        }
      );
      if (response.ok) {
        setExistingFriendship(true);
        console.log("Friendship created");
      } else {
        console.error("Failed to create friendship:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error creating friendship:", error);
    }
  }

  return (
    <div className="user-info-main-div">
      <div className="user-info-div">
        <img className="user-info-img" src={userInfoImg} alt="User Icon" />
        <div className="user-info-p-div">
          <p className="p-username">{username}</p>
          <p>Friends: {friendCount}</p> 
        </div>
        {storedUsername !== username && !existingFriendship && (
          <div className="add-friend-div">
            <button className="add-friend-button" onClick={() => handleClickAddButton(storedUsernameId, usernameId)}>Add friend</button>
          </div>
        )}
      </div>
      <CurrentSong spotifyToken={spotifyToken} spotifyApi={spotifyApi} />
    </div>
  );
}
