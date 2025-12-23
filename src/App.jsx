import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function App() {
  const { pathname } = useLocation();
  const hideFooter = pathname.startsWith("/gallery"); // hide on /gallery
  const hideNavbar = pathname.startsWith("/gallery"); // hide on /gallery

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}
