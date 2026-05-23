import React, { Suspense, lazy } from "react";
import Footer from "./Footer";

const ProjectDetails = lazy(() => import("./ProjectDetail"));

const ProjectPageLayout = () => (
  <>
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProjectDetails />
    </Suspense>
    <Footer />
  </>
);

export default ProjectPageLayout;
