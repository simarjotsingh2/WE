// src/components/Programs.jsx
import useInView from "../hooks/useInView";
import "./programs.css";

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
    id: "policy-audit",
    title: "POSH Guidelines",
    blurb:
      "Draft, review, and audit POSH policies and SOPs tailored to your industry and organization size.",
    icon: "📄",
  }
];

export default function Services() {
  const hero = useInView();
  const grid = useInView();

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
      </div>

      <div
        ref={grid.ref}
        className={`pg-grid reveal-up ${grid.inView ? "in" : ""}`}
      >
        {PROGRAMS.map((p) => (
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
