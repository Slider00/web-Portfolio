// J.A.R.V.I.S. Audio & Speech Engine (Web Speech API + Web Audio API)

// 1. Web Audio API Sci-Fi Sound Synthesizer
export const playJarvisSound = (type = "activate") => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === "activate") {
      // Sci-Fi double rising chime (C5 -> G5 -> C6)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6

      osc2.frequency.setValueAtTime(783.99, now + 0.05); // G5
      osc2.frequency.exponentialRampToValueAtTime(1567.98, now + 0.2); // G6

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.05);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } else if (type === "execute") {
      // Tech execution chirp
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08); // A6

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "listen") {
      // Soft listening ping
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, now); // E5

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (e) {
    console.warn("JARVIS AudioContext unavailable or blocked:", e);
  }
};

// 2. Pre-load & Priority Rank Human Neural Voices
let cachedVoices = [];
const loadVoices = () => {
  if ("speechSynthesis" in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
};

if ("speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export const getBestHumanVoice = (lang = "es") => {
  if (!cachedVoices.length && "speechSynthesis" in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }

  const prefix = lang.startsWith("en") ? "en" : "es";

  // Filter matching language voices
  const available = cachedVoices.filter((v) =>
    v.lang.toLowerCase().replace("_", "-").startsWith(prefix)
  );

  if (!available.length) return null;

  // Priority 1: Colombian Female Voices (es-CO - Salomé, María, Soledad, Esperanza, Natural)
  const colombianFemale = available.find((v) => {
    const l = v.lang.toLowerCase().replace("_", "-");
    const n = v.name.toLowerCase();
    const isCo = l.includes("co") || l.includes("colombia") || n.includes("colombia");
    const isFemale =
      n.includes("salomé") ||
      n.includes("salome") ||
      n.includes("maria") ||
      n.includes("maría") ||
      n.includes("soledad") ||
      n.includes("esperanza") ||
      n.includes("natural") ||
      n.includes("neural") ||
      n.includes("female");
    return isCo && isFemale;
  });
  if (colombianFemale) return colombianFemale;

  // Priority 2: Any Colombian Voice (es-CO)
  const anyColombian = available.find((v) => {
    const l = v.lang.toLowerCase().replace("_", "-");
    const n = v.name.toLowerCase();
    return l.includes("co") || l.includes("colombia") || n.includes("colombia");
  });
  if (anyColombian) return anyColombian;

  // Priority 3: Latin American Female Natural/Neural Voices (es-MX, es-US, es-419)
  const latinFemale = available.find((v) => {
    const n = v.name.toLowerCase();
    return (
      (n.includes("natural") ||
        n.includes("neural") ||
        n.includes("enhanced") ||
        n.includes("premium") ||
        n.includes("google")) &&
      (n.includes("dalia") ||
        n.includes("elvira") ||
        n.includes("paulina") ||
        n.includes("paloma") ||
        n.includes("sabina") ||
        n.includes("monica") ||
        n.includes("mónica") ||
        n.includes("soledad") ||
        n.includes("esperanza"))
    );
  });
  if (latinFemale) return latinFemale;

  // Priority 4: Any Natural Female Voice
  const femaleVoice = available.find((v) => {
    const n = v.name.toLowerCase();
    return (
      n.includes("female") ||
      n.includes("mujer") ||
      n.includes("salome") ||
      n.includes("dalia") ||
      n.includes("paulina") ||
      n.includes("monica")
    );
  });
  if (femaleVoice) return femaleVoice;

  return available[0];
};

// Clean Markdown, Emojis & Acronym Dots before speaking for natural speech cadence
export const cleanTextForSpeech = (text = "") => {
  return text
    .replace(/J\.A\.R\.V\.I\.S\./gi, "Jarvis")
    .replace(/J\.A\.R\.V\.I\.S/gi, "Jarvis")
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert [link text](url) -> link text
    .replace(/^[ \t]*[-*•]\s+/gm, "") // Remove bullet list dashes/dots
    .replace(/^\s*\d+\.\s+/gm, "") // Remove numbered lists (1. 2. 3.)
    .replace(/[*_#`~>]/g, "") // Remove markdown symbols
    .replace(/\s+/g, " ")
    .trim();
};

// 3. Speech Synthesis (Microsoft Edge Neural HD Voice Engine + Fallback)
let currentUtterance = null;
let currentAudio = null;

const fallbackSpeechSynthesis = (cleanedText, lang, callbacks) => {
  if (!("speechSynthesis" in window)) {
    callbacks.onEnd?.();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  currentUtterance = utterance;

  const targetLang = lang.startsWith("en") ? "en-US" : "es-CO";
  utterance.lang = targetLang;
  utterance.pitch = 1.02;
  utterance.rate = 0.98;

  const bestVoice = getBestHumanVoice(lang);
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  utterance.onstart = () => callbacks.onStart?.();
  utterance.onend = () => {
    currentUtterance = null;
    callbacks.onEnd?.();
  };
  utterance.onerror = (err) => {
    currentUtterance = null;
    callbacks.onError?.(err);
  };

  window.speechSynthesis.speak(utterance);
};

export const speakJarvis = async (text, lang = "es", callbacks = {}, options = {}) => {
  // Cancel any ongoing speech / audio
  stopJarvisSpeech();

  const cleanedText = cleanTextForSpeech(text);
  if (!cleanedText) {
    callbacks.onEnd?.();
    return;
  }

  playJarvisSound("execute");

  // Fast zero-latency path for guided tour and Vercel free tier efficiency
  if (options.preferLocal) {
    fallbackSpeechSynthesis(cleanedText, lang, callbacks);
    return;
  }

  const API_URL =
    import.meta.env.VITE_AI_API_URL ||
    (import.meta.env.DEV ? "http://localhost:4000" : "");

  // Attempt Microsoft Edge Salomé Neural (es-CO-SalomeNeural) high-def voice if API URL available
  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}/api/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanedText,
          voice: lang.startsWith("en") ? "en-US-AvaNeural" : "es-CO-SalomeNeural",
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        currentAudio = audio;

        callbacks.onStart?.();

        audio.onended = () => {
          currentAudio = null;
          URL.revokeObjectURL(audioUrl);
          callbacks.onEnd?.();
        };

        audio.onerror = () => {
          currentAudio = null;
          URL.revokeObjectURL(audioUrl);
          fallbackSpeechSynthesis(cleanedText, lang, callbacks);
        };

        await audio.play();
        return;
      }
    } catch (e) {
      console.warn("Edge Neural TTS backend offline, using browser fallback:", e);
    }
  }

  // Fallback to browser SpeechSynthesis
  fallbackSpeechSynthesis(cleanedText, lang, callbacks);
};

export const stopJarvisSpeech = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

// 4. Speech Recognition (Microphone Voice Commands)
export const initJarvisRecognizer = ({ onResult, onError, onEnd, lang = "es" }) => {
  const SpeechRecognitionClass =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    return {
      isSupported: false,
      start: () => onError?.("SpeechRecognition API is not supported in this browser."),
      stop: () => {},
    };
  }

  const recognition = new SpeechRecognitionClass();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = lang.startsWith("en") ? "en-US" : "es-ES";

  recognition.onstart = () => {
    playJarvisSound("listen");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0]?.[0]?.transcript || "";
    onResult?.(transcript);
  };

  recognition.onerror = (event) => {
    console.warn("Speech recognition error:", event.error);
    onError?.(event.error);
  };

  recognition.onend = () => {
    onEnd?.();
  };

  return {
    isSupported: true,
    start: () => {
      try {
        recognition.start();
      } catch (e) {
        console.warn("Recognition already running:", e);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {
        console.warn("Recognition stop error:", e);
      }
    },
  };
};
