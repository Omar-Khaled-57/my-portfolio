import { useEffect, useState } from "react";

type UpdateCallback = () => void;
const updateListeners = new Set<UpdateCallback>();

// Attach the controllerchange listener at module scope (the earliest possible
// point, before React mounts) so an update that claims the page during the
// initial load cannot be missed.
if (typeof navigator !== "undefined" && navigator.serviceWorker) {
  // A controllerless first load produces an initial controllerchange when the
  // SW installs + claims the page. That is not a deploy update and would
  // render a toast during the initial paint (hurting LCP), so suppress it.
  let hadController = navigator.serviceWorker.controller !== null;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController) {
      hadController = true;
      return;
    }
    updateListeners.forEach((fn) => fn());
  });
}

export default function PWAUpdateToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onUpdate = () => {
      setShow(true);
      timer = setTimeout(() => setShow(false), 10000);
    };
    updateListeners.add(onUpdate);
    return () => {
      updateListeners.delete(onUpdate);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-secondary backdrop-blur-xl border border-primary text-primary shadow-xl flex items-center gap-3 text-sm">
      <span>New version available</span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium hover:opacity-90 transition-opacity"
      >
        Refresh
      </button>
      <button
        type="button"
        onClick={() => setShow(false)}
        className="text-secondary hover:text-primary transition-colors ml-1"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}