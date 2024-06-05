// PrivateLayout.js
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/navbar_components/Navbar";
import Footer from "./components/main-components/Footer";

function PrivateLayout({ setIsLoggedIn, setToken }) {
  const location = useLocation();
  const shouldShowFooter = location.pathname !== "/login" && location.pathname !== "/settings";

  return (
    <>
      <Navbar setIsLoggedIn={setIsLoggedIn} setToken={setToken} />
      <Outlet />
      {shouldShowFooter && <Footer />}
    </>
  );
}

export default PrivateLayout;
