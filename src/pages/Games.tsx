import { motion } from "framer-motion";
import { Gamepad2, Trophy, Zap, Star, Users, Play, Lock, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ImmersiveBackground from "@/components/ImmersiveBackground";
const gamesHero = "/placeholder.svg";

const games = [
  {
    id: 1,
    name: "Quantum Runner",
    description: "Corre a través de dimensiones cuánticas",
    category: "Arcade",
    players: "1,234",
    rating: 4.8,
    premium: false,
    rewards: "100-500 credits"
  },
  {
    id: 2,
    name: "DreamSpace Battle",
    description: "Batallas épicas en espacios oníricos",
    category: "PvP",
    players: "2,567",
    rating: 4.9,
    premium: false,
    rewards: "200-1000 credits"
  },
  {
    id: 3,
    name: "Celestial Poker",
    description: "Poker cuántico con apuestas de credits",
    category: "Casino",
    players: "892",
    rating: 4.7,
    premium: true,
    rewards: "Variable"
  },
  {
    id: 4,
    name: "Matrix Puzzle",
    description: "Resuelve puzzles en la matrix digital",
    category: "Puzzle",
    players: "3,421",
    rating: 4.6,
    premium: false,
    rewards: "50-200 credits"
  },
  {
    id: 5,
    name: "Neon Racing",
    description: "Carreras de alta velocidad en circuitos neón",
    category: "Racing",
    players: "1,876",
    rating: 4.8,
    premium: false,
    rewards: "150-750 credits"
  },
  {
    id: 6,
    name: "TAMV Trivia",
    description: "Demuestra tu conocimiento del ecosistema",
    category: "Trivia",
    players: "4,532",
    rating: 4.5,
    premium: false,
    rewards: "25-100 credits"
  },
];

const leaderboard = [
  { rank: 1, user: "@game_master", score: 1250000, games: 342 },
  { rank: 2, user: "@quantum_player", score: 980000, games: 287 },
  { rank: 3, user: "@dream_gamer", score: 875000, games: 256 },
];

export default function Games() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ImmersiveBackground />
      
      {/* Epic Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[60vh] overflow-hidden"
      >
        <div className="absolute inset-0">
          <img src={gamesHero} alt="TAMV Gaming Hub" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center mb-6"
            animate={{ 
              boxShadow: [
                "0 0 30px rgba(168,85,247,0.5)",
                "0 0 60px rgba(236,72,153,0.5)",
                "0 0 30px rgba(168,85,247,0.5)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Gamepad2 className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-orbitron text-6xl md:text-8xl font-bold text-gradient-quantum mb-4"
          >
            TAMV Gaming Hub
          </motion.h1>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8"
          >
            Juega, compite y gana credits en el arcade más avanzado del metaverso
          </motion.p>
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Ganado", value: "12,450", icon: Zap, color: "text-yellow-500" },
            { label: "Partidas", value: "156", icon: Play, color: "text-green-500" },
            { label: "Victorias", value: "89", icon: Trophy, color: "text-purple-500" },
            { label: "Ranking Global", value: "#247", icon: Star, color: "text-orange-500" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + 0.1 * index }}
            >
              <Card className="glass-effect border-primary/20">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-orbitron font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Games Grid */}
        <div>
          <h2 className="font-orbitron text-2xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            Juegos Disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-effect border-primary/20 overflow-hidden h-full group">
                  <div className="relative h-40 bg-gradient-to-br from-accent/20 via-primary/20 to-secondary/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Gamepad2 className="w-16 h-16 text-accent/50" />
                    </div>
                    {game.premium && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      {game.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{game.name}</h3>
                      <p className="text-sm text-muted-foreground">{game.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{game.players} jugando</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{game.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-muted-foreground">{game.rewards}</span>
                      </div>
                      <Button size="sm" className="group-hover:bg-accent group-hover:text-accent-foreground">
                        {game.premium ? <Lock className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                        Jugar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Leaderboard Global
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((player) => (
                  <div key={player.rank} className="flex items-center justify-between p-4 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        player.rank === 1 ? "bg-yellow-500 text-black" :
                        player.rank === 2 ? "bg-gray-400 text-black" :
                        "bg-orange-600 text-white"
                      }`}>
                        {player.rank}
                      </div>
                      <div>
                        <p className="font-semibold">{player.user}</p>
                        <p className="text-sm text-muted-foreground">{player.games} partidas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-orbitron font-bold text-xl text-gradient-quantum">
                        {player.score.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">puntos</p>
                    </div>
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
