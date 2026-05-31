import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function useAOS(options = {}) {
  useEffect(() => {
    AOS.init(options);
    AOS.refresh();
  }, [options]);
}

export function refreshAOS() {
  AOS.refresh();
}
