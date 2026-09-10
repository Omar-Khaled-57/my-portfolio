import { useEffect } from "react";
import AOS from "aos";
import type { AosOptions } from "aos";
import "aos/dist/aos.css";

const DEFAULT_OPTIONS: AosOptions = { once: false, offset: 10 };

let aosReady = false;

export default function useAOS() {
  useEffect(() => {
    if (!aosReady) {
      AOS.init(DEFAULT_OPTIONS);
      aosReady = true;
    }
    AOS.refresh();
  }, []);
}

export function refreshAOS() {
  requestAnimationFrame(() => AOS.refresh());
}