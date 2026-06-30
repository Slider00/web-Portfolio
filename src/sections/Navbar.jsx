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
          {/* Desktop Dropdown */}
          <li className="nav-li hidden sm:block relative group">
              <span className="nav-link cursor-pointer flex items-center gap-1">
                {t('nav.cv')}
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-36 rounded-xl border border-white/10 bg-black/95 backdrop-blur-md shadow-2xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <a
                  className="block px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 first:rounded-t-xl transition-colors"
                  href={`${base}models/cv.pdf`}
                  download="Julian-Correa-CV-ES.pdf"
                >
                  {t('nav.cvEs')}
                </a>
                <a
                  className="block px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 last:rounded-b-xl transition-colors"
                  href={`${base}models/cv-en.pdf`}
                  download="Julian-Correa-CV-EN.pdf"
                >
                  {t('nav.cvEn')}
                </a>
              </div>
          </li>

          {/* Mobile Links */}
          <li className="nav-li sm:hidden">
              <a
                className="nav-link"
                href={`${base}models/cv.pdf`}
                download="Julian-Correa-CV-ES.pdf"
                onClick={onNavigate}
              >
                {t('nav.cvEs')}
              </a>
          </li>
          <li className="nav-li sm:hidden">
              <a
                className="nav-link"
                href={`${base}models/cv-en.pdf`}
                download="Julian-Correa-CV-EN.pdf"
                onClick={onNavigate}
              >
                {t('nav.cvEn')}
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
