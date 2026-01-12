import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import NGO_logo from "../assets/NGO_logo.jpg";
import "./Navbar.css";

/** ✅ Fallback routes (used if backend fails or DB empty) */
const FALLBACK_NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About WE" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
];

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Convert backend output to NavLink format safely
function normalizeNav(items, fallback) {
  if (!Array.isArray(items) || items.length === 0) return fallback;

  return items.map((it, idx) => {
    const to = String(it?.href ?? it?.to ?? fallback[idx]?.to ?? "/").trim();
    const label = String(it?.label ?? fallback[idx]?.label ?? "Link").trim();

    // mark "Home" link as end=true so it doesn't stay active everywhere
    const end = to === "/";

    return { to, label, end };
  });
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [remoteLinks, setRemoteLinks] = useState(null);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // ✅ Fetch navbar links from backend: GET /api/nav
  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await fetch(`${BASE_URL}/api/nav`);
        if (!res.ok) throw new Error("Failed to load nav links");
        const data = await res.json();
        if (!ignore) setRemoteLinks(data);
      } catch (e) {
        if (!ignore) setRemoteLinks(null); // fallback will be used
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  // ✅ Use remote links if available, else fallback
  const navLinks = useMemo(() => {
    return normalizeNav(remoteLinks, FALLBACK_NAV_LINKS);
  }, [remoteLinks]);

  return (
    <nav className="navbar" role="navigation" aria-label="Primary">
      {/* Brand */}
      <Link to="/" className="brand" aria-label="Go to home">
        <img src={NGO_logo} alt="EmpowerHer logo" className="brand-logo" />
        <span className="brand-text">EmpowerHer</span>
      </Link>

      {/* Hamburger */}
      <button
        className={`nav-toggle ${open ? "active" : ""}`}
        aria-label="Toggle navigation"
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>

      {/* Links */}
      <ul id="primary-navigation" className={`nav-links ${open ? "open" : ""}`}>
        {navLinks.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}