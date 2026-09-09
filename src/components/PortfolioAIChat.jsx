import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { askPortfolioAI } from "../lib/portfolioAi";
import { io } from "socket.io-client";
import { executeJarvisAction, parseJarvisIntent } from "../lib/jarvisActions";
import {
  initJarvisRecognizer,
  playJarvisSound,
  speakJarvis,
  stopJarvisSpeech,
} from "../lib/jarvisSpeech";
import JarvisHologramAvatar from "./JarvisHologramAvatar";

const CONTACT_LINKS = {
  whatsapp: import.meta.env.VITE_WHATSAPP_URL || "",
  linkedin: import.meta.env.VITE_LINKEDIN_URL || "",
  github: import.meta.env.VITE_GITHUB_URL || "https://github.com/Slider00",
};

const isContactIntent = (text) => {
  const value = (text || "").toLowerCase();
  const patterns = [
    "contact",
    "contacto",
    "contáct",
    "whatsapp",
    "linkedin",
    "github",
    "correo",
    "email",
    "mail",
    "reach you",
    "reach out",
    "how can i contact",
  ];
  return patterns.some((pattern) => value.includes(pattern));
};

const detectContactChannelIntent = (text) => {
  const value = (text || "").toLowerCase();
  const wantsWhatsApp = value.includes("whatsapp") || value.includes("whats");
  const wantsGitHub = value.includes("github");
  const wantsLinkedIn = value.includes("linkedin") || value.includes("linked in");
  const wantsGenericContact =
    value.includes("contact") ||
    value.includes("contacto") ||
    value.includes("contáct") ||
    value.includes("reach out") ||
    value.includes("reach you") ||
    value.includes("how can i contact");

  return { wantsWhatsApp, wantsGitHub, wantsLinkedIn, wantsGenericContact };
};

const getTimeBasedGreeting = (lang = "es") => {
  const hour = new Date().getHours();
  const isEn = (lang || "").startsWith("en");

  let salutation = "";
  if (hour >= 5 && hour < 12) {
    salutation = isEn ? "Good morning!" : "¡Buenos días!";
  } else if (hour >= 12 && hour < 19) {
    salutation = isEn ? "Good afternoon!" : "¡Buenas tardes!";
  } else {
    salutation = isEn ? "Good evening!" : "¡Buenas noches!";
  }

  if (isEn) {
    return `${salutation} I am Jarvis, Julian's personal AI assistant. It is a true pleasure to welcome you! If you would like to speak directly with me in first person and explore his portfolio using your voice, simply tap the microphone button below. Or if you prefer to get in touch or chat directly with Julian, feel free to type your message right here in the chat.`;
  }

  return `${salutation} Soy Jarvis, el asistente personal de IA de Julián. ¡Es un verdadero gusto darte la bienvenida! Si deseas hablar directamente conmigo en primera persona y explorar su portafolio por voz, simplemente presiona el botón del micrófono abajo. O si prefieres ponerte en contacto o chatear directamente con Julián, escribe tu mensaje aquí mismo en el chat.`;
};

