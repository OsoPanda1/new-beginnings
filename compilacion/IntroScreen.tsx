import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import utamvSeal from "@/assets/utamv-seal.png";

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen = ({ onComplete }: IntroScreenProps) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1200),   // Título principal
      setTimeout(() => setPhase(2), 3800),  // Subtítulo
      setTimeout(() => setPhase(3),5600),  // Mensaje institucional
      setTimeout(() => onComplete(), 9900), // Fin
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const handleSkip = () => onComplete();

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[120] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Glow institucional */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: phase >= 1 ? 0.55 : 0, scale: 1 }}
              transition={{ duration: 2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[900px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(210,210,220,0.16) 0%, transparent 68%)",
              }}
            />
          </div>

          {/* Sello UTAMV */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: phase >= 1 ? 0.9 : 0,
              y: phase >= 1 ? 0 : -20,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-10 md:mb-12 z-10 flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-silver-primary/60 bg-black/50 shadow-glow flex items-center justify-center overflow-hidden">
              <img
                src={utamvSeal}
                alt="Sello UTAMV"
                className="w-14 h-14 md:w-16 md:h-16 object-contain"
              />
            </div>
            <p className="text-[10px] md:text-xs tracking-[0.35em] text-muted-foreground/70 uppercase">
              Universidad TAMV Campus Online
            </p>
          </motion.div>

          {/* Título principal */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{
              opacity: phase >= 1 ? 1 : 0,
              y: phase >= 1 ? 0 : 24,
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-center z-10 px-4"
          >
            <motion.h1
              className="font-display text-[2.6rem] md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[0.25em] md:tracking-[0.35em] uppercase"
              style={{
                background:
                  "linear-gradient(135deg, #F5F5F7 0%, #D0D4E5 30%, #FFFFFF 55%, #B7BCCF 80%, #E0E3F0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 80px rgba(210,210,220,0.35)",
              }}
            >
              CAMPUS ONLINE UTAMV
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{
                opacity: phase >= 1 ? 1 : 0,
                scaleX: phase >= 1 ? 1 : 0,
              }}
              transition={{ duration: 1.8, delay: 0.4 }}
              className="h-[2px] w-40 md:w-64 lg:w-80 mx-auto my-4 md:my-6"
              style={{
                background:
                  "linear-gradient(80deg, transparent 20%, #D0D4E4 50%, transparent 100%)",
              }}
            />

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: phase >= 1 ? 1 : 0,
                y: phase >= 1 ? 0 : 12,
              }}
              transition={{ duration: 1.2, delay: 0.7 }}
              className="font-display text-xl md:text-3xl lg:text-4xl font-light tracking-[0.4em] md:tracking-[0.5em] text-silver uppercase"
            >
              Exelencia Academica
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 1.5, delay: 1.2 }}
              className="mt-4 text-[11px] md:text-xs tracking-[0.35em] text-muted-foreground/80 uppercase"
            >
              Generando profesionales nextgen desde Latinoamerica
            </motion.p>
          </motion.div>

          {/* Mensaje institucional */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{
              opacity: phase >= 2 ? 1 : 0,
              y: phase >= 2 ? 0 : 32,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mt-10 md:mt-14 text-center z-10 px-6"
          >
            <p className="text-base md:text-xl lg:text-2xl text-muted-foreground font-light tracking-wide max-w-3xl mx-auto leading-relaxed">
              BIENVENIDO AL CAMPUS UTAMV
              EDUCACION DE CLASE MUNDIAL DIRIGIDA DESDE LATINOAMÉRICA.
            </p>
            <p className="text-sm md:text-lg lg:text-xl text-silver/85 font-light tracking-[0.32em] md:tracking-[0.4em] mt-3 uppercase">
               ELEVA TU CARRERA AL NIVEL DE DIRECCIÓN ESTRATÉGICA
            </p>
          </motion.div>

          {/* Línea inferior UTAMV */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: phase >= 2 ? 0.7 : 0,
              y: phase >= 2 ? 0 : 10,
            }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute bottom-16 md:bottom-20 text-center px-4"
          >
            <p className="text-[10px] md:text-xs tracking-[0.4em] text-muted-foreground/60 uppercase">
              NACIDO DESDE LATINOAMÉRICA • PARA EL MUNDO
            </p>
          </motion.div>

          {/* Botón Saltar */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 0.6 : 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={handleSkip}
            className="absolute bottom-6 right-8 text-[10px] md:text-xs tracking-[0.3em] text-muted-foreground hover:text-silver transition-colors uppercase"
          >
            Saltar introducción →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;
