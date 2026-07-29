import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";

const systemLogsEs = [
  "[BLOQUEADO] Intento de escaneo de puertos desde 185.220.101.4 mitigado.",
  "[INSPECTADO] Petición entrante sanitizada contra inyección SQL.",
  "[VERIFICADO] Conexión SSL de cliente establecida de forma segura.",
  "[DENEGADO] Intento de acceso sospechoso al panel administrador.",
  "[FILTRADO] Tráfico malicioso mitigado por WAF de Cloudflare.",
  "[INTEGRIDAD] Auditoría de archivos del sistema completada - OK.",
  "[SISTEMA] Monitoreando puerto 3000 contra vulnerabilidades abiertas.",
  "[AUDITORÍA] Firma SHA-256 verificada para paquetes npm locales.",
  "[FILTRADO] Cabeceras CORS validadas para origen de cliente externo.",
];

const systemLogsEn = [
  "[BLOCKED] Port scan attempt from 185.220.101.4 mitigated.",
  "[INSPECTED] Incoming request sanitized against SQL injection.",
  "[VERIFIED] Secure client SSL connection established successfully.",
  "[DENIED] Suspicious login attempt to admin dashboard blocked.",
  "[FILTERED] Malicious traffic mitigated by Cloudflare WAF.",
  "[INTEGRITY] System file integrity check completed - OK.",
  "[SYSTEM] Monitoring port 3000 for open vulnerabilities.",
  "[AUDIT] SHA-256 checksum verified for local npm packages.",
  "[FILTERED] CORS headers validated for external origin request.",
];

const auditSequenceEs = [
  "[SISTEMA] Iniciando secuencia de auditoría en caliente...",
  "[SISTEMA] Analizando integridad del stack de memoria del servidor...",
  "[SISTEMA] Inspeccionando puertos de red activos: 80, 443, 3000...",
  "[SISTEMA] Comprobando directivas de cabeceras de seguridad CSP...",
  "[SISTEMA] Escaneando dependencias de código contra inyecciones XSS...",
  "[SISTEMA] Auditoría completada. 0 vulnerabilidades detectadas. Estado: SEGURO.",
];

const auditSequenceEn = [
  "[SYSTEM] Starting hot security audit sequence...",
  "[SYSTEM] Analyzing server memory stack integrity...",
  "[SYSTEM] Inspecting open network port boundaries: 80, 443, 3000...",
  "[SYSTEM] Checking CSP security header policies...",
  "[SYSTEM] Scanning code dependencies for XSS injection entrypoints...",
  "[SYSTEM] Audit complete. 0 vulnerabilities detected. Status: SECURE.",
];

