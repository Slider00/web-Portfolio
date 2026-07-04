import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const ProjectDetails = ({
  title,
  description,
  subDescription,
  image,
  images = [],
  tags,
  href,
  closeModal,
}) => {
  const { t } = useTranslation();
  const gallery = images.length ? images : [image];
  const [activeImage, setActiveImage] = useState(gallery[0]);

  useEffect(() => {
    setActiveImage(gallery[0]);
  }, [image, images]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full backdrop-blur-sm bg-black/60 p-4 sm:p-6">
      {/* Click outside to close modal */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={closeModal} />
      
      <motion.div
        className="relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] border shadow-2xl rounded-2xl bg-gradient-to-l from-midnight to-navy border-white/10 flex flex-col overflow-hidden z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Sticky Floating Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-midnight/80 hover:bg-white/10 border border-white/10 transition-all duration-200 cursor-pointer shadow-lg"
          aria-label="Cerrar modal"
        >
          <img src={`${import.meta.env.BASE_URL}assets/close.svg`} className="w-5 h-5" alt="close icon" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto w-full flex-1 scrollbar-thin">
          {/* Main Media View (Image or Video) */}
          <div className="w-full rounded-t-2xl max-h-80 sm:max-h-96 bg-black/25 flex justify-center items-center overflow-hidden border-b border-white/5">
            {activeImage.endsWith(".mp4") ? (
              <video
                src={activeImage}
                controls
                className="object-contain w-full rounded-t-2xl max-h-80 sm:max-h-96"
                autoPlay
                muted
                playsInline
              />
            ) : (
              <img
                src={activeImage}
                alt={title}
                className="object-contain w-full rounded-t-2xl max-h-80 sm:max-h-96"
              />
            )}
          </div>

          {/* Gallery Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex flex-wrap gap-2 px-5 pt-4">
              {gallery.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  onClick={() => setActiveImage(img)}
                  className={`overflow-hidden border rounded-md size-14 sm:size-16 flex items-center justify-center bg-black/20 relative transition-all duration-200 ${
                    activeImage === img ? "border-aqua scale-105" : "border-white/15 opacity-70 hover:opacity-100"
                  }`}
                >
                  {img.endsWith(".mp4") ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white relative">
                      <span className="text-lg">📹</span>
                      <span className="absolute bottom-0 inset-x-0 text-[7px] sm:text-[8px] bg-black/70 py-0.5 rounded text-neutral-300 font-bold uppercase tracking-wider text-center">
                        Video
                      </span>
                    </div>
                  ) : (
                    <img src={img} alt={`${title}-${index + 1}`} className="object-contain w-full h-full" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Description details content */}
          <div className="p-5">
            <h5 className="mb-2 text-xl sm:text-2xl font-bold text-white pr-8">{t(title)}</h5>
            <p className="mb-3 text-xs sm:text-sm font-normal text-neutral-400 leading-relaxed">{t(description)}</p>
            {subDescription.map((subDesc, index) => (
              <p key={index} className="mb-3 text-xs sm:text-sm font-normal text-neutral-400 leading-relaxed">{t(subDesc)}</p>
            ))}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 border-t border-white/5 pt-4">
              <div className="flex gap-2.5">
                {tags.map((tag) => (
                  <img
                    key={tag.id}
                    src={tag.path}
                    alt={tag.name}
                    title={tag.name}
                    className="rounded-lg size-8 sm:size-10 hover-animation bg-white/5 p-1.5 border border-white/5"
                  />
                ))}
              </div>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium cursor-pointer text-neutral-300 hover:text-white transition-colors"
              >
                {t("projects.viewProject")}{" "}
                <img src={`${import.meta.env.BASE_URL}assets/arrow-up.svg`} className="size-3.5 sm:size-4" alt="arrow icon" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetails;
