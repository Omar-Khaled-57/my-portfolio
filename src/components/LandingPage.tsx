import { lazy, Suspense, useCallback, useEffect, useState } from "react";
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
  const [heroTimedOut, setHeroTimedOut] = useState(false);
  const [firstPaint, setFirstPaint] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  // Desktop/tablet render sections immediately (loads are fast and placeholder
  // heights tuned for mobile would mismatch wider layouts, producing CLS from the
  // height swap). Mobile keeps the deferral to protect the LCP/FCP path.
  const [deferred, setDeferred] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches,
  );

  // Wait for a genuinely painted frame (double rAF), then let the loader keep
  // its short fixed "brand moment" before the reveal. The intro is no longer
  // pinned to the lottie canvas: playback itself stays gated on canvas
  // readiness (Home's `heroVisualReady`/`playing`), so the animation can never
  // start late or stutter — while the hero text is no longer stuck behind a
  // page-sized overlay that waits on a 140 KB JSON + lottie-web evaluation on
  // mobile. This is what lets LCP fire at first content paint instead of at
  // animation-ready (~8 s on throttled mobile).
  useEffect(() => {
    let cancelled = false;
    const go = () => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (cancelled) return;
        requestAnimationFrame(() => {
          if (!cancelled) setFirstPaint(true);
        });
      });
    };
    if (document.readyState === "complete") {
      go();
    } else {
      const onLoad = () => go();
      window.addEventListener("load", onLoad, { once: true });
      // Safety net: rAF can stall in a background/hidden tab.
      const t = window.setTimeout(go, 2000);
      return () => {
        cancelled = true;
        window.removeEventListener("load", onLoad);
        window.clearTimeout(t);
      };
    }
  }, []);

  useEffect(() => {
    if (!firstPaint) return;
    const id = window.setTimeout(() => setIntroStarted(true), 450);
    return () => window.clearTimeout(id);
  }, [firstPaint]);

  // Unmount the overlay after its 500 ms CSS fade has finished.
  useEffect(() => {
    if (!introStarted) return;
    const id = window.setTimeout(() => setOverlayGone(true), 600);
    return () => window.clearTimeout(id);
  }, [introStarted]);

  // The hero is part of the initial view, so wait for its canvas instead of
  // exposing a page where the visual appears after the entrance has ended.
  // A failed or very slow asset must not block the app indefinitely.
  useEffect(() => {
    if (ready) return;
    const timeoutId = window.setTimeout(() => {
      setHeroTimedOut(true);
      setReady(true);
    }, 8000);
    return () => window.clearTimeout(timeoutId);
  }, [ready]);

  const handleHeroReady = useCallback(() => setReady(true), []);

  // Below-the-fold sections (About, Portfolio, Contact) stay deferred on small
  // screens so their heavy deps (MUI, sweetalert2, …) don't compete with the
  // hero/LCP window. On mobile, main-thread idle previously fired while the
  // loader still hid the page, dragging ~131 KB of section chunks in front of
  // the animation; scheduling from first-paint + a delay keeps that burst
  // firmly after LCP. Placeholders keep the height stable (CLS stays 0).
  useEffect(() => {
    if (!firstPaint) return;
    const t = window.setTimeout(() => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => setDeferred(true), { timeout: 1500 });
      } else {
        window.setTimeout(() => setDeferred(true), 1200);
      }
    }, 1800);
    return () => window.clearTimeout(t);
  }, [firstPaint]);

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
          {introStarted && <Navbar />}
          <Home
            onHeroReady={handleHeroReady}
            forceHeroReveal={heroTimedOut}
            introStarted={introStarted}
          />
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
        <div className={`loader-overlay ${introStarted ? "loader-overlay--hide" : ""}`}>
          <Loader />
          <span className="loader-caption">{t("common.loading")}</span>
        </div>
      )}
    </>
  );
};

export default LandingPage;
