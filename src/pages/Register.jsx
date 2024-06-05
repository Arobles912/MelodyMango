import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Login.css";
import Header from "../components/login_components/Header.jsx";

export default function Register({ username, setUsername }) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!username || !password || !email) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
        }),
      });

      if (response.ok) {
        console.log("User registered successfully");
        alert("User registered successfully.");
        navigate("/");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to register user");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Failed to register user. Please try again later.");
    }
  };

  return (
    <div className="bg-div">
      <div className="main-div">
        <Header />
        <form onSubmit={handleRegister}>
          <h2>Sign Up</h2>
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
            onChange={(e) => setUsername(e.target.value)}
            maxLength={30}
          />
          <br />
          <img
            className="icon-img"
            src="src/assets/icon_images/password-icon.png"
            alt="password-icon"
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
          <img
            className="icon-img"
            src="src/assets/icon_images/email-icon.png"
            alt="email-icon"
          />
          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={50}
          />
          <br />
          <div className="checkbox-container">
            <input name="checkbox-input" type="checkbox" id="cbox" required />
            <label htmlFor="cbox">I accept the terms and conditions of the application.</label>
          </div>
          <br />

          <input
            className="register-submit"
            type="submit"
            value="Create account"
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p>
            Already registered?&nbsp;
            <Link to="/" className="register-link">
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
