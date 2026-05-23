import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Listens for the key sequence "O", "M", "R" typed anywhere on the page
 * and navigates to /dashboard when matched.
 * Ignores keystrokes inside input/textarea/select elements.
 */
const GlobalKeyHandler = () => {
  const navigate = useNavigate();
  const keys = useRef("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tagName = e.target.tagName?.toLowerCase();
      if (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        e.target.isContentEditable
      ) {
        return;
      }

      if (e.key.length === 1) {
        let currentKeys = keys.current + e.key.toUpperCase();
        if (currentKeys.length > 3) {
          currentKeys = currentKeys.slice(-3);
        }
        keys.current = currentKeys;

        if (keys.current === "OMR") {
          keys.current = "";
          navigate("/dashboard");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return null;
};

export default GlobalKeyHandler;
