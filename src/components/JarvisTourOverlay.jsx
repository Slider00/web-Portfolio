import React, { useEffect, useState } from "react";
import { jarvisTour } from "../lib/jarvisTour";

/**
 * JarvisTourOverlay
 * Ultra-clean 2026 Hands-Free Voice Co-Pilot Progress Line
 * 
 * Features:
 * - NO text box, NO dialogue modal, NO text pills: 100% unobstructed screen visibility.
 * - Only a subtle 2px neon cyan progress laser line at the top edge of the viewport.
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

  const { currentStepIndex, totalSteps } = tourState;
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2.5px] bg-black/30 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#33c2cc] via-[#00f3ff] to-[#ffab00] transition-all duration-700 ease-out shadow-[0_0_12px_#00f3ff]"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
}
