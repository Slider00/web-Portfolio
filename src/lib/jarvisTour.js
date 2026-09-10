import { playJarvisSound, speakJarvis, stopJarvisSpeech } from "./jarvisSpeech";

/**
 * J.A.R.V.I.S. Voice Co-Pilot & Guided Tour Engine
 * Features:
 * - Hands-free continuous wake-word voice command recognition ("Jarvis detente", "para", "pausa").
 * - Auto-scrolling section walkthrough with centered alignment.
 * - Bilingual narration (ES/EN).
 * - Zero screen obstruction.
 */

export const TOUR_STEPS = [
  {
    id: "hero",
    targetId: "hero",
    titleEs: "1. Bienvenido al Portafolio",
    titleEn: "1. Welcome to the Portfolio",
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
    this.recognizer = null;
  }

  subscribe(listener) {
    this.listeners.add(listener);
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

    // Start continuous hands-free voice command listener
    this.startVoiceListener();

    this.executeCurrentStep();
  }

  startVoiceListener() {
    const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechClass) return;

    try {
      if (this.recognizer) {
        try { this.recognizer.stop(); } catch (e) {}
      }

      const recognition = new SpeechClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = this.lang.startsWith("en") ? "en-US" : "es-ES";

      recognition.onresult = (event) => {
        if (!this.active) return;
        const results = event.results;
        for (let i = event.resultIndex; i < results.length; i++) {
          const text = (results[i][0]?.transcript || "").toLowerCase().trim();

          // Detect Stop Commands ("detente", "para", "detener", "stop", "cancela", "salir")
          if (
            text.includes("detente") ||
            text.includes("deten") ||
            text.includes("detener") ||
            text.includes("para") ||
            text.includes("parar") ||
            text.includes("stop") ||
            text.includes("cancelar") ||
            text.includes("cancela") ||
            text.includes("salir")
          ) {
            this.stopTour();
            speakJarvis(
              this.lang === "en" ? "Stopping guided tour." : "Entendido, tour detenido.",
              this.lang
            );
            return;
          }

          // Detect Pause Commands
          if (text.includes("pausa") || text.includes("pause") || text.includes("pausar")) {
            if (!this.paused) this.togglePause();
            return;
          }

          // Detect Resume Commands
          if (text.includes("continua") || text.includes("reanuda") || text.includes("resume")) {
            if (this.paused) this.togglePause();
            return;
          }
        }
      };

      recognition.onerror = (e) => {
        if (this.active && e.error !== "not-allowed" && e.error !== "aborted") {
          setTimeout(() => {
            if (this.active) this.startVoiceListener();
          }, 1000);
        }
      };

      recognition.onend = () => {
        if (this.active) {
          setTimeout(() => {
            if (this.active) {
              try { recognition.start(); } catch (err) {}
            }
          }, 300);
        }
      };

      recognition.start();
      this.recognizer = recognition;
    } catch (err) {
      console.warn("Tour voice listener setup error:", err);
    }
  }

  stopVoiceListener() {
    if (this.recognizer) {
      try {
        this.recognizer.onend = null;
        this.recognizer.stop();
      } catch (e) {}
      this.recognizer = null;
    }
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

    this.highlightSection(step.targetId);

    const el = document.getElementById(step.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    this.isSpeaking = true;
    this.notify();

    this.scrollTimeout = setTimeout(() => {
      if (!this.active || this.paused) return;

      const speechText = this.lang === "en" ? step.speechEn : step.speechEs;

      speakJarvis(speechText, this.lang, {
        onEnd: () => {
          this.isSpeaking = false;
          this.notify();

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
    this.stopVoiceListener();

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
