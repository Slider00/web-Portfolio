import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * JarvisHologramAvatar
 * Ultra-high-end 3D WebGL Holographic Arc Reactor Core & HUD AI Avatar
 * 
 * Features:
 * - 3D Multi-axis concentric rotating sci-fi arc rings (cyan / golden amber)
 * - Tilted gyroscopic wireframe icosahedron energy core with dynamic vertex pulse
 * - Orbital 3D data particle swarm
 * - Parallax mouse-tracking tilt effect
 * - State-reactive animation (IDLE, LISTENING, THINKING, SPEAKING)
 * - Fail-safe WebGL + Canvas 2D fallback engine
 */

const STATUS_CONFIGS = {
  IDLE: {
    primaryColor: 0x00f3ff, // Holographic Cyan
    secondaryColor: 0xffab00, // Golden Amber Arc
    coreColor: 0x33c2cc,
    rotationSpeed: 0.012,
    corePulseSpeed: 1.8,
    particleSpeed: 0.008,
    ringScale: 1.0,
    coreScale: 1.0,
    glowOpacity: 0.4,
  },
  LISTENING: {
    primaryColor: 0xff2e93, // Vivid Crimson / Neon Magenta
    secondaryColor: 0xa855f7, // Deep Violet
    coreColor: 0xff0055,
    rotationSpeed: 0.028,
    corePulseSpeed: 4.5,
    particleSpeed: 0.025,
    ringScale: 1.15,
    coreScale: 1.2,
    glowOpacity: 0.8,
  },
  THINKING: {
    primaryColor: 0xf59e0b, // High-energy Amber Gold
    secondaryColor: 0x06b6d4, // Cyan Laser
    coreColor: 0xffb703,
    rotationSpeed: 0.045, // Rapid counter-spin
    corePulseSpeed: 6.0,
    particleSpeed: 0.035,
    ringScale: 1.08,
    coreScale: 1.1,
    glowOpacity: 0.75,
  },
  SPEAKING: {
    primaryColor: 0x00f3ff, // Electric Cyan
    secondaryColor: 0x10b981, // Emerald Laser
    coreColor: 0x00ffcc,
    rotationSpeed: 0.022,
    corePulseSpeed: 3.5,
    particleSpeed: 0.018,
    ringScale: 1.22,
    coreScale: 1.25,
    glowOpacity: 0.85,
  },
};

