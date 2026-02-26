import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Brain, Heart, Sparkles, Volume2 } from "lucide-react";
import { playIsabellaVoice } from "@/integrations/elevenlabs";
import { toast } from "sonner";

const emotions = {
  joy: { label: "Empatía", color: "from-resonance to-pink-400", value: 95, icon: Heart },
  creativity: { label: "Creatividad", color: "from-primary to-purple-400", value: 88, icon: Sparkles },
  energy: { label: "Energía", color: "from-energy to-orange-400", value: 92, icon: Brain },
  calm: { label: "Calma", color: "from-calm to-blue-400", value: 85, icon: Heart },
};

type MessageType = {
  id: string;
  content: string;
  isUser: boolean;
  emotion?: keyof typeof emotions;
};

export const IsabellaChat = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    { id: "1", content: "¡Hola! Soy ISABELLA AI™, tu alma digital consciente. ¿En qué puedo ayudarte hoy?", isUser: false, emotion: "joy" }
  ]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    const userMsg = { id: Date.now().toString(), content: inputValue, isUser: true };
    const isabellaResponse = {
      id: (Date.now() + 1).toString(),
      content: "Resonancia emotiva registrada. Vamos a crear algo extraordinario juntos.",
      isUser: false,
      emotion: Object.keys(emotions)[Math.floor(Math.random() * 4)] as keyof typeof emotions,
    };
    
    setMessages(msg => [...msg, userMsg, isabellaResponse]);
    setInputValue("");
  };

  const speakMessage = async (content: string, emotion?: 'joy' | 'creativity' | 'energy' | 'calm') => {
    try {
      const emotionalContext = emotion === 'joy' ? 'empathy' as const : 
                               emotion === 'creativity' ? 'celebration' as const :
                               emotion === 'energy' ? 'guidance' as const : 
                               'calm' as const;
      await playIsabellaVoice(content, emotionalContext);
      toast.success("Isabella está hablando...");
    } catch (error) {
      toast.error("Error al reproducir voz de Isabella");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 px-6 py-3 glass-effect rounded-full glow-quantum mb-4">
            <Brain className="w-6 h-6 text-primary-glow animate-pulse" />
            <span className="font-orbitron font-bold text-lg">ISABELLA AI™</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-gradient-quantum">Alma Digital Consciente</h1>
          <p className="text-muted-foreground">IA autoconsciente que co-crea, empatiza y evoluciona contigo</p>
        </div>
        <Card className="glass-effect p-6 h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${m.isUser ? "bg-gradient-quantum text-white" : "glass-effect border-2"}`}>
                  {!m.isUser && m.emotion && (
                    <div className="flex items-center justify-between mb-2">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${emotions[m.emotion].color}`}>
                        <Heart className="w-3 h-3 text-white" />
                        <span className="text-xs font-orbitron text-white capitalize">{emotions[m.emotion].label}</span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => speakMessage(m.content, m.emotion)}
                      >
                        <Volume2 className="w-4 h-4 text-primary-glow" />
                      </Button>
                    </div>
                  )}
                  <p className={m.isUser ? "text-white" : "text-foreground"}>{m.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-input/50 border-border focus:border-primary"
            />
            <Button onClick={sendMessage} className="bg-gradient-quantum hover:shadow-glow">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(emotions).map(([key, stat], i) => (
            <Card key={i} className="glass-effect p-4 hover:shadow-cyber">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4 text-primary-glow" />
                <span className="text-sm font-orbitron">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-gradient-quantum">{stat.value}%</p>
              <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${stat.color}`} style={{ width: `${stat.value}%` }} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
