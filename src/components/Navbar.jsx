import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import NGO_logo from "../assets/NGO_logo.jpg";
import "./Navbar.css";

/** Routes shown in the navbar */
const NAV_LINKS = [
  { to: "/",             label: "Home", end: true },
  { to: "/about",        label: "About Us" },
  { to: "/services",     label: "Services" },
  { to: "/gallery",     label: "Gallery" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => { setOpen(false); }, [location.pathname]);


  return (
    <nav className="navbar" role="navigation" aria-label="Primary">
      {/* Brand */}
      <Link to="/" className="brand" aria-label="Go to home">
        <img
          src={NGO_logo}
          alt="EmpowerHer logo"
          className="brand-logo"
        />
        <span className="brand-text">EmpowerHer</span>
      </Link>

      {/* Hamburger */}
      <button
        className={`nav-toggle ${open ? "active" : ""}`}
        aria-label="Toggle navigation"
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen(v => !v)}
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>

      {/* Links */}
      <ul id="primary-navigation" className={`nav-links ${open ? "open" : ""}`}>
        {NAV_LINKS.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
