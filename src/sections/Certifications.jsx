import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { certifications } from "../constants";

const CertificateCard = ({ cert, onSelect }) => {
  const [imgError, setImgError] = useState(false);
  const { t } = useTranslation();

  if (cert.isComingSoon) {
    return (
      <div
        className="relative flex flex-col justify-center items-center rounded-2xl border border-white/5 bg-midnight/50 backdrop-blur-md overflow-hidden select-none transition-all duration-300 h-full min-h-[280px] p-6 text-center opacity-65"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(122,87,219,0.08),transparent_70%)] pointer-events-none" />
        <span className="text-4xl mb-3 filter drop-shadow-[0_0_8px_rgba(122,87,219,0.15)] select-none">🛠️</span>
        <h3 className="text-sm font-semibold text-neutral-400 select-none">
          {t("certifications.underConstruction")}
        </h3>
        <p className="text-[11px] text-neutral-500 mt-1 select-none">
          Próxima certificación
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(cert)}
      className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-midnight/90 backdrop-blur-md cursor-pointer overflow-hidden group select-none hover:border-white/20 transition-all duration-300 h-full"
    >
      {/* Image container */}
      <div className="relative w-full h-48 overflow-hidden rounded-t-2xl bg-black/35 border-b border-white/5">
        {imgError ? (
          <div className="w-full h-full flex flex-col justify-center items-center p-6 bg-gradient-to-br from-indigo to-storm text-center">
            <span className="text-4xl mb-2 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]">📜</span>
            <h4 className="text-xs font-bold text-white line-clamp-2 px-2">{cert.title}</h4>
            <p className="text-[10px] text-neutral-400 mt-1">{cert.issuer}</p>
            <span className="text-[9px] text-neutral-500 mt-3 font-mono">[Falta imagen PNG]</span>
          </div>
        ) : (
          <img
            src={cert.image}
            alt={cert.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}
        {/* Glow Hover overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
      </div>

      {/* Info container */}
      <div className="p-5 flex flex-col justify-between flex-1 gap-2">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            {cert.issuer}
          </span>
          <h3 className="text-sm font-bold text-white mt-1 group-hover:text-aqua transition-colors line-clamp-1">
            {cert.title}
          </h3>
        </div>
        
        <div className="flex justify-between items-center text-[11px] text-neutral-400 mt-2 border-t border-white/5 pt-3">
          <span>{cert.date}</span>
          <span className="text-neutral-300 group-hover:text-white font-medium flex items-center gap-1 transition-colors">
            Ver Certificado
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Certifications() {
  const { t } = useTranslation();
  const [activeCert, setActiveCert] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(3);
      } else if (window.innerWidth >= 640) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, certifications.length - visibleCount);
  const safeIndex = Math.min(currentIndex, maxIndex);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Touch handlers for swipe support on mobile devices
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && safeIndex < maxIndex) {
      handleNext();
    }
    if (isRightSwipe && safeIndex > 0) {
      handlePrev();
    }
  };

  // Generate pagination dots
  const dots = [];
  for (let i = 0; i <= maxIndex; i++) {
    dots.push(i);
  }

  return (
    <section className="c-space mt-20 md:mt-30" id="certifications">
      <div>
        <h2 className="text-heading text-white">{t("certifications.title")}</h2>
        <p className="subtext mt-2">{t("certifications.subtitle")}</p>
      </div>

      {/* Carousel Wrapper */}
      <div className="relative w-full mt-12 px-0 sm:px-12 group/carousel">
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          disabled={safeIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex p-3 rounded-full border border-white/10 bg-midnight/80 backdrop-blur-md text-white hover:bg-white/15 hover:border-white/20 transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none cursor-pointer hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          aria-label="Anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Outer Clip Container */}
        <div className="overflow-hidden w-full py-4 -my-4">
          {/* Inner Sliding Track */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${safeIndex * (100 / visibleCount)}%)`,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-3 py-1 h-full"
              >
                <CertificateCard cert={cert} onSelect={setActiveCert} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          disabled={safeIndex >= maxIndex}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex p-3 rounded-full border border-white/10 bg-midnight/80 backdrop-blur-md text-white hover:bg-white/15 hover:border-white/20 transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none cursor-pointer hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          aria-label="Siguiente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dot Indicators */}
      {dots.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {dots.map((index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === safeIndex
                  ? "w-6 bg-aqua"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Ir a tarjeta ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Lightbox / Modal a pantalla completa */}
      <AnimatePresence>
        {activeCert && (
          <div
            onClick={() => setActiveCert(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-midnight to-navy border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-4 md:p-6 flex flex-col justify-center items-center cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveCert(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-neutral-300 hover:text-white transition duration-200 cursor-pointer"
                aria-label="Cerrar modal"
              >
                ✕
              </button>

              {/* Image in Lightbox */}
              <div className="w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-lg bg-black/25">
                <img
                  src={activeCert.image}
                  alt={activeCert.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg border border-white/5"
                  onError={(e) => {
                    e.target.style.display = "none";
                    // Si falla, mostramos un fallback en el modal
                    const fallbackEl = document.getElementById("modal-img-fallback");
                    if (fallbackEl) fallbackEl.style.display = "flex";
                  }}
                />
                
                {/* Fallback element inside modal */}
                <div
                  id="modal-img-fallback"
                  style={{ display: "none" }}
                  className="w-full h-[40vh] flex flex-col justify-center items-center p-6 text-center text-neutral-400"
                >
                  <span className="text-6xl mb-4">📜</span>
                  <p className="text-sm font-semibold text-white">Imagen no disponible</p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-md">
                    Carga el archivo PNG en la ruta: <br />
                    <code className="text-aqua font-mono select-all bg-black/30 px-1 py-0.5 rounded text-[11px]">
                      public/assets/certificates/{activeCert.image.split("/").pop()}
                    </code>
                  </p>
                </div>
              </div>

              {/* Info Bar at Bottom */}
              <div className="w-full mt-4 md:mt-6 border-t border-white/5 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold text-aqua uppercase tracking-wider">
                    {activeCert.issuer}
                  </span>
                  <h4 className="text-base font-bold text-white leading-tight">
                    {activeCert.title}
                  </h4>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveCert(null)}
                    className="flex-1 sm:flex-initial text-center bg-white/5 hover:bg-white/10 text-white font-semibold text-xs py-2 px-4 rounded-lg transition cursor-pointer"
                  >
                    Cerrar
                  </button>
                  <a
                    href={activeCert.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial text-center bg-lavender hover:bg-lavender/85 text-white font-semibold text-xs py-2 px-4 rounded-lg transition flex items-center justify-center gap-1"
                  >
                    {t("certifications.verifyBtn")} ↗
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

