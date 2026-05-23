import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import AnimatedBackground from "./components/Background";
import LandingPage from "./components/LandingPage";
import ProjectPageLayout from "./components/ProjectPageLayout";
import GlobalKeyHandler from "./components/GlobalKeyHandler";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const CVPage = lazy(() => import('./Pages/CV'));
const NotFoundPage = lazy(() => import('./Pages/404'));

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <HelmetProvider>
      <div className="pointer-events-none fixed inset-0 z-0">
        <AnimatedBackground />
      </div>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <GlobalKeyHandler />
        <Routes>
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

          <Route
            path="/cv"
            element={
              <Suspense fallback={<div className="min-h-screen" />}>
                <CVPage />
              </Suspense>
            }
          />

          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

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