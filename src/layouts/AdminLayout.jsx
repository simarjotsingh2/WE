import { Navigate, Outlet } from "react-router-dom";

export default function AdminLayout() {
    const token = localStorage.getItem("sb_token");

    // if not logged in, send to admin login
    if (!token) return <Navigate to="/admin-login" replace />;

    return (
        <div style={{ minHeight: "100vh", background: "#f6f7fb" }}>
            <Outlet />
        </div>
    );
}