const PortfolioAIChat = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState(() => [
    { role: "assistant", content: getTimeBasedGreeting(i18n.language) },
  ]);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const recognizerRef = useRef(null);
  const [liveMode, setLiveMode] = useState("ai");
  const [isConnected, setIsConnected] = useState(false);
  const [soundMuted, setSoundMuted] = useState(
    () => localStorage.getItem("portfolio_chat_muted") === "true"
  );
  const [isListening, setIsListening] = useState(false);

  const getChatId = () => {
    let id = localStorage.getItem("portfolio_chat_id");
    if (!id) {
      id = "session_" + Math.random().toString(36).substring(2, 11);
      localStorage.setItem("portfolio_chat_id", id);
    }
    return id;
  };

  const playNotificationSound = (isIncoming) => {
    if (soundMuted) return;
    playJarvisSound(isIncoming ? "activate" : "execute");
  };

  const toggleSound = () => {
    setSoundMuted((prev) => {
      const next = !prev;
      localStorage.setItem("portfolio_chat_muted", String(next));
      if (next) stopJarvisSpeech();
      return next;
    });
  };

  // Initialize Speech Recognizer (Microphone)
  useEffect(() => {
    const recognizer = initJarvisRecognizer({
      lang: i18n.language,
      onResult: (text) => {
        setIsListening(false);
        setInput(text);
        handleVoiceCommand(text);
      },
      onError: (err) => {
        setIsListening(false);
        console.warn("Speech Recognition error:", err);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    recognizerRef.current = recognizer;
  }, [i18n.language, soundMuted, messages]);

  const toggleMic = () => {
    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    } else {
      stopJarvisSpeech();
      setIsListening(true);
      recognizerRef.current?.start();
    }
  };

  useEffect(() => {
    const API_URL =
      import.meta.env.VITE_AI_API_URL ||
      (import.meta.env.DEV ? "http://localhost:4000" : "");
    if (!API_URL) return;

    const socket = io(API_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      const chatId = getChatId();
      socket.emit("join-chat", { chatId });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("live-chat-status", ({ mode }) => {
      setLiveMode(mode);
    });

    socket.on("chat-history", (history) => {
      if (Array.isArray(history) && history.length > 0) {
        setMessages([
          { role: "assistant", content: getTimeBasedGreeting(i18n.language) },
          ...history,
        ]);
      }
    });

    socket.on("mensaje-servidor", ({ text, sender }) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: text,
          sender: sender,
        },
      ]);
      setLoading(false);
      playNotificationSound(true);

      // Speak Jarvis voice response if not muted
      if (!soundMuted) {
        speakJarvis(text, i18n.language);
      }

      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [i18n.language, soundMuted]);

  // Dedicated Voice Handler for Microphone Input (Always routes to Jarvis AI + Gemini + Voice Synthesis)
  const handleVoiceCommand = async (spokenText) => {
    const text = (spokenText || "").trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    playJarvisSound("execute");
    setInput("");
    setError("");
    setLoading(true);

    // 1. Execute UI Actions (Scrolling, Guided Tour, CV Download, Language Switch)
    const intent = parseJarvisIntent(text);
    const actionResult = executeJarvisAction(intent, {
      openChat: () => setOpen(true),
      changeLanguage: (lang) => i18n.changeLanguage(lang),
      lang: i18n.language,
    });

    if (intent.type === "START_TOUR") {
      const tourMsg = i18n.language.startsWith("en")
        ? "Starting the J.A.R.V.I.S. AI Co-Pilot guided tour..."
        : "¡Excelente! Iniciando el tour guiado con la voz de J.A.R.V.I.S...";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: tourMsg },
      ]);
      setLoading(false);
      return;
    }

    if (intent.type === "DOWNLOAD_CV") {
      const confirmationMsg =
        actionResult?.success === false
          ? t("jarvis.actions.downloadError")
          : t(intent.speechKey);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: confirmationMsg },
      ]);
      setLoading(false);

      if (!soundMuted) {
        speakJarvis(confirmationMsg, i18n.language);
      }
      return;
    }

    // 2. Direct HTTP Query to Gemini AI (Always bypasses Telegram WebSockets)
    const nextHistory = nextMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const data = await askPortfolioAI(text, nextHistory);
      const reply =
        data?.reply ||
        "I could not generate a response right now. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
        },
      ]);

      // Speak Jarvis Voice response
      if (!soundMuted) {
        speakJarvis(reply, i18n.language);
      }
    } catch (err) {
      console.error("Jarvis voice command error:", err);
      const errorMsg = t("aiChat.errorReach");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg },
      ]);
      if (!soundMuted) {
        speakJarvis(errorMsg, i18n.language);
      }
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  };

  const handleSend = async (presetMessage) => {
    const message = (presetMessage ?? input).trim();
    if (!message || loading) return;

    const nextMessages = [...messages, { role: "user", content: message }];
    setMessages(nextMessages);
    playNotificationSound(false);
    if (!presetMessage) setInput("");
    setError("");

    // In Live Human Chat (Telegram) mode, emit and release loading immediately so user can keep chatting
    if (liveMode === "human") {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("mensaje-cliente", {
          chatId: getChatId(),
          text: message,
        });
      }
      setLoading(false);
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
      return;
    }

    setLoading(true);

    // 1. Execute local UI Actions (Guided Tour, Scroll Navigation, CV Download, Language Switch)
    const intent = parseJarvisIntent(message);
    const actionResult = executeJarvisAction(intent, {
      openChat: () => setOpen(true),
      changeLanguage: (lang) => i18n.changeLanguage(lang),
      lang: i18n.language,
    });

    if (intent.type === "START_TOUR") {
      const tourMsg = i18n.language.startsWith("en")
        ? "Starting the J.A.R.V.I.S. AI Co-Pilot guided tour..."
        : "¡Excelente! Iniciando el tour guiado con la voz de J.A.R.V.I.S...";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: tourMsg },
      ]);
      setLoading(false);
      return;
    }

    if (intent.type === "DOWNLOAD_CV") {
      const confirmationMsg =
        actionResult?.success === false
          ? t("jarvis.actions.downloadError")
          : t(intent.speechKey);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: confirmationMsg },
      ]);
      setLoading(false);

      if (!soundMuted) {
        speakJarvis(confirmationMsg, i18n.language);
      }
      return;
    }

    // In AI Mode, process via Gemini AI & guarantee setLoading(false) in finally
    const nextHistory = nextMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const data = await askPortfolioAI(message, nextHistory);
      const reply =
        data?.reply ||
        "I could not generate a response right now. Please try again.";
      const contactIntent = isContactIntent(message);
      const channelIntent = detectContactChannelIntent(message);
      const contact =
        contactIntent &&
        channelIntent.wantsWhatsApp &&
        data?.contact?.type === "whatsapp"
          ? data.contact
          : null;
      const suggestions = Array.isArray(data?.suggestions)
        ? data.suggestions.filter((item) => typeof item === "string")
        : [];
      const actions = Array.isArray(data?.actions)
        ? data.actions.filter(
            (action) =>
              action?.type === "link" &&
              typeof action?.label === "string" &&
              typeof action?.url === "string"
          )
        : [];
      const filteredActions = contactIntent
        ? actions.filter((action) => {
            const label = action.label.toLowerCase();
            const url = action.url.toLowerCase();
            const isWhatsAppAction =
              label.includes("whatsapp") ||
              url.includes("wa.me") ||
              url.includes("whatsapp");
            const isGitHubAction =
              label.includes("github") || url.includes("github.com");
            const isLinkedInAction =
              label.includes("linkedin") || url.includes("linkedin.com");

            if (isWhatsAppAction) return channelIntent.wantsWhatsApp;
            if (isGitHubAction) return channelIntent.wantsGitHub;
            if (isLinkedInAction) return channelIntent.wantsLinkedIn;
            return true;
          })
        : actions.filter((action) => {
            const label = action.label.toLowerCase();
            const url = action.url.toLowerCase();
            const isContactAction =
              label.includes("whatsapp") ||
              label.includes("github") ||
              label.includes("linkedin") ||
              url.includes("wa.me") ||
              url.includes("whatsapp") ||
              url.includes("github.com") ||
              url.includes("linkedin.com");
            return !isContactAction;
          });

      const hasWhatsAppAction = filteredActions.some((action) =>
        action.label.toLowerCase().includes("whatsapp")
      );
      const hasLinkedInAction = filteredActions.some(
        (action) =>
          action.label.toLowerCase().includes("linkedin") ||
          action.url.toLowerCase().includes("linkedin.com")
      );
      const hasGitHubAction = filteredActions.some(
        (action) =>
          action.label.toLowerCase().includes("github") ||
          action.url.toLowerCase().includes("github.com")
      );

      const fallbackContactActions = [];
      if (
        contactIntent &&
        (channelIntent.wantsWhatsApp || channelIntent.wantsGenericContact) &&
        !hasWhatsAppAction &&
        CONTACT_LINKS.whatsapp
      ) {
        fallbackContactActions.push({
          type: "link",
          label: "WhatsApp",
          url: CONTACT_LINKS.whatsapp,
        });
      }
      if (
        contactIntent &&
        channelIntent.wantsLinkedIn &&
        !hasLinkedInAction &&
        CONTACT_LINKS.linkedin
      ) {
        fallbackContactActions.push({
          type: "link",
          label: "LinkedIn",
          url: CONTACT_LINKS.linkedin,
        });
      }
      if (
        contactIntent &&
        channelIntent.wantsGitHub &&
        !hasGitHubAction &&
        CONTACT_LINKS.github
      ) {
        fallbackContactActions.push({
          type: "link",
          label: "GitHub",
          url: CONTACT_LINKS.github,
        });
      }

      const finalActions = [...filteredActions, ...fallbackContactActions];
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          contact,
          suggestions,
          actions: finalActions,
        },
      ]);

      // Speak Jarvis voice response
      if (!soundMuted) {
        speakJarvis(reply, i18n.language);
      }
    } catch (err) {
      setError(t("aiChat.errorConn"));
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("aiChat.errorReach"),
        },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  };

  const hasGreetedRef = useRef(
    sessionStorage.getItem("portfolio_chat_greeted") === "true"
  );

  const handleToggleOpen = () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      const greeting = getTimeBasedGreeting(i18n.language);

      setMessages((prevMsgs) => {
        if (prevMsgs.length === 0) {
          return [{ role: "assistant", content: greeting }];
        }
        return prevMsgs;
      });

      // Play sound and voice greeting ONLY the very first time the chat is opened during the session
      if (!hasGreetedRef.current) {
        hasGreetedRef.current = true;
        sessionStorage.setItem("portfolio_chat_greeted", "true");
        playJarvisSound("activate");

        if (!soundMuted) {
          speakJarvis(greeting, i18n.language);
        }
      }
    } else {
      stopJarvisSpeech();
    }
  };

  const avatarStatus = isListening ? "LISTENING" : loading ? "THINKING" : "IDLE";

  return (
    <>
      <div
        className="fixed z-50 bottom-6 right-5 cursor-pointer transition-transform duration-300 hover:scale-105"
        aria-label="Open Jarvis AI assistant"
      >
        <JarvisHologramAvatar
          status={avatarStatus}
          size="lg"
          onClick={handleToggleOpen}
        />
      </div>

      {open && (
        <aside className="fixed z-50 w-[min(92vw,24rem)] h-[70vh] max-h-[44rem] bottom-24 right-5 rounded-2xl border border-[#33c2cc]/30 bg-primary/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-2.5">
              <JarvisHologramAvatar
                status={avatarStatus}
                size="sm"
                showBadge={false}
                interactive={false}
              />
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-1.5 leading-none">
                  J.A.R.V.I.S. <span className="text-[10px] text-[#33c2cc] font-normal">v4.0 AI</span>
                </h3>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {isListening ? "● Escuchando..." : loading ? "● Procesando..." : "● En línea"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleSound}
                className="text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title={soundMuted ? "Activar Voz de Jarvis" : "Silenciar Voz"}
              >
                {soundMuted ? (
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-4.5 h-4.5 text-[#33c2cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-neutral-300 hover:text-white"
                aria-label="Close Jarvis assistant"
              >
                ✕
              </button>
            </div>
          </header>

          {/* Telegram Live Mode Toggle Bar */}
          {liveMode === "ai" ? (
            <div className="flex justify-between items-center bg-emerald-500/10 border-b border-white/5 px-3 py-1.5 text-[11px] text-emerald-400 font-semibold">
              <span>¿Quieres hablar conmigo en directo?</span>
              <button
                disabled={!isConnected}
                onClick={() => {
                  if (socketRef.current) {
                    socketRef.current.emit("request-live-chat", { chatId: getChatId() });
                  }
                }}
                className={`px-2 py-0.5 rounded font-bold transition-all duration-300 ${
                  isConnected
                    ? "bg-emerald-500 hover:bg-emerald-600 text-black cursor-pointer animate-pulse"
                    : "bg-white/5 text-neutral-500 cursor-not-allowed"
                }`}
              >
                {isConnected ? "Chatear" : "Conectando..."}
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center bg-indigo-500/10 border-b border-white/5 px-3 py-1.5 text-[11px] text-neutral-300 font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Chat en Vivo con Julián</span>
              </div>
              <button
                disabled={!isConnected}
                onClick={() => {
                  if (socketRef.current) {
                    socketRef.current.emit("exit-live-chat", { chatId: getChatId() });
                  }
                }}
                className={`px-2.5 py-0.5 rounded font-semibold text-[10px] transition-all duration-300 ${
                  isConnected
                    ? "bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    : "bg-white/5 text-neutral-500 cursor-not-allowed"
                }`}
              >
                {isConnected ? "Volver a la IA" : "Conectando..."}
              </button>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
          >
            {messages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-lavender/30 text-white"
                    : "mr-auto bg-white/8 text-neutral-100"
                }`}
              >
                {message.sender && (
                  <span className="block text-[9px] font-bold text-neutral-400 mb-0.5 tracking-wider uppercase">
                    {message.sender}
                  </span>
                )}
                <p>{message.content}</p>
                {message.contact?.type === "whatsapp" && (
                  <a
                    href={message.contact.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex mt-2 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-xs font-semibold text-black"
                  >
                    {t("aiChat.contactWhatsapp")}
                  </a>
                )}
                {Array.isArray(message.actions) && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.actions.map((action, actionIndex) => (
                      <a
                        key={`${action.label}-${actionIndex}`}
                        href={action.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                )}
                {Array.isArray(message.suggestions) &&
                  message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.suggestions.map((suggestion, suggestionIndex) => (
                        <button
                          key={`${suggestion}-${suggestionIndex}`}
                          type="button"
                          className="inline-flex rounded-full border border-lavender/60 bg-lavender/20 px-2.5 py-1 text-xs font-medium text-white hover:bg-lavender/35"
                          onClick={() => handleSend(suggestion)}
                          disabled={loading}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
              </article>
            ))}
            {loading && (
              <article className="mr-auto rounded-xl px-4 py-3 bg-white/8 text-neutral-200">
                <div className="typing-dots flex items-center gap-1.5 h-3">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </article>
            )}
          </div>

          {/* Footer Input Area with Microphone */}
          <footer className="px-3 py-2 border-t border-white/10">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={2}
                placeholder={t("aiChat.placeholder")}
                className="w-full px-3 py-2 text-base text-white rounded-lg resize-none bg-white/10 md:text-sm field-input-focus placeholder:text-neutral-400"
              />

              {/* Microphone Voice Input Button */}
              <button
                type="button"
                onClick={toggleMic}
                className={`p-2.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                  isListening
                    ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                    : "bg-white/10 border-white/10 text-neutral-300 hover:text-white hover:bg-white/20"
                }`}
                title="Hablar por micrófono con Jarvis"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleSend()}
                className="px-4 py-2.5 text-sm font-bold text-white rounded-xl bg-[#7a57db] hover:bg-[#8a68e6] active:scale-95 shadow-[0_4px_15px_rgba(122,87,219,0.5)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
              >
                {t("aiChat.send")}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
          </footer>
        </aside>
      )}
    </>
  );
};

export default PortfolioAIChat;
