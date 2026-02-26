import { motion } from "framer-motion";
import { Gift, Sparkles, Trophy, Zap, Crown, Star, Ticket, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const prizes = [
  { id: 1, name: "1,000,000 Credits", icon: Zap, rarity: "legendary", chance: "0.01%" },
  { id: 2, name: "VIP Celestial Pass", icon: Crown, rarity: "epic", chance: "0.1%" },
  { id: 3, name: "Exclusive DreamSpace", icon: Sparkles, rarity: "rare", chance: "1%" },
  { id: 4, name: "10,000 Credits", icon: Star, rarity: "uncommon", chance: "10%" },
];

const recentWinners = [
  { user: "@quantum_creator", prize: "50,000 Credits", time: "2 min ago" },
  { user: "@dream_weaver", prize: "VIP Pass", time: "15 min ago" },
  { user: "@neon_artist", prize: "100,000 Credits", time: "1 hour ago" },
];

export default function Lottery() {
  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <motion.div
            className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center"
            animate={{ 
              boxShadow: [
                "0 0 30px rgba(234,179,8,0.5)",
                "0 0 60px rgba(234,179,8,0.8)",
                "0 0 30px rgba(234,179,8,0.5)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Gift className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="font-orbitron text-4xl font-bold text-gradient-quantum">
            TAMV Quantum Lottery
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Participa en el sorteo diario y gana premios exclusivos del ecosistema TAMV
          </p>
        </motion.div>

        {/* Main Lottery Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="crystal-glass overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-purple-500/10" />
            <CardHeader className="relative text-center pb-2">
              <CardTitle className="flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-2xl">Jackpot Actual</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="text-center">
                <motion.div
                  className="text-5xl md:text-7xl font-orbitron font-bold text-gradient-quantum"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  2,500,000
                </motion.div>
                <p className="text-muted-foreground flex items-center justify-center gap-1 mt-2">
                  <Zap className="w-4 h-4 text-yellow-500" /> TAMV Credits
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Timer className="w-4 h-4" />
                    <span className="text-sm">Próximo Sorteo</span>
                  </div>
                  <div className="flex gap-2">
                    {["05", "23", "47"].map((time, i) => (
                      <div key={i} className="bg-accent/20 rounded-lg px-3 py-2">
                        <span className="font-mono text-2xl font-bold">{time}</span>
                        <p className="text-[10px] text-muted-foreground">
                          {["hrs", "min", "sec"][i]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-accent" />
                  <span>Tienes <strong className="text-accent">3 tickets</strong> disponibles</span>
                </div>
                <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-8">
                  <Gift className="w-5 h-5 mr-2" />
                  Participar Ahora
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Prizes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {prizes.map((prize, index) => (
            <motion.div
              key={prize.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className={`crystal-glass h-full ${
                prize.rarity === "legendary" ? "border-yellow-500/50" :
                prize.rarity === "epic" ? "border-purple-500/50" :
                prize.rarity === "rare" ? "border-blue-500/50" : "border-green-500/50"
              }`}>
                <CardContent className="p-4 text-center space-y-3">
                  <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                    prize.rarity === "legendary" ? "bg-yellow-500/20 text-yellow-500" :
                    prize.rarity === "epic" ? "bg-purple-500/20 text-purple-500" :
                    prize.rarity === "rare" ? "bg-blue-500/20 text-blue-500" : "bg-green-500/20 text-green-500"
                  }`}>
                    <prize.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{prize.name}</p>
                    <Badge variant="secondary" className="mt-1 capitalize">{prize.rarity}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Probabilidad: {prize.chance}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Winners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="crystal-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Ganadores Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentWinners.map((winner, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold">
                        {winner.user[1].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{winner.user}</p>
                        <p className="text-sm text-muted-foreground">{winner.time}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">
                      {winner.prize}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
