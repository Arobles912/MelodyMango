import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/Friends.css";

export default function Friends() {
  const storedUsername = localStorage.getItem("username");
  const [storedUsernameId, setStoredUsernameId] = useState(null);
  const [friendships, setFriendships] = useState([]);
  const [friendSongs, setFriendSongs] = useState({});

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

  async function fetchUserFriendships(userId) {
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
        return data;
      } else {
        console.error("Failed to fetch friendships:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("Error fetching friendships:", error);
      return [];
    }
  }

  async function fetchCurrentSong(token) {
    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.item) {
          return `${data.item.name} by ${data.item.artists
            .map((artist) => artist.name)
            .join(", ")}`;
        } else {
          return "No song playing";
        }
      } else {
        console.error("Failed to fetch current song:", response.statusText);
        return "No song playing";
      }
    } catch (error) {
      console.error("Error fetching current song:", error);
      return "No song playing";
    }
  }

  async function deleteFriendship(friendshipId) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/friendships/${friendshipId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setFriendships((prevFriendships) =>
          prevFriendships.filter((f) => f.friendshipId !== friendshipId)
        );
      } else {
        console.error("Failed to delete friendship:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting friendship:", error);
    }
  }

  const handleDeleteFriend = (friendshipId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this friend?"
    );
    if (confirmed) {
      deleteFriendship(friendshipId);
    }
  };

  useEffect(() => {
    async function fetchAndSetUserId() {
      const userId = await fetchUserId(storedUsername);
      setStoredUsernameId(userId);
    }

    fetchAndSetUserId();
  }, [storedUsername]);

  useEffect(() => {
    async function fetchAndSetFriendships() {
      if (storedUsernameId) {
        const fetchedFriendships = await fetchUserFriendships(storedUsernameId);
        const acceptedFriendships = fetchedFriendships.filter(
          (friendship) => friendship.status === "ACCEPTED"
        );
        setFriendships(acceptedFriendships);

        for (const friendship of acceptedFriendships) {
          const friend =
            friendship.user1.userId === storedUsernameId
              ? friendship.user2
              : friendship.user1;
          if (friend.userId !== storedUsernameId) {
            const song = await fetchCurrentSong(friend.spotifyToken);
            setFriendSongs((prevState) => ({
              ...prevState,
              [friend.userId]: song,
            }));
          }
        }
      }
    }

    fetchAndSetFriendships();
  }, [storedUsernameId]);

  return (
    <div className="bg-div-friends">
      <div className="friends-container">
        <div>
        <div className="friends-list-selector-div">
            <Link className="friends-link" to="/friends">
              <button type="button">Friends</button>
            </Link>
            <Link className="friends-link" to="/friend-requests">
              <button type="button">Friend requests</button>
            </Link>
          </div>
          <div className="friends-list">
            {friendships.map((friendship) => {
              const friend =
                friendship.user1.userId === storedUsernameId
                  ? friendship.user2
                  : friendship.user1;
              return (
                friend.userId !== storedUsernameId && (
                  <div key={friend.userId} className="friend-item">
                    <div className="left-friend-item-div">
                      <img
                        className="friend-image"
                        src="src/assets/icon_images/user-icon.png"
                        alt="friend"
                      />
                      <div className="friend-info">
                        <Link
                          className="friend-username-p"
                          key={friend.userId}
                          to={`/profile/${friend.username}`}
                        >
                          <span>{friend.username}</span>
                        </Link>
                        <p className="friend-song-p">
                          Listening to:{" "}
                          <span>
                            {friendSongs[friend.userId] || "Loading..."}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="right-friend-item-div">
                      <button
                        className=""
                        onClick={() =>
                          handleDeleteFriend(friendship.friendshipId)
                        }
                      >
                        Delete friend
                      </button>
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

