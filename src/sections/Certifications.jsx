import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { certifications } from "../constants";

const CertificateCard = ({ cert, onSelect }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onSelect(cert)}
      className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-midnight/90 backdrop-blur-md cursor-pointer overflow-hidden group select-none hover:border-white/20 transition-all duration-300"
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

  return (
    <section className="c-space section-spacing" id="certifications">
      <div>
        <h2 className="text-heading text-white">{t("certifications.title")}</h2>
        <p className="subtext mt-2">{t("certifications.subtitle")}</p>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {certifications.map((cert) => (
          <CertificateCard key={cert.id} cert={cert} onSelect={setActiveCert} />
        ))}
      </div>

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
