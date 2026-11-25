import { useEffect, useRef, useState } from "react";
import { FlipWords } from "./FlipWords";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const SpaceshipHeadline = ({ text, isMobile = false }) => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const trailRef = useRef(null);
  const shipRef = useRef(null);
  const topGlowRef = useRef(null);
  const bottomGlowRef = useRef(null);
  const startTimeRef = useRef(null);

  const [dims, setDims] = useState({ w: isMobile ? 270 : 470, h: isMobile ? 76 : 124 });
  const base = import.meta.env.BASE_URL;

  // Split into 2 horizontal lines: e.g. "Desarrollador de" / "Software"
  const words = (text || "").trim().split(/\s+/);
  const topLine =
    words.length > 1 ? words.slice(0, -1).join(" ") : words[0] || "";
  const bottomLine = words.length > 1 ? words[words.length - 1] : "";

  // Measure actual rendered headline dimensions for responsive path accuracy
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDims({ w: rect.width, h: rect.height });
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, isMobile]);

  // Build 2-line continuous S-turn trajectory:
  // Line 1 (Left -> Right to "de") -> smooth downward bank after "de" -> Line 2 (Right -> Left across "Software")
  const y1 = Math.round(dims.h * 0.27);
  const y2 = bottomLine ? Math.round(dims.h * 0.77) : y1;
  const startX = isMobile ? -34 : -50;
  const endX = isMobile ? -42 : -62;
  const turnX = Math.round(dims.w + (isMobile ? 6 : 12));
  const turnBulge = isMobile ? 34 : 52;

  const flightPath = bottomLine
    ? `M ${startX} ${y1} L ${turnX} ${y1} C ${turnX + turnBulge} ${y1}, ${
        turnX + turnBulge
      } ${y2}, ${turnX} ${y2} L ${endX} ${y2}`
    : `M ${startX} ${y1} L ${turnX + 40} ${y1}`;

  // 60/120fps zero-rerender animation loop driving ship, curved contrail, and letter illumination
  useEffect(() => {
    let rafId;
    const flightMs = 7800; // Slower, smooth cruise across both lines
    const pauseMs = 2600;
    const cycleMs = flightMs + pauseMs;
    const shipW = isMobile ? 44 : 68;
    const shipH = isMobile ? 17 : 26;
    const nozzleBackPx = isMobile ? 11 : 17;
    const trailMaxFrac = 0.13;

    const tick = (now) => {
      if (startTimeRef.current === null) startTimeRef.current = now;
      const elapsed = (now - startTimeRef.current) % cycleMs;

      const pathEl = pathRef.current;
      const shipEl = shipRef.current;
      const trailEl = trailRef.current;
      const topGlowEl = topGlowRef.current;
      const bottomGlowEl = bottomGlowRef.current;

      if (pathEl && shipEl && trailEl) {
        const totalLen = pathEl.getTotalLength();

        if (elapsed <= flightMs && totalLen > 0) {
          const u = elapsed / flightMs;
          // Gentle cosine blend for natural acceleration/deceleration without rushing
          const p = 0.82 * u + 0.18 * (0.5 - 0.5 * Math.cos(Math.PI * u));
          const dist = p * totalLen;

          const pt = pathEl.getPointAtLength(dist);
          const pBefore = pathEl.getPointAtLength(Math.max(0, dist - 2.5));
          const pAfter = pathEl.getPointAtLength(Math.min(totalLen, dist + 2.5));

          const angleRad = Math.atan2(pAfter.y - pBefore.y, pAfter.x - pBefore.x);
          const angleDeg = (angleRad * 180) / Math.PI;

          // Smooth aileron roll during the downward bank at "de" so the cockpit stays upright on Line 2
          const cosA = Math.cos(angleRad);
          const scaleY =
            cosA >= 0
              ? Math.max(0.45, cosA)
              : -Math.max(0.45, Math.abs(cosA));

          // Smooth entry & exit fade
          let opacity = 1;
          if (u < 0.07) opacity = u / 0.07;
          else if (u > 0.92) opacity = (1 - u) / 0.08;

          shipEl.style.opacity = String(opacity);
          shipEl.style.transform = `translate3d(${pt.x - shipW / 2}px, ${
            pt.y - shipH / 2
          }px, 0) rotate(${angleDeg}deg) scaleY(${scaleY})`;

          // Curved SVG contrail hugging the rear nozzles along the path
          const pNozzle = Math.max(0, (dist - nozzleBackPx) / totalLen);
          const sStart = Math.max(0, pNozzle - trailMaxFrac);
          const visLen = Math.max(0, pNozzle - sStart);
          trailEl.style.opacity = String(opacity * 0.9);
          trailEl.setAttribute("stroke-dasharray", `${visLen} 2`);
          trailEl.setAttribute("stroke-dashoffset", `${-sStart}`);

          // Real-time localized thruster light cast onto whichever line the ship is crossing
          const midY = (y1 + y2) / 2;
          const glowRadius = isMobile ? 65 : 105;

          if (topGlowEl) {
            if (pt.y <= midY + 10) {
              topGlowEl.style.opacity = String(opacity);
              topGlowEl.style.backgroundImage = `radial-gradient(${glowRadius}px circle at ${pt.x}px 55%, rgba(255,122,61,0.95) 0%, rgba(124,232,255,0.8) 45%, rgba(255,255,255,0) 100%)`;
            } else {
              topGlowEl.style.opacity = "0";
            }
          }

          if (bottomGlowEl) {
            if (pt.y >= midY - 10) {
              bottomGlowEl.style.opacity = String(opacity);
              bottomGlowEl.style.backgroundImage = `radial-gradient(${glowRadius}px circle at ${pt.x}px 50%, rgba(255,122,61,0.95) 0%, rgba(124,232,255,0.8) 45%, rgba(255,255,255,0) 100%)`;
            } else {
              bottomGlowEl.style.opacity = "0";
            }
          }
        } else {
          // Rest phase between passes
          shipEl.style.opacity = "0";
          trailEl.style.opacity = "0";
          if (topGlowEl) topGlowEl.style.opacity = "0";
          if (bottomGlowEl) bottomGlowEl.style.opacity = "0";
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [flightPath, isMobile, y1, y2]);

  const handleReplay = () => {
    startTimeRef.current = performance.now();
  };

  return (
    <span
      ref={containerRef}
      onClick={handleReplay}
      title="Click para lanzar nave"
      className={`relative inline-flex flex-col ${
        isMobile ? "items-center" : "items-start"
      } cursor-pointer select-none overflow-visible py-0.5`}
    >
      {/* Line 1: "Desarrollador de" / "Software" */}
      <span
        className={`relative z-10 block font-bold tracking-[-0.03em] text-white leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)] ${
          isMobile ? "text-3xl" : "text-5xl lg:text-[3.65rem]"
        }`}
      >
        <span className="relative inline-block">
          {topLine}
          <span
            ref={topGlowRef}
            aria-hidden="true"
            style={{
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              opacity: 0,
            }}
            className="pointer-events-none absolute inset-0 select-none transition-opacity duration-75"
          >
            {topLine}
          </span>
        </span>
      </span>

      {/* Line 2: "Software" / "Developer" */}
      {bottomLine && (
        <span
          className={`relative z-10 block font-bold tracking-[-0.03em] text-white leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)] ${
            isMobile ? "text-3xl" : "text-5xl lg:text-[3.65rem]"
          }`}
        >
          <span className="relative inline-block">
            {bottomLine}
            <span
              ref={bottomGlowRef}
              aria-hidden="true"
              style={{
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                opacity: 0,
              }}
              className="pointer-events-none absolute inset-0 select-none transition-opacity duration-75"
            >
              {bottomLine}
            </span>
          </span>
        </span>
      )}

      {/* Curved SVG Trajectory & Glowing Ion Contrail Layer */}
      <svg
        aria-hidden="true"
        width={dims.w}
        height={dims.h}
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        className="pointer-events-none absolute inset-0 z-20 overflow-visible"
      >
        <defs>
          <linearGradient id="shipTrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff7a3d" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#ff7a3d" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7ce8ff" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Hidden geometry guide path */}
        <path ref={pathRef} d={flightPath} fill="none" stroke="none" />

        {/* Visible curved plasma contrail following the ship around "de" */}
        <path
          ref={trailRef}
          d={flightPath}
          pathLength={1}
          fill="none"
          stroke="url(#shipTrailGrad)"
          strokeWidth={isMobile ? 2 : 2.6}
          strokeLinecap="round"
          style={{
            opacity: 0,
            filter: "drop-shadow(0 0 8px rgba(255,122,61,0.8))",
          }}
        />
      </svg>

      {/* Starfighter Layer Following the 2-Line Curved Trajectory */}
      <div
        ref={shipRef}
        aria-hidden="true"
        style={{
          opacity: 0,
          width: isMobile ? "44px" : "68px",
          height: isMobile ? "17px" : "26px",
        }}
        className="pointer-events-none absolute top-0 left-0 z-30 will-change-transform"
      >
        <img
          src={`${base}assets/spaceship.svg`}
          alt=""
          className="w-full h-full object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)] drop-shadow-[0_0_12px_rgba(255,122,61,0.45)]"
        />
      </div>
    </span>
  );
};

const HeroText = () => {
  const { t, i18n } = useTranslation();
  const isSpanish = i18n.language?.startsWith("es");

  const words = [
    t("hero.wordScalable"),
    t("hero.wordSecure"),
    t("hero.wordModern"),
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="z-10 mt-24 text-center md:mt-34 md:text-left select-none">
      {/* Desktop View */}
      <motion.div
        className="flex-col hidden md:flex c-space max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Minimal Editorial Eyebrow */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-3 self-start mb-6"
        >
          <span className="h-2 w-2 rounded-full bg-[#ff7a3d] shadow-[0_0_12px_#ff7a3d]" />
          <span className="text-base font-medium tracking-tight text-white/95">
            {t("hero.greeting")}
          </span>
          <span className="text-white/25 font-light">/</span>
          <span className="text-xs font-medium tracking-wide text-white/55">
            {t("hero.badge")}
          </span>
        </motion.div>

        {/* Primary Role Headline with 2-Line Curved Starfighter Trajectory */}
        <motion.h1 variants={itemVariants}>
          <SpaceshipHeadline text={t("hero.titleCraftingPart1")} />
        </motion.h1>

        {/* Editorial Sentence Flow */}
        {isSpanish ? (
          <div className="flex flex-col items-start mt-3">
            <motion.p
              variants={itemVariants}
              className="text-2xl lg:text-[1.75rem] font-normal tracking-[-0.015em] text-white/65 leading-snug drop-shadow-[0_2px_16px_rgba(0,0,0,0.75)]"
            >
              {t("hero.titleCraftingPart2")}{" "}
              <span className="text-white font-medium">
                {t("hero.titleWebSolutions").toLowerCase()}
              </span>
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-1 min-h-[112px] flex items-center"
            >
              <FlipWords
                words={words}
                className="font-extrabold text-7xl lg:text-[5.25rem] leading-[1.02]"
              />
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col items-start mt-3">
            <motion.p
              variants={itemVariants}
              className="text-2xl lg:text-[1.75rem] font-normal tracking-[-0.015em] text-white/65 leading-snug drop-shadow-[0_2px_16px_rgba(0,0,0,0.75)]"
            >
              {t("hero.titleCraftingPart2")}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="my-0.5 min-h-[108px] flex items-center"
            >
              <FlipWords
                words={words}
                showPeriod={false}
                className="font-extrabold text-7xl lg:text-[5.25rem] leading-[1.02]"
              />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-2xl lg:text-[1.85rem] font-medium tracking-[-0.02em] text-white/90 mt-1 drop-shadow-[0_2px_16px_rgba(0,0,0,0.75)]"
            >
              {t("hero.titleWebSolutions")}
              <span className="text-[#ff7a3d]">.</span>
            </motion.p>
          </div>
        )}

        {/* Senior-Craft Minimal CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3.5 mt-8"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-[#06091f] bg-white hover:bg-neutral-100 rounded-full transition-all duration-200 shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:-translate-y-0.5"
          >
            <span>{t("hero.ctaProjects")}</span>
            <svg
              className="w-3.5 h-3.5 text-[#06091f]/75 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M7 17L17 7M17 7H8M17 7V16"
              />
            </svg>
          </a>

          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white/85 hover:text-white rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/12 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5"
          >
            {t("hero.ctaContact")}
          </a>
        </motion.div>
      </motion.div>

      {/* Mobile View */}
      <motion.div
        className="flex flex-col items-center space-y-3 md:hidden px-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2"
        >
          <span className="h-2 w-2 rounded-full bg-[#ff7a3d]" />
          <span className="text-sm font-medium text-white/90">
            {t("hero.greeting")}
          </span>
        </motion.div>

        <motion.h1 variants={itemVariants}>
          <SpaceshipHeadline text={t("hero.titleCraftingPart1")} isMobile />
        </motion.h1>

        {isSpanish ? (
          <div className="flex flex-col items-center space-y-1">
            <motion.p
              variants={itemVariants}
              className="text-lg font-normal text-white/70"
            >
              {t("hero.titleBuilding")}{" "}
              <span className="text-white font-medium">
                {t("hero.titleWebApps").toLowerCase()}
              </span>
            </motion.p>
            <motion.div variants={itemVariants} className="min-h-[72px]">
              <FlipWords
                words={words}
                className="font-extrabold text-5xl leading-none whitespace-nowrap"
              />
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-1">
            <motion.p
              variants={itemVariants}
              className="text-lg font-normal text-white/70"
            >
              {t("hero.titleBuilding")}
            </motion.p>
            <motion.div variants={itemVariants} className="min-h-[72px]">
              <FlipWords
                words={words}
                showPeriod={false}
                className="font-extrabold text-5xl leading-none whitespace-nowrap"
              />
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="text-lg font-medium text-white"
            >
              {t("hero.titleWebApps")}
              <span className="text-[#ff7a3d]">.</span>
            </motion.p>
          </div>
        )}

        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 pt-2"
        >
          <a
            href="#projects"
            className="px-5 py-2.5 text-xs font-semibold text-[#06091f] bg-white rounded-full"
          >
            {t("hero.ctaProjects")}
          </a>
          <a
            href="#contact"
            className="px-5 py-2.5 text-xs font-medium text-white rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md"
          >
            {t("hero.ctaContact")}
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroText;
