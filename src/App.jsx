import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { useState, lazy, Suspense, useEffect, useRef } from "react";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import { AnimatePresence } from "framer-motion";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import WelcomeScreen from "./Pages/WelcomeScreen";

const Login = lazy(() => import("./Pages/Login"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));

const Portfolio = lazy(() => import('./Pages/Portfolio'));
const ContactPage = lazy(() => import('./Pages/Contact'));
const ProjectDetails = lazy(() => import('./components/ProjectDetail'));
const NotFoundPage = lazy(() => import('./Pages/404'));
const CVPage = lazy(() => import('./Pages/CV'));

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  return (
    <>
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

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
  );
};

const ProjectPageLayout = () => (
  <>
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProjectDetails />
    </Suspense>
    <Footer />
  </>
);

const GlobalKeyHandler = () => {
  const navigate = useNavigate();
  const keys = useRef("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tagName = e.target.tagName?.toLowerCase();
      if (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        e.target.isContentEditable
      ) {
        return;
      }

      if (e.key.length === 1) {
        let currentKeys = keys.current + e.key.toUpperCase();
        if (currentKeys.length > 3) {
          currentKeys = currentKeys.slice(-3);
        }
        keys.current = currentKeys;

        if (keys.current === "OMR") {
          keys.current = "";
          navigate("/login");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return null;
};

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (showWelcome) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showWelcome]);

  return (
    
    <HelmetProvider>
      <div className="pointer-events-none">
  <AnimatedBackground />
</div>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <GlobalKeyHandler />
        <Routes>
          {/* PUBLIC */}
          <Route
            path="/"
            element={
              <LandingPage
                showWelcome={showWelcome}
                setShowWelcome={setShowWelcome}
              />
            }
          />

          <Route path="/project/:slug" element={<ProjectPageLayout />} />

          {/* CV standalone page */}
          <Route
            path="/cv"
            element={
              <Suspense fallback={<div className="min-h-screen" />}>
                <CVPage />
              </Suspense>
            }
          />

          {/* AUTH */}
          <Route
            path="/login"
            element={
              <Suspense fallback={<div className="min-h-screen" />}>
                <Login />
              </Suspense>
            }
          />

          {/* ADMIN (PROTECTED) */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="min-h-screen" />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <Suspense fallback={null}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;