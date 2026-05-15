"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
export const FlipWords = ({ words, duration = 3000, className }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words?.length || words.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);

    return () => window.clearInterval(timer);
  }, [duration, words]);

  const currentWord = words?.[index] ?? "";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        exit={{
          opacity: 0,
          y: -8,
          position: "absolute",
        }}
        className={twMerge("z-10 inline-block relative text-left", className)}
        key={`${currentWord}-${index}`}
      >
        <span className="inline-block whitespace-nowrap">{currentWord}</span>
      </motion.div>
    </AnimatePresence>
  );
};
