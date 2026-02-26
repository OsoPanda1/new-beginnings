import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet as WalletIcon, CreditCard, TrendingUp, Send, Download, Zap, Shield } from "lucide-react";
// Button used in Card actions
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ImmersiveBackground from "@/components/ImmersiveBackground";
import walletHero from "@/assets/wallet-hero.jpg";

export default function Wallet() {
  const [balance] = useState(2547.89);
  const [cards] = useState([
    { id: 1, name: "TAMV Quantum Card", balance: 1234.56, type: "virtual", color: "from-primary via-accent to-secondary" },
    { id: 2, name: "Premium Elite", balance: 5678.90, type: "physical", color: "from-energy via-resonance to-calm" },
  ]);

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
          <img src={walletHero} alt="Wallet Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-gradient-quantum flex items-center justify-center mb-6 shadow-glow"
          >
            <WalletIcon className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-orbitron font-bold text-gradient-quantum mb-4"
          >
            Cattleya Wallet
          </motion.h1>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8"
          >
            Tu economía quantum. Segura, instantánea, global.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-bold text-gradient-quantum"
          >
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </motion.div>
          <p className="text-sm text-muted-foreground mt-2">Balance Total</p>
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 space-y-12">
        {/* Quick Actions */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Send, label: "Enviar", color: "primary" },
            { icon: Download, label: "Recibir", color: "accent" },
            { icon: TrendingUp, label: "Invertir", color: "energy" },
            { icon: Shield, label: "Seguridad", color: "resonance" },
          ].map((action) => (
            <motion.div
              key={action.label}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="p-6 glass-effect border-primary/20 cursor-pointer hover:shadow-glow transition-all">
                <action.icon className={`w-8 h-8 mb-3 text-${action.color}`} />
                <p className="font-medium">{action.label}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Cards Gallery */}
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-gradient-quantum mb-6">Tus Tarjetas Quantum</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className="relative"
              >
                <Card className={`p-8 glass-effect border-primary/30 overflow-hidden relative h-56`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-20`} />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <CreditCard className="w-12 h-12 text-primary" />
                      <Badge className="bg-gradient-quantum">
                        {card.type === "virtual" ? "Virtual" : "Física"}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{card.name}</p>
                      <p className="text-3xl font-bold text-gradient-quantum">
                        ${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-primary/50" />
                        ))}
                        <span className="ml-2 text-sm">8742</span>
                      </div>
                      <Zap className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-gradient-quantum mb-6">Transacciones Recientes</h2>
          <Card className="glass-effect border-primary/20">
            {[
              { id: 1, type: "Recibido", amount: 150.00, from: "María G.", time: "Hace 2 horas" },
              { id: 2, type: "Enviado", amount: -45.50, from: "DreamSpace Premium", time: "Hace 5 horas" },
              { id: 3, type: "Recibido", amount: 320.00, from: "Carlos R.", time: "Ayer" },
            ].map((transaction, i) => (
              <motion.div
                key={transaction.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="p-4 border-b border-primary/10 last:border-b-0 hover:bg-primary/5 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{transaction.type}</p>
                    <p className="text-sm text-muted-foreground">{transaction.from}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${transaction.amount > 0 ? 'text-resonance' : 'text-muted-foreground'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">{transaction.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
