import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Send, Video, Phone, MoreVertical, Slash, EyeOff } from "lucide-react";

export default function Chats() {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [hiddenChats, setHiddenChats] = useState<Set<string>>(new Set());
  const [blockedChats, setBlockedChats] = useState<Set<string>>(new Set());

  // Load auth, chats and blocked/hidden data
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchChats();
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchChats();
    });
    fetchHiddenBlocked();
    return () => subscription.unsubscribe();
  }, []);

  const fetchHiddenBlocked = () => {
    setHiddenChats(new Set());
    setBlockedChats(new Set());
  };

  useEffect(() => {
    if (!selectedChat) return;
    if (blockedChats.has(selectedChat.id)) {
      toast.error("Este chat está bloqueado.");
      setSelectedChat(null);
      return;
    }
    fetchMessages(selectedChat.id);
    const channel = supabase
      .channel(`messages-${selectedChat.id}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${selectedChat.id}`
      }, () => fetchMessages(selectedChat.id))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChat, blockedChats]);

  const fetchChats = useCallback(async () => {
    const { data } = await supabase
      .from("chat_members")
      .select(`
        chat_id,
        chats (
          id,
          name,
          chat_type,
          avatar_url,
          updated_at
        )
      `)
      .eq("user_id", user?.id);
    if (!data || data.length === 0) {
      const exampleChats = [
        { id: "demo-1", name: "TAMV Comunidad Global", chat_type: "group", avatar_url: null },
        { id: "demo-2", name: "DreamSpaces Creadores", chat_type: "group", avatar_url: null },
        { id: "demo-3", name: "ISABELLA AI Support", chat_type: "private", avatar_url: null }
      ];
      setChats(exampleChats);
      return;
    }
    const filteredChats = data.map((item) => item.chats).filter(Boolean)
      .filter(chat => !hiddenChats.has(chat.id));
    setChats(filteredChats);
  }, [user, hiddenChats]);

  const fetchMessages = useCallback(async (chatId: string) => {
    const { data } = await supabase
      .from("messages")
      .select(`
        *,
        profiles:user_id (username, avatar_url)
      `)
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    if (blockedChats.has(selectedChat.id)) {
      toast.error("Chat bloqueado, no puedes enviar mensajes.");
      return;
    }
    const { error } = await supabase.from("messages").insert({
      chat_id: selectedChat.id,
      user_id: user?.id,
      content: newMessage,
    });
    if (error) toast.error("Error al enviar mensaje");
    else setNewMessage("");
  };

  const toggleHideChat = (chatId: string) => {
    setHiddenChats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chatId)) newSet.delete(chatId);
      else newSet.add(chatId);
      return newSet;
    });
  };

  const toggleBlockChat = (chatId: string) => {
    setBlockedChats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chatId)) newSet.delete(chatId);
      else newSet.add(chatId);
      return newSet;
    });
    if (selectedChat?.id === chatId) setSelectedChat(null);
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/60 selection:text-primary-foreground">
      <div className="flex h-screen text-white overflow-hidden">
        {/* Sidebar with Chats */}
        <motion.div initial={{ width: 0 }} animate={{ width: 320 }} exit={{ width: 0 }}
          className="flex flex-col border-r border-primary/20 glass-effect h-full">
          <div className="p-6 border-b border-primary/20 flex items-center justify-between">
            <h2 className="text-2xl font-orbitron text-gradient-quantum">Mensajes</h2>
            <Button variant="ghost" size="icon" onClick={() => {
              if (hiddenChats.size === 0) {
                toast("No hay chats ocultos.");
              } else {
                setChats(prevChats => {
                  return [...prevChats, ...[...hiddenChats].map(id => ({ id, name: "Chat oculto", chat_type: "hidden" }))];
                });
                toast("Mostrando chats ocultos");
              }
            }}>
              <EyeOff className="w-5 h-5 text-orange-400" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            {chats.map((chat) => {
              const isBlocked = blockedChats.has(chat.id);
              const isHidden = hiddenChats.has(chat.id);
              return (
                <motion.div key={chat.id}
                  whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.05)" }}
                  className={`p-4 cursor-pointer border-b border-primary/10 flex items-center gap-3 transition-colors
                    ${selectedChat?.id === chat.id ? "bg-primary/15" : ""} ${isBlocked ? "opacity-50 grayscale" : ""}`}
                  onClick={() => !isBlocked && !isHidden && setSelectedChat(chat)}
                >
                  <Avatar className="border-2 border-primary/30 relative">
                    <AvatarImage src={chat.avatar_url} />
                    <AvatarFallback className="bg-primary/20">{chat.name?.[0]?.toUpperCase()}</AvatarFallback>
                    {isBlocked && (
                      <div className="absolute top-0 right-0 bg-red-600 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white" title="Chat bloqueado">
                        <Slash />
                      </div>
                    )}
                    {isHidden && (
                      <div className="absolute bottom-0 right-0 bg-yellow-500 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white" title="Chat oculto">
                        <EyeOff />
                      </div>
                    )}
                  </Avatar>
                  <div className="flex flex-col truncate flex-1 select-text">
                    <p className="font-medium truncate text-white">{chat.name}</p>
                    <small className="text-sm text-muted-foreground truncate">
                      {chat.chat_type === "group" ? "Grupo" : chat.chat_type === "hidden" ? "Oculto" : "Chat privado"}
                    </small>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => toggleHideChat(chat.id)}>
                      {hiddenChats.has(chat.id) ? "Mostrar" : "Ocultar"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toggleBlockChat(chat.id)}>
                      {blockedChats.has(chat.id) ? "Desbloquear" : "Bloquear"}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </ScrollArea>
        </motion.div>

        {/* Chat main content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="flex-1 flex flex-col border-l border-primary/20 glass-effect">
          {selectedChat ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-primary/20">
                <div className="flex items-center gap-4">
                  <Avatar className="border-2 border-primary/30">
                    <AvatarImage src={selectedChat.avatar_url} />
                    <AvatarFallback className="bg-primary/20">{selectedChat.name?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-orbitron text-white">{selectedChat.name}</h3>
                    <p className="text-xs text-muted-foreground">En línea</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-secondary" aria-label="Video call">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-secondary" aria-label="Phone call">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-secondary" aria-label="More options">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div key={message.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.user_id === user?.id ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] ${message.user_id === user?.id ? "order-1" : ""}`}>
                        <Card className={`p-4 ${
                          message.user_id === user?.id
                            ? "bg-primary/20 border-primary/30"
                            : "glass-effect border-primary/20"
                        }`}>
                          {message.user_id !== user?.id && (
                            <p className="text-xs font-orbitron text-primary mb-1">{message.profiles?.username}</p>
                          )}
                          <p className="text-white whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">{new Date(message.created_at).toLocaleTimeString()}</p>
                        </Card>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-primary/20 glass-effect flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="bg-card border-primary/30"
                  aria-label="Nuevo mensaje"
                  autoFocus
                />
                <Button onClick={sendMessage} className="bg-gradient-quantum" aria-label="Enviar mensaje">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-center text-white p-10">
              <div>
                <h3 className="text-2xl font-orbitron text-gradient-quantum mb-2">Selecciona un chat</h3>
                <p className="text-muted-foreground">Elige una conversación para comenzar</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
