import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import PrivateLayout from "./PrivateLayout";
import Home from "./pages/Home";
import Friends from "./pages/Friends";
import FriendRequests from "./pages/FriendRequests";
import { spotifyApiInstance as spotifyApi } from "./utils/spotify_utils";
import Settings from "./pages/Settings";
import Song from "./pages/Song";
import Artist from "./pages/Artist";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [spotifyToken, setSpotifyToken] = useState(
    localStorage.getItem("spotifyToken") || ""
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to={`/home`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
              setUsername={setUsername}
              username={username}
            />
          }
        />
        <Route
          path="/register"
          element={<Register setUsername={setUsername} username={username} />}
        />
        <Route path="/settings" element={<Settings />} />
        <Route
          element={
            <PrivateLayout
              setIsLoggedIn={setIsLoggedIn}
              setToken={setSpotifyToken}
            />
          }
        >
          <Route path="/friend-requests" element={<FriendRequests />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/song/:songId" element={<Song/>} />
          <Route path="/artist/:artistId" element={<Artist/>} />
          <Route
            path="/search"
            element={<SearchResults spotifyApi={spotifyApi} />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
