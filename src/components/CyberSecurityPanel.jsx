import { motion } from "motion/react";

const events = [
  { label: "Port Scan Blocked", level: "high" },
  { label: "Suspicious Login Denied", level: "medium" },
  { label: "Payload Sanitized", level: "low" },
];

const levelColor = {
  high: "text-coral",
  medium: "text-sand",
  low: "text-mint",
};

export default function CyberSecurityPanel() {
  return (
    <div className="relative w-full h-full p-5 overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(51,194,204,0.18),transparent_42%),radial-gradient(circle_at_82%_24%,rgba(122,87,219,0.18),transparent_46%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative z-10 flex items-center justify-between">
        <p className="text-lg font-semibold tracking-wide text-white/90">Cyber Shield</p>
        <div className="flex items-center gap-2 px-2 py-1 text-[10px] tracking-wider rounded-full bg-mint/15 ring-1 ring-mint/35 text-mint">
          <motion.span
            className="rounded-full size-1.5 bg-mint"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.2, 0.9] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
          />
          SECURE
        </div>
      </div>

      <div className="relative z-10 mt-4 h-[78%]">
        <div className="absolute inset-0 rounded-xl border border-white/10 bg-primary/20 backdrop-blur-[2px]" />

        <div className="absolute inset-x-4 top-4 h-28 rounded-lg border border-white/10 bg-black/20 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 w-full bg-gradient-to-b from-aqua/20 via-transparent to-transparent"
            animate={{ y: ["-100%", "140%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:100%_8px]" />
          <div className="relative flex items-center justify-center h-full">
            <motion.div
              className="flex items-center justify-center rounded-full size-16 ring-1 ring-aqua/40 bg-aqua/10"
              animate={{ boxShadow: ["0 0 0 rgba(51,194,204,0)", "0 0 24px rgba(51,194,204,0.45)", "0 0 0 rgba(51,194,204,0)"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-2xl">🛡️</span>
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-x-4 bottom-4 space-y-2">
          {events.map((event, i) => (
            <motion.div
              key={event.label}
              className="flex items-center justify-between px-3 py-2 text-xs rounded-md bg-white/8 ring-1 ring-white/12"
              initial={{ opacity: 0.55 }}
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 1.6 + i * 0.35, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-white/85">{event.label}</span>
              <span className={levelColor[event.level]}>{event.level.toUpperCase()}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

