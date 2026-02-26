/**
 * 🔄 Trueque Page - TAMV MD-X4™
 * P2P barter/exchange system with escrow
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightLeft, Search, Shield, Star, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import marketplaceImg from "@/assets/marketplace-immersive.jpg";

const mockOffers = [
  { id: 1, proposer: "CarlosXR", offering: "Skin Avatar Dragón", requesting: "Track KAOS exclusivo", status: "open", trust: 92, category: "assets" },
  { id: 2, proposer: "MaríaCreator", offering: "Diseño 3D sala", requesting: "500 TAMV Credits", status: "matched", trust: 88, category: "services" },
  { id: 3, proposer: "DreamLab", offering: "Acceso VIP DreamSpace", requesting: "NFT Arte Digital", status: "escrow", trust: 95, category: "experiences" },
  { id: 4, proposer: "AudioFX_Pro", offering: "Pack 20 efectos sonido 4D", requesting: "Membresía Premium 1 mes", status: "completed", trust: 97, category: "assets" },
];

export default function Trueque() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("browse");

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string; icon: any }> = {
      open: { label: "Abierta", color: "bg-blue-500/20 text-blue-400", icon: Clock },
      matched: { label: "Match", color: "bg-green-500/20 text-green-400", icon: CheckCircle },
      escrow: { label: "En Escrow", color: "bg-yellow-500/20 text-yellow-400", icon: Shield },
      completed: { label: "Completado", color: "bg-accent/20 text-accent", icon: CheckCircle },
      disputed: { label: "Disputa", color: "bg-red-500/20 text-red-400", icon: AlertTriangle },
    };
    const s = map[status] || map.open;
    return <Badge className={s.color}><s.icon className="w-3 h-3 mr-1" />{s.label}</Badge>;
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[300px] overflow-hidden">
        <img src={marketplaceImg} alt="Trueque" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-accent to-primary">
              <ArrowRightLeft className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-foreground">Sistema Trueque</h1>
              <p className="text-muted-foreground">Intercambio directo P2P con escrow verificable BookPI™</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar ofertas de trueque..." className="pl-10 glass-effect" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Button className="bg-gradient-quantum text-white">Crear Oferta</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="glass-effect">
            <TabsTrigger value="browse">Explorar</TabsTrigger>
            <TabsTrigger value="my-offers">Mis Ofertas</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-4 mt-4">
            {mockOffers.filter(o => !searchTerm || o.offering.toLowerCase().includes(searchTerm.toLowerCase())).map((offer, i) => (
              <motion.div key={offer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="glass-effect p-6 hover:border-accent/50 transition-all">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2 border-accent/30">
                        <AvatarFallback className="bg-gradient-quantum text-white">{offer.proposer[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{offer.proposer}</span>
                          <Badge variant="outline" className="text-xs"><Star className="w-3 h-3 mr-1 text-yellow-400" />{offer.trust}%</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span className="text-accent font-medium">{offer.offering}</span>
                          <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{offer.requesting}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(offer.status)}
                      {offer.status === "open" && <Button size="sm" className="bg-gradient-quantum text-white">Proponer Match</Button>}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
          
          <TabsContent value="my-offers" className="mt-4">
            <Card className="glass-effect p-12 text-center">
              <ArrowRightLeft className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-orbitron font-bold text-foreground mb-2">Crea tu primera oferta</h3>
              <p className="text-muted-foreground mb-4">Ofrece algo que tengas y pide lo que necesitas</p>
              <Button className="bg-gradient-quantum text-white">Crear Oferta de Trueque</Button>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <Card className="glass-effect p-12 text-center">
              <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-orbitron font-bold text-foreground mb-2">Sin historial aún</h3>
              <p className="text-muted-foreground">Tus intercambios completados aparecerán aquí</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
