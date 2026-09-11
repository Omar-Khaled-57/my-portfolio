const loadCVModal = () => import("../components/CVModal");

export const prefetchCVModal = () => {
  void loadCVModal();
};

export const scheduleCVModalPrefetch = () => {
  if (typeof window === "undefined") return;
  // Wait for the window load event so the prefetch doesn't compete with the
  // critical-path resources (LCP). Then load during idle time.
  const performWhenIdle = () => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => prefetchCVModal(), {
        timeout: 3000,
      });
      window.addEventListener("visibilitychange", function onVis() {
        if (document.visibilityState === "hidden") {
          window.cancelIdleCallback(id);
          window.removeEventListener("visibilitychange", onVis);
        }
      });
    } else {
      setTimeout(prefetchCVModal, 3000);
    }
  };
  if (document.readyState === "complete") {
    performWhenIdle();
  } else {
    window.addEventListener("load", function onLoad() {
      window.removeEventListener("load", onLoad);
      performWhenIdle();
    });
  }
};