import React, { useState, useMemo } from "react";
import { Radar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar componentes de ChartJS para el gráfico Radar
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const SKILLS_LIST = [
  { id: "react", name: "React.js / Vite", category: "Frontend" },
  { id: "javascript", name: "JS / TypeScript", category: "Frontend" },
  { id: "tailwindcss", name: "Tailwind CSS", category: "Frontend" },
  { id: "flutter", name: "Flutter / Dart", category: "Mobile" },
  { id: "ionic", name: "Ionic Framework", category: "Mobile" },
  { id: "csharp", name: "C# / Blazor", category: "Backend" },
  { id: "dotnet", name: ".NET / EF Core", category: "Backend" },
  { id: "php", name: "PHP / WordPress", category: "Backend" },
  { id: "git", name: "Git / CI-CD", category: "Herramientas" },
];

const PRESETS = {
  frontend: {
    nameKey: "recruiter.presetFrontend",
    skills: ["react", "javascript", "tailwindcss", "git"],
    experience: "mid",
    mode: "remote",
  },
  mobile: {
    nameKey: "recruiter.presetMobile",
    skills: ["flutter", "javascript", "ionic", "git"],
    experience: "mid",
    mode: "remote",
  },
  fullstack: {
    nameKey: "recruiter.presetFullstack",
    skills: ["react", "javascript", "tailwindcss", "csharp", "dotnet", "git"],
    experience: "senior",
    mode: "remote",
  },
  custom: {
    nameKey: "recruiter.presetCustom",
    skills: [],
    experience: "mid",
    mode: "remote",
  },
};

const RecruiterHub = () => {
  const { t, i18n } = useTranslation();
  const base = import.meta.env.BASE_URL;
  const [rolePreset, setRolePreset] = useState("frontend");
  const [selectedSkills, setSelectedSkills] = useState(PRESETS.frontend.skills);
  const [experience, setExperience] = useState(PRESETS.frontend.experience);
  const [mode, setMode] = useState(PRESETS.frontend.mode);
  const [isCopied, setIsCopied] = useState(false);

  // Manejar cambio de perfil preestablecido
  const handlePresetChange = (e) => {
    const val = e.target.value;
    setRolePreset(val);
    if (PRESETS[val]) {
      setSelectedSkills(PRESETS[val].skills);
      setExperience(PRESETS[val].experience);
      setMode(PRESETS[val].mode);
    }
  };

  // Toggle de skill individual
  const handleSkillToggle = (skillId) => {
    setRolePreset("custom");
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  // Lógica de cálculo de compatibilidad (Fit Score)
  const fitResult = useMemo(() => {
    let score = 50; // Base score
    const totalSkillsSelected = selectedSkills.length;

    if (totalSkillsSelected > 0) {
      // Julian es fuerte en Frontend, Mobile y .NET/C#
      const coreMatches = selectedSkills.filter((s) =>
        ["react", "javascript", "tailwindcss", "flutter", "csharp", "dotnet"].includes(s)
      );
      score += (coreMatches.length / totalSkillsSelected) * 35;
      score += Math.min(totalSkillsSelected * 2, 5);
    }

    // Años de experiencia (Julián tiene ~5 años desde 2020)
    if (experience === "junior") {
      score += 10; // Sobrecualificado, excelente match
    } else if (experience === "mid") {
      score += 10; // Match perfecto
    } else if (experience === "senior") {
      score += 7;  // Apto para roles Senior/Liderazgo inicial
    }

    // Modalidad
    if (mode === "remote") {
      score += 10; // Ideal
    } else if (mode === "hybrid") {
      score += 8;
    } else {
      score += 3; // Presencial menos preferido
    }

    const finalScore = Math.min(Math.round(score), 100);

    // Feedback descriptivo
    let feedback = "";
    if (finalScore >= 90) {
      feedback = t("recruiter.feedbackExcellent");
    } else if (finalScore >= 75) {
      feedback = t("recruiter.feedbackStrong");
    } else {
      feedback = t("recruiter.feedbackModerate");
    }

    return { score: finalScore, feedback };
  }, [selectedSkills, experience, mode, t]);

  // Generar mensaje de contacto predeterminado
  const contactText = useMemo(() => {
    const skillNames = selectedSkills
      .map((id) => SKILLS_LIST.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    
    const translatedMode = t(`recruiter.${mode}`);
    
    return t("recruiter.defaultContactMsg", {
      score: fitResult.score,
      mode: translatedMode,
      skills: skillNames || (i18n.language === "es" ? "Desarrollo General" : "General Development")
    });
  }, [selectedSkills, fitResult.score, mode, t, i18n.language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contactText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Configuración de los ejes del Radar Chart
  const radarData = useMemo(() => {
    // Clasificar las habilidades seleccionadas para dibujar la demanda vs. la capacidad de Julian
    const categoriesCount = { Frontend: 0, Mobile: 0, Backend: 0, Herramientas: 0 };
    selectedSkills.forEach((id) => {
      const skill = SKILLS_LIST.find((s) => s.id === id);
      if (skill) categoriesCount[skill.category]++;
    });

    // Puntuación del trabajo requerido (normalizado sobre 100)
    const requiredFrontend = Math.min((categoriesCount.Frontend / 3) * 100, 100) || 15;
    const requiredMobile = Math.min((categoriesCount.Mobile / 2) * 100, 100) || 15;
    const requiredBackend = Math.min((categoriesCount.Backend / 3) * 100, 100) || 15;
    const requiredTools = Math.min((categoriesCount.Herramientas / 1) * 100, 100) || 15;

    // Perfil de Julián (valores reales basados en su experiencia y proyectos)
    const julianProfile = [95, 90, 80, 85, 90]; // Frontend, Mobile, Backend, Tools, Soft Skills

    return {
      labels: [
        t("recruiter.radarLabels.frontend"),
        t("recruiter.radarLabels.mobile"),
        t("recruiter.radarLabels.backend"),
        t("recruiter.radarLabels.tools"),
        t("recruiter.radarLabels.softSkills"),
      ],
      datasets: [
        {
          label: t("recruiter.julianCapacity"),
          data: julianProfile,
          backgroundColor: "rgba(122, 87, 219, 0.2)", // --color-lavender
          borderColor: "#7a57db",
          borderWidth: 2,
          pointBackgroundColor: "#7a57db",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#7a57db",
        },
        {
          label: t("recruiter.yourRequirement"),
          data: [
            requiredFrontend,
            requiredMobile,
            requiredBackend,
            requiredTools,
            experience === "senior" ? 95 : experience === "mid" ? 75 : 55,
          ],
          backgroundColor: "rgba(51, 194, 204, 0.15)", // --color-aqua
          borderColor: "#33c2cc",
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: "#33c2cc",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#33c2cc",
        },
      ],
    };
  }, [selectedSkills, experience, t]);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: "rgba(255, 255, 255, 0.1)" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        pointLabels: {
          color: "rgba(255, 255, 255, 0.7)",
          font: { size: 10, family: "Funnel Display" },
        },
        ticks: {
          display: false,
          max: 100,
          min: 0,
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          font: { family: "Funnel Display" },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}%`;
          },
        },
      },
    },
  };

  return (
    <section className="c-space section-spacing" id="recruiter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-heading text-white">{t("recruiter.title")}</h2>
          <p className="subtext mt-2">
            {t("recruiter.subtitle")}
          </p>
        </div>
        {/* Pulsing Availability Badge */}
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
            {t("recruiter.availableBadge")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
        {/* COL 1: Vacancy Controls (Left Side) */}
        <div className="lg:col-span-7 flex flex-col gap-6 grid-default-color p-6 md:p-8">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            {t("recruiter.configureTitle")}
          </h3>

          {/* Role Preset Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-300 font-semibold uppercase tracking-wider">
              {t("recruiter.presetLabel")}
            </label>
            <select
              value={rolePreset}
              onChange={handlePresetChange}
              className="w-full bg-midnight border border-white/10 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lavender"
            >
              <option value="frontend">{t("recruiter.presetFrontend")}</option>
              <option value="mobile">{t("recruiter.presetMobile")}</option>
              <option value="fullstack">{t("recruiter.presetFullstack")}</option>
              <option value="custom">{t("recruiter.presetCustom")}</option>
            </select>
          </div>

          {/* Skill Selector Checkboxes */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-300 font-semibold uppercase tracking-wider">
              {t("recruiter.skillsLabel")}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
              {SKILLS_LIST.map((skill) => {
                const isChecked = selectedSkills.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    onClick={() => handleSkillToggle(skill.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition duration-200 cursor-pointer ${
                      isChecked
                        ? "bg-lavender/25 border-lavender text-white shadow-[0_0_12px_rgba(122,87,219,0.3)]"
                        : "bg-midnight/65 border-white/5 text-neutral-400 hover:border-white/15"
                    }`}
                  >
                    <span>{skill.name}</span>
                    {isChecked ? (
                      <span className="text-aqua font-bold">✓</span>
                    ) : (
                      <span className="text-neutral-600">+</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Experience and Mode Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Experience level Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-300 font-semibold uppercase tracking-wider">
                {t("recruiter.seniorityLabel")}
              </label>
              <div className="flex bg-midnight rounded-lg p-1 border border-white/10">
                {["junior", "mid", "senior"].map((exp) => (
                  <button
                    key={exp}
                    onClick={() => {
                      setRolePreset("custom");
                      setExperience(exp);
                    }}
                    className={`flex-1 text-center py-1.5 rounded-md text-xs font-semibold capitalize transition ${
                      experience === exp
                        ? "bg-lavender text-white shadow-sm"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-300 font-semibold uppercase tracking-wider">
                {t("recruiter.workplaceLabel")}
              </label>
              <div className="flex bg-midnight rounded-lg p-1 border border-white/10">
                {["remote", "hybrid", "onsite"].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setRolePreset("custom");
                      setMode(m);
                    }}
                    className={`flex-1 text-center py-1.5 rounded-md text-xs font-semibold capitalize transition ${
                      mode === m
                        ? "bg-lavender text-white shadow-sm"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {t(`recruiter.${m}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Compatibility Result Card */}
          <div className="bg-midnight/70 rounded-xl p-4 border border-white/5 mt-2">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center min-w-[70px] min-h-[70px] rounded-full bg-gradient-to-tr from-lavender to-aqua p-0.5">
                <div className="flex items-center justify-center w-full h-full bg-midnight rounded-full">
                  <span className="text-lg font-bold text-white">
                    {fitResult.score}%
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{t("recruiter.scoreTitle")}</h4>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  {fitResult.feedback}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COL 2: Radar Chart & Actions (Right Side) */}
        <div className="lg:col-span-5 flex flex-col gap-6 grid-black-color p-6 md:p-8 justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {t("recruiter.chartTitle")}
          </h3>

          {/* Chart Wrapper with fixed height to prevent overflow */}
          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <Radar data={radarData} options={radarOptions} />
          </div>

          {/* Interactive Action Hub */}
          <div className="flex flex-col gap-3 mt-4 border-t border-white/10 pt-4">
            <p className="text-xs text-neutral-400 mb-1">
              {t("recruiter.readyToContact")}
            </p>

            {/* CV Downloads */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`${base}models/cv-en.pdf`}
                download="Julian-Correa-CV-EN.pdf"
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition"
              >
                {t("recruiter.downloadCvEn")}
              </a>
              <a
                href={`${base}models/cv.pdf`}
                download="Julian-Correa-CV-ES.pdf"
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition"
              >
                {t("recruiter.downloadCvEs")}
              </a>
            </div>

            {/* Preset Message Copy & Send */}
            <div className="flex flex-col gap-2 bg-midnight/40 rounded-lg p-2.5 border border-white/5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                {t("recruiter.generatedMessageLabel")}
              </span>
              <p className="text-[11px] text-neutral-300 italic line-clamp-2">
                "{contactText}"
              </p>
              <button
                onClick={copyToClipboard}
                className={`w-full text-xs font-semibold py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                  isCopied
                    ? "bg-emerald-500 text-white"
                    : "bg-lavender text-white hover:bg-lavender/80"
                }`}
              >
                {isCopied ? t("recruiter.copiedBtn") : t("recruiter.copyMessageBtn")}
              </button>
            </div>

            {/* Direct Channels */}
            <div className="flex justify-between items-center text-xs text-neutral-400 px-1 mt-1">
              <span>{t("recruiter.fastChannels")}</span>
              <div className="flex gap-4">
                <a
                  href="mailto:julian.correa.556@unisabaneta.edu.co"
                  className="hover:text-aqua transition underline"
                >
                  Email
                </a>
                <a
                  href="https://linkedin.com/in/juliancorreabety"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-aqua transition underline"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Slider00"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-aqua transition underline"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecruiterHub;
