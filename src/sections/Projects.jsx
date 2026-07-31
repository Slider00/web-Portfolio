import { useState } from "react";
import Project from "../components/Project";
import { myProjects } from "../constants";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useTranslation } from "react-i18next";

const Projects = () => {
  const { t } = useTranslation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 10, stiffness: 50 });
  const springY = useSpring(y, { damping: 10, stiffness: 50 });
  const handleMouseMove = (e) => {
    x.set(e.clientX + 20);
    y.set(e.clientY + 20);
  };
  const [preview, setPreview] = useState(null);

  // Pagination & Sorting (Newest projects first)
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;
  const sortedProjects = [...myProjects].reverse();
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);

  return (
    <section
      onMouseMove={handleMouseMove}
      id="projects"
      className="relative c-space section-spacing"
    >
      <h2 className="text-heading">{t("projects.title")}</h2>
      <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent mt-12 h-[1px] w-full" />
      {currentProjects.map((project) => (
        <Project key={project.id} {...project} setPreview={setPreview} />
      ))}

      {/* Pagination Control Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12 mb-6 select-none z-10 relative">
          <button
            onClick={() => {
              setCurrentPage((p) => Math.max(p - 1, 1));
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            disabled={currentPage === 1}
            className="flex items-center justify-center p-2 rounded-lg border border-white/5 bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition duration-300 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-neutral-400 cursor-pointer disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            const isActive = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => {
                  setCurrentPage(pageNum);
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-9 h-9 rounded-lg font-mono font-bold text-xs flex items-center justify-center border transition duration-300 cursor-pointer ${
                  isActive
                    ? "bg-lavender border-lavender text-white shadow-[0_0_12px_rgba(122,87,219,0.4)]"
                    : "border-white/5 bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => {
              setCurrentPage((p) => Math.min(p + 1, totalPages));
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center p-2 rounded-lg border border-white/5 bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition duration-300 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-neutral-400 cursor-pointer disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
      {preview && (
        <motion.img
          className="fixed top-0 left-0 z-50 object-contain h-56 rounded-lg shadow-lg pointer-events-none w-80 bg-black/30"
          src={preview}
          style={{ x: springX, y: springY }}
        />
      )}
    </section>
  );
};

export default Projects;
