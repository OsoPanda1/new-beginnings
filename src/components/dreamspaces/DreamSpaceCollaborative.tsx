/**
 * 🌌 DreamSpace Collaborative - TAMV MD-X4™
 * Real-time multiplayer 3D/4D experiences with Supabase Presence
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Text3D, Stars, Center } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { 
  Users, Mic, MicOff, Video, VideoOff, 
  Hand, MessageCircle, Settings, Share2,
  Maximize2, Volume2, VolumeX, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Participant {
  id: string;
  username: string;
  avatar_url?: string;
  position: { x: number; y: number; z: number };
  color: string;
  speaking?: boolean;
  online_at: string;
}

interface AvatarOrbProps {
  participant: Participant;
  isLocal?: boolean;
}

function AvatarOrb({ participant, isLocal }: AvatarOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      if (participant.speaking) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 10) * 0.1);
      }
    }
  });

  const color = new THREE.Color(participant.color);

  return (
    <group position={[participant.position.x, participant.position.y, participant.position.z]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.8 : 0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Glow ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial color={color} transparent opacity={participant.speaking ? 0.8 : 0.3} />
        </mesh>
        {/* Username label */}
        {hovered && (
          <Center position={[0, 1, 0]}>
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={0.15}
              height={0.02}
            >
              {participant.username}
              <meshBasicMaterial color="white" />
            </Text3D>
          </Center>
        )}
      </Float>
      {isLocal && (
        <pointLight color={color} intensity={2} distance={5} />
      )}
    </group>
  );
}

function DreamEnvironment() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      (gridRef.current.material as THREE.Material).opacity = 0.1 + Math.sin(state.clock.getElapsedTime()) * 0.05;
    }
  });

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="night" />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f7ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      
      {/* Quantum grid floor */}
      <gridHelper
        ref={gridRef}
        args={[50, 50, '#00f7ff', '#ff00ff']}
        position={[0, -2, 0]}
      />
      
      {/* Central portal */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[3, 0.1, 16, 100]} />
        <meshStandardMaterial
          color="#00f7ff"
          emissive="#00f7ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </>
  );
}

interface DreamSpaceCollaborativeProps {
  spaceId: string;
  spaceName?: string;
  onClose?: () => void;
}

export function DreamSpaceCollaborative({ spaceId, spaceName = "Quantum Nexus", onClose }: DreamSpaceCollaborativeProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localUser, setLocalUser] = useState<Participant | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ user: string; text: string; time: string }[]>([]);

  const colors = ['#00f7ff', '#ff00ff', '#00ff88', '#ffaa00', '#ff4466', '#44aaff'];

  // Initialize presence
  useEffect(() => {
    const initPresence = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      const localParticipant: Participant = {
        id: user.id,
        username: profile?.username || 'Usuario',
        avatar_url: profile?.avatar_url || undefined,
        position: { 
          x: (Math.random() - 0.5) * 10, 
          y: 0, 
          z: (Math.random() - 0.5) * 10 
        },
        color: colors[Math.floor(Math.random() * colors.length)],
        online_at: new Date().toISOString()
      };

      setLocalUser(localParticipant);

      // Set up presence channel
      const channel = supabase.channel(`dreamspace:${spaceId}`, {
        config: { presence: { key: user.id } }
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const presenceParticipants = Object.entries(state).map(([key, value]) => {
            const userData = (value as any[])[0];
            return {
              id: key,
              username: userData.username || 'Usuario',
              avatar_url: userData.avatar_url,
              position: userData.position || { x: 0, y: 0, z: 0 },
              color: userData.color || '#00f7ff',
              speaking: userData.speaking || false,
              online_at: userData.online_at
            };
          });
          setParticipants(presenceParticipants);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          const userData = newPresences[0];
          toast(`${userData.username || 'Usuario'} se unió al espacio`, {
            icon: '✨'
          });
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          const userData = leftPresences[0];
          toast(`${userData.username || 'Usuario'} salió del espacio`, {
            icon: '👋'
          });
        })
        .on('broadcast', { event: 'chat' }, ({ payload }) => {
          setMessages(prev => [...prev, payload]);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track(localParticipant);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    initPresence();
  }, [spaceId]);

  const sendMessage = useCallback(async () => {
    if (!message.trim() || !localUser) return;

    const channel = supabase.channel(`dreamspace:${spaceId}`);
    await channel.send({
      type: 'broadcast',
      event: 'chat',
      payload: {
        user: localUser.username,
        text: message,
        time: new Date().toLocaleTimeString()
      }
    });

    setMessage("");
  }, [message, localUser, spaceId]);

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <DreamEnvironment />
        
        {/* Render participants */}
        {participants.map(participant => (
          <AvatarOrb
            key={participant.id}
            participant={participant}
            isLocal={participant.id === localUser?.id}
          />
        ))}

        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="glass-effect border-primary/30"
            >
              ← Salir
            </Button>
            <div>
              <h2 className="font-orbitron font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {spaceName}
              </h2>
              <Badge variant="outline" className="border-primary/30">
                <Users className="w-3 h-3 mr-1" />
                {participants.length} en línea
              </Badge>
            </div>
          </div>

          {/* Participant avatars */}
          <div className="flex items-center gap-2">
            {participants.slice(0, 5).map(p => (
              <Avatar key={p.id} className="w-8 h-8 border-2" style={{ borderColor: p.color }}>
                <AvatarImage src={p.avatar_url} />
                <AvatarFallback style={{ backgroundColor: p.color + '40' }}>
                  {p.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {participants.length > 5 && (
              <Badge className="bg-primary/20">+{participants.length - 5}</Badge>
            )}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
          <div className="flex items-center justify-center gap-3">
            <Button
              variant={isMuted ? "outline" : "default"}
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className={`glass-effect ${isMuted ? 'border-destructive/50' : 'bg-emerald-500'}`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            <Button
              variant={!isVideoOn ? "outline" : "default"}
              size="icon"
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`glass-effect ${!isVideoOn ? 'border-destructive/50' : 'bg-emerald-500'}`}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setChatOpen(!chatOpen)}
              className="glass-effect border-primary/30"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="glass-effect border-primary/30"
            >
              <Hand className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="glass-effect border-primary/30"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Chat panel */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute top-16 right-4 bottom-20 w-80 glass-effect rounded-xl border border-primary/20 p-4 pointer-events-auto"
            >
              <h3 className="font-orbitron font-bold mb-4">Chat del Espacio</h3>
              <div className="flex-1 h-[calc(100%-80px)] overflow-y-auto space-y-2 mb-4">
                {messages.map((msg, i) => (
                  <div key={i} className="bg-background/50 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary">{msg.user}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="glass-effect border-primary/30"
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button size="icon" onClick={sendMessage} className="bg-primary">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
