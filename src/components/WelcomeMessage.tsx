import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function WelcomeMessage() {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkWelcomeMessage = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      setUser(session.user);

      // Check if user has seen welcome message
      const hasSeenWelcome = localStorage.getItem(`welcome_shown_${session.user.id}`);
      
      if (!hasSeenWelcome) {
        // Show after 2 seconds
        setTimeout(() => {
          setShow(true);
        }, 2000);
      }
    };

    checkWelcomeMessage();
  }, []);

  const handleClose = () => {
    setShow(false);
    if (user) {
      localStorage.setItem(`welcome_shown_${user.id}`, 'true');
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, rotateY: 180 }}
            transition={{ type: "spring", duration: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="glass-effect border-primary/30 p-8 max-w-2xl relative overflow-hidden">
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 opacity-50" />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-quantum blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-quantum blur-3xl"
              />

              {/* Close button */}
              <Button
                size="icon"
                variant="ghost"
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 hover:bg-primary/10"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Content */}
              <div className="relative z-10 text-center space-y-6">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-quantum shadow-glow mb-4"
                >
                  <Heart className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-gradient-quantum">
                  ¡Bienvenido a la Familia TAMV!
                </h2>

                <div className="space-y-4 text-lg">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-gradient-quantum font-semibold">Hola,</span> te estábamos esperando.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-muted-foreground"
                  >
                    Este es <span className="text-gradient-quantum font-semibold">tu espacio</span>, tu nuevo mundo digital.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="pt-4 border-t border-primary/20"
                  >
                    <p className="text-sm text-muted-foreground mb-2">
                      Desde Real del Monte, Hidalgo
                    </p>
                    <p className="text-base">
                      Recibe un abrazo y mi agradecimiento eterno por estar aquí.
                    </p>
                    <p className="text-lg font-semibold text-gradient-quantum mt-3">
                      Bienvenido a mi familia.
                    </p>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="text-sm italic text-muted-foreground pt-4"
                  >
                    Atte. <span className="text-gradient-quantum font-semibold">Anubis Villaseñor</span>
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1, type: "spring" }}
                  className="flex items-center justify-center gap-2 pt-6"
                >
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-sm text-muted-foreground">
                    El futuro comienza ahora
                  </span>
                  <Sparkles className="w-5 h-5 text-accent" />
                </motion.div>

                <Button
                  onClick={handleClose}
                  size="lg"
                  className="bg-gradient-quantum hover:scale-110 transition-transform mt-6"
                >
                  Comenzar Mi Viaje Quantum
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
