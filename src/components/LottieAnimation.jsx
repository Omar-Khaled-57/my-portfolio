import { useEffect, useRef } from "react"
import lottie from "lottie-web"

const LottieAnimation = ({ animationPath, loop = true, autoplay = true, className, style }) => {
  const containerRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
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
      },
    })

    animRef.current = anim

    return () => {
      anim.destroy()
      animRef.current = null
    }
  }, [animationPath, loop, autoplay])

  return <div ref={containerRef} className={className} style={style} />
}

export default LottieAnimation
