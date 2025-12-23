import { useEffect, useMemo, useState } from "react";
import "./Testimonials.css";

/**
 * Testimonials
 * - Desktop/Tablet: responsive grid
 * - Mobile: lightweight slider (no libs) with dots + auto-advance
 */
export default function Testimonials({ items }) {
  const data = useMemo(
    () =>
      items?.length
        ? items
        : [
            {
              name: "Amanpreet Kaur",
              role: "HR Director, LumeTech",
              quote:
                "EmpowerHer helped us set up our Internal Committee and train our staff with empathy and clarity. The shift in culture is visible.",
              avatar:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
            },
            {
              name: "Harjit Singh",
              role: "Dean of Students, GNA University",
              quote:
                "The awareness session was powerful and practical. Faculty and students left with the confidence to act and support.",
              avatar:
                "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200&auto=format&fit=crop",
            },
            {
              name: "Simran Gill",
              role: "Operations Lead, NovaCare",
              quote:
                "Clear, respectful, and action-oriented. Our policies and reporting pathways are finally easy to understand.",
              avatar:
                "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop",
            },
            {
              name: "Rahul Arora",
              role: "Founder, Arora Textiles",
              quote:
                "From compliance to culture—this team made the complex simple. Our employees feel safer and more empowered.",
              avatar:
                "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop",
            },
          ],
    [items]
  );

  // mobile slider index
  const [idx, setIdx] = useState(0);

  // auto-advance (paused when only 1 item)
  useEffect(() => {
    if (data.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % data.length), 4500);
    return () => clearInterval(id);
  }, [data.length]);

  // keep idx in range if items change
  useEffect(() => {
    if (idx > data.length - 1) setIdx(0);
  }, [data.length, idx]);

  return (
    <section className="t-wrap" aria-label="Testimonials">
      <div className="t-head">
        <span className="t-kicker">Trusted by teams & universities</span>
        <h2 className="t-title">
          What People <span>Say</span>
        </h2>
        <p className="t-sub">
          Real voices from workshops, PoSH awareness sessions, and IC
          implementations across industries.
        </p>
      </div>

      {/* Desktop / tablet grid */}
      <div className="t-grid" role="list">
        {data.slice(0, 6).map((t, i) => (
          <Card key={i} {...t} />
        ))}
      </div>

      {/* Mobile slider */}
      <div
        className="t-slider"
        aria-roledescription="carousel"
        aria-label="Testimonials carousel"
      >
        <div
          className="t-track"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {data.map((t, i) => (
            <Card key={`m-${i}`} {...t} />
          ))}
        </div>

        <div className="t-dots" role="tablist" aria-label="Slides">
          {data.map((_, i) => (
            <button
              key={i}
              className={`t-dot ${i === idx ? "active" : ""}`}
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === idx}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ name, role, quote, avatar }) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="t-card" role="listitem">
      <div className="t-card-inner">
        <p className="t-quote">“{quote}”</p>

        <div className="t-profile">
          {avatar ? (
            <img className="t-avatar" src={avatar} alt={`${name} portrait`} />
          ) : (
            <div className="t-avatar t-avatar-fallback" aria-hidden="true">
              {initials}
            </div>
          )}
          <div className="t-meta">
            <div className="t-name">{name}</div>
            <div className="t-role">{role}</div>
            <div className="t-stars" aria-label="5 out of 5">
              ★★★★★
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
