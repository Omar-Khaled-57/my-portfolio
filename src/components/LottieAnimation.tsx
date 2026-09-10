import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import lottie from "lottie-web";
import type { AnimationConfig } from "lottie-web";

const LottieAnimation = ({
  animationPath,
  loop = true,
  autoplay = true,
  className,
  style,
}: {
  animationPath: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: CSSProperties;
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

    animRef.current = anim;

    return () => {
      anim.destroy();
      animRef.current = null;
    };
  }, [animationPath, loop, autoplay]);

  return <div ref={containerRef} className={className} style={style} />;
};

export default LottieAnimation;