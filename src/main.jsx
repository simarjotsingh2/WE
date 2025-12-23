// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import About from "./components/About"; // your new About page
import Donate from "./components/Donate";
import Hero from "./components/Hero";
import JoinWe from "./components/JoinWe";
import MissionVision from "./components/MissionVision";
import ScrollToTop from "./components/ScrollToTop"; // <- make this file as shown earlier
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import Gallery from "./pages/Gallery";
import "./styles.css";

// Home page composition (content visible on "/")
function HomePage() {
  return (
    <>
      <Hero />
      <MissionVision />
      <Testimonials />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />                {/* <- put it right inside BrowserRouter */}
      <Routes>
        <Route path="/" element={<App />}>   {/* App is the layout with <Outlet /> */}
          <Route index element={<HomePage />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="gallery" element={<Gallery />} />

          <Route path="join" element={<JoinWe />} />
          <Route path="donate" element={<Donate />} />
          <Route path="*" element={<div style={{ padding: 40 }}>Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
