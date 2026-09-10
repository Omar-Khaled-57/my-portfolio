import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoadingScreen from "./LoadingScreen";
import Loader from "./Loader";
import { useI18n } from "../i18n";

const Home = lazy(() => import("../Pages/Home"));
const About = lazy(() => import("../Pages/About"));
const Portfolio = lazy(() => import("../Pages/Portfolio"));
const ContactPage = lazy(() => import("../Pages/Contact"));

const OnMounted = ({ onReady, children }: { onReady: () => void; children: ReactNode }) => {
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    onReady();
  }, [onReady]);
  return <>{children}</>;
};

const LandingPage = () => {
  const { t } = useI18n();
  const [ready, setReady] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => setOverlayGone(true), 600);
    return () => clearTimeout(id);
  }, [ready]);

  return (
    <>
      <main>
        <Suspense fallback={null}>
          <OnMounted onReady={() => setReady(true)}>
            {ready && <Navbar />}
            <Home />
          </OnMounted>
        </Suspense>
        <Suspense fallback={<LoadingScreen />}>
          <About />
        </Suspense>
        <Suspense fallback={<div className="loader-compact h-20 flex items-center justify-center overflow-hidden"><Loader /></div>}>
          <Portfolio />
          <ContactPage />
        </Suspense>
      </main>
      <Footer />
      {!overlayGone && (
        <div className={`loader-overlay ${ready ? "loader-overlay--hide" : ""}`}>
          <Loader />
          <span className="loader-caption">{t("common.loading")}</span>
        </div>
      )}
    </>
  );
};

export default LandingPage;