import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Login.css";
import Header from "../components/login_components/Header.jsx";
import Footer from "../components/login_components/Footer.jsx";

export default function Login({ setIsLoggedIn, setUsername }) {
  const [username, setLocalUsername] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
        navigate(`/home`);
      }
    }
  }, [setIsLoggedIn, setUsername, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password
        }),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("token", token); 
        localStorage.setItem("username", username);
        setIsLoggedIn(true);
        setUsername(username);
        navigate(`/home`);
      } else {
        const data = await response.json();
        setError(data.message || "Incorrect username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Failed to log user. Please try again later.");
    }
  };

  return (
    <div className="bg-div">
      <div className="main-div">
        <Header />
        <form onSubmit={handleLogin}>
          <h2>Log In</h2>
          <img
            className="icon-img"
            src="src/assets/icon_images/user-icon.png"
            alt="user-icon"
          />
          <label htmlFor="username">Username:</label>
          <br />
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setLocalUsername(e.target.value)}
            maxLength={30}
          />
          <br />
          <img
            className="icon-img"
            src="src/assets/icon_images/password-icon.png"
            alt="user-icon"
          />
          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            id="password"
            name="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            maxLength={50}
          />
          <br />
          <input className="submit" type="submit" value="Login" />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p>
            Don't have an account?&nbsp;
            <Link to="/register" className="register-link">
              Register here
            </Link>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
}