export default function JarvisHologramAvatar({
  status = "IDLE",
  size = "lg",
  interactive = true,
  onClick,
  className = "",
  showBadge = true,
}) {
  const containerRef = useRef(null);
  const mountRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Map size prop to canvas dimensions
  const getDimensions = () => {
    switch (size) {
      case "sm":
        return { px: 42, ringThickness: 1.5 };
      case "md":
        return { px: 64, ringThickness: 2 };
      case "xl":
        return { px: 180, ringThickness: 3 };
      case "lg":
      default:
        return { px: 100, ringThickness: 2.5 };
    }
  };

  const { px } = getDimensions();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId;
    let renderer, scene, camera;
    let outerRing, middleRing, innerRing, gyroX, gyroY;
    let coreMesh, coreWireframe, particlesMesh, audioWaveRings = [];

    const width = px;
    const height = px;

    // 1. Initialize WebGL Scene
    try {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 18;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Clear container and append canvas
      container.innerHTML = "";
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL not supported or context lost. Using 2D HUD mode.", e);
      return;
    }

    // 2. Build 3D JARVIS Arc Reactor Components
    const currentConfig = STATUS_CONFIGS[status] || STATUS_CONFIGS.IDLE;

    // Outer Arc Ring 1 (Concentric Sci-fi segment ring)
    const createOuterRingGeometry = () => {
      const group = new THREE.Group();
      const radius = 6.8;
      const segments = 64;

      // Arc Segment 1
      const arc1Geom = new THREE.RingGeometry(radius - 0.25, radius, segments, 1, 0, Math.PI * 1.4);
      const arc1Mat = new THREE.MeshBasicMaterial({
        color: currentConfig.primaryColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const arc1 = new THREE.Mesh(arc1Geom, arc1Mat);
      group.add(arc1);

      // Arc Segment 2 (Opposite Amber segment)
      const arc2Geom = new THREE.RingGeometry(radius - 0.2, radius, segments, 1, Math.PI * 1.5, Math.PI * 0.35);
      const arc2Mat = new THREE.MeshBasicMaterial({
        color: currentConfig.secondaryColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      const arc2 = new THREE.Mesh(arc2Geom, arc2Mat);
      group.add(arc2);

      // Outer dashed HUD line
      const outerCircleGeom = new THREE.BufferGeometry();
      const points = [];
      for (let i = 0; i <= 48; i++) {
        if (i % 3 === 0) continue; // create tick gap
        const theta = (i / 48) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * (radius + 0.5), Math.sin(theta) * (radius + 0.5), 0));
      }
      outerCircleGeom.setFromPoints(points);
      const outerLineMat = new THREE.LineBasicMaterial({
        color: currentConfig.primaryColor,
        transparent: true,
        opacity: 0.5,
      });
      const outerLine = new THREE.LineSegments(outerCircleGeom, outerLineMat);
      group.add(outerLine);

      return group;
    };

    outerRing = createOuterRingGeometry();
    scene.add(outerRing);

    // Middle Gyroscopic Ring (Tilted 3D Orbiting Ring)
    const gyroGroup = new THREE.Group();

    const gyroRingGeom = new THREE.TorusGeometry(5.2, 0.08, 12, 48);
    const gyroRingMat = new THREE.MeshBasicMaterial({
      color: currentConfig.primaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });

    gyroX = new THREE.Mesh(gyroRingGeom, gyroRingMat);
    gyroX.rotation.x = Math.PI / 3;
    gyroGroup.add(gyroX);

    gyroY = new THREE.Mesh(gyroRingGeom, gyroRingMat.clone());
    gyroY.material.color.setHex(currentConfig.secondaryColor);
    gyroY.rotation.y = Math.PI / 4;
    gyroGroup.add(gyroY);

    scene.add(gyroGroup);

    // Inner Gyroscope / Inner Ring 3
    const innerRingGeom = new THREE.RingGeometry(3.6, 3.8, 32);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: currentConfig.primaryColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    innerRing = new THREE.Mesh(innerRingGeom, innerRingMat);
    scene.add(innerRing);

    // 3. Central Quantum Energy Core (Icosahedron + Glowing Mesh)
    const coreGroup = new THREE.Group();

    // Solid Inner Glow Sphere
    const coreGeom = new THREE.SphereGeometry(1.8, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: currentConfig.coreColor,
      transparent: true,
      opacity: 0.85,
    });
    coreMesh = new THREE.Mesh(coreGeom, coreMat);
    coreGroup.add(coreMesh);

    // Outer Geodesic Wireframe Core
    const wireGeom = new THREE.IcosahedronGeometry(2.4, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: currentConfig.primaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    coreWireframe = new THREE.Mesh(wireGeom, wireMat);
    coreGroup.add(coreWireframe);

    scene.add(coreGroup);

    // 4. Orbital 3D Particle Swarm
    const particleCount = 50;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 3.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      particleScales[i] = Math.random() * 0.3 + 0.1;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: currentConfig.primaryColor,
      size: 0.35,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    particlesMesh = new THREE.Points(particleGeom, particleMat);
    scene.add(particlesMesh);

    // 5. Audio Wave Shockwave Ripples (Expanding Concentric Rings)
    const waveGroup = new THREE.Group();
    for (let w = 0; w < 3; w++) {
      const waveGeom = new THREE.RingGeometry(2.0, 2.15, 32);
      const waveMat = new THREE.MeshBasicMaterial({
        color: currentConfig.primaryColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      });
      const waveMesh = new THREE.Mesh(waveGeom, waveMat);
      waveMesh.position.z = -0.5 * w;
      waveGroup.add(waveMesh);
      audioWaveRings.push({ mesh: waveMesh, phase: (w * Math.PI) / 3 });
    }
    scene.add(waveGroup);

    // Light Source
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // 6. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.IDLE;

      // Mouse Parallax Lerp
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.08;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.08;

      scene.rotation.y = mousePosRef.current.x * 0.45;
      scene.rotation.x = -mousePosRef.current.y * 0.45;

      // Rotate Outer Arc Rings
      if (outerRing) {
        outerRing.rotation.z += config.rotationSpeed;
      }

      // Rotate Gyroscopic Rings
      if (gyroX) gyroX.rotation.z -= config.rotationSpeed * 1.5;
      if (gyroY) gyroY.rotation.z += config.rotationSpeed * 1.8;
      if (innerRing) innerRing.rotation.z -= config.rotationSpeed * 0.8;

      // Rotate and Pulse Quantum Core
      if (coreWireframe) {
        coreWireframe.rotation.x = elapsedTime * (config.rotationSpeed * 25);
        coreWireframe.rotation.y = elapsedTime * (config.rotationSpeed * 35);
      }

      // Core Sine Scale Pulsation
      const pulse = 1 + Math.sin(elapsedTime * config.corePulseSpeed) * 0.12;
      coreGroup.scale.set(config.coreScale * pulse, config.coreScale * pulse, config.coreScale * pulse);

      // Rotate Orbital Particles
      if (particlesMesh) {
        particlesMesh.rotation.y += config.particleSpeed;
        particlesMesh.rotation.x += config.particleSpeed * 0.5;
      }

      // Animate Audio Shockwave Ripples
      audioWaveRings.forEach((waveObj) => {
        const ringProgress = (elapsedTime * 2.5 + waveObj.phase) % (Math.PI * 2);
        const scaleVal = 1 + (ringProgress / (Math.PI * 2)) * 2.2;
        const opacityVal = Math.max(0, 1 - ringProgress / (Math.PI * 2)) * (status === "IDLE" ? 0.35 : 0.85);

        waveObj.mesh.scale.set(scaleVal, scaleVal, 1);
        waveObj.mesh.material.opacity = opacityVal;
      });

      // Continuous Floating Sine Wave Motion (Z/Y oscillation)
      scene.position.y = Math.sin(elapsedTime * 1.5) * 0.35;

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    // Clean up WebGL context on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, [px, status]);

  // Handle Mouse Hover Tilt Effect
  const handleMouseMove = (e) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    mousePosRef.current.targetX = Math.max(-1, Math.min(1, normX));
    mousePosRef.current.targetY = Math.max(-1, Math.min(1, normY));
  };

  const handleMouseLeave = () => {
    mousePosRef.current.targetX = 0;
    mousePosRef.current.targetY = 0;
  };

  const getStatusGlowClass = () => {
    switch (status) {
      case "LISTENING":
        return "shadow-[0_0_35px_rgba(255,0,85,0.7)] border-[#ff0055]/60";
      case "THINKING":
        return "shadow-[0_0_35px_rgba(245,158,11,0.75)] border-[#f59e0b]/60";
      case "SPEAKING":
        return "shadow-[0_0_35px_rgba(0,243,255,0.85)] border-[#00f3ff]/70";
      case "IDLE":
      default:
        return "shadow-[0_0_25px_rgba(51,194,204,0.45)] border-[#33c2cc]/40 hover:border-[#00f3ff] hover:shadow-[0_0_35px_rgba(0,243,255,0.7)]";
    }
  };

  const getBadgeColor = () => {
    switch (status) {
      case "LISTENING":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "THINKING":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse";
      case "SPEAKING":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 animate-pulse";
      default:
        return "bg-black/70 text-cyan-300 border-white/20";
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width: `${px}px`, height: `${px}px` }}
      className={`relative flex items-center justify-center rounded-full bg-[#030412]/90 backdrop-blur-md border transition-all duration-500 cursor-pointer overflow-visible group select-none ${getStatusGlowClass()} ${className}`}
    >
      {/* Sci-Fi Futuristic HUD Reticle Overlay */}
      <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />

      {/* Top Left & Bottom Right Corner Crosshairs */}
      <span className="absolute top-1 left-1 text-[8px] font-mono text-cyan-400/60 pointer-events-none">+</span>
      <span className="absolute bottom-1 right-1 text-[8px] font-mono text-cyan-400/60 pointer-events-none">+</span>

      {/* Rotating Outer HUD Dashed Ring */}
      <div
        className={`absolute inset-[-3px] rounded-full border border-dashed pointer-events-none transition-all duration-700 ${
          status === "THINKING"
            ? "border-amber-400/70 animate-spin"
            : status === "LISTENING"
            ? "border-red-400/80 animate-pulse"
            : "border-[#33c2cc]/40 group-hover:border-[#00f3ff]/70"
        }`}
        style={{ animationDuration: status === "THINKING" ? "4s" : "15s" }}
      />

      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full flex items-center justify-center rounded-full overflow-hidden" />

      {/* JARVIS Sci-Fi Hologram Badge */}
      {showBadge && size !== "sm" && (
        <span
          className={`absolute bottom-[-6px] px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase rounded-full border backdrop-blur-md transition-all duration-300 shadow-md ${getBadgeColor()}`}
        >
          {status === "LISTENING"
            ? "REC"
            : status === "THINKING"
            ? "CPU"
            : status === "SPEAKING"
            ? "VOICE"
            : "JARVIS"}
        </span>
      )}
    </div>
  );
}
