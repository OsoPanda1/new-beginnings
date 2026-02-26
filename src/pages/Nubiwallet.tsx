import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, Send, Download, ArrowRightLeft, Shield, Lock,
  History, AlertCircle,
  CheckCircle2, Clock, Zap, QrCode, Copy, ExternalLink, Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNubiwallet } from "@/hooks/useNubiwallet";

export default function Nubiwallet() {
  const { wallet, transactions, loading, sending, sendFunds, swapCurrency } = useNubiwallet();
  const [sendAmount, setSendAmount] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [swapFromAmount, setSwapFromAmount] = useState("");
  const [swapFrom, setSwapFrom] = useState<'MXN' | 'TAMV' | 'USD'>('MXN');
  const [swapTo, setSwapTo] = useState<'MXN' | 'TAMV' | 'USD'>('TAMV');

  // Exchange rates
  const rates: Record<string, Record<string, number>> = {
    MXN: { TAMV: 0.5, USD: 0.058 },
    TAMV: { MXN: 2, USD: 0.116 },
    USD: { MXN: 17.2, TAMV: 8.6 }
  };

  const balance = wallet ? {
    mxn: wallet.balance_mxn,
    tamv: wallet.balance_tamv,
    usd: wallet.balance_usd
  } : {
    mxn: 45678.90,
    tamv: 12500,
    usd: 2345.67
  };

  const displayTransactions = transactions.length > 0 ? transactions.map(tx => ({
    id: tx.id,
    type: tx.transaction_type as "send" | "receive" | "swap" | "reward",
    amount: tx.amount,
    currency: tx.currency,
    counterparty: tx.counterparty || 'Desconocido',
    timestamp: tx.created_at,
    status: tx.status as "completed" | "pending" | "failed",
    hash: tx.msr_hash
  })) : [
    {
      id: "demo-001",
      type: "receive" as const,
      amount: 5000,
      currency: "MXN",
      counterparty: "Lotería TAMV",
      timestamp: "2025-12-28T10:30:00Z",
      status: "completed" as const,
      hash: "0x7f83b1657ff1fc53b92dc18148a1d65d"
    },
    {
      id: "demo-002",
      type: "send" as const,
      amount: 1500,
      currency: "MXN",
      counterparty: "DreamSpace Premium",
      timestamp: "2025-12-27T14:15:00Z",
      status: "completed" as const,
      hash: "0x3b8a2c1e9d7f6a5b4c3d2e1f0a9b8c7d"
    },
    {
      id: "demo-003",
      type: "swap" as const,
      amount: 10000,
      currency: "TAMV",
      counterparty: "Exchange MXN→TAMV",
      timestamp: "2025-12-26T09:45:00Z",
      status: "completed" as const,
      hash: "0x9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f"
    },
    {
      id: "demo-004",
      type: "reward" as const,
      amount: 500,
      currency: "TAMV",
      counterparty: "Referido: @usuario123",
      timestamp: "2025-12-25T16:20:00Z",
      status: "completed" as const
    }
  ];

  const handleSend = async () => {
    if (!sendAmount || !sendAddress) {
      toast.error("Completa todos los campos");
      return;
    }
    
    const success = await sendFunds(Number(sendAmount), 'MXN', sendAddress);
    if (success) {
      setSendAmount("");
      setSendAddress("");
    }
  };

  const handleSwap = async () => {
    if (!swapFromAmount) {
      toast.error("Ingresa una cantidad");
      return;
    }
    await swapCurrency(swapFrom, swapTo, Number(swapFromAmount));
    setSwapFromAmount("");
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send": return Send;
      case "receive": return Download;
      case "swap": return ArrowRightLeft;
      case "reward": return Zap;
      default: return Wallet;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "send": return "text-red-400";
      case "receive": return "text-emerald-400";
      case "swap": return "text-blue-400";
      case "reward": return "text-amber-400";
      default: return "text-muted-foreground";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-12 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-glow"
            >
              <Wallet className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-orbitron font-bold text-gradient-quantum">Nubiwallet</h1>
              <p className="text-muted-foreground">Ledger de doble entrada • Economía TAMV</p>
            </div>
            {wallet?.is_verified && (
              <Badge className="ml-auto bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verificada
              </Badge>
            )}
          </div>

          {/* Balance Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { currency: "MXN", amount: balance.mxn, icon: "🇲🇽", color: "from-emerald-500 to-green-600" },
              { currency: "TAMV Credits", amount: balance.tamv, icon: "⚡", color: "from-primary to-accent" },
              { currency: "USD", amount: balance.usd, icon: "🇺🇸", color: "from-blue-500 to-cyan-500" }
            ].map((item, index) => (
              <motion.div
                key={item.currency}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect border-primary/20 p-6 hover:shadow-glow transition-all relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl">{item.icon}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.currency}
                      </Badge>
                    </div>
                    <p className="text-3xl font-bold">
                      {item.currency === "TAMV Credits" 
                        ? item.amount.toLocaleString()
                        : `$${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      }
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Balance disponible</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <Tabs defaultValue="send" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4 glass-effect">
            <TabsTrigger value="send"><Send className="w-4 h-4" /></TabsTrigger>
            <TabsTrigger value="receive"><Download className="w-4 h-4" /></TabsTrigger>
            <TabsTrigger value="swap"><ArrowRightLeft className="w-4 h-4" /></TabsTrigger>
            <TabsTrigger value="history"><History className="w-4 h-4" /></TabsTrigger>
          </TabsList>

          {/* Send Tab */}
          <TabsContent value="send">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-effect border-primary/20 p-6">
                <h2 className="text-xl font-orbitron font-bold mb-6 flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Enviar Fondos
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Cantidad</label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        placeholder="0.00"
                        className="glass-effect border-primary/30 text-2xl h-14 pr-16"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        MXN
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Dirección o Usuario</label>
                    <Input
                      value={sendAddress}
                      onChange={(e) => setSendAddress(e.target.value)}
                      placeholder="@usuario o 0x..."
                      className="glass-effect border-primary/30"
                    />
                  </div>
                  
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-amber-400">Verifica la dirección antes de enviar</span>
                  </div>
                  
                  <Button
                    onClick={handleSend}
                    disabled={sending}
                    className="w-full bg-gradient-quantum hover:opacity-90 h-12"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              <Card className="glass-effect border-primary/20 p-6">
                <h3 className="text-lg font-bold mb-4">Características de Seguridad</h3>
                <div className="space-y-3">
                  {[
                    { icon: Shield, text: "Cifrado post-cuántico (Dilithium-5)" },
                    { icon: Lock, text: "Doble firma para transacciones mayores" },
                    { icon: CheckCircle2, text: "Verificación en MSR Blockchain" },
                    { icon: Clock, text: "Límites diarios configurables" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
                      <item.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Receive Tab */}
          <TabsContent value="receive">
            <Card className="glass-effect border-primary/20 p-8 max-w-md mx-auto text-center">
              <div className="w-48 h-48 mx-auto mb-6 rounded-xl bg-white p-4 flex items-center justify-center">
                <QrCode className="w-full h-full text-background" />
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">Tu dirección Nubiwallet</p>
              
              <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 font-mono text-sm">
                <span className="flex-1 truncate">
                  {wallet?.wallet_address || "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(wallet?.wallet_address || "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Swap Tab */}
          <TabsContent value="swap">
            <Card className="glass-effect border-primary/20 p-6 max-w-md mx-auto">
              <h2 className="text-xl font-orbitron font-bold mb-6 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-primary" />
                Intercambiar
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-background/50">
                  <label className="text-sm text-muted-foreground">De</label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input 
                      placeholder="0.00" 
                      className="flex-1 text-xl" 
                      value={swapFromAmount}
                      onChange={(e) => setSwapFromAmount(e.target.value)}
                      type="number"
                    />
                    <select 
                      value={swapFrom}
                      onChange={(e) => setSwapFrom(e.target.value as 'MXN' | 'TAMV' | 'USD')}
                      className="bg-primary/20 rounded px-3 py-2 text-sm"
                    >
                      <option value="MXN">MXN</option>
                      <option value="TAMV">TAMV</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-primary/20"
                    onClick={() => {
                      setSwapFrom(swapTo);
                      setSwapTo(swapFrom);
                    }}
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="p-4 rounded-lg bg-background/50">
                  <label className="text-sm text-muted-foreground">A</label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input 
                      placeholder="0.00" 
                      className="flex-1 text-xl" 
                      readOnly 
                      value={swapFromAmount && swapFrom !== swapTo 
                        ? (Number(swapFromAmount) * (rates[swapFrom][swapTo] || 1)).toFixed(2)
                        : ""
                      }
                    />
                    <select 
                      value={swapTo}
                      onChange={(e) => setSwapTo(e.target.value as 'MXN' | 'TAMV' | 'USD')}
                      className="bg-primary/20 rounded px-3 py-2 text-sm"
                    >
                      <option value="MXN">MXN</option>
                      <option value="TAMV">TAMV</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  1 {swapFrom} = {rates[swapFrom][swapTo] || 1} {swapTo}
                </div>
                
                <Button 
                  className="w-full bg-gradient-quantum"
                  onClick={handleSwap}
                  disabled={!swapFromAmount || swapFrom === swapTo}
                >
                  Confirmar Intercambio
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <div className="space-y-4">
              <AnimatePresence>
                {displayTransactions.map((tx, index) => {
                  const Icon = getTransactionIcon(tx.type);
                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass-effect border-primary/20 p-4 hover:shadow-glow transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tx.type === 'receive' || tx.type === 'reward' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                          }`}>
                            <Icon className={`w-5 h-5 ${getTransactionColor(tx.type)}`} />
                          </div>
                          
                          <div className="flex-1">
                            <p className="font-medium">{tx.counterparty}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(tx.timestamp).toLocaleString()}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className={`font-bold ${getTransactionColor(tx.type)}`}>
                              {tx.type === 'send' ? '-' : '+'}
                              {tx.amount.toLocaleString()} {tx.currency}
                            </p>
                            {tx.hash && (
                              <button 
                                onClick={() => copyToClipboard(tx.hash!)}
                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Ver en MSR
                              </button>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
