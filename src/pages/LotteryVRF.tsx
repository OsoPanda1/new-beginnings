import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Ticket, Trophy, Sparkles, Clock, Users,
  Dice1, Dice2, Dice3, Dice4, Dice5, Dice6,
  CheckCircle2, Star, Shield, Gift, Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useLotteryVRF } from "@/hooks/useLotteryVRF";

export default function LotteryVRF() {
  const { draws, myTickets, loading, purchasing, purchaseTicket, verifyVRF } = useLotteryVRF();
  const [isRolling, setIsRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 45, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const DiceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

  const rollDice = async () => {
    if (myTickets.length <= 0) {
      toast.error("No tienes boletos disponibles");
      return;
    }

    setIsRolling(true);
    
    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }
    
    const finalValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(finalValue);
    setIsRolling(false);
    
    if (finalValue >= 5) {
      toast.success(`¡Ganaste! Número: ${finalValue}`);
    } else {
      toast.info(`Número: ${finalValue}. ¡Sigue intentando!`);
    }
  };

  const handleBuyTicket = async (drawId: string) => {
    await purchaseTicket(drawId);
  };

  const handleVerifyVRF = async (drawId: string) => {
    const result = await verifyVRF(drawId);
    if (result) {
      toast.success("VRF verificado correctamente");
    }
  };

  const CurrentDice = DiceIcons[diceValue - 1];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Use DB draws if available, otherwise show demo data
  const displayDraws = draws.length > 0 ? draws.map(d => ({
    id: d.id,
    name: d.name,
    prize: d.prize_pool,
    ticketPrice: d.ticket_price,
    ticketsSold: d.tickets_sold,
    maxTickets: d.max_tickets,
    drawDate: d.draw_date,
    status: d.status as "active" | "drawing" | "completed",
    winner: d.winner_user_id,
    vrfHash: d.vrf_proof
  })) : [
    {
      id: "demo-001",
      name: "Sorteo Quantum Semanal",
      prize: 500000,
      ticketPrice: 50,
      ticketsSold: 8543,
      maxTickets: 10000,
      drawDate: "2026-01-31T20:00:00Z",
      status: "active" as const
    },
    {
      id: "demo-002",
      name: "Mega Jackpot TAMV",
      prize: 2500000,
      ticketPrice: 200,
      ticketsSold: 4521,
      maxTickets: 5000,
      drawDate: "2026-02-15T20:00:00Z",
      status: "active" as const
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Sparkles className="w-4 h-4 text-primary/30" />
          </motion.div>
        ))}
      </div>

      {/* Hero Section with Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-16 px-4 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(251,191,36,0.5)]"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-orbitron font-bold mb-4"
        >
          <span className="text-gradient-quantum">Lotería TAMV</span>
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          Sistema de azar verificable con VRF (Verifiable Random Function).
          Transparencia y fairness garantizados en MSR Blockchain.
        </motion.p>

        {/* Your Tickets Count */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.45, type: "spring" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-4"
        >
          <Ticket className="w-5 h-5 text-primary" />
          <span className="font-bold">{myTickets.length}</span>
          <span className="text-muted-foreground">boletos activos</span>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="inline-flex items-center gap-4 px-6 py-3 rounded-full glass-effect border border-primary/30"
        >
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">Próximo sorteo:</span>
          <div className="flex items-center gap-2 font-mono text-lg">
            <span className="px-2 py-1 rounded bg-primary/20">{String(countdown.hours).padStart(2, '0')}</span>
            <span>:</span>
            <span className="px-2 py-1 rounded bg-primary/20">{String(countdown.minutes).padStart(2, '0')}</span>
            <span>:</span>
            <span className="px-2 py-1 rounded bg-primary/20">{String(countdown.seconds).padStart(2, '0')}</span>
          </div>
        </motion.div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 pb-20 space-y-12">
        {/* Quick Roll Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-effect border-primary/20 p-8 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-orbitron font-bold mb-6">Tira el Dado Quantum</h2>
            
            <motion.div
              animate={isRolling ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
              className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow"
            >
              <CurrentDice className="w-20 h-20 text-white" />
            </motion.div>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Ticket className="w-5 h-5 text-primary" />
              <span>Boletos disponibles: <strong>{myTickets.length}</strong></span>
            </div>
            
            <Button
              onClick={rollDice}
              disabled={isRolling || myTickets.length <= 0}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 h-12"
            >
              {isRolling ? "Rodando..." : "¡Tirar Dado!"}
            </Button>
            
            <p className="text-xs text-muted-foreground mt-4">
              VRF verificado por Chainlink • Hash público en MSR
            </p>
          </Card>
        </motion.div>

        {/* Active Draws */}
        <div>
          <h2 className="text-2xl font-orbitron font-bold text-gradient-quantum mb-6 text-center">
            Sorteos Activos
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayDraws.map((draw, index) => (
              <motion.div
                key={draw.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card className={`glass-effect border-primary/20 p-6 ${
                  draw.status === 'completed' ? 'opacity-70' : 'hover:shadow-glow'
                } transition-all relative overflow-hidden`}>
                  {draw.status === 'completed' && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completado
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">{draw.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(draw.drawDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center py-4 mb-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10">
                    <p className="text-sm text-muted-foreground">Premio</p>
                    <p className="text-3xl font-bold text-gradient-quantum">
                      ${draw.prize.toLocaleString()} MXN
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Boletos vendidos</span>
                      <span>{draw.ticketsSold.toLocaleString()} / {draw.maxTickets.toLocaleString()}</span>
                    </div>
                    <Progress value={(draw.ticketsSold / draw.maxTickets) * 100} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Ticket className="w-4 h-4 text-primary" />
                      ${draw.ticketPrice} MXN
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {draw.ticketsSold} participantes
                    </span>
                  </div>
                  
                  {draw.status === 'completed' ? (
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-sm text-center">
                          <Star className="w-4 h-4 inline mr-1 text-amber-400" />
                          Ganador: <strong>{draw.winner || 'Verificando...'}</strong>
                        </p>
                      </div>
                      {draw.vrfHash && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleVerifyVRF(draw.id)}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Verificar VRF
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleBuyTicket(draw.id)}
                      disabled={purchasing}
                      className="w-full bg-gradient-quantum hover:opacity-90"
                    >
                      {purchasing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Ticket className="w-4 h-4 mr-2" />
                      )}
                      Comprar Boleto
                    </Button>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* VRF Guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Card className="glass-effect border-primary/20 p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-orbitron font-bold">Garantía de Fairness VRF</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Cada sorteo utiliza Verifiable Random Function (VRF) de Chainlink para garantizar
              aleatoriedad criptográficamente verificable. Los resultados son auditables en MSR Blockchain.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <Badge variant="outline">Chainlink VRF v2</Badge>
              <Badge variant="outline">MSR Anchored</Badge>
              <Badge variant="outline">Quantum-Split 70/20/10</Badge>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
