// J.A.R.V.I.S. Action Parser & UI Execution Engine
import { jarvisTour } from "./jarvisTour";

export const parseJarvisIntent = (text = "") => {
  // Normalize text removing accents
  const query = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (!query) return { type: "UNKNOWN" };

  // 1. Tech Stack & Specific Project Intents
  if (
    query.includes("proyecto") ||
    query.includes("project") ||
    query.includes("trabajo") ||
    query.includes("work") ||
    query.includes("flutter") ||
    query.includes("react") ||
    query.includes("mobile") ||
    query.includes("movil") ||
    query.includes("app") ||
    query.includes("dotnet") ||
    query.includes("net") ||
    query.includes("csharp") ||
    query.includes("c#") ||
    query.includes("node") ||
    query.includes("php") ||
    query.includes("wordpress") ||
    query.includes("blazor") ||
    query.includes("web") ||
    query.includes("gis") ||
    query.includes("sismo") ||
    query.includes("emergenci") ||
    query.includes("wompi") ||
    query.includes("saas") ||
    query.includes("pos") ||
    query.includes("portfolio") ||
    query.includes("portafolio") ||
    query.includes("demo")
  ) {
    return { type: "NAVIGATE", target: "projects", speechKey: "jarvis.actions.projects" };
  }

  // 2. Experience Intents
  if (
    query.includes("experiencia") ||
    query.includes("experience") ||
    query.includes("empleo") ||
    query.includes("empresa") ||
    query.includes("innventa") ||
    query.includes("bety") ||
    query.includes("senior") ||
    query.includes("desarrollador") ||
    query.includes("developer") ||
    query.includes("trayectoria")
  ) {
    return { type: "NAVIGATE", target: "experiences", speechKey: "jarvis.actions.experience" };
  }

  // 3. Certifications & Education Intents
  if (
    query.includes("certificad") ||
    query.includes("certific") ||
    query.includes("titulo") ||
    query.includes("diploma") ||
    query.includes("estudio") ||
    query.includes("universidad") ||
    query.includes("educacion") ||
    query.includes("ingeniero") ||
    query.includes("unisabaneta") ||
    query.includes("freecodecamp") ||
    query.includes("scrum")
  ) {
    return { type: "NAVIGATE", target: "certifications", speechKey: "jarvis.actions.certifications" };
  }

  // 4. Recruiter Hub Intents
  if (
    query.includes("reclutador") ||
    query.includes("recruiter") ||
    query.includes("vacante") ||
    query.includes("simul") ||
    query.includes("compatibil") ||
    query.includes("contratar") ||
    query.includes("hire") ||
    query.includes("match")
  ) {
    return { type: "NAVIGATE", target: "recruiter", speechKey: "jarvis.actions.recruiter" };
  }

  // 5. Testimonials & Reviews Intents
  if (
    query.includes("testimonio") ||
    query.includes("review") ||
    query.includes("opinion") ||
    query.includes("cliente") ||
    query.includes("comentario") ||
    query.includes("resena") ||
    query.includes("resena")
  ) {
    return { type: "NAVIGATE", target: "testimonials", speechKey: "jarvis.actions.testimonials" };
  }

  // 6. About / Profile / Greetings Intents
  if (
    query.includes("sobre mi") ||
    query.includes("about") ||
    query.includes("quien es") ||
    query.includes("julian") ||
    query.includes("perfil") ||
    query.includes("habilidad") ||
    query.includes("skill") ||
    query.includes("hola") ||
    query.includes("hi") ||
    query.includes("hello") ||
    query.includes("saludo") ||
    query.includes("ayuda") ||
    query.includes("help") ||
    query.includes("que haces")
  ) {
    return { type: "NAVIGATE", target: "about", speechKey: "jarvis.actions.about" };
  }

  // 7. Hero / Top Intents
  if (
    query.includes("inicio") ||
    query.includes("home") ||
    query.includes("hero") ||
    query.includes("arriba") ||
    query.includes("top")
  ) {
    return { type: "NAVIGATE", target: "hero", speechKey: "jarvis.actions.hero" };
  }

  // 8. Contact Intents
  if (
    query.includes("contacto") ||
    query.includes("contact") ||
    query.includes("correo") ||
    query.includes("email") ||
    query.includes("mail") ||
    query.includes("whatsapp") ||
    query.includes("linkedin")
  ) {
    return { type: "NAVIGATE", target: "contact", speechKey: "jarvis.actions.contact" };
  }

  // 9. CV Download Intents
  if (
    query.includes("cv") ||
    query.includes("hoja de vida") ||
    query.includes("curriculum") ||
    query.includes("resume") ||
    query.includes("pdf")
  ) {
    const isEnglish = query.includes("ingles") || query.includes("english");
    const isSpanish = query.includes("espanol") || query.includes("spanish");
    const lang = isEnglish ? "en" : isSpanish ? "es" : "both";
    const speechKey =
      lang === "en"
        ? "jarvis.actions.downloadCvEn"
        : lang === "es"
        ? "jarvis.actions.downloadCvEs"
        : "jarvis.actions.downloadCvBoth";

    return {
      type: "DOWNLOAD_CV",
      lang,
      speechKey,
    };
  }

  // 10. Live Chat Intents (Explicit Human Telegram Requests Only)
  if (
    query.includes("hablar en directo") ||
    query.includes("hablar con julian en persona") ||
    query.includes("conectar por telegram")
  ) {
    return { type: "OPEN_LIVE_CHAT", speechKey: "jarvis.actions.liveChat" };
  }

  // 11. Guided Tour & Control Intents
  if (
    query.includes("detente") ||
    query.includes("deten") ||
    query.includes("detener") ||
    query.includes("para tour") ||
    query.includes("cancelar tour") ||
    query.includes("stop tour") ||
    query.includes("salir tour")
  ) {
    return { type: "STOP_TOUR", speechKey: "jarvis.actions.stopTour" };
  }

  if (query.includes("pausa") || query.includes("pausar") || query.includes("pause")) {
    return { type: "PAUSE_TOUR", speechKey: "jarvis.actions.pauseTour" };
  }

  if (query.includes("continua") || query.includes("reanuda") || query.includes("resume")) {
    return { type: "RESUME_TOUR", speechKey: "jarvis.actions.resumeTour" };
  }

  if (
    query.includes("tour") ||
    query.includes("recorrido") ||
    query.includes("guiado") ||
    query.includes("copilot") ||
    query.includes("co-piloto") ||
    query.includes("guided")
  ) {
    return { type: "START_TOUR", speechKey: "jarvis.actions.tour" };
  }

  // 12. Language Switch Intents
  if (query.includes("ingles") || query.includes("english")) {
    return { type: "CHANGE_LANGUAGE", lang: "en", speechKey: "jarvis.actions.changeLangEn" };
  }
  if (query.includes("espanol") || query.includes("spanish")) {
    return { type: "CHANGE_LANGUAGE", lang: "es", speechKey: "jarvis.actions.changeLangEs" };
  }

  // Fallback: If intent is unknown, default to navigating to Projects & opening Chat
  return { type: "UNKNOWN_FALLBACK", target: "projects", speechKey: "jarvis.actions.unknown" };
};

