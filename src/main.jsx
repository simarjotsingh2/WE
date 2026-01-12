import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import "./styles.css";

// Public pages/components
import About from "./components/About";
import Donate from "./components/Donate";
import Hero from "./components/Hero";
import JoinWe from "./components/JoinWe";
import MissionVision from "./components/MissionVision";
import ScrollToTop from "./components/ScrollToTop";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import Gallery from "./pages/Gallery";
import TestBackend from "./pages/TestBackend";

function HomePage() {
  return (
    <>
      <Hero />
      <MissionVision />
      <Testimonials />
      {/* If you want Services on home page, uncomment */}
      {/* <Services /> */}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public layout with Navbar/Footer */}
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="join" element={<JoinWe />} />
          <Route path="donate" element={<Donate />} />
          <Route path="test-backend" element={<TestBackend />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<div style={{ padding: 40 }}>Page not found</div>}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
