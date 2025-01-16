import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/App.css"; // Optional for custom styles
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Optional: Redirect to login page after logout
  };

  return (
    <nav className="navbar fixed-top navbar-expand-lg custom-navbar">
      <div className="container-md">
        {/* Logo */}
        <a className="navbar-brand logo" href="/">
          <img src="favicon.ico" height="40" alt="TrustSphere" />
          <span>TrustSphere</span>
        </a>
        {/* Toggle button for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Menu Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto navLinks">
            {user && (
              <>
                <li className="nav-item">
                  <Link to="/articles">Articles</Link>
                </li>
                <li className="nav-item">
                  <Link to="/crimeAnalysis">Analysis</Link>
                </li>
                <li className="nav-item">
                  <Link to="/protectData">Protect Data</Link>
                </li>
              </>
            )}
            {user ? (
              <li className="nav-item">
                <button className="logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
