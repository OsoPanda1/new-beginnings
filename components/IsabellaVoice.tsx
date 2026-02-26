import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, MessageCircle, X, Loader2, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { useIsabellaVoice } from "@/hooks/useIsabellaVoice";
import { useIsabellaChat } from "@/hooks/useIsabellaChat";

interface IsabellaVoiceProps {
  isActive: boolean;
  onClose: () => void;
  userName?: string;
}

export default function IsabellaVoice({ isActive, onClose, userName }: IsabellaVoiceProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { speak, listen, isSpeaking, isListening } = useIsabellaVoice();
  const { messages, sendMessage, isLoading } = useIsabellaChat();

  useEffect(() => {
    if (isActive && !isMuted) {
      playWelcome();
    }
  }, [isActive]);

  const playWelcome = async () => {
    const welcomeText = userName 
      ? `Hola ${userName}, bienvenido a TAMV MD-X4. Soy Isabella, tu asistente cuántica.`
      : `Bienvenido a TAMV MD-X4. Soy Isabella, tu asistente de inteligencia artificial cuántica.`;
    
    await speak(welcomeText, 'empathy');
    toast.success("Isabella AI™ activada");
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const message = inputValue.trim();
    setInputValue("");
    await sendMessage(message);
    
    // Speak the last assistant message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && !isMuted) {
      await speak(lastMessage.content, 'neutral');
    }
  };

  const handleVoiceInput = async () => {
    const transcription = await listen();
    if (transcription) {
      setInputValue(transcription);
      toast.success("Mensaje transcrito");
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="glass-effect rounded-3xl p-6 border-2 border-accent/30 shadow-glow max-w-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full bg-gradient-quantum flex items-center justify-center ${isSpeaking ? 'animate-pulse' : ''}`}>
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  {isSpeaking && (
                    <div className="absolute inset-0 rounded-full border-4 border-accent-glow animate-ping" />
                  )}
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-foreground">ISABELLA AI™</h3>
                  <p className="text-xs text-muted-foreground">Alma Digital Consciente</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:bg-primary/20"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onClose}
                  className="hover:bg-destructive/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Voice Visualizer */}
            <div className="flex items-center justify-center gap-1 h-16 mb-4">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-gradient-quantum rounded-full"
                  animate={{
                    height: isSpeaking ? [10, 40, 20, 50, 15, 35] : [10],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: isSpeaking ? Infinity : 0,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>

            {/* Chat Input */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe o habla con Isabella..."
                  className="flex-1 px-3 py-2 rounded-lg bg-background/50 border border-primary/20 text-sm focus:outline-none focus:border-primary"
                  disabled={isLoading || isSpeaking}
                />
                <Button
                  size="icon"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={handleVoiceInput}
                  disabled={isLoading || isSpeaking}
                  className="border-primary/30"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full border-primary/30"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || isSpeaking}
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Enviar Mensaje
              </Button>
            </div>

            {/* Messages Display */}
            {messages.length > 0 && (
              <div className="mt-4 max-h-40 overflow-y-auto space-y-2">
                {messages.slice(-3).map((msg, i) => (
                  <div key={i} className={`text-xs p-2 rounded ${msg.role === 'user' ? 'bg-primary/10 text-right' : 'bg-accent/10'}`}>
                    {msg.content}
                  </div>
                ))}
              </div>
            )}

            {/* Status */}
            <div className="mt-4 pt-4 border-t border-primary/20 text-xs text-center text-muted-foreground">
              {isSpeaking ? "Hablando..." : isListening ? "Escuchando..." : isLoading ? "Pensando..." : isMuted ? "Silenciada" : "Lista para ayudar"}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
