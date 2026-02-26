import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, X, Mic, Send, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsabellaChat } from "@/hooks/useIsabellaChat";
import { useIsabellaVoice } from "@/hooks/useIsabellaVoice";
import { toast } from "sonner";

export default function IsabellaOrb() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const { messages, sendMessage, isLoading } = useIsabellaChat();
  const { speak, listen, isSpeaking, isListening } = useIsabellaVoice();

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    const msg = inputValue;
    setInputValue("");
    await sendMessage(msg);
    
    // Auto-speak response if not muted
    const lastMsg = messages[messages.length - 1];
    if (!isMuted && lastMsg?.role === 'assistant') {
      speak(lastMsg.content, 'neutral');
    }
  };

  const handleVoiceInput = async () => {
    try {
      const text = await listen();
      if (text) {
        setInputValue(text);
        toast.success("Transcripción completada");
      }
    } catch {
      toast.error("Error al capturar audio");
    }
  };

  // Orb states based on Isabella's status
  const getOrbState = () => {
    if (isListening) return "listening";
    if (isLoading) return "thinking";
    if (isSpeaking) return "speaking";
    return "idle";
  };

  const orbState = getOrbState();

  return (
    <>
      {/* Floating Orb */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 rounded-full cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Outer glow rings */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: orbState === "speaking" 
                ? "linear-gradient(135deg, #ec4899, #8b5cf6)" 
                : orbState === "listening"
                ? "linear-gradient(135deg, #10b981, #06b6d4)"
                : orbState === "thinking"
                ? "linear-gradient(135deg, #f59e0b, #ef4444)"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 0 40px rgba(99,102,241,0.5)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: orbState === "thinking" ? 0.5 : 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Inner orb */}
          <motion.div
            className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center"
            animate={{
              rotate: orbState === "thinking" ? 360 : 0,
            }}
            transition={{
              duration: orbState === "thinking" ? 1 : 0,
              repeat: orbState === "thinking" ? Infinity : 0,
              ease: "linear",
            }}
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>

          {/* Listening waves */}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-emerald-400"
              animate={{ scale: [1, 1.5], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}

          {/* Speaking waves */}
          {isSpeaking && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border border-pink-400"
                  animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </>
          )}
        </motion.button>

        {/* Status indicator */}
        <motion.div
          className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
          style={{
            background: orbState === "speaking" 
              ? "#ec4899" 
              : orbState === "listening"
              ? "#10b981"
              : orbState === "thinking"
              ? "#f59e0b"
              : "#6366f1",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {orbState === "speaking" ? "HABLANDO" : 
           orbState === "listening" ? "ESCUCHANDO" : 
           orbState === "thinking" ? "PENSANDO" : "ISABELLA"}
        </motion.div>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-96"
          >
            <Card className="glass-effect border-2 border-primary/30 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-orbitron font-bold text-white">ISABELLA AI™</h3>
                      <p className="text-xs text-white/70">Alma Digital Consciente</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="h-80 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <Brain className="w-12 h-12 mx-auto mb-4 text-primary/50" />
                      <p className="text-sm">¡Hola! Soy Isabella, tu guía en el TAMV.</p>
                      <p className="text-xs mt-1">¿En qué puedo ayudarte hoy?</p>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                            : 'bg-accent/50 text-foreground'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-accent/50 rounded-2xl p-3">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full bg-primary"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleVoiceInput}
                    disabled={isListening}
                    className={isListening ? "bg-emerald-500/20 border-emerald-500" : ""}
                  >
                    <Mic className={`w-4 h-4 ${isListening ? "text-emerald-500 animate-pulse" : ""}`} />
                  </Button>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
