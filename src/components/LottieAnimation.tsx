import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import lottie from "lottie-web";
import type { AnimationConfig } from "lottie-web";

const LottieAnimation = ({
  animationPath,
  loop = true,
  autoplay = true,
  playing,
  className,
  style,
  onReady,
}: {
  animationPath: string;
  loop?: boolean;
  autoplay?: boolean;
  playing?: boolean;
  className?: string;
  style?: CSSProperties;
  onReady?: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<ReturnType<typeof lottie.loadAnimation> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "canvas",
      loop,
      autoplay,
      path: animationPath,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
        clearCanvas: true,
        progressiveLoad: true,
        hideOnTransparent: true,
      } as unknown as AnimationConfig["rendererSettings"],
    });

    const notifyReady = () => {
      // Allow the initialized canvas to paint before the loader starts exiting.
      window.requestAnimationFrame(() => onReady?.());
    };

    anim.addEventListener("DOMLoaded", notifyReady);
    animRef.current = anim;

    return () => {
      anim.removeEventListener("DOMLoaded", notifyReady);
      anim.destroy();
      animRef.current = null;
    };
  }, [animationPath, loop, autoplay, onReady]);

  useEffect(() => {
    const animation = animRef.current;
    if (!animation || playing === undefined) return;
    if (playing) animation.play();
    else animation.pause();
  }, [playing]);

  return <div ref={containerRef} className={className} style={style} />;
};

export default LottieAnimation;
