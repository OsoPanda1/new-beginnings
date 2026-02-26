import { motion } from "framer-motion";
import { Users, Link2, Copy, TrendingUp, Zap, Crown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const referralTiers = [
  { level: 1, required: 0, bonus: "5%", perks: ["Basic rewards"] },
  { level: 2, required: 5, bonus: "10%", perks: ["Priority support", "Exclusive badge"] },
  { level: 3, required: 25, bonus: "15%", perks: ["VIP events", "Monthly bonus"] },
  { level: 4, required: 100, bonus: "25%", perks: ["Celestial status", "Revenue share"] },
];

const topReferrers = [
  { rank: 1, user: "@quantum_master", referrals: 847, earnings: "125,000" },
  { rank: 2, user: "@dream_creator", referrals: 632, earnings: "98,500" },
  { rank: 3, user: "@neon_pioneer", referrals: 521, earnings: "78,200" },
];

const recentReferrals = [
  { user: "@new_dreamer", status: "active", earnings: "+150", date: "Today" },
  { user: "@creative_soul", status: "active", earnings: "+150", date: "Yesterday" },
  { user: "@future_builder", status: "pending", earnings: "Pending", date: "2 days ago" },
];

export default function Referrals() {
  const referralLink = "https://tamv.online/ref/anubis-celestial";
  const currentReferrals = 12;
  const currentLevel = 2;
  const nextLevelRequired = 25;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Link copiado al portapapeles");
  };

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
            className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-accent via-primary to-secondary flex items-center justify-center"
            animate={{ 
              boxShadow: [
                "0 0 30px rgba(0,188,212,0.5)",
                "0 0 60px rgba(156,39,176,0.5)",
                "0 0 30px rgba(0,188,212,0.5)",
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Users className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="font-orbitron text-4xl font-bold text-gradient-quantum">
            Programa de Referidos
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Invita amigos al ecosistema TAMV y gana recompensas por cada uno que se una
          </p>
        </motion.div>

        {/* Referral Link Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="crystal-glass overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10" />
            <CardContent className="relative p-6 space-y-4">
              <div className="flex items-center gap-2 text-accent">
                <Link2 className="w-5 h-5" />
                <span className="font-semibold">Tu Link de Referido</span>
              </div>
              <div className="flex gap-2">
                <Input 
                  value={referralLink} 
                  readOnly 
                  className="bg-background/50 font-mono text-sm"
                />
                <Button onClick={copyLink} className="shrink-0">
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  Compartir en Twitter
                </Button>
                <Button variant="outline" size="sm">
                  Compartir en Discord
                </Button>
                <Button variant="outline" size="sm">
                  Generar QR
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="crystal-glass h-full">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-accent" />
                <div className="text-3xl font-orbitron font-bold text-gradient-quantum">{currentReferrals}</div>
                <p className="text-muted-foreground">Referidos Totales</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="crystal-glass h-full">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-3xl font-orbitron font-bold text-gradient-quantum">4,850</div>
                <p className="text-muted-foreground">Credits Ganados</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="crystal-glass h-full">
              <CardContent className="p-6 text-center">
                <Crown className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-3xl font-orbitron font-bold">Nivel {currentLevel}</div>
                <p className="text-muted-foreground">Ambassador</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="crystal-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Progreso de Nivel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Nivel {currentLevel} → Nivel {currentLevel + 1}</span>
                <span className="text-muted-foreground">{currentReferrals}/{nextLevelRequired} referidos</span>
              </div>
              <Progress value={(currentReferrals / nextLevelRequired) * 100} className="h-3" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {referralTiers.map((tier) => (
                  <div 
                    key={tier.level}
                    className={`p-4 rounded-xl border ${
                      currentLevel >= tier.level 
                        ? "border-accent bg-accent/10" 
                        : "border-border/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {currentLevel >= tier.level && <CheckCircle className="w-4 h-4 text-green-500" />}
                      <span className="font-semibold">Nivel {tier.level}</span>
                    </div>
                    <div className="text-2xl font-bold text-accent mb-1">{tier.bonus}</div>
                    <p className="text-xs text-muted-foreground">{tier.required}+ referidos</p>
                    <ul className="mt-2 space-y-1">
                      {tier.perks.map((perk, i) => (
                        <li key={i} className="text-xs text-muted-foreground">• {perk}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="crystal-glass h-full">
              <CardHeader>
                <CardTitle>Referidos Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReferrals.map((ref, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold">
                          {ref.user[1].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{ref.user}</p>
                          <p className="text-xs text-muted-foreground">{ref.date}</p>
                        </div>
                      </div>
                      <Badge variant={ref.status === "active" ? "default" : "secondary"}>
                        {ref.earnings}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="crystal-glass h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Top Referidores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topReferrers.map((ref) => (
                    <div key={ref.rank} className="flex items-center justify-between p-3 rounded-lg bg-accent/5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          ref.rank === 1 ? "bg-yellow-500 text-black" :
                          ref.rank === 2 ? "bg-gray-400 text-black" :
                          "bg-orange-600 text-white"
                        }`}>
                          {ref.rank}
                        </div>
                        <div>
                          <p className="font-medium">{ref.user}</p>
                          <p className="text-xs text-muted-foreground">{ref.referrals} referidos</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-accent">{ref.earnings}</p>
                        <p className="text-xs text-muted-foreground">credits</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
