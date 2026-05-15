import { motion } from "motion/react";

const pills = [
  "Architecture",
  "APIs",
  "UX",
  "Performance",
  "Testing",
  "Accessibility",
  "Mobile",
  "CI/CD",
];

const bars = [
  { label: "Frontend", value: 92 },
  { label: "Backend", value: 76 },
  { label: "DevOps", value: 68 },
];

export default function AutoActivityPanel() {
  return (
    <div className="relative flex flex-col justify-between w-full h-full p-5 overflow-hidden rounded-2xl">
      <div className="absolute top-0 right-0 rounded-full size-40 bg-aqua/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 rounded-full size-44 bg-royal/20 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between">
        <p className="text-xl font-semibold tracking-wide text-white/90">Live Build Flow</p>
        <div className="flex items-center gap-2 text-xs text-neutral-300">
          <motion.span
            className="inline-block rounded-full size-2 bg-mint"
            animate={{ opacity: [0.35, 1, 0.35], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
          ACTIVE
        </div>
      </div>

      <div className="relative z-10 mt-4">
        <div className="flex w-max animate-marquee [--gap:0.75rem] [--duration:24s] gap-3">
          {[...pills, ...pills].map((pill, i) => (
            <span
              key={`${pill}-${i}`}
              className="px-3 py-1 text-sm rounded-full bg-white/8 ring-1 ring-white/15 text-white/85 whitespace-nowrap"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-6 space-y-4">
        {bars.map((bar, i) => (
          <div key={bar.label}>
            <div className="flex items-center justify-between mb-1 text-xs text-neutral-300">
              <span>{bar.label}</span>
              <span>{bar.value}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-aqua to-lavender"
                initial={{ width: "12%" }}
                animate={{ width: [`${Math.max(18, bar.value - 12)}%`, `${bar.value}%`, `${Math.max(18, bar.value - 8)}%`] }}
                transition={{
                  duration: 2.8 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

