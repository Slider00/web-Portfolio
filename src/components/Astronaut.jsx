import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useMotionValue, useSpring } from "motion/react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ✅ ruta dinámica que respeta el base del proyecto
const MODEL_PATH = `${import.meta.env.BASE_URL}models/tenhun_falling_spaceman_fanart.glb`;

export function Astronaut(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(MODEL_PATH);
  const { actions } = useAnimations(animations, group);
  const styledMaterial = useMemo(() => {
    const base = materials["AstronautFallingTexture.png"];
    if (!base?.clone) return base;

    const nextMaterial = base.clone();
    const baseMap = base.map;

    if (baseMap?.image) {
      const source = baseMap.image;
      const canvas = document.createElement("canvas");
      canvas.width = source.width;
      canvas.height = source.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(source, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] / 255;
          const g = data[i + 1] / 255;
          const b = data[i + 2] / 255;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          const sat = max === 0 ? 0 : delta / max;

          let hue = 0;
          if (delta !== 0) {
            if (max === r) hue = ((g - b) / delta) % 6;
            else if (max === g) hue = (b - r) / delta + 2;
            else hue = (r - g) / delta + 4;
            hue *= 60;
            if (hue < 0) hue += 360;
          }

          // Replace current green/cyan accents with a black/gray combo.
          const isGreenCyan = hue >= 145 && hue <= 205 && sat > 0.2;
          const isPinkAccent =
            ((hue >= 300 && hue <= 360) || (hue >= 0 && hue <= 18)) &&
            sat > 0.28 &&
            max > 0.2;
          if (isPinkAccent) {
            data[i] = 16;
            data[i + 1] = 16;
            data[i + 2] = 16;
            continue;
          }

          if (isGreenCyan) {
            const isDarkAccent = max < 0.62;
            if (isDarkAccent) {
              data[i] = 16;
              data[i + 1] = 16;
              data[i + 2] = 16;
            } else {
              data[i] = 128;
              data[i + 1] = 128;
              data[i + 2] = 128;
            }
          }

          // Normalize existing dark tones so all blacks match better.
          if (max < 0.12) {
            data[i] = 16;
            data[i + 1] = 16;
            data[i + 2] = 16;
          }
        }

        // Add a subtle "planet reflection" inside the darkest visor area.
        const width = canvas.width;
        const height = canvas.height;
        const pixelCount = width * height;
        const visorMask = new Uint8Array(pixelCount);

        for (let p = 0; p < pixelCount; p++) {
          const idx = p * 4;
          const r = data[idx] / 255;
          const g = data[idx + 1] / 255;
          const b = data[idx + 2] / 255;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          const sat = max === 0 ? 0 : delta / max;

          let hue = 0;
          if (delta !== 0) {
            if (max === r) hue = ((g - b) / delta) % 6;
            else if (max === g) hue = (b - r) / delta + 2;
            else hue = (r - g) / delta + 4;
            hue *= 60;
            if (hue < 0) hue += 360;
          }

          const isVisorDark =
            max < 0.26 &&
            sat > 0.35 &&
            ((hue >= 8 && hue <= 45) || (hue >= 300 && hue <= 360));

          visorMask[p] = isVisorDark ? 1 : 0;
        }

        const visited = new Uint8Array(pixelCount);
        const queue = new Int32Array(pixelCount);
        let bestArea = 0;
        let bestMinX = 0;
        let bestMinY = 0;
        let bestMaxX = 0;
        let bestMaxY = 0;

        for (let start = 0; start < pixelCount; start++) {
          if (!visorMask[start] || visited[start]) continue;

          let qHead = 0;
          let qTail = 0;
          queue[qTail++] = start;
          visited[start] = 1;

          let area = 0;
          let minX = width;
          let minY = height;
          let maxX = 0;
          let maxY = 0;

          while (qHead < qTail) {
            const current = queue[qHead++];
            area++;
            const x = current % width;
            const y = (current / width) | 0;
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;

            const left = current - 1;
            const right = current + 1;
            const up = current - width;
            const down = current + width;

            if (x > 0 && visorMask[left] && !visited[left]) {
              visited[left] = 1;
              queue[qTail++] = left;
            }
            if (x < width - 1 && visorMask[right] && !visited[right]) {
              visited[right] = 1;
              queue[qTail++] = right;
            }
            if (y > 0 && visorMask[up] && !visited[up]) {
              visited[up] = 1;
              queue[qTail++] = up;
            }
            if (y < height - 1 && visorMask[down] && !visited[down]) {
              visited[down] = 1;
              queue[qTail++] = down;
            }
          }

          if (area > bestArea) {
            bestArea = area;
            bestMinX = minX;
            bestMinY = minY;
            bestMaxX = maxX;
            bestMaxY = maxY;
          }
        }

        if (bestArea > 120) {
          const boxW = bestMaxX - bestMinX + 1;
          const boxH = bestMaxY - bestMinY + 1;
          const cx = bestMinX + boxW * 0.38;
          const cy = bestMinY + boxH * 0.35;
          const radius = Math.max(4, Math.min(boxW, boxH) * 0.22);
          const outer = radius * 1.35;

          const startX = Math.max(0, Math.floor(cx - outer));
          const endX = Math.min(width - 1, Math.ceil(cx + outer));
          const startY = Math.max(0, Math.floor(cy - outer));
          const endY = Math.min(height - 1, Math.ceil(cy + outer));

          for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
              const p = y * width + x;
              if (!visorMask[p]) continue;

              const dx = x - cx;
              const dy = y - cy;
              const d = Math.sqrt(dx * dx + dy * dy);
              if (d > outer) continue;

              const idx = p * 4;
              const baseR = data[idx];
              const baseG = data[idx + 1];
              const baseB = data[idx + 2];

              let mix = 0;
              if (d <= radius) {
                mix = 0.45 * (1 - d / radius) + 0.18;
              } else {
                mix = 0.15 * (1 - (d - radius) / (outer - radius));
              }

              // Planet tint with soft specular look.
              const planetR = 72;
              const planetG = 132;
              const planetB = 224;

              data[idx] = Math.round(baseR * (1 - mix) + planetR * mix);
              data[idx + 1] = Math.round(baseG * (1 - mix) + planetG * mix);
              data[idx + 2] = Math.round(baseB * (1 - mix) + planetB * mix);

              // Slight rim light for detail.
              if (d > radius * 0.78 && d < radius * 0.95) {
                data[idx] = Math.min(255, data[idx] + 16);
                data[idx + 1] = Math.min(255, data[idx + 1] + 24);
                data[idx + 2] = Math.min(255, data[idx + 2] + 30);
              }
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const processedMap = new THREE.CanvasTexture(canvas);
        processedMap.flipY = baseMap.flipY;
        processedMap.colorSpace = baseMap.colorSpace;
        processedMap.wrapS = baseMap.wrapS;
        processedMap.wrapT = baseMap.wrapT;
        processedMap.repeat.copy(baseMap.repeat);
        processedMap.offset.copy(baseMap.offset);
        processedMap.rotation = baseMap.rotation;
        processedMap.center.copy(baseMap.center);
        processedMap.generateMipmaps = true;
        processedMap.minFilter = baseMap.minFilter;
        processedMap.magFilter = baseMap.magFilter;
        processedMap.needsUpdate = true;
        nextMaterial.map = processedMap;
      }
    }

    nextMaterial.needsUpdate = true;
    return nextMaterial;
  }, [materials]);

  useEffect(() => {
    if (animations.length > 0) {
      actions[animations[0].name]?.play();
    }
  }, [actions, animations]);

  const yPosition = useMotionValue(5);
  const ySpring = useSpring(yPosition, { damping: 30 });

  useEffect(() => {
    ySpring.set(-1);
  }, [ySpring]);

  useEffect(() => {
    return () => {
      if (styledMaterial && styledMaterial !== materials["AstronautFallingTexture.png"]) {
        styledMaterial.map?.dispose?.();
        styledMaterial.dispose?.();
      }
    };
  }, [materials, styledMaterial]);

  useFrame(() => {
    if (!group.current) return;
    group.current.position.y = ySpring.get();
  });

  return (
      <group
          ref={group}
          {...props}
          dispose={null}
          rotation={[-Math.PI / 2, -0.2, 2.2]}
          scale={props.scale || 0.3}
          position={props.position || [1.3, -1, 0]}
      >
        <group name="Sketchfab_Scene">
          <group name="Sketchfab_model">
            <group name="Root">
              <group name="metarig">
                <primitive object={nodes.metarig_rootJoint} />
                <skinnedMesh
                    name="Cube001_0"
                    geometry={nodes.Cube001_0.geometry}
                    material={styledMaterial}
                    skeleton={nodes.Cube001_0.skeleton}
                />
                <skinnedMesh
                    name="Cube002_0"
                    geometry={nodes.Cube002_0.geometry}
                    material={styledMaterial}
                    skeleton={nodes.Cube002_0.skeleton}
                />
                <skinnedMesh
                    name="Plane_0"
                    geometry={nodes.Plane_0.geometry}
                    material={styledMaterial}
                    skeleton={nodes.Plane_0.skeleton}
                />
                <skinnedMesh
                    name="Cube008_0"
                    geometry={nodes.Cube008_0.geometry}
                    material={styledMaterial}
                    skeleton={nodes.Cube008_0.skeleton}
                />
                <skinnedMesh
                    name="Cube_0"
                    geometry={nodes.Cube_0.geometry}
                    material={styledMaterial}
                    skeleton={nodes.Cube_0.skeleton}
                />
                <skinnedMesh
                    name="Cube011_0"
                    geometry={nodes.Cube011_0.geometry}
                    material={styledMaterial}
                    skeleton={nodes.Cube011_0.skeleton}
                />
                <group name="Cube001" />
                <group name="Cube005" />
                <group name="Cube002" />
                <group name="Plane" />
                <group name="Cube008" />
                <group name="Cube004" />
                <group name="Cube003" />
                <group name="Cube" />
                <group
                    name="Cube009"
                    rotation={[-2.708, 0.013, -1.447]}
                    scale={1.307}
                />
                <group name="Cube011" />
              </group>
            </group>
          </group>
        </group>
      </group>
  );
}

// ✅ También corregimos el preload
useGLTF.preload(MODEL_PATH);
