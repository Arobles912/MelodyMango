import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import placeHolderImage from "../../assets/icon_images/user-icon.png";

export default function ProfileSettings() {
    const userImage = localStorage.getItem("spotifyLoggedUserImage") || placeHolderImage;
    const username = localStorage.getItem("username");
    const [userData, setUserData] = useState();
    const [spotifyUserData, setSpotifyData] = useState([]);
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserData(username) {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/users/username/${username}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    console.error("Failed to fetch user ID:", response.statusText);
                    return null;
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
                return null;
            }
        }

        fetchUserData(username);
    }, [username]);

    useEffect(() => {
        if (!userData || !userData.userId) return;

        async function fetchSpotifyData(userId) {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/spotify-data/user/${userId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    if (data.length === 0) {
                        alert("No Spotify data found for this user.");
                    }
                    setSpotifyData(data);
                } else {
                    console.error("Failed to fetch Spotify data:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching Spotify data:", error);
            }
        }

        fetchSpotifyData(userData.userId);
    }, [userData]);

    async function handleSaveChanges() {
        const confirmation = window.confirm("Are you sure you want to save these changes?");
        if (confirmation) {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/users/username/${username}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: newUsername || userData.username,
                            email: newEmail || userData.email,
                        }),
                    }
                );
                if (response.ok) {
                    const updatedData = await response.json();
                    setUserData(updatedData);
                    if (newUsername) {
                        localStorage.setItem("username", newUsername);
                    }
                    window.location.reload();
                } else {
                    console.error("Failed to update user data:", response.statusText);
                    alert("Username or email are already in use.");
                }
            } catch (error) {
                console.error("Error updating user data:", error);
                alert("Username or email are already in use");
            }
        }
    }

    async function handleUnlinkAccount() {
        if (!spotifyUserData.length) {
            alert("No Spotify data to unlink.");
            return;
        }

        const confirmation = window.confirm("Are you sure you want to unlink your Spotify account?");
        if (confirmation) {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/spotify-data/${spotifyUserData[0].dataId}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.ok) {
                    setSpotifyData([]);
                    localStorage.removeItem("spotifyRefreshToken");
                    localStorage.removeItem("spotifyToken");
                    localStorage.removeItem("spotifyUserImage");
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
                        navigate("/");
                        window.location.reload();
                    }, 500);
                } else {
                    console.error("Failed to unlink Spotify account:", response.statusText);
                }
            } catch (error) {
                console.error("Error unlinking Spotify account:", error);
            }
        }
    }

    return (
        <div className="profile-options-div">
            <div className="img-options-div">
                <img src={userImage} alt="user-profile" />
                <div className="user-info-profile-div">
                    <p>Username: {userData?.username}</p>
                    <p>Email: {userData?.email}</p>
                    <p>Spotify username: {spotifyUserData?.[0]?.spotifyUsername}</p>
                    <p>Spotify email: {spotifyUserData?.[0]?.spotifyEmail}</p>
                </div>
            </div>
            <div className="change-options-div">
                <p>Change username:</p>
                <input
                    type="text"
                    name="ch-username"
                    id="ch-username"
                    maxLength={50}
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                />
                <p>Change email:</p>
                <input
                    type="email"
                    name="ch-email"
                    id="ch-email"
                    maxLength={100}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
                <div className="unlink-account-div">
                    <p>Unlink spotify account:</p>
                    <button onClick={handleUnlinkAccount}>Unlink account</button>
                </div>
                <button className="save-changes-button" onClick={handleSaveChanges}>Save changes</button>
            </div>
        </div>
    );
}
