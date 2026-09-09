import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  initJarvisRecognizer,
  playJarvisSound,
  speakJarvis,
  stopJarvisSpeech,
} from "../lib/jarvisSpeech";
import { executeJarvisAction, parseJarvisIntent } from "../lib/jarvisActions";
import { askPortfolioAI } from "../lib/portfolioAi";
import JarvisHologramAvatar from "./JarvisHologramAvatar";

const JarvisHUD = ({ onOpenLiveChat }) => {
  const { t, i18n } = useTranslation();
  const [activated, setActivated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState("IDLE"); // IDLE, LISTENING, THINKING, SPEAKING, EXECUTING
  const [speechMuted, setSpeechMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState([]);
  const recognizerRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!activated) return;

    const recognizer = initJarvisRecognizer({
      lang: i18n.language,
      onResult: (text) => {
        setIsListening(false);
        setTranscript(text);
        handleCommand(text);
      },
      onError: (err) => {
        setIsListening(false);
        setStatus("IDLE");
        console.warn("Jarvis Recognition error:", err);
      },
      onEnd: () => {
        setIsListening(false);
        if (status === "LISTENING") setStatus("IDLE");
      },
    });

    recognizerRef.current = recognizer;
  }, [activated, i18n.language]);

  // Activate JARVIS on first click
  const handleActivate = () => {
    setActivated(true);
    setExpanded(true);
    playJarvisSound("activate");

    const greetingText = t("jarvis.greeting");
    setTranscript(greetingText);
    setStatus("SPEAKING");

    if (!speechMuted) {
      speakJarvis(greetingText, i18n.language, {
        onEnd: () => setStatus("IDLE"),
      });
    } else {
      setTimeout(() => setStatus("IDLE"), 2500);
    }
  };

  // Process text or voice command with Gemini AI + Local UI Actions
  const handleCommand = async (rawText) => {
    const text = rawText.trim();
    if (!text) return;

    setInputVal("");
    setTranscript(`"${text}"`);
    setStatus("THINKING");
    playJarvisSound("execute");

    // 1. Instantly parse and execute UI Action for zero latency
    const intent = parseJarvisIntent(text);
    const result = executeJarvisAction(intent, {
      openChat: onOpenLiveChat,
      changeLanguage: (lang) => i18n.changeLanguage(lang),
    });

    const localActionMsg =
      result?.success === false
        ? t("jarvis.actions.downloadError")
        : t(intent.speechKey);

    // Direct confirmation for file downloads to avoid redundant AI link text
    if (intent.type === "DOWNLOAD_CV") {
      setStatus("SPEAKING");
      setTranscript(localActionMsg);

      if (!speechMuted) {
        speakJarvis(localActionMsg, i18n.language, {
          onEnd: () => setStatus("IDLE"),
        });
      } else {
        setTimeout(() => setStatus("IDLE"), 2500);
      }
      return;
    }

    // 2. Query Gemini AI for real intellect & deep reasoning
    try {
      const nextHistory = [...history, { role: "user", content: text }];
      setHistory(nextHistory);

      const aiData = await askPortfolioAI(text, nextHistory);
      const aiReply = aiData?.reply;

      if (aiReply) {
        setStatus("SPEAKING");
        setTranscript(aiReply);

        setHistory((prev) => [...prev, { role: "assistant", content: aiReply }]);

        if (!speechMuted) {
          speakJarvis(aiReply, i18n.language, {
            onEnd: () => setStatus("IDLE"),
          });
        } else {
          setTimeout(() => setStatus("IDLE"), 2500);
        }
        return;
      }
    } catch (e) {
      console.warn("Gemini AI request fallback to local JARVIS voice:", e);
    }

    // 3. Fallback if Gemini AI backend is offline/slow
    setStatus("SPEAKING");
    setTranscript(localActionMsg);
    if (!speechMuted) {
      speakJarvis(localActionMsg, i18n.language, {
        onEnd: () => setStatus("IDLE"),
      });
    } else {
      setTimeout(() => setStatus("IDLE"), 2000);
    }
  };

  const toggleMic = () => {
    if (!activated) {
      handleActivate();
      return;
    }

    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
      setStatus("IDLE");
    } else {
      stopJarvisSpeech();
      setIsListening(true);
      setStatus("LISTENING");
      recognizerRef.current?.start();
    }
  };

  const toggleMute = () => {
    setSpeechMuted((prev) => {
      const next = !prev;
      if (next) stopJarvisSpeech();
      return next;
    });
  };

  return (
    <aside className="fixed z-40 top-4 left-4 sm:top-5 sm:left-5 max-w-[calc(100vw-2rem)] select-none">
      {/* 1. Unactivated Bar */}
      {!activated ? (
        <button
          onClick={handleActivate}
          className="jarvis-reactor flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-[#33c2cc]/40 bg-[#030412]/85 backdrop-blur-md text-white text-xs font-mono font-semibold hover:border-[#33c2cc] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(51,194,204,0.3)] cursor-pointer"
        >
          <span className="relative flex size-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#33c2cc] opacity-75"></span>
            <span className="relative inline-flex rounded-full size-3 bg-[#33c2cc]"></span>
          </span>
          <span>{t("jarvis.activateBtn")}</span>
        </button>
      ) : (
        /* 2. Activated HUD Container */
        <div className="flex flex-col gap-2 rounded-2xl border border-[#33c2cc]/30 bg-[#030412]/90 backdrop-blur-xl p-3 shadow-[0_0_30px_rgba(51,194,204,0.25)] w-72 sm:w-88 transition-all duration-300">
          {/* Header & Status Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <JarvisHologramAvatar
                status={status}
                size="sm"
                showBadge={false}
                interactive={false}
              />
              <div>
                <h4 className="text-[11px] font-mono font-bold tracking-widest text-[#33c2cc] uppercase">
                  JARVIS HUD
                </h4>
                <p className="text-[9px] font-mono text-neutral-400">
                  {status === "LISTENING"
                    ? t("jarvis.statusListening")
                    : status === "THINKING"
                    ? t("jarvis.statusThinking")
                    : status === "EXECUTING"
                    ? t("jarvis.statusExecuting")
                    : status === "SPEAKING"
                    ? "Audio Output Active"
                    : t("jarvis.statusIdle")}
                </p>
              </div>
            </div>

            {/* Action controls */}
            <div className="flex items-center gap-2">
              {/* Audio Waveform indicator when speaking */}
              {status === "SPEAKING" && (
                <div className="jarvis-waveform flex items-center gap-0.5 h-4 px-1">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              )}

              {/* Mute button */}
              <button
                type="button"
                onClick={toggleMute}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title={speechMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {speechMuted ? (
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="size-4 text-[#33c2cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>

              {/* Expand / Collapse toggle */}
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-xs font-mono"
              >
                {expanded ? "▼" : "▲"}
              </button>
            </div>
          </div>

          {/* Transcript / Speech Bubble */}
          {transcript && (
            <div className="bg-white/5 rounded-lg p-2 border border-white/10 text-xs font-sans leading-relaxed text-neutral-200">
              <p className="text-[11px] text-[#33c2cc] font-mono mb-0.5">J.A.R.V.I.S.:</p>
              <p>{transcript}</p>
            </div>
          )}

          {/* Expanded HUD Controls & Quick Actions */}
          {expanded && (
            <>
              {/* Quick Action Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() => handleCommand("iniciar tour guiado")}
                  className="px-2 py-1 rounded bg-[#00f3ff]/20 border border-[#00f3ff]/50 text-cyan-300 text-[10px] font-mono font-bold hover:bg-[#00f3ff]/35 transition-colors cursor-pointer animate-pulse"
                >
                  {t("jarvis.pills.tour")}
                </button>
                <button
                  onClick={() => handleCommand("ver proyectos")}
                  className="px-2 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 text-[10px] font-mono hover:bg-white/15 transition-colors cursor-pointer"
                >
                  {t("jarvis.pills.projects")}
                </button>
                <button
                  onClick={() => handleCommand("ver experiencia")}
                  className="px-2 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 text-[10px] font-mono hover:bg-white/15 transition-colors cursor-pointer"
                >
                  {t("jarvis.pills.experience")}
                </button>
                <button
                  onClick={() => handleCommand("descargar cv")}
                  className="px-2 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 text-[10px] font-mono hover:bg-white/15 transition-colors cursor-pointer"
                >
                  {t("jarvis.pills.downloadCv")}
                </button>
                <button
                  onClick={() => handleCommand("centro reclutadores")}
                  className="px-2 py-1 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono hover:bg-purple-500/30 transition-colors cursor-pointer"
                >
                  {t("jarvis.pills.recruiter")}
                </button>
              </div>

              {/* Command Input & Mic Button */}
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCommand(inputVal);
                    }
                  }}
                  placeholder="Command J.A.R.V.I.S. (e.g. show projects)..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#33c2cc]/60 font-mono"
                />

                {/* Mic Button */}
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-2 rounded-lg border transition-all duration-300 cursor-pointer ${
                    isListening
                      ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                      : "bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10"
                  }`}
                  title="Toggle Microphone"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  );
};

export default JarvisHUD;
