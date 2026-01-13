import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // adjust path if different

export default function PublicLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}
