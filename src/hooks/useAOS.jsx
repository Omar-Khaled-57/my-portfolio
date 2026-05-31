import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function useAOS(options = {}) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    AOS.init(optionsRef.current);
    AOS.refresh();
    return () => {
      AOS.refreshHard();
    };
  }, []);
}

export function refreshAOS() {
  requestAnimationFrame(() => AOS.refresh());
}
