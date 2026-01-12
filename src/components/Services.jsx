// src/components/Services.jsx
import { useEffect, useMemo, useState } from "react";
import useInView from "../hooks/useInView";
import "./programs.css";

// ✅ fallback (your current hardcoded data)
const PROGRAMS = [
  {
    id: "posh-awareness",
    title: "POSH Compliance",
    blurb:
      "Interactive workshops for employees & managers—rights, responsibilities, bystander action, and safe reporting.",
    tag: "Workplace Safety",
    icon: "🎓",
  },
  {
    id: "external-icc",
    title: "External IC Membership",
    blurb:
      "Experienced external member support for compliant constitution, inquiry conduct, documentation and closure.",
    tag: "Compliance",
    icon: "🛡️",
  },
  {
    id: "policy-audit",
    title: "Policy Drafting & Audits",
    blurb:
      "Draft, review, and audit POSH policies and SOPs tailored to your industry and organization size.",
    tag: "Policy",
    icon: "📄",
  },
  {
    id: "skill-dev",
    title: "Skill Development Workshops",
    blurb:
      "Confidence, communication and leadership sessions that help women advance into decision-making roles.",
    tag: "Leadership",
    icon: "🚀",
  },
  {
    id: "legal-desk",
    title: "Legal Support Desk",
    blurb:
      "Confidential first-response, guidance on procedure, and referrals to appropriate legal/medical support.",
    tag: "Support",
    icon: "⚖️",
  },
  {
    id: "campus",
    title: "Campus Outreach",
    blurb:
      "POSH awareness for colleges/universities: orientation sessions, case studies, and internship pathways.",
    tag: "Outreach",
    icon: "🏫",
  },
  {
    id: "helpline",
    title: "Community Helpline",
    blurb:
      "A safe, confidential channel connecting individuals with timely information and support.",
    tag: "Community",
    icon: "📞",
  },
  {
    id: "posh-guidelines",
    title: "POSH Guidelines",
    blurb:
      "Guidance on POSH rules, responsibilities, and best practices for a strong compliance culture.",
    tag: "Guidelines",
    icon: "📘",
  },
];

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ✅ icon mapping (DB can store: cap/shield/doc/rocket/scale/school/phone/book or emoji)
const ICON_MAP = {
  cap: "🎓",
  shield: "🛡️",
  doc: "📄",
  rocket: "🚀",
  scale: "⚖️",
  school: "🏫",
  phone: "📞",
  book: "📘",
};

function normalizePrograms(items, fallback) {
  if (!Array.isArray(items) || items.length === 0) return fallback;

  return items.map((it, idx) => {
    const id = String(it?.id ?? fallback[idx]?.id ?? `program-${idx + 1}`);
    const title = (it?.title ?? fallback[idx]?.title ?? `Program ${idx + 1}`).trim();

    // backend could send: description OR blurb
    const blurb =
      (it?.blurb ?? it?.description ?? fallback[idx]?.blurb ?? "").trim();

    const tag = (it?.tag ?? fallback[idx]?.tag ?? "").trim();

    // icon can be emoji OR keyword like "shield"
    const rawIcon = (it?.icon ?? fallback[idx]?.icon ?? "").toString().trim();
    const icon = ICON_MAP[rawIcon] || rawIcon || "✨";

    return { id, title, blurb, tag, icon };
  });
}

export default function Services() {
  const hero = useInView();
  const grid = useInView();

  const [remoteItems, setRemoteItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ✅ fetch from backend: /api/services-page
  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setErr("");
        setLoading(true);

        const res = await fetch(`${BASE_URL}/api/services-page`);
        if (!res.ok) throw new Error("Failed to load programs");

        const data = await res.json();
        if (!ignore) setRemoteItems(data);
      } catch (e) {
        if (!ignore) {
          setErr(e?.message || "Failed to load programs");
          setRemoteItems(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const programs = useMemo(() => {
    return normalizePrograms(remoteItems, PROGRAMS);
  }, [remoteItems]);

  return (
    <section id="programs" className="pg-wrap">
      <div className="pg-hero">
        <h1
          ref={hero.ref}
          className={`pg-title reveal-up ${hero.inView ? "in" : ""}`}
        >
          Our <span>Programs</span>
        </h1>

        <p className={`pg-lead reveal-fade ${hero.inView ? "in" : ""}`}>
          Practical, compliant, and people-centered offerings for safer, fairer
          workplaces. Explore everything we run across organizations and
          communities.
        </p>

        {/* ✅ tiny status (won't affect design) */}
        {loading ? (
          <p className="pg-lead" style={{ opacity: 0.6, marginTop: 8 }}>
            Loading programs…
          </p>
        ) : null}
        {err ? (
          <p className="pg-lead" style={{ color: "crimson", marginTop: 8 }}>
            {err}
          </p>
        ) : null}
      </div>

      <div
        ref={grid.ref}
        className={`pg-grid reveal-up ${grid.inView ? "in" : ""}`}
      >
        {programs.map((p) => (
          <article key={p.id} className="pg-card">
            <div className="pg-icon" aria-hidden="true">
              {p.icon}
            </div>
            <h3 className="pg-card-title">{p.title}</h3>
            <p className="pg-card-text">{p.blurb}</p>
            <div className="pg-tags">
              <span>{p.tag}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
