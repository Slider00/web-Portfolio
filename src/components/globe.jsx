"use client";

import createGlobe from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

const MOVEMENT_DAMPING = 1400;

const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [1, 0.35, 0.35], // Beautiful coral-red for earthquakes
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

export function Globe({ className, config = GLOBE_CONFIG, markers, labels }) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const labelRefs = useRef([]);
  const { i18n } = useTranslation();
  const isEs = i18n.language === "es";

  const activeMarkers = markers || config.markers;

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      ...config,
      markers: activeMarkers,
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        if (!pointerInteracting.current) phi += 0.005;
        const currentPhi = phi + rs.get();
        state.phi = currentPhi;
        state.width = width * 2;
        state.height = width * 2;

        // Project and position 3D labels onto 2D screen space
        if (labels && labels.length > 0) {
          const radius = width / 2;
          const tilt = config.theta || 0.3;

          labels.forEach((label, idx) => {
            const el = labelRefs.current[idx];
            if (!el) return;

            const latRad = (label.lat * Math.PI) / 180;
            const lonRad = (label.lon * Math.PI) / 180;
            const rotLon = lonRad + currentPhi;

            const cosLat = Math.cos(latRad);
            const sinLat = Math.sin(latRad);

            // 3D Cartesian coordinates projection
            const x = cosLat * Math.sin(rotLon);
            const y = sinLat * Math.cos(tilt) - cosLat * Math.cos(rotLon) * Math.sin(tilt);
            const z = sinLat * Math.sin(tilt) + cosLat * Math.cos(rotLon) * Math.cos(tilt);

            // If z > 0.06, the coordinate is on the visible front side of the globe
            if (z > 0.06) {
              const screenX = radius + x * radius;
              const screenY = radius - y * radius;
              el.style.transform = `translate(-50%, -50%) translate(${screenX}px, ${screenY}px)`;
              el.style.opacity = "1";
            } else {
              el.style.opacity = "0";
            }
          });
        }
      },
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 0);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, config, activeMarkers, labels]);

  return (
    <div
      className={twMerge(
        "mx-auto aspect-[1/1] w-full max-w-[600px] relative pointer-events-auto flex items-center justify-center",
        className
      )}
    >
      <div className="relative w-full h-full max-w-[14rem] max-h-[14rem] sm:max-w-[15.5rem] sm:max-h-[15.5rem] md:max-w-[17.5rem] md:max-h-[17.5rem] lg:max-w-[18.5rem] lg:max-h-[18.5rem] aspect-square flex items-center justify-center">
        <canvas
          className="w-full h-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size] pointer-events-auto cursor-grab"
          ref={canvasRef}
          onPointerDown={(e) => {
            pointerInteracting.current = e.clientX;
            updatePointerInteraction(e.clientX);
          }}
          onPointerUp={() => updatePointerInteraction(null)}
          onPointerOut={() => updatePointerInteraction(null)}
          onMouseMove={(e) => updateMovement(e.clientX)}
          onTouchMove={(e) =>
            e.touches[0] && updateMovement(e.touches[0].clientX)
          }
        />
        
        {/* Floating Magnitude Labels */}
        {labels &&
          labels.map((label, idx) => (
            <div
              key={idx}
              ref={(el) => (labelRefs.current[idx] = el)}
              className="absolute pointer-events-none text-[8px] sm:text-[9px] font-bold font-mono px-1 py-0.5 rounded bg-black/80 border border-red-500/30 text-red-300 shadow-md select-none transform transition-opacity duration-300 z-20"
              style={{ opacity: 0, left: 0, top: 0 }}
            >
              M {label.mag.toFixed(1)}
            </div>
          ))}
      </div>
      
      {/* Pulsing dynamic real-time badge */}
      <div className="hidden sm:flex absolute bottom-2 left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/5 bg-black/60 backdrop-blur-md text-[8px] md:text-[9px] font-semibold text-neutral-400 select-none shadow-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        {isEs ? "Sismicidad tiempo real M2.5+ (USGS)" : "Real-time Earthquakes M2.5+ (USGS)"}
      </div>
    </div>
  );
}
