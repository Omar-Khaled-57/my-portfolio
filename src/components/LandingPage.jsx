import React, { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Home from "../Pages/Home";
import About from "../Pages/About";
import WelcomeScreen from "../Pages/WelcomeScreen";
import Footer from "./Footer";

const Portfolio = lazy(() => import("../Pages/Portfolio"));
const ContactPage = lazy(() => import("../Pages/Contact"));

/**
 * Main landing page layout: welcome screen → navbar → sections → footer.
 * Portfolio and Contact are lazy-loaded for faster initial paint.
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
          <Home />
          <About />
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
