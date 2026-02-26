import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, Loader2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Local storage key for visitor session
const VISITOR_SESSION_KEY = 'utamv_visitor_session';
const VISITOR_MESSAGES_KEY = 'utamv_visitor_messages';
const VISITOR_QUOTA_KEY = 'utamv_visitor_quota';
const DAILY_LIMIT = 5;

/**
 * PublicVisitorChat - AI Chat for non-authenticated visitors
 * Works entirely client-side with fallback responses
 * Based on UTAMV AI Academic Core 2026 principles
 */
const PublicVisitorChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load saved messages from localStorage
    try {
      const saved = localStorage.getItem(VISITOR_MESSAGES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      }
    } catch (e) {
      console.error('Error loading messages:', e);
    }
    return [{
      id: "1",
      role: "assistant",
      content: `¡Hola! Soy Isabella, tu guía académica de UTAMV.

Puedo ayudarte con:
• Información sobre nuestros programas académicos
• Proceso de admisión e inscripción
• Precios y opciones de financiamiento
• Contenido y temario de cursos
• Certificaciones y beneficios

¿En qué puedo ayudarte hoy?`,
      timestamp: new Date(),
    }];
  });
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => {
    let sid = localStorage.getItem(VISITOR_SESSION_KEY);
    if (!sid) {
      sid = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(VISITOR_SESSION_KEY, sid);
    }
    return sid;
  });
  
  const [quotaUsed, setQuotaUsed] = useState(() => {
    // Check quota from localStorage
    try {
      const quotaData = localStorage.getItem(VISITOR_QUOTA_KEY);
      if (quotaData) {
        const { date, count } = JSON.parse(quotaData);
        const today = new Date().toDateString();
        if (date === today) {
          return count;
        }
      }
    } catch (e) {
      console.error('Error loading quota:', e);
    }
    return 0;
  });
  
  const [limitReached, setLimitReached] = useState(quotaUsed >= DAILY_LIMIT);

  const scrollBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(VISITOR_MESSAGES_KEY, JSON.stringify(messages.slice(-20))); // Keep last 20 messages
    } catch (e) {
      console.error('Error saving messages:', e);
    }
  }, [messages]);

  const updateQuota = (newCount: number) => {
    setQuotaUsed(newCount);
    setLimitReached(newCount >= DAILY_LIMIT);
    try {
      localStorage.setItem(VISITOR_QUOTA_KEY, JSON.stringify({
        date: new Date().toDateString(),
        count: newCount
      }));
    } catch (e) {
      console.error('Error saving quota:', e);
    }
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuánto') || lowerMessage.includes('cuanto')) {
      return `El Máster en Marketing Digital 2026 tiene un precio de **$199 USD** para la Cohorte Fundadora (50% de descuento).

Incluye:
• 10 módulos completos
• 50+ horas de contenido
• Certificación UTAMV
• Acceso de por vida
• Soporte personalizado

💡 Puedes pagar con tarjeta de crédito/débito a través de Stripe.

¿Te gustaría conocer más sobre el temario o proceso de inscripción?`;
    }
    
    if (lowerMessage.includes('inscrib') || lowerMessage.includes('registro') || lowerMessage.includes('cómo') || lowerMessage.includes('como') || lowerMessage.includes('proceso')) {
      return `El proceso de inscripción es muy sencillo:

1. Ve a la sección "Admisiones"
2. Completa el formulario con tus datos
3. Realiza el pago seguro ($199 USD)
4. Recibe acceso inmediato al campus

📝 Requisitos mínimos:
• Ser mayor de 18 años
• Tener acceso a internet
• Ganas de aprender

¿Tienes alguna duda específica sobre el proceso?`;
    }
    
    if (lowerMessage.includes('certific') || lowerMessage.includes('título') || lowerMessage.includes('titulo') || lowerMessage.includes('validé') || lowerMessage.includes('valide')) {
      return `Al completar el programa recibirás:

📜 Certificado UTAMV con:
• Verificación digital única
• Detalle de competencias desarrolladas
• Horas acreditadas (50+)
• Sello institucional

⚠️ **Aviso importante**: UTAMV es una institución privada en fase pre-RVOE. Los certificados tienen carácter institucional y no cuentan con validez oficial hasta obtener el reconocimiento de las autoridades educativas.

¿Te gustaría ver una vista previa del certificado?`;
    }
    
    if (lowerMessage.includes('financiamiento') || lowerMessage.includes('pago') || lowerMessage.includes('cuotas') || lowerMessage.includes('meses')) {
      return `Opciones de pago disponibles:

💳 **Pago único**: $199 USD (mejor precio)
💳 **Stripe**: Tarjetas de crédito/débito

✨ Beneficios Cohorte Fundadora:
• 50% de descuento
• Acceso prioritario
• Bonificaciones exclusivas

¿Te gustaría proceder con la inscripción?`;
    }
    
    if (lowerMessage.includes('temario') || lowerMessage.includes('módulo') || lowerMessage.includes('modulo') || lowerMessage.includes('contenido') || lowerMessage.includes('aprender')) {
      return `El Máster incluye 10 módulos:

1. Fundamentos del Marketing Digital
2. SEO, AEO y Optimización Web
3. Publicidad Digital y Paid Media
4. Social Media y Estrategia de Contenidos
5. Email Marketing, Automatización y CRM
6. Analítica Digital, Data y Métricas
7. Estrategia y Gestión de Comunidades
8. Influencer Marketing y Colaboraciones
9. E-commerce y Conversion Rate Optimization
10. Proyecto Capstone Integrador

¿Te gustaría conocer el detalle de algún módulo específico?`;
    }
    
    if (lowerMessage.includes('contacto') || lowerMessage.includes('email') || lowerMessage.includes('correo') || lowerMessage.includes('ayuda') || lowerMessage.includes('soporte')) {
      return `Puedes contactarnos por:

📧 Email: tamvonlinenetwork@outlook.es
🌐 Sitio web: utamv.mx

Nuestro equipo está disponible para ayudarte con:
• Dudas sobre programas
• Proceso de inscripción
• Soporte técnico
• Información de pagos

¿Hay algo más en lo que pueda ayudarte?`;
    }
    
    if (lowerMessage.includes('duración') || lowerMessage.includes('duracion') || lowerMessage.includes('tiempo') || lowerMessage.includes('cuándo') || lowerMessage.includes('cuando')) {
      return `Duración del programa:

⏱️ **Máster Marketing Digital 2026**: 6 meses
• 10 módulos
• 50+ horas de contenido
• Ritmo flexible (estudia a tu propio ritmo)
• Acceso de por vida al contenido

Puedes avanzar tan rápido o tan despacio como necesites. El contenido está disponible 24/7.

¿Te gustaría comenzar?`;
    }

    // Default response
    return `Gracias por tu interés en UTAMV. Soy Isabella, tu guía académica.

Puedo ayudarte con información sobre:
• **Precios** y financiamiento
• **Proceso** de inscripción
• **Contenido** del programa
• **Certificaciones**

**Aviso**: UTAMV es una institución privada en fase pre-RVOE. Nuestros programas tienen carácter institucional.

¿En qué puedo ayudarte específicamente?`;
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping || limitReached) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const aiResponse = getAIResponse(userMessage.content);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
    
    // Update quota
    updateQuota(quotaUsed + 1);
  };

  const quickQuestions = [
    "¿Cuál es el precio?",
    "¿Cómo me inscribo?",
    "¿Qué incluye la certificación?",
    "¿Hay financiamiento?",
  ];

  const remaining = DAILY_LIMIT - quotaUsed;

  return (
    <div className="flex flex-col h-[450px]">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Isabella IA</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Chat para visitantes
            </p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-right">
          <span className={remaining <= 1 ? "text-destructive font-medium" : ""}>
            {remaining}/{DAILY_LIMIT} mensajes
          </span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "assistant" ? "bg-primary/20" : "bg-muted"}`}>
                  {msg.role === "assistant" ? <Bot className="w-3.5 h-3.5 text-primary" /> : <User className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>
                <div className={`rounded-2xl px-3 py-2 ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"}`}>
                  <p className={`text-sm whitespace-pre-line ${msg.role === "user" ? "text-primary-foreground" : "text-foreground"}`}>
                    {msg.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-none px-3 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={scrollBottomRef} />
        </div>
      </ScrollArea>

      {/* Limit warning with CTA */}
      {limitReached && (
        <div className="px-3 py-3 bg-teal/10 border-t border-teal/20">
          <div className="flex items-center gap-2 text-xs text-teal mb-2">
            <Lock className="w-4 h-4" />
            <span className="font-medium">Límite de visitante alcanzado</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Regístrate gratis para continuar chateando y acceder a más beneficios.
          </p>
          <Button 
            variant="teal" 
            size="sm" 
            className="w-full"
            onClick={() => navigate('/auth')}
          >
            Crear cuenta gratis
          </Button>
        </div>
      )}

      {/* Quick questions */}
      {!limitReached && (
        <div className="px-3 py-2 border-t border-border">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={limitReached ? "Regístrate para continuar..." : "Escribe tu pregunta..."}
            className="flex-1 text-sm"
            disabled={isTyping || limitReached}
          />
          <Button type="submit" disabled={!input.trim() || isTyping || limitReached} size="icon" className="h-9 w-9">
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PublicVisitorChat;
