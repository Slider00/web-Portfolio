import React, { useEffect, useState } from "react";
import { jarvisTour } from "../lib/jarvisTour";
import JarvisHologramAvatar from "./JarvisHologramAvatar";

/**
 * JarvisTourOverlay
 * Ultra-futuristic Sci-Fi HUD Overlay active during Co-Pilot Guided Tour.
 * Features live progress bar, interactive playback controls, live subtitles,
 * and 3D Hologram status synchronization.
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
    <div className="fixed z-50 top-4 left-1/2 -translate-x-1/2 w-[min(94vw,42rem)] select-none pointer-events-auto animate-fade-in">
      {/* Top Glassmorphic HUD Bar */}
      <div className="relative flex flex-col gap-2 p-3.5 rounded-2xl border border-[#33c2cc]/50 bg-[#030412]/92 backdrop-blur-xl shadow-[0_0_40px_rgba(51,194,204,0.35)]">
        {/* Holographic Scanning Line Animation */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent animate-pulse" />

        {/* Top Header Controls Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Avatar & Title */}
          <div className="flex items-center gap-3">
            <JarvisHologramAvatar
              status={isSpeaking ? "SPEAKING" : paused ? "IDLE" : "THINKING"}
              size="sm"
              showBadge={false}
              interactive={false}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f3ff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-2 bg-[#00f3ff]"></span>
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#00f3ff] uppercase">
                  {currentStep ? (isEn ? currentStep.badgeEn : currentStep.badgeEs) : "CO-PILOT MODE"}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white font-mono leading-tight">
                {currentStep ? (isEn ? currentStep.titleEn : currentStep.titleEs) : "Tour Guiado"}
              </h3>
            </div>
          </div>

          {/* Right: Interactive Navigation Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Prev Step */}
            <button
              type="button"
              onClick={() => jarvisTour.prevStep()}
              disabled={currentStepIndex === 0}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-white/10 bg-white/5 text-[11px] font-mono font-semibold text-neutral-300 hover:text-white hover:border-[#33c2cc]/60 hover:bg-[#33c2cc]/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
              title={isEn ? "Previous Step" : "Paso Anterior"}
            >
              ◄
            </button>

            {/* Pause / Resume */}
            <button
              type="button"
              onClick={() => jarvisTour.togglePause()}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all duration-200 cursor-pointer ${
                paused
                  ? "border-amber-500/60 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                  : "border-[#33c2cc]/60 bg-[#33c2cc]/20 text-cyan-300 hover:bg-[#33c2cc]/30"
              }`}
            >
              {paused ? (isEn ? "▶ Resume" : "▶ Reanudar") : (isEn ? "⏸ Pause" : "⏸ Pausar")}
            </button>

            {/* Next Step */}
            <button
              type="button"
              onClick={() => jarvisTour.nextStep()}
              disabled={currentStepIndex === totalSteps - 1}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-white/10 bg-white/5 text-[11px] font-mono font-semibold text-neutral-300 hover:text-white hover:border-[#33c2cc]/60 hover:bg-[#33c2cc]/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
              title={isEn ? "Next Step" : "Siguiente Paso"}
            >
              ►
            </button>

            {/* Stop / Exit */}
            <button
              type="button"
              onClick={() => jarvisTour.stopTour()}
              className="px-2.5 py-1 rounded-lg border border-red-500/40 bg-red-500/15 text-[11px] font-mono font-bold text-red-400 hover:bg-red-500/30 hover:border-red-500 cursor-pointer transition-all duration-200"
              title={isEn ? "Exit Guided Tour" : "Finalizar Tour"}
            >
              ✕ {isEn ? "Exit" : "Salir"}
            </button>
          </div>
        </div>

        {/* Dynamic Neon Step Progress Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#33c2cc] via-[#00f3ff] to-[#ffab00] transition-all duration-700 ease-out shadow-[0_0_10px_#00f3ff]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-[#00f3ff]">
            {currentStepIndex + 1}/{totalSteps}
          </span>
        </div>

        {/* Live Subtitle Narration Box */}
        <div className="mt-1 p-2.5 rounded-xl border border-white/10 bg-black/40 text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans flex items-start gap-2.5">
          {isSpeaking && (
            <div className="jarvis-waveform flex items-center gap-0.5 h-4 mt-0.5 shrink-0">
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
      </div>
    </div>
  );
}
