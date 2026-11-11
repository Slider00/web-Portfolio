"use client";
import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export const FlipWords = ({
  words,
  duration = 3400,
  className,
  showPeriod = true,
}) => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextWord = useCallback(() => {
    if (!words?.length) return;
    setIndex((prev) => (prev + 1) % words.length);
  }, [words]);

  useEffect(() => {
    if (!words?.length || words.length < 2 || isHovered) return;

    const timer = window.setInterval(() => {
      nextWord();
    }, duration);

    return () => window.clearInterval(timer);
  }, [duration, words, isHovered, nextWord]);

  const currentWord = words?.[index] ?? "";

  return (
    <span
      onClick={nextWord}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative inline-flex flex-col items-center md:items-start cursor-pointer select-none group"
    >
      <span className="relative inline-flex items-baseline overflow-hidden py-1">
        <AnimatePresence mode="wait">
          <motion.span
            key={`${currentWord}-${index}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: -24,
              filter: "blur(4px)",
              transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
            }}
            className={twMerge(
              "inline-flex items-baseline tracking-[-0.035em]",
              className
            )}
          >
            {currentWord.split("").map((letter, letterIndex) => (
              <motion.span
                key={`${currentWord}-${letterIndex}`}
                initial={{ y: "105%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  delay: letterIndex * 0.024,
                  duration: 0.48,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="hero-editorial-word inline-block will-change-transform"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
            {showPeriod && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: currentWord.length * 0.024 + 0.08,
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block text-[#ff7a3d] ml-0.5"
              >
                .
              </motion.span>
            )}
          </motion.span>
        </AnimatePresence>
      </span>

      {/* Subtle architectural baseline accent */}
      <span className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden mt-0.5">
        <motion.span
          key={`line-${index}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: duration / 1000,
            ease: "linear",
          }}
          className="block h-full w-full origin-left bg-gradient-to-r from-[#ff7a3d] via-white/80 to-transparent"
        />
      </span>
    </span>
  );
};
