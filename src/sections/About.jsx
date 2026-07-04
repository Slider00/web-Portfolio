import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "../components/globe";
import CopyEmailButton from "../components/CopyEmailButton";
import { Frameworks } from "../components/Frameworks.jsx";
import CyberSecurityPanel from "../components/CyberSecurityPanel";
import TerminalPreview from "../components/TerminalPreview";

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
        <div className="flex items-end h-[30rem] md:h-full grid-default-color grid-1">
          <div className="absolute top-4 left-4 right-4 bottom-44 md:bottom-36">
            <TerminalPreview />
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
        <div className="grid-black-color grid-3">
          <div className="z-10 w-[65%] sm:w-[50%]">
            <p className="headtext">{t("about.timezoneTitle")}</p>
            <p className="subtext">
              {t("about.timezoneSub")}
            </p>

            {/* List of strongest earthquakes */}
            {recentQuakes.length > 0 && (
              <div className="mt-4 border-t border-white/5 pt-3">
                <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                  {isEs ? "Sismos Más Fuertes (Últimas 24h)" : "Strongest Earthquakes (Last 24h)"}
                </span>
                <ul className="space-y-1 text-[10px] text-neutral-400">
                  {recentQuakes.map((quake, i) => (
                    <li key={i} className="truncate hover:text-white transition-colors" title={`Magnitude ${quake.mag}: ${quake.place}`}>
                      <strong className="text-rose-400 font-mono">M {quake.mag.toFixed(1)}</strong>
                      <span className="mx-1">•</span>
                      <span>{quake.place}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <figure className="absolute pointer-events-none -right-10 -bottom-16 sm:bottom-[-4.5rem] sm:right-[-3rem] md:left-[36%] md:top-[14%]">
            <Globe markers={globeMarkers} labels={globeLabels} />
          </figure>
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
