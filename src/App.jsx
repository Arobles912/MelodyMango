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
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} username={username} setUsername={setUsername}/>
            )
          }
        />
        <Route path="/register" element={<Register username={username} setUsername={setUsername} />} />
        
        <Route element={<PrivateLayout 
                          isLoggedIn={isLoggedIn} 
                          username={username} 
                          setIsLoggedIn={setIsLoggedIn} 
                          setToken={() => {}} 
                          setUsername={setUsername} 
                          spotifyApi={spotifyApi} />} >
          <Route path="/home" element={<Profile setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/search" element={<SearchResults spotifyApi={spotifyApi} />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
