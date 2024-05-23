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
        <Route path="/home" element={<Profile setIsLoggedIn={setIsLoggedIn}/>} />
      </Routes>
    </Router>
  );
}

export default App;
