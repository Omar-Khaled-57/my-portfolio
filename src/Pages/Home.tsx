import { useState, useEffect, useCallback, useMemo, memo, Suspense, lazy, useRef, type AnimationEvent } from "react"
import { Helmet } from "react-helmet-async"
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles, Download } from "lucide-react"
import WhatsAppIcon from "../components/icons/WhatsAppIcon"
import useAOS, { refreshAOS } from "../hooks/useAOS"
import { useI18n } from "../i18n"
import { useSharedData } from "../context/DataContext"
import { usePWAInstall } from "../hooks/usePWAInstall"
import type { IconProp } from "../types"

const LottieAnimation = lazy(() => import("../components/LottieAnimation"));

const StatusBadge = memo(({ text }: { text: string }) => (
  <div className="hidden animate-float lg:mx-0" data-aos="zoom-in" data-aos-delay="100">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
          <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 me-2 text-blue-400" />
          {text}
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(({ first, second }: { first: string; second: string }) => (
  <div className="hero-cascade hero-cascade--title space-y-2">
    <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
      <span className="relative inline-block">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-[var(--text-gradient-start)] to-[var(--text-gradient-end)] bg-clip-text text-transparent py-2">
          {first}
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-2">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent py-2">
          {second}
        </span>
      </span>
    </h1>
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon, contact }: { href: string; text: string; icon: IconProp; contact?: boolean }) => (
  <a href={href} className="inline-flex">
    <button className="group relative w-[160px] min-h-[48px]" type="button">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-all duration-300"></div>
      <div className="relative h-12 bg-primary backdrop-blur-xl rounded-lg border border-primary leading-none overflow-hidden strong-shadow">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-[var(--text-gradient-start)] to-[var(--text-gradient-end)] bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon className={`w-4 h-4 text-[var(--text-gradient-start)] ${contact ? 'group-hover:translate-x-1 rtl:group-hover:-translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
        </span>
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link, label }: { icon: IconProp; link: string; label: string }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" aria-label={label}>
    <button className="group relative p-3"
      aria-label={label}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)]"></div>
      <div className="relative rounded-xl bg-secondary backdrop-blur-xl p-2 flex items-center justify-center border border-primary group-hover:border-accent-primary/20 transition-all duration-300 shadow-xl strong-shadow">
        <Icon className="w-5 h-5 text-primary group-hover:text-primary transition-colors" />
      </div>
    </button>
  </a>
));

const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;

const platformIconMap: Record<string, IconProp> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  WhatsApp: WhatsAppIcon,
  Instagram: Instagram,
};

const HeroAnimation = memo(({ className, onReady, playing, isMobile = false }: { className?: string; onReady: () => void; playing: boolean; isMobile?: boolean }) => {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [deferred, setDeferred] = useState(false);
  useEffect(() => {
    const el = holderRef.current;
    if (!el) return;

    let io: IntersectionObserver | null = null;

    if (typeof IntersectionObserver !== "function") {
      setVisible(true);
      return;
    }

    io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io?.disconnect();
          io = null;
          setVisible(true);
        }
      },
      { rootMargin: "0px 0px" }
    );
    io?.observe(el);

    return () => {
      if (io) io.disconnect();
    };
  }, []);

  // On mobile the lottie stack (80 KB chunk + JSON + eval/render) must not
  // compete with the LCP/TBT window: the right column CSS-animates in at
  // reveal, and the lottie is only built once the LCP has *settled* — the
  // first LCP candidate paints early, so debounce a quiet gap after the last
  // candidate before importing. Desktop keeps immediate-on-visible behavior.
  useEffect(() => {
    if (!visible) return;
    if (!isMobile) {
      setDeferred(true);
      return;
    }
    // Reduced-motion users keep the gradient + slide; skip the 80 KB lottie.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let observer: PerformanceObserver | null = null;
    let settleTimer = 0;
    let backstop = 0;
    const build = () => {
      observer?.disconnect();
      window.clearTimeout(settleTimer);
      window.clearTimeout(backstop);
      if (!cancelled) setDeferred(true);
    };
    if (typeof PerformanceObserver !== "undefined") {
      observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const latest = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number;
          loadTime?: number;
        };
        if (latest && (latest.renderTime ?? latest.loadTime ?? 0) > 0) {
          window.clearTimeout(settleTimer);
          settleTimer = window.setTimeout(build, 800);
        }
      });
      observer.observe({ type: "largest-contentful-paint", buffered: true });
    }
    backstop = window.setTimeout(build, 6000);
    return () => {
      cancelled = true;
      observer?.disconnect();
      window.clearTimeout(settleTimer);
      window.clearTimeout(backstop);
    };
  }, [visible, isMobile]);
  return (
    <div ref={holderRef} className={className}>
      {deferred && (
        <Suspense fallback={null}>
          <LottieAnimation animationPath="/animations/lottie.json" className={className} autoplay={false} playing={playing} onReady={onReady} />
        </Suspense>
      )}
    </div>
  );
});

interface SocialLinkItem {
  icon: IconProp;
  link: string;
  label: string;
}

const Home = ({ onHeroReady, forceHeroReveal = false, introStarted = false }: { onHeroReady: () => void; forceHeroReveal?: boolean; introStarted?: boolean }) => {
  const { t } = useI18n();
  const { socialLinks: rawSocialLinks } = useSharedData();
  const { canInstall, promptInstall } = usePWAInstall();
  const words = t("home.words");
  // Same breakpoint as LandingPage (min-width: 768px = desktop): on mobile the
  // hero visual CSS-animates in at reveal and the lottie loads lazily after LCP.
  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches,
    [],
  );
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [heroVisualReady, setHeroVisualReady] = useState(false)
  const [leftColumnEntered, setLeftColumnEntered] = useState(false)
  const [playHeroAnimation, setPlayHeroAnimation] = useState(false)
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([
    { icon: Github, link: "https://github.com/Omar-Khaled-57", label: "GitHub Profile" },
    { icon: Linkedin, link: "https://linkedin.com/in/omar-khaled-el-khouly-0a0690313/", label: "LinkedIn Profile" },
    { icon: WhatsAppIcon, link: "https://wa.me/201123029406", label: "WhatsApp" },
  ]);

  useEffect(() => {
    if (rawSocialLinks && rawSocialLinks.length > 0) {
      setSocialLinks(
        rawSocialLinks.map(({ platform, url }) => ({
          icon: platformIconMap[platform] || ExternalLink,
          link: url,
          label: platform,
        }))
      );
    }
  }, [rawSocialLinks]);

  useAOS();

  useEffect(() => {
    let ticking = false;
    const handleResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        refreshAOS();
        ticking = false;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTyping = useCallback(() => {
    if (isMobile) return; // mobile paints the static role text (LCP) up front
    if (isTyping) {
      if (charIndex < words[wordIndex].length) {
        setText(prev => prev + words[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % words.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex, words, isMobile]);

  useEffect(() => {
    // Mobile: paint the full first role immediately (no type/erase cycle), so
    // the hero's largest text — the LCP element — is fully rendered at reveal
    // instead of waiting on a throttled typewriter that can cycle mid-word.
    if (isMobile) {
      const first = words[0] ?? "";
      setText(first);
      setCharIndex(first.length);
      setWordIndex(0);
      setIsTyping(false);
      return;
    }
    setText("");
    setCharIndex(0);
    setWordIndex(0);
    setIsTyping(true);
  }, [words, isMobile]);

  // The reveal is now fast enough to catch the typewriter mid-word. Snap the
  // first shown word to its full length so the hero's largest text paints at
  // reveal time (behaving exactly like the old flow, where the overlay hid the
  // page long enough that the first word had already finished typing). The
  // natural pause → erase → next-word cycle then continues unchanged.
  const revealSnapped = useRef(false);
  useEffect(() => {
    if (!introStarted || revealSnapped.current) return;
    const w = words[wordIndex];
    if (w && isTyping && text.length < w.length) {
      revealSnapped.current = true;
      setText(w);
      setCharIndex(w.length);
    }
  }, [introStarted, isTyping, text, wordIndex, words]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping, isTyping]);

  useEffect(() => {
    if (forceHeroReveal) setHeroVisualReady(true);
  }, [forceHeroReveal]);

  const handleHeroAnimationReady = useCallback(() => {
    setHeroVisualReady(true);
    onHeroReady();
  }, [onHeroReady]);

  useEffect(() => {
    if (!leftColumnEntered) return;
    const timeoutId = window.setTimeout(() => setPlayHeroAnimation(true), 140);
    return () => window.clearTimeout(timeoutId);
  }, [leftColumnEntered]);

  const handleLeftColumnAnimationEnd = useCallback((event: AnimationEvent<HTMLDivElement>) => {
    if (event.animationName === "hero-visual-enter") setLeftColumnEntered(true);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t("home.metaTitle")}</title>
        <meta name="description" content={t("home.metaDescription")} />
     <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://omar-el-khouly.vercel.app/" />
        <meta property="og:title" content={t("home.metaTitle")} />
     <meta property="og:description" content={t("home.metaDescription")} />
        <meta property="og:url" content="https://omar-el-khouly.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://omar-el-khouly.vercel.app/images/og-image.png" />
        <meta property="og:image:secure_url" content="https://omar-el-khouly.vercel.app/images/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="1024" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://omar-el-khouly.vercel.app/images/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Omar Khaled El-Khouly",
          "jobTitle": "Software Developer",
          "url": "https://github.com/Omar-Khaled-57",
          "sameAs": [
            socialLinks.find(l => l.label?.toLowerCase() === 'github')?.link || "https://github.com/Omar-Khaled-57",
            socialLinks.find(l => l.label?.toLowerCase() === 'linkedin')?.link || "https://linkedin.com/in/omar-khaled-el-khouly-0a0690313/"
          ]
        })}</script>
      </Helmet>

      <div className={`hero-intro min-h-dvh bg-[var(--bg-primary)] overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] pt-20 sm:pt-24 pb-8 sm:pb-12 flex flex-col justify-center landscape:pt-12 ${introStarted ? "hero-intro--started" : ""}`} id="Home">
        <div className="relative z-10 w-full">
          <div className="container mx-auto">
            <div className="flex flex-col landscape:max-lg:flex-row lg:flex-row items-center justify-center md:justify-between gap-0 sm:gap-12 landscape:max-lg:gap-8 lg:gap-20">
              {/* Left Column */}
              <div className="hero-left-column w-full landscape:max-lg:w-1/2 lg:w-1/2 space-y-6 sm:space-y-8 text-left lg:text-left order-1 lg:order-1 lg:mt-0" onAnimationEnd={handleLeftColumnAnimationEnd}>
                <div className="space-y-4 sm:space-y-6 text-start">
                  <StatusBadge text={t("home.status")} />
                  <MainTitle first={t("home.title.first")} second={t("home.title.second")} />

                  {/* Typing Effect */}
                  <div className="hero-cascade hero-cascade--typing h-8 flex items-center">
                    <span className="text-xl md:text-2xl bg-gradient-to-r from-[var(--text-gradient-start)] to-[var(--text-gradient-end)] bg-clip-text text-transparent font-light">
                      {text}
                    </span>
                    <span className="w-[3px] h-6 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ms-1 animate-blink"></span>
                  </div>

                  {/* Description */}
                  <p className="hero-cascade hero-cascade--description text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed font-light">
                    {t("home.description")}
                  </p>

                  {/* CTA Buttons */}
                  <div className="hero-cascade hero-cascade--actions flex flex-row gap-3 w-full justify-start">
                    <CTAButton href="#Portfolio" text={t("home.projects")} icon={ExternalLink} />
                    <CTAButton href="#Contact" text={t("home.contact")} icon={Mail} contact />
                  </div>

                  {/* Social Links */}
                  <div className="hero-cascade hero-cascade--socials hidden sm:flex gap-4 justify-start">
                    {socialLinks.map((social, index) => (
                      <SocialLink key={index} {...social} />
                    ))}
                    {canInstall && (
                      <button
                        type="button"
                        onClick={promptInstall}
                        aria-label="Install app"
                        className="group relative p-3"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)]"></div>
                        <div className="relative rounded-xl bg-secondary backdrop-blur-xl p-2 flex items-center justify-center border border-primary group-hover:border-accent-primary/20 transition-all duration-300 shadow-xl strong-shadow">
                          <Download className="w-5 h-5 text-primary group-hover:text-primary transition-colors" />
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - WebM Video */}
              <div className={`hero-visual w-full landscape:max-lg:w-1/2 lg:w-[75%] py-0 h-[min(360px,38dvh)] sm:portrait:h-[min(500px,50dvh)] landscape:max-lg:h-[min(640px,84dvh)] lg:h-[min(680px,100dvh-6rem)] xl:h-[min(840px,100dvh-6rem)] relative flex items-center justify-center order-2 lg:order-2 mt-5 portrait:max-sm:mt-[clamp(14px,4dvh,40px)] landscape:max-lg:mt-0 sm:mt-0 ${(isMobile || heroVisualReady) && introStarted ? "hero-visual--ready" : ""}`}>
                <div
                  className="relative w-full h-full flex items-center justify-center opacity-90"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out ${
                    isHovering ? "opacity-50 scale-105" : "opacity-20 scale-100"
                  }`}>
                  </div>

                  <div className="relative lg:start-12 z-10 w-full h-full">
                    <HeroAnimation
                      className={`w-full h-full transition-all duration-700 ease-in-out drop-shadow-[0_15px_50px_rgba(0,0,0,0.2)] drop-shadow-[0_5px_15px_rgba(99,102,241,0.6)] ${
                        isHovering 
                          ? "scale-[95%] sm:scale-[90%] lg:scale-[95%] rotate-2" 
                          : "scale-[85%] sm:scale-[80%] lg:scale-[85%]"
                      }`}
                      onReady={handleHeroAnimationReady}
                      playing={playHeroAnimation}
                      isMobile={isMobile}
                    />
                  </div>

                  <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
                    isHovering ? "opacity-50" : "opacity-20"
                  }`}>
                    <div className={`absolute top-1/2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-700 ${
                      isHovering ? "scale-110" : "scale-100"
                    }`}>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Home);
