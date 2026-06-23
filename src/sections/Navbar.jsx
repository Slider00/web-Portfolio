import { useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
function Navigation({ onNavigate }) {
  const [isCvOpen, setIsCvOpen] = useState(false);
  const base = import.meta.env.BASE_URL;

  const handleDownload = () => {
    setIsCvOpen(false);
    onNavigate?.();
  };

  return (
      <ul className="nav-ul">
          <li className="nav-li">
              <button
                  onClick={() => window.location.href = `${base}coins.html`}
              >
                  Cryptocurrency
              </button>
          </li>

          <li className="nav-li">
              <a className="nav-link" href={`${base}`} onClick={onNavigate}>
                  Home
              </a>
          </li>
          <li className="nav-li">
              <a className="nav-link" href="#about" onClick={onNavigate}>
                  About
              </a>
          </li>
          <li className="nav-li">
              <a className="nav-link" href="#work" onClick={onNavigate}>
                  Work
              </a>
          </li>
          <li className="nav-li">
              <a className="nav-link" href="#recruiter" onClick={onNavigate}>
                  Recruiter Hub
              </a>
          </li>
          <li className="nav-li">
              <a className="nav-link" href="#testimonials" onClick={onNavigate}>
                  Testimonials
              </a>
          </li>
          <li className="nav-li">
              <a className="nav-link" href="#contact" onClick={onNavigate}>
                  Contact
              </a>
          </li>
          <li className="relative nav-li">
              <button className="nav-link" onClick={() => setIsCvOpen((v) => !v)}>
                CV
              </button>
              {isCvOpen && (
                <div className="z-30 p-2 mt-2 rounded-md shadow-lg sm:absolute sm:right-0 min-w-40 bg-midnight/95 ring-1 ring-white/10">
                  <a
                    className="block px-3 py-2 text-sm rounded-md text-neutral-200 hover:bg-white/10"
                    href={`${base}models/cv.pdf`}
                    download="Julian-Correa-CV-ES.pdf"
                    onClick={handleDownload}
                  >
                    CV Español
                  </a>
                  <a
                    className="block px-3 py-2 mt-1 text-sm rounded-md text-neutral-200 hover:bg-white/10"
                    href={`${base}models/cv-en.pdf`}
                    download="Julian-Correa-CV-EN.pdf"
                    onClick={handleDownload}
                  >
                    CV English
                  </a>
                </div>
              )}
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
