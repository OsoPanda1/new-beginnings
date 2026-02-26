/**
 * 🔨 Auctions Page - TAMV MD-X4™
 * Real-time bidding with BookPI evidence
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gavel, Clock, TrendingUp, Users, Flame, Eye, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import galleryHero from "@/assets/gallery-hero.jpg";

interface Auction {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  startPrice: number;
  bidders: number;
  endTime: Date;
  seller: string;
  category: string;
  hot: boolean;
}

const mockAuctions: Auction[] = [
  { id: "1", title: "Avatar Holográfico Edición Limitada", image: "/placeholder.svg", currentBid: 2500, startPrice: 500, bidders: 12, endTime: new Date(Date.now() + 3600000 * 5), seller: "ArtistXR", category: "Avatares", hot: true },
  { id: "2", title: "DreamSpace Galaxia Exclusivo", image: "/placeholder.svg", currentBid: 15000, startPrice: 5000, bidders: 8, endTime: new Date(Date.now() + 3600000 * 12), seller: "DreamArchitect", category: "Spaces", hot: true },
  { id: "3", title: "Pack Musical KAOS Premium", image: "/placeholder.svg", currentBid: 800, startPrice: 200, bidders: 22, endTime: new Date(Date.now() + 3600000 * 2), seller: "DJ_Nebula", category: "Audio", hot: false },
  { id: "4", title: "Skin Mascota Legendaria", image: "/placeholder.svg", currentBid: 3200, startPrice: 1000, bidders: 15, endTime: new Date(Date.now() + 3600000 * 8), seller: "PetDesigner", category: "Mascotas", hot: false },
];

function CountdownTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = endTime.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Finalizada"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);
  return <span className="font-mono text-accent">{timeLeft}</span>;
}

export default function Auctions() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = ["all", "Avatares", "Spaces", "Audio", "Mascotas", "Arte"];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[300px] overflow-hidden">
        <img src={galleryHero} alt="Subastas" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-destructive to-primary">
              <Gavel className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-foreground">Subastas TAMV</h1>
              <p className="text-muted-foreground">Pujas en tiempo real con evidencia BookPI™ inmutable</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button key={cat} variant={selectedCategory === cat ? "default" : "outline"} size="sm"
              className={selectedCategory === cat ? "bg-gradient-quantum text-white" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "all" ? "Todas" : cat}
            </Button>
          ))}
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAuctions.filter(a => selectedCategory === "all" || a.category === selectedCategory).map((auction, i) => (
            <motion.div key={auction.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass-effect overflow-hidden hover:border-accent/50 transition-all group cursor-pointer">
                {/* Image */}
                <div className="relative aspect-video bg-card">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Gavel className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                  {auction.hot && (
                    <Badge className="absolute top-3 left-3 bg-destructive text-white"><Flame className="w-3 h-3 mr-1" />HOT</Badge>
                  )}
                  <Badge className="absolute top-3 right-3 backdrop-blur bg-background/50">{auction.category}</Badge>
                </div>
                
                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-orbitron font-bold text-foreground group-hover:text-accent transition-colors">{auction.title}</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Puja actual</p>
                      <p className="text-2xl font-orbitron font-bold text-accent">{auction.currentBid.toLocaleString()} <span className="text-sm">TAMV</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Termina en</p>
                      <CountdownTimer endTime={auction.endTime} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6"><AvatarFallback className="text-xs bg-primary">{auction.seller[0]}</AvatarFallback></Avatar>
                      <span>{auction.seller}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{auction.bidders} pujas</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-quantum text-white font-orbitron">
                    Pujar <TrendingUp className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
