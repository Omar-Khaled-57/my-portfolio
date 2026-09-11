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

const DeferredSection = ({
  id,
  minH,
  ready,
  fallback,
  children,
}: {
  id: string;
  minH: number;
  ready: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}) => {
  if (!ready) {
    return <section id={id} style={{ minHeight: `${minH}px` }} />;
  }
  return (
    <Suspense fallback={<section id={id} style={{ minHeight: `${minH}px` }}>{fallback}</section>}>
      {children}
    </Suspense>
  );
};

const LandingPage = () => {
  const { t } = useI18n();
  const [ready, setReady] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);
  const [deferred, setDeferred] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => setOverlayGone(true), 600);
    return () => clearTimeout(id);
  }, [ready]);

  // Below-the-fold sections are mounted shortly after the first paint so their
  // heavy dependencies (MUI, sweetalert2, …) don't compete with LCP resources.
  // Lightweight placeholders (with section IDs + estimated min-height) are
  // rendered immediately to keep the page height stable (CLS=0).
  useEffect(() => {
    const start = () => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => setDeferred(true), { timeout: 1200 });
      } else {
        window.setTimeout(() => setDeferred(true), 1200);
      }
    };
    if (typeof window.requestAnimationFrame !== "function") {
      start();
      return;
    }
    const raf = window.requestAnimationFrame(() => window.setTimeout(start, 0));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!deferred) return;
    if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") {
      window.dispatchEvent(new CustomEvent("sectionsReady"));
    }
  }, [deferred]);

  return (
    <>
      <main>
        <Suspense fallback={null}>
          <OnMounted onReady={() => setReady(true)}>
            {ready && <Navbar />}
            <Home />
          </OnMounted>
        </Suspense>

        <DeferredSection id="About" minH={2100} ready={deferred} fallback={<LoadingScreen />}>
          <About />
        </DeferredSection>

        <DeferredSection id="Portfolio" minH={1800} ready={deferred}>
          <Portfolio />
        </DeferredSection>

        <DeferredSection id="Contact" minH={1600} ready={deferred} fallback={<div className="loader-compact h-20 flex items-center justify-center overflow-hidden"><Loader /></div>}>
          <ContactPage />
        </DeferredSection>
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