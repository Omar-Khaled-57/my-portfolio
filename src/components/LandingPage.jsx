import React, { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import WelcomeScreen from "../Pages/WelcomeScreen";
import Footer from "./Footer";

const Home = lazy(() => import("../Pages/Home"));
const About = lazy(() => import("../Pages/About"));
const Portfolio = lazy(() => import("../Pages/Portfolio"));
const ContactPage = lazy(() => import("../Pages/Contact"));

/**
 * Main landing page layout: welcome screen → navbar → sections → footer.
 * Home, About, Portfolio and Contact are lazy-loaded for faster initial paint.
 */
const LandingPage = ({ showWelcome, setShowWelcome }) => (
  <>
    <AnimatePresence mode="wait">
      {showWelcome && (
        <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
      )}
    </AnimatePresence>

    {!showWelcome && (
      <>
        <Navbar />
        <main>
          <Suspense fallback={<div className="min-h-screen" />}>
            <Home />
          </Suspense>
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
    )}
  </>
);

export default LandingPage;
