import React, { useEffect, useState } from "react";
import { jarvisTour } from "../lib/jarvisTour";

/**
 * JarvisTourOverlay
 * Ultra-clean 2026 Hands-Free Voice Co-Pilot HUD
 * 
 * Features:
 * - NO dialogue box / NO modal card: 100% unobstructed screen visibility.
 * - Subtle 2px neon cyan progress laser line at the top edge of the viewport.
 * - Minimal floating micro-pill next to the 3D JARVIS Hologram Avatar.
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

  const { currentStepIndex, totalSteps, lang } = tourState;
  const isEn = lang === "en";
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <>
      {/* 1. Top Edge Laser Progress Line */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-black/40 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#33c2cc] via-[#00f3ff] to-[#ffab00] transition-all duration-700 ease-out shadow-[0_0_12px_#00f3ff]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 2. Sleek Micro Pill next to the 3D Hologram Avatar at Bottom Right */}
      <div className="fixed z-50 bottom-24 right-5 sm:right-6 select-none pointer-events-auto transition-all duration-300 animate-fade-in">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00f3ff]/50 bg-[#030412]/85 backdrop-blur-md shadow-[0_0_20px_rgba(0,243,255,0.3)]">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f3ff] opacity-75"></span>
            <span className="relative inline-flex rounded-full size-2 bg-[#00f3ff]"></span>
          </span>

          <span className="text-[10px] font-mono font-bold text-cyan-300">
            {isEn ? "JARVIS VOICE TOUR" : "JARVIS EN VIVO"} ● {currentStepIndex + 1}/{totalSteps}
          </span>

          <button
            type="button"
            onClick={() => jarvisTour.stopTour()}
            className="ml-1 px-1.5 py-0.5 rounded-full border border-red-500/40 bg-red-500/20 text-[9px] font-mono font-bold text-red-300 hover:bg-red-500/40 cursor-pointer transition-colors"
            title={isEn ? "Say 'Jarvis stop' or click to exit" : "Di 'Jarvis detente' o haz clic para salir"}
          >
            ✕ {isEn ? "Stop" : "Detener"}
          </button>
        </div>
      </div>
    </>
  );
}
