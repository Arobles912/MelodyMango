import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/Friends.css";

export default function FriendRequests() {
  const storedUsername = localStorage.getItem("username");
  const [storedUsernameId, setStoredUsernameId] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);

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

  async function fetchPendingFriendRequests(userId) {
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
        const filteredRequests = data.filter(
          (friendship) =>
            friendship.status === "PENDING" &&
            friendship.user1.userId !== userId
        );
        return filteredRequests;
      } else {
        console.error("Failed to fetch friend requests:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      return [];
    }
  }

  async function updateFriendRequestStatus(friendshipId, status) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/friendships/${friendshipId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (response.ok) {
        setFriendRequests((prevRequests) =>
          prevRequests.filter(
            (request) => request.friendshipId !== friendshipId
          )
        );
      } else {
        console.error("Failed to update friend request:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating friend request:", error);
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
        setFriendRequests((prevRequests) =>
          prevRequests.filter(
            (request) => request.friendshipId !== friendshipId
          )
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
      "Are you sure you want to delete this friend request?"
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
    async function fetchAndSetFriendRequests() {
      if (storedUsernameId) {
        const fetchedRequests = await fetchPendingFriendRequests(
          storedUsernameId
        );
        setFriendRequests(fetchedRequests);
      }
    }

    fetchAndSetFriendRequests();
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
            {friendRequests.map((request) => {
              const friend =
                request.user1.userId === storedUsernameId
                  ? request.user2
                  : request.user1;
              return (
                <div key={request.friendshipId} className="friend-item">
                  <div className="left-friend-item-div">
                    <img
                      className="friend-image"
                      src="src/assets/icon_images/user-icon.png"
                      alt="friend"
                    />
                    <div className="friend-info-request">
                      <Link
                        className="friend-username-request-p"
                        to={`/profile/${friend.username}`}
                      >
                        <p>{friend.username}</p>
                      </Link>
                    </div>
                  </div>
                  <div className="right-friend-item-div">
                    <button
                      onClick={() =>
                        updateFriendRequestStatus(
                          request.friendshipId,
                          "ACCEPTED"
                        )
                      }
                    >
                      Add
                    </button>
                    <button
                      onClick={() => handleDeleteFriend(request.friendshipId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
