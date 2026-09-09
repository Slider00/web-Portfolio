import React, { useEffect, useState } from "react";
import { jarvisTour } from "../lib/jarvisTour";

/**
 * JarvisTourOverlay
 * Ultra-modern 2026 Floating Co-Pilot Tour Control Dock
 * 
 * Features:
 * - Zero top screen obstruction: top headers and content remain 100% clean and visible.
 * - Anchors seamlessly near the floating 3D JARVIS Hologram Avatar at the bottom-right.
 * - Compact glassmorphic holographic subtitle bubble with typing sound waves.
 * - Sleek micro controls (Prev, Pause/Resume, Next, Exit).
 */

export default function JarvisTourOverlay() {
  const [tourState, setTourState] = useState(() => jarvisTour.getState());

  useEffect(() => {
    const unsubscribe = jarvisTour.subscribe((newState) => {
      setTourState({ ...newState });
    });
    return () => unsubscribe();
  }, []);

  if (!tourState.active) return null;

  const { currentStep, currentStepIndex, totalSteps, paused, isSpeaking, lang } = tourState;
  const isEn = lang === "en";
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="fixed z-50 bottom-24 right-5 sm:right-6 w-[min(92vw,24rem)] select-none pointer-events-auto transition-all duration-300 animate-fade-in">
      {/* Sleek Floating Glassmorphic Holographic Dock */}
      <div className="relative flex flex-col gap-2.5 p-3.5 rounded-2xl border border-[#00f3ff]/40 bg-[#030412]/92 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,243,255,0.25)] overflow-hidden">
        {/* Top Glowing Laser Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent animate-pulse" />

        {/* Step Badge & Micro Controls Row */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
          {/* Left: Step Info */}
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f3ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-[#00f3ff]"></span>
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#00f3ff] uppercase">
              {currentStep ? (isEn ? currentStep.titleEn : currentStep.titleEs) : "Tour Guiado"}
            </span>
          </div>

          {/* Right: Micro Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => jarvisTour.prevStep()}
              disabled={currentStepIndex === 0}
              className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-neutral-300 hover:text-white hover:border-[#00f3ff]/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title={isEn ? "Previous Step" : "Paso Anterior"}
            >
              ◄
            </button>

            <button
              type="button"
              onClick={() => jarvisTour.togglePause()}
              className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold transition-all cursor-pointer ${
                paused
                  ? "border-amber-500/60 bg-amber-500/20 text-amber-300"
                  : "border-[#00f3ff]/60 bg-[#00f3ff]/15 text-cyan-300"
              }`}
            >
              {paused ? (isEn ? "▶ Reanudar" : "▶ Reanudar") : (isEn ? "⏸ Pausar" : "⏸ Pausar")}
            </button>

            <button
              type="button"
              onClick={() => jarvisTour.nextStep()}
              disabled={currentStepIndex === totalSteps - 1}
              className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-neutral-300 hover:text-white hover:border-[#00f3ff]/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title={isEn ? "Next Step" : "Siguiente Paso"}
            >
              ►
            </button>

            <button
              type="button"
              onClick={() => jarvisTour.stopTour()}
              className="px-2 py-0.5 rounded border border-red-500/40 bg-red-500/15 text-[10px] font-mono font-bold text-red-400 hover:bg-red-500/30 cursor-pointer transition-colors"
              title={isEn ? "Exit Guided Tour" : "Finalizar Tour"}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Live Subtitle Narration Text */}
        <div className="flex items-start gap-2.5 text-xs text-neutral-100 font-sans leading-relaxed">
          {isSpeaking && (
            <div className="jarvis-waveform flex items-center gap-0.5 h-3.5 mt-0.5 shrink-0">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          )}
          <p className="flex-1 text-pretty">
            {currentStep ? (isEn ? currentStep.speechEn : currentStep.speechEs) : ""}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#33c2cc] to-[#00f3ff] transition-all duration-500 shadow-[0_0_8px_#00f3ff]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[9px] font-mono font-bold text-[#00f3ff]">
            {currentStepIndex + 1}/{totalSteps}
          </span>
        </div>
      </div>
    </div>
  );
}
