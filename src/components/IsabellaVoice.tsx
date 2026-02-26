import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, X, Loader2, Mic, MicOff, Send } from "lucide-react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak, stopSpeaking, listen, isSpeaking, isListening } = useIsabellaVoice();
  const { messages, sendMessage, isLoading } = useIsabellaChat();
  const hasGreeted = useRef(false);

  useEffect(() => {
    if (isActive && !isMuted && !hasGreeted.current) {
      hasGreeted.current = true;
      const welcomeText = userName 
        ? `Hola ${userName}, bienvenido a TAMV. Soy Isabella, tu asistente cuántica.`
        : `Bienvenido a TAMV MD-X4. Soy Isabella, tu asistente de inteligencia cuántica.`;
      speak(welcomeText, 'empathy');
      toast.success("Isabella AI™ activada");
    }
  }, [isActive, isMuted, userName, speak]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-speak last assistant message
  useEffect(() => {
    if (isMuted || isSpeaking || isLoading) return;
    const last = messages[messages.length - 1];
    if (last?.role === 'assistant' && last.content.length > 5) {
      // Only speak complete messages (not streaming partials)
      const timer = setTimeout(() => {
        if (!isLoading) speak(last.content.slice(0, 500), 'neutral');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading, isMuted, isSpeaking, speak]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    const msg = inputValue.trim();
    setInputValue("");
    await sendMessage(msg);
  };

  const handleVoiceInput = async () => {
    if (isSpeaking) stopSpeaking();
    const transcript = await listen();
    if (transcript) {
      setInputValue(transcript);
      toast.success("Voz transcrita");
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-8 right-8 z-50 w-96"
        >
          <div className="crystal-glass rounded-2xl p-5 border border-accent/20 shadow-quantum">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ${isSpeaking ? 'animate-pulse' : ''}`}>
                    <span className="text-lg">🔮</span>
                  </div>
                  {isSpeaking && <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping" />}
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-sm text-foreground">ISABELLA AI™</h3>
                  <p className="text-[10px] text-muted-foreground">
                    {isSpeaking ? "Hablando..." : isListening ? "Escuchando..." : isLoading ? "Pensando..." : "Lista"}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Waveform */}
            <div className="flex items-center justify-center gap-0.5 h-10 mb-3">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full"
                  style={{ background: 'linear-gradient(to top, hsl(var(--primary)), hsl(var(--accent)))' }}
                  animate={{
                    height: isSpeaking ? [4, 24, 12, 32, 8, 20] : isListening ? [4, 16, 8, 20, 6, 14] : [4],
                  }}
                  transition={{ duration: 0.5, repeat: (isSpeaking || isListening) ? Infinity : 0, delay: i * 0.03 }}
                />
              ))}
            </div>

            {/* Messages */}
            <div className="max-h-48 overflow-y-auto space-y-2 mb-3 scrollbar-hide">
              {messages.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Escribe o habla con Isabella...
                </p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`text-xs p-2.5 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary/15 text-foreground ml-8' 
                    : 'bg-accent/10 text-foreground mr-4'
                }`}>
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe a Isabella..."
                className="flex-1 px-3 py-2 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                disabled={isLoading || isSpeaking}
              />
              <Button
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                className="h-9 w-9 border-border"
                onClick={handleVoiceInput}
                disabled={isLoading || isSpeaking}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                size="icon"
                className="h-9 w-9 bg-gradient-to-r from-primary to-accent"
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading || isSpeaking}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