export const executeJarvisAction = (action, helpers = {}) => {
  if (!action || !action.type) return;

  switch (action.type) {
    case "STOP_TOUR": {
      jarvisTour.stopTour();
      break;
    }
    case "PAUSE_TOUR":
    case "RESUME_TOUR": {
      jarvisTour.togglePause();
      break;
    }
    case "START_TOUR": {
      jarvisTour.startTour(helpers.lang || "es");
      break;
    }
    case "NAVIGATE": {
      const el = document.getElementById(action.target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      break;
    }
    case "DOWNLOAD_CV": {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const downloadFile = (fileName) => {
          const link = document.createElement("a");
          link.href = `${baseUrl}assets/${fileName}`;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        if (action.lang === "both") {
          downloadFile("CV Julian es.pdf");
          setTimeout(() => {
            downloadFile("CV Julian en.pdf");
          }, 350);
        } else {
          const cvFileName = action.lang === "en" ? "CV Julian en.pdf" : "CV Julian es.pdf";
          downloadFile(cvFileName);
        }
        return { success: true };
      } catch (err) {
        console.error("CV Download error:", err);
        return { success: false, error: err?.message };
      }
    }
    case "OPEN_LIVE_CHAT": {
      if (helpers.openChat) {
        helpers.openChat();
      }
      const el = document.getElementById("projects");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      break;
    }
    case "CHANGE_LANGUAGE": {
      if (helpers.changeLanguage) {
        helpers.changeLanguage(action.lang);
      }
      break;
    }
    case "UNKNOWN_FALLBACK": {
      // Fallback action: scroll smoothly to projects section so the user sees action!
      const el = document.getElementById("projects");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      break;
    }
    default:
      break;
  }
};
