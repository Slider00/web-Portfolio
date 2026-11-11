import { FlipWords } from "./FlipWords";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

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

        {/* Primary Role Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl lg:text-[3.65rem] font-bold tracking-[-0.03em] text-white leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]"
        >
          {t("hero.titleCraftingPart1")}
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

        <motion.h1
          variants={itemVariants}
          className="text-3xl font-bold tracking-[-0.025em] text-white"
        >
          {t("hero.titleCraftingPart1")}
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
