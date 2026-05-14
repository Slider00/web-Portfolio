import { useEffect, useMemo, useState } from "react";

const lines = [
  "const role = 'Frontend Developer';",
  "const focus = ['React', 'TypeScript', 'UX'];",
  "deploy({ quality: 'high', performance: 'optimized' });",
  "security.enable(['xss-protection', 'csrf-guard']);",
];

export default function TerminalPreview({ className = "" }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const full = lines[lineIndex];
    let i = 0;
    const typeTimer = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(typeTimer);
    }, 28);

    const nextTimer = setTimeout(() => {
      setTyped("");
      setLineIndex((prev) => (prev + 1) % lines.length);
    }, 2800);

    return () => {
      clearInterval(typeTimer);
      clearTimeout(nextTimer);
    };
  }, [lineIndex]);

  const staticLines = useMemo(
    () => [
      "import { build } from './skills';",
      "",
      "function createExperience() {",
      "  return build('secure', 'scalable', 'clean');",
      "}",
      "",
    ],
    []
  );

  return (
    <div
      className={`relative w-full h-full rounded-xl border border-white/12 bg-[#11142b]/85 backdrop-blur-sm overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.35)] ${className}`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-1.5">
          <span className="rounded-full size-2.5 bg-coral/90" />
          <span className="rounded-full size-2.5 bg-sand/90" />
          <span className="rounded-full size-2.5 bg-mint/90" />
        </div>
        <span className="text-[10px] tracking-wider text-neutral-300">portfolio.ts</span>
      </div>

      <div className="absolute inset-0 opacity-20 pointer-events-none [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:100%_18px]" />

      <div className="relative p-4 font-mono text-xs md:text-sm leading-7 text-neutral-200">
        {staticLines.map((line, i) => (
          <p key={i} className="whitespace-pre">
            <span className="inline-block w-5 text-neutral-500">{i + 1}</span>
            {line}
          </p>
        ))}
        <p className="whitespace-pre text-aqua">
          <span className="inline-block w-5 text-neutral-500">{staticLines.length + 1}</span>
          {typed}
          <span className="inline-block w-2 ml-1 align-middle bg-aqua animate-pulse">&nbsp;</span>
        </p>
      </div>
    </div>
  );
}
