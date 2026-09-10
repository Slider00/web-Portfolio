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

  // No duplicate top line: only Navbar's single progress bar is used on the site
  return null;
}

