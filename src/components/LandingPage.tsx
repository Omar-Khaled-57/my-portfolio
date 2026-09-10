import { lazy, Suspense, useState } from "react";
import Navbar from "./Navbar";
import WelcomeScreen from "../Pages/WelcomeScreen";
import Footer from "./Footer";

const Home = lazy(() => import("../Pages/Home"));
const About = lazy(() => import("../Pages/About"));
const Portfolio = lazy(() => import("../Pages/Portfolio"));
const ContactPage = lazy(() => import("../Pages/Contact"));

interface LandingPageProps {
  showWelcome: boolean;
  setShowWelcome: (v: boolean) => void;
}

/**
 * Main landing page layout.
 * The hero (Home) is always mounted underneath the welcome splash so it can
 * load while the splash is up; the splash only lifts once the hero reports
 * ready. The navbar appears only after the splash is gone.
 */
const LandingPage = ({ showWelcome, setShowWelcome }: LandingPageProps) => {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <>
      {!showWelcome && <Navbar />}
      {/* Home is mounted during the splash so it loads beneath it. */}
      <main>
        <Suspense fallback={<div className="min-h-screen" />}>
          <Home onReady={() => setHeroReady(true)} />
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
      {showWelcome && (
        <WelcomeScreen
          onLoadingComplete={() => setShowWelcome(false)}
          heroReady={heroReady}
        />
      )}
    </>
  );
};

export default LandingPage;