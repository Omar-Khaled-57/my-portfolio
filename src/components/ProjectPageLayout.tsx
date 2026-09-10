import { Suspense, lazy } from "react";
import Footer from "./Footer";
import LoadingScreen from "./LoadingScreen";

const ProjectDetails = lazy(() => import("./ProjectDetail"));

const ProjectPageLayout = () => (
  <>
    <Suspense fallback={<LoadingScreen />}>
      <ProjectDetails />
    </Suspense>
    <Footer />
  </>
);

export default ProjectPageLayout;