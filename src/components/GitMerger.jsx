import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const branchDetails = {
  "feat/frontend-ux": {
    name: "feat/frontend-ux",
    color: "rgb(34, 211, 238)", // Cyan
    lightColor: "rgb(224, 242, 254)", // Sky-100
    glowClass: "shadow-cyan-500/10 border-cyan-500/30",
    glowShadow: "hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:border-cyan-400/50",
    bgColor: "bg-cyan-950/10",
    selectedBgColor: "bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]",
    icon: (
      <svg className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
      </svg>
    ),
    skills: ["React", "Next.js", "Aesthetic UI", "Tailwind CSS", "Animations (Motion)"],
    conflict: [
      "<<<<<<< HEAD (main)",
      "const designStyle = 'Standard template, raw CSS, dark mode placeholder';",
      "=======",
      "const designStyle = 'Rich glassmorphism, responsive grids, custom transitions';",
      ">>>>>>> feat/frontend-ux"
    ]
  },
  "feat/backend-api": {
    name: "feat/backend-api",
    color: "rgb(236, 72, 153)", // Pink/Fuchsia
    lightColor: "rgb(253, 244, 245)", // Rose-50
    glowClass: "shadow-pink-500/10 border-pink-500/30",
    glowShadow: "hover:shadow-[0_0_15px_rgba(236,72,153,0.25)] hover:border-pink-400/50",
    bgColor: "bg-pink-950/10",
    selectedBgColor: "bg-pink-500/15 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]",
    icon: (
      <svg className="w-3.5 h-3.5 text-fuchsia-400 flex-shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    skills: ["Node.js", "Express", "WebSockets", "MongoDB", "REST APIs"],
    conflict: [
      "<<<<<<< HEAD (main)",
      "const apiEngine = 'Synchronous request loops, no cache, plain JSON';",
      "=======",
      "const apiEngine = 'Asynchronous routes, Redis caching layers, real-time sockets';",
      ">>>>>>> feat/backend-api"
    ]
  },
  "feat/cloud-ops": {
    name: "feat/cloud-ops",
    color: "rgb(249, 115, 22)", // Orange
    lightColor: "rgb(255, 247, 237)", // Orange-50
    glowClass: "shadow-orange-500/10 border-orange-500/30",
    glowShadow: "hover:shadow-[0_0_15px_rgba(249,115,22,0.25)] hover:border-orange-400/50",
    bgColor: "bg-orange-950/10",
    selectedBgColor: "bg-orange-500/15 border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]",
    icon: (
      <svg className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    skills: ["Docker", "CI/CD Pipelines", "Nginx", "GitHub Actions", "Vercel / VPS"],
    conflict: [
      "<<<<<<< HEAD (main)",
      "const deployStrategy = 'Manual FTP upload, downtime on release';",
      "=======",
      "const deployStrategy = 'Automated GitOps pipeline, Docker builds, zero downtime';",
      ">>>>>>> feat/cloud-ops"
    ]
  }
};

export default function GitMerger({ className = "" }) {
  const { t } = useTranslation();
  const [activeBranch, setActiveBranch] = useState(null); // Selected branch for click-to-merge
  const [mergedBranches, setMergedBranches] = useState({
    "feat/frontend-ux": false,
    "feat/backend-api": false,
    "feat/cloud-ops": false
  });
  
  // Game states: 'idle', 'conflict', 'resolving', 'deploying', 'success'
  const [gameState, setGameState] = useState("idle");
  const [conflictBranch, setConflictBranch] = useState(null);
  const [deployedSkills, setDeployedSkills] = useState([]);
  
  const [terminalLogs, setTerminalLogs] = useState([
    { text: "[git] Local repository initialized. Branch 'main' active.", type: "system" },
    { text: "[git] 3 remote feature branches available for merging.", type: "info" }
  ]);

  const terminalContainerRef = useRef(null);

  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Log message helper
  const addLog = (text, type = "info") => {
    setTerminalLogs((prev) => [...prev, { text, type }]);
  };

  // Merge initiation handler
  const startMerge = (branchId) => {
    if (mergedBranches[branchId]) {
      addLog(`[git] Branch ${branchId} is already merged.`, "warning");
      return;
    }
    if (gameState !== "idle") return;

    setConflictBranch(branchId);
    setGameState("conflict");
    addLog(`[git] git merge origin/${branchId}`, "system");
    addLog("[git] AUTO-MERGE: Conflict detected. Manual resolution required.", "error");
  };

  // Conflict resolution action
  const resolveConflict = () => {
    if (gameState !== "conflict") return;
    setGameState("resolving");
    addLog("[git] Resolving conflicts in code files...", "info");

    setTimeout(() => {
      setGameState("deploying");
      addLog("[git] All merge conflicts resolved. Code merged successfully.", "success");
      addLog("[build] Triggering automated deployment pipeline...", "system");
      addLog("[build] Installing dependencies and bundling assets...", "info");

      setTimeout(() => {
        addLog("[build] ✓ Eslint static analysis passed.", "success");
        addLog("[build] ✓ Production builds optimized successfully.", "success");
        addLog(`[deploy] Deploying live containers for ${conflictBranch}...`, "info");

        setTimeout(() => {
          // Complete merge
          setMergedBranches((prev) => ({ ...prev, [conflictBranch]: true }));
          setDeployedSkills((prev) => [...prev, ...branchDetails[conflictBranch].skills]);
          addLog(`[deploy] ✓ Branch ${conflictBranch} successfully deployed to production!`, "success");
          
          // Check if all branches are merged
          const allMerged = 
            (conflictBranch === "feat/frontend-ux" || mergedBranches["feat/frontend-ux"]) &&
            (conflictBranch === "feat/backend-api" || mergedBranches["feat/backend-api"]) &&
            (conflictBranch === "feat/cloud-ops" || mergedBranches["feat/cloud-ops"]);

          if (allMerged) {
            setGameState("success");
            addLog("[system] ALL FEATURES DEPLOYED. Production release v1.0.0 is live!", "system");
          } else {
            setGameState("idle");
            setActiveBranch(null);
            setConflictBranch(null);
          }
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const resetAll = () => {
    setMergedBranches({
      "feat/frontend-ux": false,
      "feat/backend-api": false,
      "feat/cloud-ops": false
    });
    setDeployedSkills([]);
    setGameState("idle");
    setActiveBranch(null);
    setConflictBranch(null);
    setTerminalLogs([
      { text: "[git] Local repository reinitialized. Branch 'main' active.", type: "system" },
      { text: "[git] 3 remote feature branches available for merging.", type: "info" }
    ]);
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e, branchId) => {
    if (gameState !== "idle" || mergedBranches[branchId]) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("branchId", branchId);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const branchId = e.dataTransfer.getData("branchId");
    if (branchId && branchDetails[branchId]) {
      startMerge(branchId);
    }
  };

  return (
    <div
      className={`relative w-full h-full rounded-xl border border-white/12 bg-[#080b16]/95 backdrop-blur-md overflow-hidden shadow-2xl flex flex-col ${className}`}
      style={{ height: "100%" }}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-1.5">
          <span className="rounded-full size-2 bg-rose-500/90" />
          <span className="rounded-full size-2 bg-amber-500/90" />
          <span className="rounded-full size-2 bg-emerald-500/90" />
        </div>
        <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          git branch: <span className="text-emerald-400 font-bold">main*</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-12 flex-1 overflow-hidden">
        
        {/* Left Side: Branch Selector */}
        <div className="col-span-12 md:col-span-5 md:border-r border-white/10 bg-black/20 p-2 md:p-2.5 flex flex-col justify-between overflow-hidden border-b md:border-b-0">
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-[7.2px] md:text-[7.5px] font-bold text-neutral-500 uppercase tracking-widest block mb-1.5 md:mb-2 select-none">
              Available Branches (Merge Queue)
            </span>
            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-1 md:pb-0 scrollbar-none w-full">
              {Object.entries(branchDetails).map(([id, details]) => {
                const isMerged = mergedBranches[id];
                const isSelected = activeBranch === id;
                return (
                  <div
                    key={id}
                    draggable={gameState === "idle" && !isMerged}
                    onDragStart={(e) => handleDragStart(e, id)}
                    onClick={() => gameState === "idle" && !isMerged && setActiveBranch(id)}
                    className={`relative border rounded-lg p-2 md:p-2.5 transition duration-300 cursor-grab select-none flex-shrink-0 md:flex-shrink w-[11.5rem] md:w-full flex flex-col justify-between ${
                      isMerged
                        ? "bg-emerald-950/10 border-emerald-500/10 text-neutral-500 cursor-not-allowed opacity-40"
                        : isSelected
                        ? details.selectedBgColor
                        : `bg-white/5 border-white/5 text-neutral-300 hover:text-white ${details.bgColor} ${details.glowClass} ${details.glowShadow}`
                    }`}
                  >
                    <div>
                      {/* Badge */}
                      <div className="flex justify-between items-center mb-1 md:mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {details.icon}
                          <span className="text-[8px] md:text-[8.5px] font-mono font-bold truncate">
                            {details.name}
                          </span>
                        </div>
                        <span className={`text-[6.5px] md:text-[7px] px-1 py-0.5 rounded font-bold uppercase flex-shrink-0 ${
                          isMerged ? "bg-emerald-500/15 text-emerald-400" : "bg-neutral-800 text-neutral-400"
                        }`}>
                          {isMerged ? "Merged" : "Pending"}
                        </span>
                      </div>
                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-1 mt-1 md:mt-1.5">
                        {details.skills.slice(0, 3).map((s, idx) => (
                          <span key={idx} className={`text-[7px] font-sans px-1.5 py-0.5 bg-white/5 border rounded flex items-center gap-0.5 ${
                            idx >= 2 ? "hidden md:inline-flex" : ""
                          } ${
                            isMerged ? "border-emerald-500/20 text-emerald-400/80 bg-emerald-950/5" : "border-white/5 text-neutral-400"
                          }`}>
                            {isMerged && <span className="text-[6.5px] font-bold text-emerald-400">✓</span>}
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Inline Merge Trigger Button (Mobile-friendly and Space-saving) */}
                    {isSelected && gameState === "idle" && !isMerged && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startMerge(id);
                        }}
                        className="mt-2 w-full py-1 text-[8.5px] font-bold uppercase rounded border border-aqua/30 bg-aqua/10 hover:bg-aqua/20 text-aqua cursor-pointer transition text-center"
                      >
                        Merge branch ⚡
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Merge Help Text (Desktop only) */}
          <div className="hidden md:block border-t border-white/5 pt-1.5 mt-2">
            <div className="text-[7px] text-neutral-500 font-mono text-center leading-3">
              {gameState === "success" 
                ? "✓ System fully compiled. Production Release is live." 
                : "💡 Drag a branch node or click to select, then merge."}
            </div>
          </div>
        </div>

        {/* Right Side: Graph & Code Terminal */}
        <div className="col-span-12 md:col-span-7 flex flex-col h-full overflow-hidden bg-black/10">
          
          {/* Top: SVG Commit Graph */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="h-[5.5rem] md:h-[9.5rem] border-b border-white/5 relative bg-[#060812]/50 flex items-center justify-center p-2 flex-shrink-0"
          >
            {/* Pulsing Dropzone Overlay */}
            {gameState === "idle" && (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 border border-dashed border-emerald-500/40 bg-[#080b16]/90 px-3 py-1 rounded-full pointer-events-none flex items-center justify-center animate-pulse text-[8px] font-mono tracking-wider text-emerald-400 shadow-lg z-20">
                Git Merge Dropzone
              </div>
            )}

            {/* Commit Tree SVG */}
            <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-pink" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-orange" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-green" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Branch Paths */}
              {/* Left Branch: feat/frontend-ux */}
              {/* Glow Channel Background */}
              <path 
                d="M 50,60 C 90,20 160,20 200,60" 
                fill="none" 
                stroke={branchDetails["feat/frontend-ux"].color} 
                strokeWidth={activeBranch === "feat/frontend-ux" ? 4.5 : 3.0}
                opacity={activeBranch === "feat/frontend-ux" || mergedBranches["feat/frontend-ux"] ? 0.35 : 0.15}
                filter="url(#glow-cyan)"
                className="transition-all duration-500"
              />
              {/* Inner Bright Core */}
              <path 
                d="M 50,60 C 90,20 160,20 200,60" 
                fill="none" 
                stroke={mergedBranches["feat/frontend-ux"] ? branchDetails["feat/frontend-ux"].lightColor : branchDetails["feat/frontend-ux"].color} 
                strokeWidth={1.2}
                strokeDasharray={mergedBranches["feat/frontend-ux"] ? "none" : "3,3"}
                className="transition-all duration-500"
              />

              {/* Right Branch: feat/backend-api */}
              {/* Glow Channel Background */}
              <path 
                d="M 50,60 C 100,100 230,100 280,60" 
                fill="none" 
                stroke={branchDetails["feat/backend-api"].color} 
                strokeWidth={activeBranch === "feat/backend-api" ? 4.5 : 3.0}
                opacity={activeBranch === "feat/backend-api" || mergedBranches["feat/backend-api"] ? 0.35 : 0.15}
                filter="url(#glow-pink)"
                className="transition-all duration-500"
              />
              {/* Inner Bright Core */}
              <path 
                d="M 50,60 C 100,100 230,100 280,60" 
                fill="none" 
                stroke={mergedBranches["feat/backend-api"] ? branchDetails["feat/backend-api"].lightColor : branchDetails["feat/backend-api"].color} 
                strokeWidth={1.2}
                strokeDasharray={mergedBranches["feat/backend-api"] ? "none" : "3,3"}
                className="transition-all duration-500"
              />

              {/* Bottom Branch: feat/cloud-ops */}
              {/* Glow Channel Background */}
              <path 
                d="M 50,60 C 130,130 300,130 380,60" 
                fill="none" 
                stroke={branchDetails["feat/cloud-ops"].color} 
                strokeWidth={activeBranch === "feat/cloud-ops" ? 4.5 : 3.0}
                opacity={activeBranch === "feat/cloud-ops" || mergedBranches["feat/cloud-ops"] ? 0.35 : 0.15}
                filter="url(#glow-orange)"
                className="transition-all duration-500"
              />
              {/* Inner Bright Core */}
              <path 
                d="M 50,60 C 130,130 300,130 380,60" 
                fill="none" 
                stroke={mergedBranches["feat/cloud-ops"] ? branchDetails["feat/cloud-ops"].lightColor : branchDetails["feat/cloud-ops"].color} 
                strokeWidth={1.2}
                strokeDasharray={mergedBranches["feat/cloud-ops"] ? "none" : "3,3"}
                className="transition-all duration-500"
              />

              {/* Main Timeline Branch */}
              {/* Glow Channel */}
              <line 
                x1={10} y1={60} x2={390} y2={60} 
                stroke="rgb(16, 185, 129)" 
                strokeWidth={5} 
                opacity={0.3}
                filter="url(#glow-green)"
              />
              {/* Inner Core */}
              <line 
                x1={10} y1={60} x2={390} y2={60} 
                stroke="rgb(209, 250, 229)" 
                strokeWidth={1.8} 
              />

              {/* Glowing Data Packets Flowing Along Paths */}
              {/* Frontend packets */}
              <circle r="2.5" fill="rgb(34, 211, 238)" filter="url(#glow-cyan)">
                <animateMotion 
                  path="M 50,60 C 90,20 160,20 200,60" 
                  dur={mergedBranches["feat/frontend-ux"] ? "1.2s" : "3.2s"} 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle r="2.5" fill="rgb(34, 211, 238)" filter="url(#glow-cyan)">
                <animateMotion 
                  path="M 50,60 C 90,20 160,20 200,60" 
                  dur={mergedBranches["feat/frontend-ux"] ? "1.2s" : "3.2s"} 
                  begin={mergedBranches["feat/frontend-ux"] ? "0.6s" : "1.6s"} 
                  repeatCount="indefinite" 
                />
              </circle>

              {/* Backend packets */}
              <circle r="2.5" fill="rgb(236, 72, 153)" filter="url(#glow-pink)">
                <animateMotion 
                  path="M 50,60 C 100,100 230,100 280,60" 
                  dur={mergedBranches["feat/backend-api"] ? "1.2s" : "3.2s"} 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle r="2.5" fill="rgb(236, 72, 153)" filter="url(#glow-pink)">
                <animateMotion 
                  path="M 50,60 C 100,100 230,100 280,60" 
                  dur={mergedBranches["feat/backend-api"] ? "1.2s" : "3.2s"} 
                  begin={mergedBranches["feat/backend-api"] ? "0.6s" : "1.6s"} 
                  repeatCount="indefinite" 
                />
              </circle>

              {/* Cloud packets */}
              <circle r="2.5" fill="rgb(249, 115, 22)" filter="url(#glow-orange)">
                <animateMotion 
                  path="M 50,60 C 130,130 300,130 380,60" 
                  dur={mergedBranches["feat/cloud-ops"] ? "1.5s" : "4.0s"} 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle r="2.5" fill="rgb(249, 115, 22)" filter="url(#glow-orange)">
                <animateMotion 
                  path="M 50,60 C 130,130 300,130 380,60" 
                  dur={mergedBranches["feat/cloud-ops"] ? "1.5s" : "4.0s"} 
                  begin={mergedBranches["feat/cloud-ops"] ? "0.75s" : "2.0s"} 
                  repeatCount="indefinite" 
                />
              </circle>

              {/* Main branch packet */}
              <circle r="2.8" fill="rgb(16, 185, 129)" filter="url(#glow-green)">
                <animateMotion 
                  path="M 10,60 L 390,60" 
                  dur="2.5s" 
                  repeatCount="indefinite" 
                />
              </circle>

              {/* Commit Nodes */}
              {/* Commit 1: Init */}
              <circle cx={40} cy={60} r={4.5} fill="rgb(16, 185, 129)" filter="url(#glow-green)" />
              
              {/* Frontend Branch Node & Merge */}
              <circle cx={140} cy={30} r={4} fill={branchDetails["feat/frontend-ux"].color} filter="url(#glow-cyan)" />
              <circle 
                cx={200} cy={60} r={mergedBranches["feat/frontend-ux"] ? 5.5 : 4.5} 
                fill={mergedBranches["feat/frontend-ux"] ? branchDetails["feat/frontend-ux"].color : "#0a0c1a"} 
                stroke={branchDetails["feat/frontend-ux"].color} 
                strokeWidth={2}
                filter="url(#glow-cyan)"
              />
              {/* Keep a static circle inside ping */}
              {mergedBranches["feat/frontend-ux"] && (
                <circle cx={200} cy={60} r={4.5} fill={branchDetails["feat/frontend-ux"].color} />
              )}

              {/* Backend Branch Node & Merge */}
              <circle cx={140} cy={87} r={4} fill={branchDetails["feat/backend-api"].color} filter="url(#glow-pink)" />
              <circle 
                cx={280} cy={60} r={mergedBranches["feat/backend-api"] ? 5.5 : 4.5} 
                fill={mergedBranches["feat/backend-api"] ? branchDetails["feat/backend-api"].color : "#0a0c1a"} 
                stroke={branchDetails["feat/backend-api"].color} 
                strokeWidth={2}
                filter="url(#glow-pink)"
              />
              {mergedBranches["feat/backend-api"] && (
                <circle cx={280} cy={60} r={4.5} fill={branchDetails["feat/backend-api"].color} />
              )}

              {/* Cloud Ops Branch Intermediate & Merge */}
              <circle cx={210} cy={112} r={4} fill={branchDetails["feat/cloud-ops"].color} filter="url(#glow-orange)" />
              <circle 
                cx={380} cy={60} r={mergedBranches["feat/cloud-ops"] ? 5.5 : 4.5} 
                fill={mergedBranches["feat/cloud-ops"] ? branchDetails["feat/cloud-ops"].color : "#0a0c1a"} 
                stroke={branchDetails["feat/cloud-ops"].color} 
                strokeWidth={2}
                filter="url(#glow-orange)"
              />
              {mergedBranches["feat/cloud-ops"] && (
                <circle cx={380} cy={60} r={4.5} fill={branchDetails["feat/cloud-ops"].color} />
              )}
            </svg>
          </div>

          {/* Bottom half: Conflict Resolution Screen OR Live Console Output */}
          <div className="flex-1 min-h-[9rem] flex flex-col overflow-hidden">
            {gameState === "conflict" ? (
              /* Merge Conflict Resolution Overlay */
              <div className="flex-1 bg-rose-950/20 p-2.5 flex flex-col justify-between overflow-y-auto">
                <div>
                  <span className="text-[7.5px] font-bold text-rose-400 uppercase tracking-widest block mb-1">
                    ⚠️ Merge Conflict: Resolve to proceed
                  </span>
                  <div className="border border-rose-500/20 bg-black/40 rounded p-2 font-mono text-[8px] sm:text-[9.2px] leading-3 text-neutral-300">
                    {branchDetails[conflictBranch].conflict.map((line, idx) => (
                      <p key={idx} className={
                        line.startsWith("<<<<") ? "text-rose-400 font-bold bg-rose-500/10 px-1" :
                        line.startsWith("====") ? "text-neutral-500 font-bold bg-neutral-500/10 px-1" :
                        line.startsWith(">>>>") ? "text-cyan-400 font-bold bg-cyan-500/10 px-1" :
                        line.includes("HEAD") ? "text-neutral-400" : "text-white"
                      }>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
                <button
                  onClick={resolveConflict}
                  className="w-full py-1 text-[9px] font-bold uppercase rounded border border-rose-500/30 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 cursor-pointer transition text-center"
                >
                  ⚡ Accept Incoming Changes & Resolve Conflict
                </button>
              </div>
            ) : gameState === "resolving" || gameState === "deploying" ? (
              /* Pipeline processing loader */
              <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#080b16]">
                <div className="relative size-12 flex items-center justify-center">
                  {/* Outer spinning ring */}
                  <div className="absolute inset-0 border-2 border-white/5 border-t-aqua rounded-full animate-spin" />
                  <span className="text-[12px] font-bold">🚀</span>
                </div>
                <span className="text-[9px] font-mono text-neutral-400 mt-3 animate-pulse">
                  {gameState === "resolving" ? "Analyzing lockfiles & compiling..." : "Building Docker containers & Deploying..."}
                </span>
              </div>
            ) : gameState === "success" ? (
              /* Final release success screen */
              <div className="flex-1 bg-emerald-950/20 p-3 flex flex-col justify-between items-center text-center">
                <div className="my-auto">
                  <div className="text-[18px] mb-1">🎉</div>
                  <span className="text-[9.5px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                    System Fully Deployed
                  </span>
                  <p className="text-[8.5px] text-neutral-300 max-w-[20rem] mx-auto leading-3">
                    All branches merged into main. Core full-stack architectural components are live.
                  </p>
                </div>
                <button
                  onClick={resetAll}
                  className="w-full py-1 text-[8.5px] font-bold uppercase rounded border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 cursor-pointer transition text-center mt-2"
                >
                  Re-Lock System (Start Over)
                </button>
              </div>
            ) : (
              /* Live Terminal logs output screen */
              <div className="flex-1 p-2 flex flex-col overflow-hidden font-mono text-[8px] leading-3 text-neutral-400">
                <div className="flex justify-between items-center border-b border-white/5 pb-1 mb-1 flex-shrink-0">
                  <span className="text-[7.5px] font-bold text-neutral-500 uppercase tracking-widest">
                    Build Pipeline logs
                  </span>
                  {deployedSkills.length > 0 && (
                    <span className="text-[7px] text-emerald-400 animate-pulse font-bold">
                      ● Active Deployed: {deployedSkills.length} Skills
                    </span>
                  )}
                </div>
                
                <div ref={terminalContainerRef} className="flex-1 overflow-y-auto space-y-0.5 pr-1">
                  {terminalLogs.map((log, i) => (
                    <p key={i} className="whitespace-pre-wrap break-all">
                      <span className={
                        log.type === "success" ? "text-emerald-400" :
                        log.type === "warning" ? "text-amber-400" :
                        log.type === "error" ? "text-rose-400" :
                        log.type === "system" ? "text-fuchsia-400" :
                        "text-sky-400"
                      }>
                        {log.text}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
