import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Gift, TrendingUp, CreditCard, Sparkles } from "lucide-react";

export const CreditsSystem = () => {
  const packages = [
    { amount: 100, price: 5, bonus: 0, popular: false },
    { amount: 500, price: 25, bonus: 50, popular: false },
    { amount: 1000, price: 50, bonus: 150, popular: true },
    { amount: 5000, price: 250, bonus: 1000, popular: false },
  ];

  const transactions = [
    { type: "gift", desc: "Regalo enviado a @quantum_soul", amount: -50, time: "Hace 2h" },
    { type: "earn", desc: "Venta de arte en subasta", amount: +350, time: "Hace 5h" },
    { type: "purchase", desc: "Compra de credits", amount: +1000, time: "Hace 1d" },
    { type: "gift", desc: "Regalo recibido de @neon_dreams", amount: +25, time: "Hace 2d" },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 px-6 py-3 glass-effect rounded-full glow-quantum mb-4">
            <Coins className="w-6 h-6 text-accent-glow animate-pulse" />
            <span className="font-orbitron font-bold text-lg">TAMV Credits™</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-gradient-gold">
            Sistema Económico Emocional
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Créditos internos para regalos, cursos, subastas y economía consciente
          </p>
        </div>

        {/* Balance Card */}
        <Card className="glass-effect p-8 max-w-2xl mx-auto">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Balance Actual</p>
            <p className="text-6xl font-orbitron font-bold text-gradient-gold">
              12,450
            </p>
            <p className="text-sm text-muted-foreground">
              ≈ $435.75 USD de valor • $305.02 USD en ganancias
            </p>
            
            <div className="flex gap-4 justify-center pt-4">
              <Button className="bg-gradient-gold hover:shadow-glow transition-all duration-300">
                <CreditCard className="w-5 h-5 mr-2" />
                Comprar Credits
              </Button>
              <Button variant="outline" className="border-accent hover:border-accent-glow">
                <Gift className="w-5 h-5 mr-2" />
                Enviar Regalo
              </Button>
            </div>
          </div>
        </Card>

        {/* Packages */}
        <div>
          <h2 className="text-2xl font-orbitron font-bold text-gradient-quantum mb-6">
            Paquetes de Credits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, i) => (
              <Card
                key={i}
                className={`
                  glass-effect p-6 hover:shadow-cyber transition-all duration-300 hover:scale-105
                  ${pkg.popular ? "border-2 border-accent glow-quantum" : ""}
                `}
              >
                {pkg.popular && (
                  <div className="bg-gradient-gold text-black text-xs font-orbitron font-bold px-3 py-1 rounded-full inline-block mb-3">
                    MÁS POPULAR
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-4xl font-orbitron font-bold text-gradient-gold">
                      {pkg.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Credits</p>
                    {pkg.bonus > 0 && (
                      <div className="mt-2 text-sm text-accent-glow font-semibold">
                        + {pkg.bonus} Bonus
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-foreground">${pkg.price}</p>
                    <p className="text-xs text-muted-foreground">USD</p>
                  </div>
                  
                  <Button 
                    className={`
                      w-full
                      ${pkg.popular 
                        ? "bg-gradient-gold hover:shadow-glow" 
                        : "bg-gradient-quantum hover:shadow-cyber"
                      }
                    `}
                  >
                    Comprar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 glass-effect p-6">
            <h2 className="text-2xl font-orbitron font-bold text-gradient-quantum mb-6">
              Transacciones Recientes
            </h2>
            
            <div className="space-y-3">
              {transactions.map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-card-glass transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${tx.type === "gift" ? "bg-resonance/20" : tx.type === "earn" ? "bg-accent/20" : "bg-primary/20"}
                    `}>
                      {tx.type === "gift" ? <Gift className="w-5 h-5 text-resonance" /> :
                       tx.type === "earn" ? <TrendingUp className="w-5 h-5 text-accent" /> :
                       <Coins className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium">{tx.desc}</p>
                      <p className="text-sm text-muted-foreground">{tx.time}</p>
                    </div>
                  </div>
                  
                  <p className={`
                    text-lg font-orbitron font-bold
                    ${tx.amount > 0 ? "text-accent-glow" : "text-muted-foreground"}
                  `}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Lottery Info */}
          <Card className="glass-effect p-6">
            <div className="space-y-4">
              <div className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-3 text-accent-glow animate-pulse" />
                <h3 className="text-xl font-orbitron font-bold text-gradient-gold mb-2">
                  Lotería TAMV™
                </h3>
                <p className="text-sm text-muted-foreground">
                  Gana $500 USD cada mes
                </p>
              </div>
              
              <div className="bg-card-glass rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tus oportunidades:</span>
                  <span className="font-bold text-accent-glow">124</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Próximo sorteo:</span>
                  <span className="font-bold">12d 5h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Premio actual:</span>
                  <span className="font-bold text-gradient-gold">$500</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Cada $1 gastado = 20,000 oportunidades
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