export default function CyberSecurityPanel() {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === "es";

  // State Management
  const [logs, setLogs] = useState([]);
  const [activeRadarDots, setActiveRadarDots] = useState([]);
  const [threatCount, setThreatCount] = useState(4821);
  const [auditState, setAuditState] = useState("idle"); // idle | auditing | complete
  const [auditProgress, setAuditProgress] = useState(0);

  const terminalRef = useRef(null);
  const nextLogId = useRef(0);
  const dotId = useRef(0);

  // Helper to add logs
  const appendLog = (text) => {
    const time = new Date().toLocaleTimeString().slice(-8);
    setLogs((prev) => [...prev.slice(-30), `[${time}] ${text}`]);
  };

  // Setup Initial Logs
  useEffect(() => {
    const list = isEs ? systemLogsEs : systemLogsEn;
    const initialLogs = [];
    for (let i = 0; i < 4; i++) {
      const time = new Date(Date.now() - (4 - i) * 60000).toLocaleTimeString().slice(-8);
      initialLogs.push(`[${time}] ${list[Math.floor(Math.random() * list.length)]}`);
    }
    setLogs(initialLogs);
  }, [isEs]);

  // Scroll to bottom of terminal container without page jump
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Periodic random security alerts & threat counts
  useEffect(() => {
    if (auditState === "auditing") return;

    const interval = setInterval(() => {
      // Add random security log
      const list = isEs ? systemLogsEs : systemLogsEn;
      const randomLog = list[Math.floor(Math.random() * list.length)];
      appendLog(randomLog);

      // Increment threat count slightly
      setThreatCount((prev) => prev + Math.floor(Math.random() * 3) + 1);

      // Spawn a temporary threat ping on the radar
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 35; // keep inside radar circle (r=50)
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;
      const isThreat = Math.random() > 0.4; // 60% red threat, 40% green verified node

      const newDot = {
        id: dotId.current++,
        x,
        y,
        color: isThreat ? "fill-rose-500 shadow-rose-500" : "fill-emerald-500 shadow-emerald-500",
        glow: isThreat ? "rgba(244,63,94,0.6)" : "rgba(16,185,129,0.6)",
      };

      setActiveRadarDots((prev) => [...prev, newDot]);
      setTimeout(() => {
        setActiveRadarDots((prev) => prev.filter((d) => d.id !== newDot.id));
      }, 3000);
    }, 4500);

    return () => clearInterval(interval);
  }, [isEs, auditState]);

  // Handle Scan/Audit Trigger Action
  const triggerAudit = () => {
    if (auditState === "auditing") return;

    setAuditState("auditing");
    setAuditProgress(0);
    appendLog(isEs ? "⚠️ INICIANDO AUDITORÍA COMPLETA DEL SISTEMA..." : "⚠️ INITIALIZING FULL SECURITY AUDIT...");

    // Run audit ticks
    let progress = 0;
    const auditInterval = setInterval(() => {
      progress += 4;
      setAuditProgress(progress);

      // Inject audit steps at specific progress tiers
      const seq = isEs ? auditSequenceEs : auditSequenceEn;
      const index = Math.floor(progress / 18);
      if (progress % 16 === 0 && index < seq.length) {
        appendLog(seq[index]);
      }

      // Spawn multiple dots on the radar during audit
      if (progress % 12 === 0) {
        const x = 20 + Math.random() * 60;
        const y = 20 + Math.random() * 60;
        const id = dotId.current++;
        const isSecure = Math.random() > 0.3;
        const newDot = {
          id,
          x,
          y,
          color: isSecure ? "fill-emerald-400 shadow-emerald-400" : "fill-rose-400 shadow-rose-400",
          glow: isSecure ? "rgba(16,185,129,0.8)" : "rgba(244,63,94,0.8)",
        };
        setActiveRadarDots((prev) => [...prev, newDot]);
        setTimeout(() => {
          setActiveRadarDots((prev) => prev.filter((d) => d.id !== id));
        }, 1500);
      }

      if (progress >= 100) {
        clearInterval(auditInterval);
        setAuditState("complete");
        setThreatCount((prev) => prev + 12);
        appendLog(isEs ? "✓ AUDITORÍA INTEGRAL: OK. SISTEMA PROTEGIDO." : "✓ INTEGRAL AUDIT: OK. SYSTEM FULLY SECURED.");
        setTimeout(() => {
          setAuditState("idle");
        }, 3000);
      }
    }, 150);
  };

  return (
    <div className="relative w-full h-full p-3.5 md:p-4 overflow-hidden rounded-2xl flex flex-col justify-between h-full">
      {/* Grid and Radial backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.1),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.08),transparent_50%)]" />
      <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between flex-shrink-0">
        <div className="flex flex-col">
          <p className="text-[13px] md:text-[14px] font-bold tracking-wide text-white/95">
            {t("cyberShield.title")}
          </p>
          <span className="text-[6.5px] md:text-[7px] text-neutral-500 font-mono tracking-widest uppercase">
            Firewall v2.0.26 // Active Sentinel
          </span>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 text-[8px] md:text-[9.5px] font-mono tracking-wider rounded-full border transition-all duration-300 ${
          auditState === "auditing"
            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        }`}>
          <span className={`rounded-full size-1.5 ${
            auditState === "auditing" ? "bg-amber-400 animate-ping" : "bg-emerald-400 animate-pulse"
          }`} />
          {auditState === "auditing" 
            ? (isEs ? "AUDITANDO" : "AUDITING") 
            : t("cyberShield.status")}
        </div>
      </div>

      {/* Center Panel (Radar + Metrics) */}
      <div className="relative z-10 grid grid-cols-12 gap-3.5 items-center my-2.5 flex-shrink-0">
        
        {/* Radar Scanner Column */}
        <div className="col-span-5 flex justify-center items-center">
          <div className="relative size-[5.5rem] md:size-[6.2rem] rounded-full border border-emerald-500/20 bg-emerald-950/15 overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            
            {/* SVG Circular Grid */}
            <svg className="absolute inset-0 size-full select-none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="0.75" />
              <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="0.75" strokeDasharray="3 2" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="0.75" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(16,185,129,0.12)" strokeWidth="0.75" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(16,185,129,0.12)" strokeWidth="0.75" />
            </svg>

            {/* Sweep Animation */}
            <div 
              className="absolute size-full origin-center pointer-events-none"
              style={{
                background: "conic-gradient(from 0deg, rgba(16,185,129,0.3) 0deg, rgba(16,185,129,0) 70deg)",
                animation: `radar-sweep ${auditState === "auditing" ? "0.8s" : "3s"} linear infinite`,
                borderRadius: "50%",
                maskImage: "radial-gradient(circle, black 35%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(circle, black 35%, transparent 100%)"
              }}
            />

            {/* Radar Dot Pings */}
            <AnimatePresence>
              {activeRadarDots.map((dot) => (
                <motion.div
                  key={dot.id}
                  className={`absolute rounded-full size-1.5 ${dot.color}`}
                  style={{
                    left: `${dot.x}%`,
                    top: `${dot.y}%`,
                    transform: "translate(-50%, -50%)",
                    boxShadow: `0 0 8px ${dot.glow}`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.5] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Security Metrics Column */}
        <div className="col-span-7 flex flex-col justify-center space-y-1.5 md:space-y-2 select-none">
          <div className="flex justify-between items-center border-b border-white/5 pb-1">
            <span className="text-[7px] md:text-[8px] text-neutral-500 font-bold uppercase tracking-wider">
              {isEs ? "Ataques Mitigados" : "Threats Blocked"}
            </span>
            <span className="text-[9px] md:text-[10px] text-rose-400 font-mono font-bold">
              {threatCount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-1">
            <span className="text-[7px] md:text-[8px] text-neutral-500 font-bold uppercase tracking-wider">
              IP Gateway
            </span>
            <span className="text-[8px] md:text-[9px] text-neutral-300 font-mono">
              107.152.4.9
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[7px] md:text-[8px] text-neutral-500 font-bold uppercase tracking-wider">
              {isEs ? "Integridad" : "Security Rating"}
            </span>
            <span className="text-[9px] md:text-[10px] text-emerald-400 font-mono font-bold animate-pulse">
              100% SECURE
            </span>
          </div>
        </div>
      </div>

      {/* Terminal logs list */}
      <div 
        ref={terminalRef}
        className="relative z-10 flex-1 min-h-[6.5rem] md:min-h-[7rem] bg-black/45 border border-white/8 rounded-lg p-2 font-mono text-[7px] md:text-[8px] overflow-y-auto flex flex-col gap-1.5 scrollbar-thin scrollbar-track-transparent select-text"
      >
        <div className="flex flex-col gap-1 w-full">
          {logs.map((log, idx) => (
            <div key={idx} className="text-emerald-400/90 leading-relaxed font-mono w-full break-all">
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Control Action Button */}
      <div className="relative z-10 mt-2.5 flex-shrink-0">
        <button
          onClick={triggerAudit}
          disabled={auditState === "auditing"}
          className={`w-full py-1.5 md:py-2 text-[8px] md:text-[9.5px] font-bold font-mono tracking-widest uppercase rounded border transition-all duration-300 ${
            auditState === "auditing"
              ? "border-amber-500/20 bg-amber-500/5 text-amber-500 cursor-not-allowed"
              : auditState === "complete"
              ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
              : "border-emerald-500/30 bg-emerald-950/15 hover:bg-emerald-950/25 text-emerald-400 hover:text-white cursor-pointer active:scale-98 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          }`}
        >
          {auditState === "auditing"
            ? `${isEs ? "EJECUTANDO AUDITORÍA" : "EXECUTING AUDIT"} • ${auditProgress}%`
            : auditState === "complete"
            ? `✓ ${isEs ? "SISTEMA INTEGRALMENTE COMPILADO" : "SYSTEM FULLY VERIFIED"}`
            : isEs 
            ? "⚡ INICIAR AUDITORÍA DE SEGURIDAD" 
            : "⚡ RUN SYSTEM SECURITY AUDIT"}
        </button>
      </div>

      {/* CSS Radar sweep animation keyframe injection */}
      <style>{`
        @keyframes radar-sweep {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
