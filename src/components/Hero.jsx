import { useNavigate } from "react-router-dom";
import heroBg from "../assets/hero-bg.png"; // 👈 correct relative path
import "./Hero.css"; // 👈 correct import

const Hero = () => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate("/join");
  };

  return (
    <section
      className="hero"
      style={{
        background: `linear-gradient(rgba(125, 77, 255, 0.6), rgba(255, 78, 203, 0.6)), url(${heroBg}) center/cover no-repeat`,
      }}
    >
      <div className="hero-content">
        <h1>
          Empowering Women, <span>Guiding Workplaces</span>
        </h1>
        <p>
          Join us in building a world where every woman has the opportunity to
          thrive, lead, and create lasting change in her community.
        </p>
        <button className="btn-donate" onClick={handleJoinClick}>Join WE</button>
      </div>
    </section>
  );
};

export default Hero;
