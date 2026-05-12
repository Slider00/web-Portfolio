import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useMemo } from "react";

const ParallaxBackground = () => {
    const { scrollYProgress } = useScroll();
    const x = useSpring(scrollYProgress, { damping: 50 });
    const mountain3Y = useTransform(x, [0, 0.5], ["0%", "70%"]);
    const planetsX = useTransform(x, [0, 0.5], ["0%", "-20%"]);
    const mountain2Y = useTransform(x, [0, 0.5], ["0%", "30%"]);
    const mountain1Y = useTransform(x, [0, 0.5], ["0%", "0%"]);

    // Base path for static assets (adapta según el base de Vite)
    const base = import.meta.env.BASE_URL;
    const stars = useMemo(
      () =>
        Array.from({ length: 85 }, (_, i) => {
          const seed = i * 9973;
          const left = (seed * 17) % 100;
          const top = (seed * 29) % 48;
          const size = 12;
          const duration = 2.2 + ((seed * 7) % 23) / 10;
          const delay = -((seed * 19) % 40) / 10;
          const opacity = 0.35 + ((seed * 11) % 45) / 100;
          return { left, top, size, duration, delay, opacity };
        }),
      []
    );

    return (
        <section className="absolute inset-0 bg-black/40">
            <div className="relative h-screen overflow-y-hidden">
                {/* Background Sky */}
                <div
                    className="absolute inset-0 w-full h-screen -z-50"
                    style={{
                        backgroundImage: `url(${base}assets/sky.jpg)`,
                        backgroundPosition: "bottom",
                        backgroundSize: "cover",
                    }}
                />
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -45 }}>
                  {stars.map((star, index) => (
                    <span
                      key={index}
                      className="twinkle-star"
                      style={{
                        left: `${star.left}%`,
                        top: `${star.top}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                        animationDuration: `${star.duration}s`,
                        animationDelay: `${star.delay}s`,
                      }}
                    />
                  ))}
                </div>
                {/* Mountain Layer 3 */}
                <motion.div
                    className="absolute inset-0 -z-40"
                    style={{
                        backgroundImage: `url(${base}assets/mountain-3.png)`,
                        backgroundPosition: "bottom",
                        backgroundSize: "cover",
                        y: mountain3Y,
                    }}
                />
                {/* Planets */}
                <motion.div
                    className="absolute inset-0 -z-30"
                    style={{
                        backgroundImage: `url(${base}assets/planets.png)`,
                        backgroundPosition: "bottom",
                        backgroundSize: "cover",
                        x: planetsX,
                    }}
                />
                {/* Mountain Layer 2 */}
                <motion.div
                    className="absolute inset-0 -z-20"
                    style={{
                        backgroundImage: `url(${base}assets/mountain-2.png)`,
                        backgroundPosition: "bottom",
                        backgroundSize: "cover",
                        y: mountain2Y,
                    }}
                />
                {/* Mountain Layer 1 */}
                <motion.div
                    className="absolute inset-0 -z-10"
                    style={{
                        backgroundImage: `url(${base}assets/mountain-1.png)`,
                        backgroundPosition: "bottom",
                        backgroundSize: "cover",
                        y: mountain1Y,
                    }}
                />
            </div>
        </section>
    );
};

export default ParallaxBackground;
