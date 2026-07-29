import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "../components/globe";
import CopyEmailButton from "../components/CopyEmailButton";
import { Frameworks } from "../components/Frameworks.jsx";
import CyberSecurityPanel from "../components/CyberSecurityPanel";
import GitMerger from "../components/GitMerger";

const cleanPlaceName = (place, isEs) => {
  if (!place) return "";
  let cleaned = place.replace(/^\d+\s*km\s+[A-Z]+\s+of\s+/i, "");
  cleaned = cleaned.replace(/^\d+\s*km\s+[A-Z]+\s+de\s+/i, "");
  
  if (isEs) {
    cleaned = cleaned.replace(/\bof\b/gi, "de");
    cleaned = cleaned.replace(/\bSouth of\b/gi, "Sur de");
    cleaned = cleaned.replace(/\bNorth of\b/gi, "Norte de");
    cleaned = cleaned.replace(/\bEast of\b/gi, "Este de");
    cleaned = cleaned.replace(/\bWest of\b/gi, "Oeste de");
  }
  return cleaned;
};

const About = () => {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === "es";

  const [recentQuakes, setRecentQuakes] = useState([]);
  const [globeMarkers, setGlobeMarkers] = useState([]);
  const [globeLabels, setGlobeLabels] = useState([]);

  useEffect(() => {
    const fetchQuakes = async () => {
      try {
        const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson");
        if (!res.ok) throw new Error("Failed to fetch earthquake data");
        const data = await res.json();
        
        // 1. Process for Globe Markers
        const markersList = data.features
          .filter(f => f.geometry && f.geometry.coordinates)
          .map(f => {
            const [lon, lat] = f.geometry.coordinates;
            const mag = f.properties.mag || 2.5;
            return {
              location: [lat, lon],
              size: Math.max(0.02, Math.min(0.08, mag * 0.012))
            };
          });
        setGlobeMarkers(markersList.slice(0, 150));

        // 2. Process for List (Top 3 strongest)
        const sortedQuakes = data.features
          .filter(f => f.properties && f.properties.mag)
          .map(f => ({
            mag: f.properties.mag,
            place: cleanPlaceName(f.properties.place, isEs)
          }))
          .sort((a, b) => b.mag - a.mag)
          .slice(0, 3);

        setRecentQuakes(sortedQuakes);

        // 3. Process for Globe Labels (Top 8 strongest to avoid screen clutter)
        const labelList = data.features
          .filter(f => f.geometry && f.geometry.coordinates && f.properties.mag)
          .map(f => {
            const [lon, lat] = f.geometry.coordinates;
            return {
              lat,
              lon,
              mag: f.properties.mag
            };
          })
          .sort((a, b) => b.mag - a.mag)
          .slice(0, 8);
        setGlobeLabels(labelList);
      } catch (err) {
        console.error("Error fetching earthquakes in About:", err);
      }
    };

    fetchQuakes();
  }, [isEs]);

  return (
    <section className="c-space section-spacing" id="about">
      <h2 className="text-heading">{t("about.title")}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[18rem] mt-12">
        <div className="flex items-end h-[38rem] md:h-full grid-default-color grid-1">
          <div className="absolute top-4 left-4 right-4 bottom-60 md:bottom-48">
            <GitMerger />
          </div>
          <div className="z-10">
            <p className="headtext">{t("about.name")}</p>
            <p className="subtext">
              {t("about.bio")}
            </p>
          </div>
          <div className="absolute inset-x-0 pointer-events-none -bottom-4 h-1/2 sm:h-1/3 bg-gradient-to-t from-indigo" />
        </div>
        <div className="h-[22rem] md:h-full grid-default-color grid-2">
          <CyberSecurityPanel />
        </div>
        {/* Grid 3 */}
        <div className="h-[18rem] md:h-full grid-black-color grid-3 p-4 flex flex-row items-center justify-between gap-4">
          <div className="w-[55%] flex flex-col justify-center min-w-0 z-10 select-none">
            <h3 className="text-neutral-200 text-[11px] md:text-[13px] font-bold font-sans tracking-wide leading-tight mb-0.5">
              {isEs ? "Geolocalización y Actividad Sísmica" : "Geolocation & Seismic Activity"}
            </h3>
            <p className="text-[7.5px] md:text-[8px] text-neutral-500 font-semibold mb-3 tracking-wide leading-3 uppercase">
              {isEs ? "Medellín, Colombia • Sismos Globales" : "Medellín, Colombia • Global Seismicity"}
            </p>
            <span className="text-[9px] md:text-[10px] font-bold text-rose-500 uppercase tracking-widest block mb-2.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              {isEs ? "Sismos Más Fuertes (24h)" : "Strongest Earthquakes (24h)"}
            </span>
            {recentQuakes.length > 0 ? (
              <ul className="space-y-1.5 text-[9px] md:text-[9.5px] text-neutral-400 font-medium">
                {recentQuakes.slice(0, 5).map((quake, i) => (
                  <li key={i} className="truncate hover:text-white transition-colors" title={`Magnitude ${quake.mag}: ${quake.place}`}>
                    <strong className="text-rose-400 font-mono">M {quake.mag.toFixed(1)}</strong>
                    <span className="mx-1 text-neutral-600">•</span>
                    <span>{cleanPlaceName(quake.place, isEs)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[9px] text-neutral-500 italic animate-pulse">
                {isEs ? "Consultando datos de USGS..." : "Querying USGS data..."}
              </div>
            )}
          </div>
          <div className="w-[45%] h-full flex items-center justify-center relative overflow-hidden pointer-events-auto">
            <Globe markers={globeMarkers} labels={globeLabels} />
          </div>
        </div>
        {/* Grid 4 */}
        <div className="grid-special-color grid-4">
          <div className="flex flex-col items-center justify-center gap-4 size-full">
            <p className="text-center headtext">
              {t("about.collaborationTitle")}
            </p>
            <CopyEmailButton />
          </div>
        </div>
        {/* Grid 5 */}
        <div className="grid-default-color grid-5">
          <div className="z-10 w-[50%]">
            <p className="headtext">{t("about.techstackTitle")}</p>
            <p className="subtext">
              {t("about.techstackSub")}
            </p>
          </div>
          <figure className="absolute inset-y-0 md:inset-y-9 w-full h-full start-[50%] md:scale-125">
            <Frameworks />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default About;
