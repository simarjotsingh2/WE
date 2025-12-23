import chachi from "../assets/chachi.jpg"; // reuse an existing image so it builds
import useInView from "../hooks/useInView";
import "./about.css";

export default function About() {
    const hero = useInView();
    const left = useInView();
    const right = useInView();
    const stats = useInView();

    return (
        <section id="about" className="about-hero">
            <div className="about-inner">
                <h1 ref={hero.ref} className={`about-title reveal-up ${hero.inView ? "in" : ""}`}>
                    About <span>WE</span>
                </h1>
                <p className={`about-lead reveal-fade ${hero.inView ? "in" : ""}`}>
                    WE — Women Empowerment at Workplace is a community-driven organization dedicated to
                    building safer, fairer workplaces through education, policy guidance, and survivor-centered support.
                </p>
            </div>

            <div className="about-grid">
                <article ref={left.ref} className={`about-card reveal-left ${left.inView ? "in" : ""}`}>
                    <h2>Our Story</h2>
                    <p>
                        Founded by advocate Sarbjeet Kaur, WE emerged from years of working with Internal
                        Complaints Committees (ICCs) and seeing how culture, compliance, and care must work together.
                        We provide practical toolkits and confidential help so both organizations and individuals can act with confidence.
                    </p>
                    <h3>What We Do</h3>
                    <ul className="about-list">
                        <li>POSH Act (2013) policy design, audits, and awareness training</li>
                        <li>External ICC membership & case-handling guidance</li>
                        <li>Leadership programs that grow allyship and accountability</li>
                        <li>Confidential support pathways for those affected</li>
                    </ul>
                </article>

                <figure ref={right.ref} className={`about-photo reveal-right ${right.inView ? "in" : ""}`}>
                    <img src={chachi} alt="WE community" />
                </figure>
            </div>

            <div ref={stats.ref} className={`about-stats reveal-up ${stats.inView ? "in" : ""}`}>
                <div><strong>50+</strong><span>organizations supported</span></div>
                <div><strong>2,000+</strong><span>professionals trained</span></div>
                <div><strong>100%</strong><span>confidential first response</span></div>
            </div>
        </section>
    );
}
