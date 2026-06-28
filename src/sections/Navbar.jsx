import { useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useTranslation } from "react-i18next";

function Navigation({ onNavigate }) {
  const { t, i18n } = useTranslation();
  const base = import.meta.env.BASE_URL;

  return (
      <ul className="nav-ul">
          <li className="nav-li">
              <a className="nav-link" href={`${base}`} onClick={onNavigate}>
                  {t('nav.home')}
              </a>
          </li>
          <li className="nav-li">
              <a className="nav-link" href="#about" onClick={onNavigate}>
                  {t('nav.about')}
              </a>
          </li>
          <li className="nav-li">
              <a className="nav-link" href="#work" onClick={onNavigate}>
                  {t('nav.work')}
              </a>
          </li>
          <li className="nav-li">
              <a className="nav-link" href="#certifications" onClick={onNavigate}>
                  {t('nav.credentials')}
              </a>
          </li>
          <li className="nav-li">
              <a className="nav-link" href="#recruiter" onClick={onNavigate}>
                  {t('nav.recruiterHub')}
              </a>
          </li>
          <li className="nav-li">
              <a className="nav-link" href="#testimonials" onClick={onNavigate}>
                  {t('nav.testimonials')}
              </a>
          </li>
          <li className="nav-li">
              <a className="nav-link" href="#contact" onClick={onNavigate}>
                  {t('nav.contact')}
              </a>
          </li>
          <li className="nav-li">
              <a
                className="nav-link"
                href={i18n.language === "es" ? `${base}models/cv.pdf` : `${base}models/cv-en.pdf`}
                download={i18n.language === "es" ? "Julian-Correa-CV-ES.pdf" : "Julian-Correa-CV-EN.pdf"}
                onClick={onNavigate}
              >
                {t('nav.cv')}
              </a>
          </li>
      </ul>
  );
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="fixed inset-x-0 z-20 w-full backdrop-blur-lg bg-primary/40">
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-aqua via-lavender to-fuchsia origin-[0%]"
                style={{ scaleX }}
            />
            <div className="mx-auto c-space max-w-7xl">
        <div className="flex items-center justify-between py-2 sm:py-0">
            <a className="text-xl font-bold transition-colors text-neutral-400 hover:text-white" href={`${import.meta.env.BASE_URL}`}>
                Julian Correa
            </a>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex cursor-pointer text-neutral-400 hover:text-white focus:outline-none sm:hidden"
            >
                <img
                    src={isOpen ? `${import.meta.env.BASE_URL}assets/close.svg` : `${import.meta.env.BASE_URL}assets/menu.svg`}
                    className="w-6 h-6"
                    alt="toggle"
                />
            </button>
            <nav className="hidden sm:flex">
                <Navigation />
            </nav>
        </div>
      </div>
            {isOpen && (
                <motion.div
          className="block overflow-hidden text-center sm:hidden"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ maxHeight: "100vh" }}
          transition={{ duration: 1 }}
        >
          <nav className="pb-5">
            <Navigation onNavigate={() => setIsOpen(false)} />
          </nav>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
