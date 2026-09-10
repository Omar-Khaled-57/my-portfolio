import { useEffect } from "react";
import AOS from "aos";
import type { AosOptions } from "aos";
import "aos/dist/aos.css";

const DEFAULT_OPTIONS: AosOptions = { once: false, offset: 10 };
const INIT_DELAY_MS = 1000;

let initTimer: ReturnType<typeof setTimeout> | null = null;
let aosReady = false;

export default function useAOS() {
  useEffect(() => {
    if (aosReady) {
      AOS.refresh();
      return;
    }
    if (initTimer) clearTimeout(initTimer);
    initTimer = setTimeout(() => {
      AOS.init(DEFAULT_OPTIONS);
      aosReady = true;
      AOS.refresh();
    }, INIT_DELAY_MS);
    const timer = initTimer;
    return () => {
      if (initTimer === timer) initTimer = null;
      clearTimeout(timer);
    };
  }, []);
}

export function refreshAOS() {
  requestAnimationFrame(() => AOS.refresh());
}