import { FlipWords } from "./FlipWords";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const HeroText = () => {
  const { t } = useTranslation();
  const words = [
    t("hero.wordSecure"),
    t("hero.wordModern"),
    t("hero.wordScalable")
  ];
  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <div className="z-10 mt-20 text-center md:mt-40 md:text-left rounded-3xl bg-clip-text">
      {/* Desktop View */}
      <div className="flex-col hidden md:flex c-space">
        <motion.h1
          className="text-4xl font-medium"
          variants={variants}
          initial="visible"
          animate="visible"
          transition={{ duration: 0.35 }}
        >
          {t("hero.greeting")}
        </motion.h1>
        <div className="flex flex-col items-start">
          <motion.p
            className="text-5xl font-medium text-neutral-300"
            variants={variants}
            initial="visible"
            animate="visible"
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            {t("hero.titleCraftingPart1")} <br /> {t("hero.titleCraftingPart2")}
          </motion.p>
          <motion.div
            variants={variants}
            initial="visible"
            animate="visible"
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <FlipWords
              words={words}
              className="font-black text-white text-8xl"
            />
          </motion.div>
          <motion.p
            className="text-4xl font-medium text-neutral-300"
            variants={variants}
            initial="visible"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {t("hero.titleWebSolutions")}
          </motion.p>
        </div>
      </div>
      {/* Mobile View */}
      <div className="flex flex-col space-y-5 md:hidden">
        <motion.p
          className="text-4xl font-medium"
          variants={variants}
          initial="visible"
          animate="visible"
          transition={{ duration: 0.3 }}
        >
          {t("hero.greeting")}
        </motion.p>
        <div>
          <motion.p
            className="text-5xl font-black text-neutral-300"
            variants={variants}
            initial="visible"
            animate="visible"
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            {t("hero.titleBuilding")}
          </motion.p>
          <motion.div
            variants={variants}
            initial="visible"
            animate="visible"
            transition={{ duration: 0.4, delay: 0.1 }}
            className="min-h-[88px]"
          >
            <FlipWords
              words={words}
              className="font-bold text-white text-6xl leading-none whitespace-nowrap"
            />
          </motion.div>
          <motion.p
            className="text-4xl font-black text-neutral-300"
            variants={variants}
            initial="visible"
            animate="visible"
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            {t("hero.titleWebApps")}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default HeroText;
