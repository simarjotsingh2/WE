import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./join-we.css";
import "./Navbar.css";



const prefetchDonate = () => {
    // Dynamic import triggers Vite to preload the route component
    import("../components/Donate").catch(() => { });
};


export default function JoinWe() {
    const [form, setForm] = useState({
        fullName: "", email: "", phone: "", interest: "Volunteer", message: "", consent: false,
    });

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        // TODO: send to backend / email service
        console.log("Join WE submission:", form);
        alert("Thanks! We’ll contact you soon.");
    }

    return (
        <section className="join-wrap">
            <div className="join-hero">
                <h1 className="join-title">Join <span>WE</span></h1>
                <p className="join-lead">
                    Become a volunteer, partner, or advocate. Fill this quick form and our team will reach out.
                </p>
            </div>

            <form className="join-form" onSubmit={handleSubmit}>
                <label>
                    Full name
                    <input name="fullName" value={form.fullName} onChange={handleChange} required />
                </label>

                <label>
                    Email
                    <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </label>

                <label>
                    Phone (optional)
                    <input name="phone" value={form.phone} onChange={handleChange} />
                </label>

                <label>
                    I’m interested in
                    <select name="interest" value={form.interest} onChange={handleChange}>
                        <option>Volunteer</option>
                        <option>Partnership</option>
                        <option>Corporate Training</option>
                        <option>Internship</option>
                    </select>
                </label>

                <label>
                    Message
                    <textarea name="message" rows="5" value={form.message} onChange={handleChange} />
                </label>

                <label className="check">
                    <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} required />
                    I agree to be contacted by WE.
                </label>

                <button type="submit" className="btn-primary">Submit</button>
                <NavLink
                to="/donate"
                onMouseEnter={prefetchDonate}
                onFocus={prefetchDonate}
                className={({ isActive }) => `btn-donate btn-lg ${isActive ? "active" : ""}`}
            >
                Donate Now
            </NavLink>
            </form>
        </section>
    );
}
