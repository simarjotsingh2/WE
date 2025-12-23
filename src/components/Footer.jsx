import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      {/* top gradient divider */}
      <div className="footer-divider" aria-hidden="true" />

      <div className="footer-wrap">
        {/* Brand + blurb */}
        <div className="footer-col">
          <div className="brand">
            <span className="brand-dot" aria-hidden="true" />
            <span className="brand-name">EmpowerHer</span>
          </div>
          <p className="muted">
            From awareness to action—creating safe, inclusive workplaces.
          </p>

          <div className="social">
            <a
              className="social-btn"
              aria-label="Instagram"
              href="https://www.instagram.com/we4womenempowerment/"
              target="_blank"
              rel="noreferrer"
            >
              {/* Instagram SVG */}
              <svg viewBox="0 0 24 24" className="icon">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2A2.8 2.8 0 1 0 12 15.8 2.8 2.8 0 0 0 12 9.2zm5.6-2.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
              </svg>
            </a>

            <a
              className="social-btn"
              aria-label="Facebook"
              href="https://facebook.com/yourpage"
              target="_blank"
              rel="noreferrer"
            >
              {/* Facebook SVG */}
              <svg viewBox="0 0 24 24" className="icon">
                <path d="M13 22v-8h3l.6-3H13V8.6c0-.9.3-1.6 1.7-1.6H17V4.2C16.7 4.2 15.6 4 14.4 4 11.9 4 10 5.7 10 8.3V11H7v3h3v8h3z" />
              </svg>
            </a>

            <a
              className="social-btn"
              aria-label="LinkedIn"
              href="https://linkedin.com/company/yourcompany"
              target="_blank"
              rel="noreferrer"
            >
              {/* LinkedIn SVG */}
              <svg viewBox="0 0 24 24" className="icon">
                <path d="M6.5 6.5a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5zM3.8 8.5h5.4V21H3.8V8.5zM14 8.3c-2.5 0-4.2 1.4-4.2 4.6V21h5.3v-6.3c0-1.6.8-2.6 2.1-2.6 1.2 0 1.9.8 1.9 2.6V21H24v-7.4c0-3.9-2.1-5.3-4.8-5.3-2 0-3.2.9-3.8 1.9h-.1l-.3-1.9H14z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h3>Contact us</h3>
          <ul className="contact">
            <li>
              <a href="mailto:hello@empowerher.org">hello@empowerher.org</a>
            </li>
            <li>
              <a href="tel:+12045551234">+1 (204) 555-1234</a>
            </li>
            <li>
              Winnipeg, MB · Canada
            </li>
          </ul>
        </div>

        {/* Newsletter (optional) */}
        <div className="footer-col">
          <h3>Stay in the loop</h3>
          <form
            className="newsletter"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks! We’ll keep you posted.");
            }}
          >
            <input
              type="email"
              name="email"
              placeholder="Your email"
              aria-label="Email address"
              required
            />
            <button type="submit" id="subscribe-button">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} EmpowerHer. Built with ❤️</p>
      </div>
    </footer>
  );
}
