import { Canvas, useFrame } from "@react-three/fiber";
import HeroText from "../components/HeroText";
import ParallaxBackground from "../components/parallaxBackground";
import { Astronaut } from "../components/Astronaut";
import { Float } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { easing } from "maath";
import { Suspense } from "react";
import Loader from "../components/Loader";

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  return (
    <section className="flex items-start justify-center min-h-screen overflow-hidden md:items-start md:justify-start c-space">
      <HeroText />
      <ParallaxBackground />
      <figure
        className="absolute inset-0"
        style={{ width: "100vw", height: "100vh" }}
      >
        <Canvas
          camera={{ position: [0, 1, 3] }}
          dpr={isMobile ? [1, 1.25] : 2}
          gl={{
            antialias: !isMobile,
            powerPreference: "high-performance",
          }}
        >
          <Suspense fallback={<Loader />}>
            <Float
              speed={isMobile ? 0.5 : 1}
              rotationIntensity={isMobile ? 0.12 : 0.3}
              floatIntensity={isMobile ? 0.25 : 0.7}
            >
              <Astronaut
                scale={isMobile && 0.23}
                position={isMobile && [0, -1.5, 0]}
              />
            </Float>
            {!isMobile && <Rig />}
          </Suspense>
        </Canvas>
      </figure>
    </section>
  );
};

function Rig() {
  return useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.mouse.x / 10, 1 + state.mouse.y / 10, 3],
      0.5,
      delta
    );
  });
}

export default Hero;
