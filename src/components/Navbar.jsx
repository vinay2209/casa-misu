import React from "react";
import "./Navbar.css";
import logo from "../assets/logo.svg";

const navLinks = [
  "Home",
  "Menu",
  "About Us",
  "Gallery",
  "Order",
  "FAQ",
  "Contact",
];

export default function Navbar() {
  return (
    <div className="navbar-wrapper">
      <div className="navbar-inner">
        <div className="navbar-pill">
          <ul className="nav-links">
            {navLinks.map((l, i) => (
              <li key={l} className={i===0?"active":""}>{l}</li>
            ))}
          </ul>
        </div>
        <div className="logo-badge">
          <img src={logo} alt="Casa Misu" style={{height:48}}/>
        </div>
      </div>
    </div>
  );
}
