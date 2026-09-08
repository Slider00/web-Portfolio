import { playJarvisSound, speakJarvis, stopJarvisSpeech } from "./jarvisSpeech";

/**
 * J.A.R.V.I.S. Voice Co-Pilot & Guided Tour Engine
 * Automates smooth section scrolling, synchronized speech narration,
 * multi-language support (ES/EN), and real-time state broadcasts.
 */

export const TOUR_STEPS = [
  {
    id: "hero",
    targetId: "hero",
    titleEs: "1. Bienvenido al Portafolio",
    titleEn: "1. Welcome to the Portfolio",
    badgeEs: "CO-PILOTO IA ● INICIO",
    badgeEn: "AI CO-PILOT ● HOME",
    speechEs:
      "¡Bienvenido al portafolio de Julián! Soy J.A.R.V.I.S., su asistente de Inteligencia Artificial. Permíteme acompañarte en este recorrido guiado por sus mejores proyectos y trayectoria profesional.",
    speechEn:
      "Welcome to Julian's portfolio! I am J.A.R.V.I.S., his AI co-pilot. Allow me to guide you through his top projects, skills, and engineering achievements.",
  },
  {
    id: "about",
    targetId: "about",
    titleEs: "2. Sobre Mí & Habilidades",
    titleEn: "2. About & Tech Stack",
    badgeEs: "STACK & INGENIERÍA",
    badgeEn: "STACK & ENGINEERING",
    speechEs:
      "Julián es Desarrollador Full Stack con sólidas competencias en React, .NET, Flutter, Node y arquitecturas cloud. Se enfoca en crear código limpio, seguro y altamente escalable.",
    speechEn:
      "Julian is a Full Stack Developer with strong expertise in React, .NET, Flutter, Node, and cloud architectures, specializing in clean, secure, and scalable software.",
  },
  {
    id: "projects",
    targetId: "projects",
    titleEs: "3. Proyectos Destacados",
    titleEn: "3. Featured Projects",
    badgeEs: "SOLUCIONES & PORTAFOLIO",
    badgeEn: "SOLUTIONS & PORTFOLIO",
    speechEs:
      "Aquí puedes explorar sus proyectos más destacados, incluyendo aplicaciones móviles en Flutter, plataformas web empresariales en React y sistemas de información geográfica en tiempo real.",
    speechEn:
      "Here you can explore his key projects, including mobile apps with Flutter, enterprise web applications with React, and real-time GIS platforms.",
  },
  {
    id: "experiences",
    targetId: "experiences",
    titleEs: "4. Trayectoria Profesional",
    titleEn: "4. Work Experience",
    badgeEs: "EXPERIENCIA & LIDERAZGO",
    badgeEn: "EXPERIENCE & LEADERSHIP",
    speechEs:
      "En su trayectoria profesional, Julián ha liderado el desarrollo de software para empresas de tecnología e innovación, optimizando procesos clave y construyendo soluciones digitales robustas.",
    speechEn:
      "Throughout his career, Julian has led software development for tech companies, optimizing core processes and architecting high-impact digital solutions.",
  },
  {
    id: "recruiter",
    targetId: "recruiter",
    titleEs: "5. Centro de Reclutadores & Contacto",
    titleEn: "5. Recruiter Hub & Contact",
    badgeEs: "RECLUTADORES & CV",
    badgeEn: "RECRUITERS & RESUME",
    speechEs:
      "Si eres reclutador o deseas colaborar con él, puedes descargar su Hoja de Vida en PDF en español o inglés, o enviarle un mensaje directo por WhatsApp, LinkedIn o correo. ¡Gracias por tu visita!",
    speechEn:
      "If you are a recruiter or wish to collaborate, you can download his Resume in English or Spanish, or contact him directly via WhatsApp, LinkedIn, or email. Thank you for your visit!",
  },
];

class JarvisTourController {
  constructor() {
    this.active = false;
    this.paused = false;
    this.currentStepIndex = 0;
    this.listeners = new Set();
    this.lang = "es";
    this.isSpeaking = false;
    this.scrollTimeout = null;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Notify immediate state
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }

  getState() {
    return {
      active: this.active,
      paused: this.paused,
      currentStepIndex: this.currentStepIndex,
      currentStep: TOUR_STEPS[this.currentStepIndex] || null,
      totalSteps: TOUR_STEPS.length,
      isSpeaking: this.isSpeaking,
      lang: this.lang,
    };
  }

  setLanguage(lang = "es") {
    this.lang = lang.startsWith("en") ? "en" : "es";
    this.notify();
  }

  startTour(lang = "es") {
    this.setLanguage(lang);
    this.active = true;
    this.paused = false;
    this.currentStepIndex = 0;
    playJarvisSound("activate");
    this.notify();

    this.executeCurrentStep();
  }

  executeCurrentStep() {
    if (!this.active) return;

    stopJarvisSpeech();
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);

    const step = TOUR_STEPS[this.currentStepIndex];
    if (!step) {
      this.stopTour();
      return;
    }

    // Highlight section & Smooth scroll
    this.highlightSection(step.targetId);

    const el = document.getElementById(step.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    this.isSpeaking = true;
    this.notify();

    // Small delay to allow scroll animation to settle before speech
    this.scrollTimeout = setTimeout(() => {
      if (!this.active || this.paused) return;

      const speechText = this.lang === "en" ? step.speechEn : step.speechEs;

      speakJarvis(speechText, this.lang, {
        onEnd: () => {
          this.isSpeaking = false;
          this.notify();

          // Auto advance to next step after brief pause if still active and not paused
          if (this.active && !this.paused) {
            setTimeout(() => {
              if (this.active && !this.paused) {
                if (this.currentStepIndex < TOUR_STEPS.length - 1) {
                  this.nextStep();
                } else {
                  this.stopTour();
                }
              }
            }, 1800);
          }
        },
      });
    }, 600);
  }

  nextStep() {
    if (!this.active) return;
    if (this.currentStepIndex < TOUR_STEPS.length - 1) {
      this.currentStepIndex++;
      this.executeCurrentStep();
    } else {
      this.stopTour();
    }
  }

  prevStep() {
    if (!this.active) return;
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.executeCurrentStep();
    }
  }

  togglePause() {
    if (!this.active) return;
    this.paused = !this.paused;
    if (this.paused) {
      stopJarvisSpeech();
      this.isSpeaking = false;
    } else {
      this.executeCurrentStep();
    }
    this.notify();
  }

  stopTour() {
    stopJarvisSpeech();
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);

    this.active = false;
    this.paused = false;
    this.isSpeaking = false;
    this.removeHighlights();
    playJarvisSound("execute");
    this.notify();
  }

  highlightSection(targetId) {
    this.removeHighlights();
    const el = document.getElementById(targetId);
    if (el) {
      el.classList.add("jarvis-tour-active-section");
    }
  }

  removeHighlights() {
    document.querySelectorAll(".jarvis-tour-active-section").forEach((el) => {
      el.classList.remove("jarvis-tour-active-section");
    });
  }
}

export const jarvisTour = new JarvisTourController();
