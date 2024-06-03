import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from "./components/navbar_components/Navbar";

function PrivateLayout({username, setIsLoggedIn, setToken, setUsername, spotifyApi }) {
  return (
    <>
      <Navbar
        username={username}
        setIsLoggedIn={setIsLoggedIn}
        setToken={setToken}
        setUsername={setUsername}
        spotifyApi={spotifyApi}
      />
      <Outlet />
    </>
  );
}

export default PrivateLayout;
