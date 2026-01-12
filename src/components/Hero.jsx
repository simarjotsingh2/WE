import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// fallback = your current hardcoded text
const FALLBACK = {
  heading: "Empowering Women,",
  highlight: "Guiding Workplaces",
  subheading:
    "Join us in building a world where every woman has the opportunity to thrive, lead, and create lasting change in her community.",
  button_text: "Join WE",
  button_link: "/join",

  // IMPORTANT: use public path (recommended)
  bg_image_url: "/images/hero/we-1.png",

  overlay_from: "125,77,255",
  overlay_to: "255,78,203",
  overlay_opacity_from: 0.6,
  overlay_opacity_to: 0.6,
};

export default function Hero() {
  const navigate = useNavigate();

  const [remote, setRemote] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch from backend
  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await fetch(`${BASE_URL}/api/hero/home`);
        if (!res.ok) throw new Error("Failed to load hero");
        const data = await res.json();
        if (!ignore) setRemote(data);
      } catch {
        if (!ignore) setRemote(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  // merge remote + fallback safely
  const hero = useMemo(() => {
    const h = remote || {};
    return {
      heading: h.heading || FALLBACK.heading,
      highlight: h.highlight || FALLBACK.highlight,
      subheading: h.subheading || FALLBACK.subheading,
      button_text: h.button_text || FALLBACK.button_text,
      button_link: h.button_link || FALLBACK.button_link,
      bg_image_url: h.bg_image_url || FALLBACK.bg_image_url,
      overlay_from: h.overlay_from || FALLBACK.overlay_from,
      overlay_to: h.overlay_to || FALLBACK.overlay_to,
      overlay_opacity_from:
        h.overlay_opacity_from ?? FALLBACK.overlay_opacity_from,
      overlay_opacity_to: h.overlay_opacity_to ?? FALLBACK.overlay_opacity_to,
    };
  }, [remote]);

  const handleJoinClick = () => {
    navigate(hero.button_link || "/");
  };

  return (
    <section
      className="hero"
      style={{
        background: `linear-gradient(
          rgba(${hero.overlay_from}, ${hero.overlay_opacity_from}),
          rgba(${hero.overlay_to}, ${hero.overlay_opacity_to})
        ), url(${hero.bg_image_url}) center/cover no-repeat`,
      }}
    >
      <div className="hero-content">
        <h1>
          {hero.heading} <span>{hero.highlight}</span>
        </h1>

        <p>{hero.subheading}</p>

        <button className="btn-donate" onClick={handleJoinClick}>
          {hero.button_text}
        </button>

        {/* optional: remove later */}
        {/* {loading ? <p style={{ opacity: 0.6 }}>Loading...</p> : null} */}
      </div>
    </section>
  );
}
