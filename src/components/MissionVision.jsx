import chachi from "../assets/chachi.jpg";
import useInView from "../hooks/useInView";
import "./mission-vision.css";

export default function MissionVision() {
    const title = useInView();
    const lead = useInView();
    const card = useInView();
    const photo = useInView();

    return (
        <div className="mv-hero">
            <div className="mv-hero-inner">
                <h2
                    ref={title.ref}
                    className={`mv-hero-title reveal-up ${title.inView ? "in" : ""}`}
                >
                    Mission
                </h2>

                <p
                    ref={lead.ref}
                    className={`mv-hero-body reveal-fade ${lead.inView ? "in" : ""}`}
                >
                    To empower women through comprehensive education, skill development,
                    legal support, and healthcare services, enabling them to become
                    self-reliant leaders in their communities.
                </p>
            </div>

            {/* Card + image */}
            <section id="mission" className="mv-section">
                <div className="mv-container">
                    <div
                        ref={card.ref}
                        className={`mv-card reveal-left ${card.inView ? "in" : ""}`}
                    >
                        <p className="mv-body">
                            I am Sarbjeet Kaur, Founder & President of WE - Women Empowerment at Workplace.
                            This welfare society was born from my personal journey as a lawyer and as an
                            External Member on Internal Complaints Committees (ICCs).<br /><br />
                            In those years, I saw two painful realities:
                            <br />• Companies struggling with disrupted work culture and financial losses because of workplace harassment.
                            <br />• Women silently suffering, often afraid to speak up about what they faced.
                            <br /><br />
                            I strongly felt the need for one platform where women could raise their voices freely
                            and where companies could get the right guidance to handle these sensitive matters.
                            With support from like-minded colleagues, I founded WE.
                            <br /><br />
                            At WE, our purpose is simple:
                            <br />• Give women the courage and space to share their experiences.
                            <br />• Help organizations follow the POSH Act, 2013 and build safer, healthier workplaces.
                            <br /><br />
                            For us, WE is not just an NGO—it is a movement towards dignity, equality, and respect at work.
                        </p>
                    </div>

                    <figure
                        ref={photo.ref}
                        className={`mv-image-wrap reveal-right ${photo.inView ? "in" : ""}`}
                    >
                        <img src={chachi} alt="Smiling woman by a window" className="mv-image" />
                    </figure>
                </div>
            </section>
        </div>
    );
}
