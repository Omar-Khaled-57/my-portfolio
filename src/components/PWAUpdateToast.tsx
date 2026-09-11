import { useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";

const PWA_UPDATE_EVENT = "pwa-update-ready";

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh: () => window.dispatchEvent(new Event(PWA_UPDATE_EVENT)),
});

export default function PWAUpdateToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onReady = () => setShow(true);
    window.addEventListener(PWA_UPDATE_EVENT, onReady);
    return () => window.removeEventListener(PWA_UPDATE_EVENT, onReady);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-max -translate-x-1/2 sm:w-auto">
      <div
        role="status"
        className="pwa-update-toast px-5 py-3 rounded-xl bg-secondary backdrop-blur-xl border border-primary text-primary shadow-xl flex items-center gap-3 text-sm"
      >
        <span>New version available</span>
        <button
          type="button"
          onClick={() => updateSW()}
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
    </div>
  );
}
