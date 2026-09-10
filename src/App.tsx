import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import AnimatedBackground from "./components/Background";
import LandingPage from "./components/LandingPage";
import ProjectPageLayout from "./components/ProjectPageLayout";
import GlobalKeyHandler from "./components/GlobalKeyHandler";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingScreen from "./components/LoadingScreen";

const CVPage = lazy(() => import('./Pages/CV'));
const NotFoundPage = lazy(() => import('./Pages/404'));
const Login = lazy(() => import('./Pages/Login'));
const Dashboard = lazy(() => import('./Pages/Dashboard'));

function App() {
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
            element={<LandingPage />}
          />

          <Route path="/project/:slug" element={<ProjectPageLayout />} />

          <Route
            path="/cv"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <CVPage />
              </Suspense>
            }
          />

          <Route
            path="/login"
            element={
              <Suspense fallback={<LoadingScreen />}>
                <Login />
              </Suspense>
            }
          />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingScreen />}>
                  <Dashboard />
                </Suspense>
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