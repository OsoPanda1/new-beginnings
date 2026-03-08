import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  MessageCircle, 
  AlertTriangle,
  Users,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  user_id: string;
  user_name: string | null;
  message: string;
  created_at: string;
  is_flagged: boolean;
}

// Forbidden words/patterns for spam detection
const FORBIDDEN_PATTERNS = [
  /https?:\/\//i,
  /www\./i,
  /compra/i,
  /venta/i,
  /\.com/i,
  /gratis/i,
  /oferta/i,
  /descuento/i,
  /click/i,
  /enlace/i,
];

const GeneralChat = () => {
  const { user, isPaid } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaid) return;

    // Fetch initial messages
    fetchMessages();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          if (!newMsg.is_flagged) {
            setMessages(prev => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isPaid]);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('is_flagged', false)
      .order('created_at', { ascending: true })
      .limit(100);

    if (data) {
      setMessages(data);
    }
  };

  const checkForSpam = (text: string): boolean => {
    return FORBIDDEN_PATTERNS.some(pattern => pattern.test(text));
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !isPaid) return;

    // Check for spam
    if (checkForSpam(newMessage)) {
      toast({
        title: 'Mensaje bloqueado',
        description: 'Tu mensaje contiene contenido no permitido. Evita compartir enlaces o intentar vender productos.',
        variant: 'destructive',
      });
      return;
    }

    setSending(true);

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anónimo',
          message: newMessage.trim(),
          is_flagged: false,
        });

      if (error) throw error;
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el mensaje.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isPaid) {
    return (
      <div className="card-elite p-8 text-center">
        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-xl font-bold text-foreground mb-2">
          Chat Exclusivo
        </h3>
        <p className="text-muted-foreground">
          El chat general es exclusivo para estudiantes inscritos en el Master.
        </p>
      </div>
    );
  }

  return (
    <div className="card-elite flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Chat General</h3>
            <p className="text-xs text-muted-foreground">Comunidad Master 360</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-4 h-4" />
          <span>Moderado por IA</span>
        </div>
      </div>

      {/* Rules banner */}
      <div className="px-4 py-2 bg-muted/30 border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
        <AlertTriangle className="w-4 h-4" />
        <span>Prohibido compartir enlaces externos o intentar vender productos/servicios.</span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              Sé el primero en enviar un mensaje
            </p>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.user_id === user?.id;
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted rounded-bl-none'
                    }`}
                  >
                    {!isOwn && (
                      <p className="text-xs font-medium mb-1 opacity-70">
                        {msg.user_name}
                      </p>
                    )}
                    <p className={`text-sm ${isOwn ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {msg.message}
                    </p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1"
            disabled={sending}
            maxLength={500}
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || sending}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GeneralChat;
