import React, { lazy, Suspense } from "react";
import Navbar from "./Navbar";
import WelcomeScreen from "../Pages/WelcomeScreen";
import Footer from "./Footer";
import Home from "../Pages/Home";

const About = lazy(() => import("../Pages/About"));
const Portfolio = lazy(() => import("../Pages/Portfolio"));
const ContactPage = lazy(() => import("../Pages/Contact"));

/**
 * Main landing page layout: welcome screen → navbar → sections → footer.
 * About, Portfolio and Contact are lazy-loaded; Home is eager so the hero
 * (the LCP element) paints on the first React commit instead of after a
 * second round trip for its chunk.
 */
const LandingPage = ({ showWelcome, setShowWelcome }) => (
  <>
    {showWelcome && (
      <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
    )}

    <Navbar />
    <main>
      <Home />
      <Suspense fallback={<div className="min-h-screen" />}>
        <About />
      </Suspense>
      <Suspense fallback={<div className="h-20" />}>
        <Portfolio />
        <ContactPage />
      </Suspense>
    </main>
    <Footer />
  </>
);

export default LandingPage;
