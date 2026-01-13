import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    async function handleLogin(e) {
        e.preventDefault();
        setMsg("");

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return setMsg(error.message);

        // store access token for backend
        localStorage.setItem("sb_token", data.session.access_token);
        window.location.href = "/admin";
    }

    return (
        <div style={{ maxWidth: 420, margin: "60px auto", padding: 20 }}>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                    style={{ width: "100%", padding: 10, margin: "10px 0" }} />
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password"
                    style={{ width: "100%", padding: 10, margin: "10px 0" }} />
                <button style={{ width: "100%", padding: 10 }}>Login</button>
            </form>
            {msg && <p style={{ color: "crimson" }}>{msg}</p>}
        </div>
    );
}
