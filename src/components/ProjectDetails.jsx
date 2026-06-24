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
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-hidden backdrop-blur-sm">
      <motion.div
        className="relative max-w-2xl border shadow-sm rounded-2xl bg-gradient-to-l from-midnight to-navy border-white/10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <button
          onClick={closeModal}
          className="absolute p-2 rounded-sm top-5 right-5 bg-midnight hover:bg-gray-500"
        >
          <img src={`${import.meta.env.BASE_URL}assets/close.svg`} className="w-6 h-6" alt="close icon" />
        </button>
        <div className="w-full rounded-t-2xl max-h-96 bg-black/25">
          <img
            src={activeImage}
            alt={title}
            className="object-contain w-full rounded-t-2xl max-h-96"
          />
        </div>
        {gallery.length > 1 && (
          <div className="flex gap-2 px-5 pt-4">
            {gallery.map((img, index) => (
              <button
                key={`${img}-${index}`}
                onClick={() => setActiveImage(img)}
                className={`overflow-hidden border rounded-md size-16 ${activeImage === img ? "border-aqua" : "border-white/15"}`}
              >
                <img src={img} alt={`${title}-${index + 1}`} className="object-contain w-full h-full bg-black/20" />
              </button>
            ))}
          </div>
        )}
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold text-white">{t(title)}</h5>
          <p className="mb-3 font-normal text-neutral-400">{t(description)}</p>
          {subDescription.map((subDesc, index) => (
            <p key={index} className="mb-3 font-normal text-neutral-400">{t(subDesc)}</p>
          ))}
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-3">
              {tags.map((tag) => (
                <img
                  key={tag.id}
                  src={tag.path}
                  alt={tag.name}
                  className="rounded-lg size-10 hover-animation"
                />
              ))}
            </div>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium cursor-pointer hover-animation"
            >
              {t("projects.viewProject")}{" "}
              <img src={`${import.meta.env.BASE_URL}assets/arrow-up.svg`} className="size-4" alt="arrow icon" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetails;
