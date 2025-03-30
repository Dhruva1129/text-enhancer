import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="logo">Text Enhancer</h1>
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><a href="/">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
