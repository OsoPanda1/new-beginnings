import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingCart, Sparkles, TrendingUp, Star, Filter, 
  CreditCard, Wallet, Crown, Eye,
  Package, Zap, Shield, Plus, Minus, Trash2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

// Products with expanded data
const products = [
  { id: 1, name: "Avatar Quantum Premium", category: "Avatars", price: 500, gradient: "from-primary to-purple-500", rating: 4.8, sales: 234, creator: "@anubis", isAuction: false, isFeatured: true },
  { id: 2, name: "DreamSpace Template Pro", category: "Spaces", price: 1200, gradient: "from-secondary to-cyan-500", rating: 4.9, sales: 189, creator: "@creator_pro", isAuction: false, isFeatured: true },
  { id: 3, name: "Skin Neon Dreams", category: "Skins", price: 300, gradient: "from-accent to-yellow-500", rating: 4.7, sales: 456, creator: "@neon_artist", isAuction: false, isFeatured: false },
  { id: 4, name: "Effect Pack Sensorial", category: "Effects", price: 800, gradient: "from-resonance to-pink-500", rating: 4.6, sales: 123, creator: "@fx_master", isAuction: false, isFeatured: false },
  { id: 5, name: "NFT Dragon Legendario", category: "NFTs", price: 5000, gradient: "from-red-500 to-orange-500", rating: 5.0, sales: 12, creator: "@nft_king", isAuction: true, currentBid: 4800, endsIn: "2h 34m", isFeatured: true },
  { id: 6, name: "Audio Pack Kaos V2", category: "Audio", price: 650, gradient: "from-green-500 to-emerald-500", rating: 4.8, sales: 321, creator: "@kaos_sound", isAuction: false, isFeatured: false },
  { id: 7, name: "Pet Digital Phoenix", category: "Pets", price: 2500, gradient: "from-amber-500 to-red-500", rating: 4.9, sales: 67, creator: "@pet_creator", isAuction: true, currentBid: 2300, endsIn: "5h 12m", isFeatured: true },
  { id: 8, name: "Membresía Celestial", category: "Memberships", price: 9999, gradient: "from-indigo-500 to-purple-500", rating: 5.0, sales: 45, creator: "@tamv_official", isAuction: false, isFeatured: true },
];

const categories = ["All", "Avatars", "Spaces", "Skins", "Effects", "NFTs", "Audio", "Pets", "Memberships"];

// Commission rates from gritalo.docx
const TAMV_COMMISSION = 0.08; // 8% base commission

export default function Marketplace() {
  const { items: cartItems, addItem, removeItem, updateQuantity, clearCart, total } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "popular") return b.sales - a.sales;
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      gradient: product.gradient,
    });
    toast.success(`${product.name} añadido al carrito`);
  };

  // Get total as number
  const cartTotal = total();
  
  const handleCheckout = () => {
    if (!paymentMethod) {
      toast.error("Selecciona un método de pago");
      return;
    }
    
    // Calculate totals with commission
    const commission = cartTotal * TAMV_COMMISSION;
    const finalTotal = cartTotal + commission;

    toast.success(`Procesando pago de ${finalTotal.toLocaleString()} TAMV Credits via ${paymentMethod}`);
    setIsCheckoutOpen(false);
    clearCart();
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 glass-effect rounded-full">
          <ShoppingCart className="w-6 h-6 text-accent animate-pulse" />
          <span className="font-orbitron font-bold text-lg">TAMV Marketplace™</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-gradient-quantum">
          Economía Digital del Metaverso
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Assets 2D/3D/4D, NFTs auditados, avatares, skins, mascotas digitales y experiencias únicas.
          Comisión TAMV: 8% por transacción.
        </p>
      </motion.section>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Productos", value: "2.4K+", icon: Package, color: "text-purple-500" },
          { label: "Creadores", value: "890+", icon: Crown, color: "text-yellow-500" },
          { label: "Ventas", value: "$1.2M", icon: TrendingUp, color: "text-green-500" },
          { label: "NFTs", value: "450+", icon: Sparkles, color: "text-pink-500" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-4 text-center glass-effect">
                <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar productos, creadores, categorías..."
            className="pl-10"
          />
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Más populares</SelectItem>
            <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
            <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
            <SelectItem value="rating">Mejor valorados</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Cart Button */}
        <Button
          variant="outline"
          className="relative"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Carrito
          {cartItemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              {cartItemCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Categories */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? "bg-gradient-quantum" : ""}
            >
              {cat}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Products Grid */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="featured">Destacados</TabsTrigger>
          <TabsTrigger value="auctions">Subastas</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} index={i} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.filter(p => p.isFeatured).map((product, i) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} index={i} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="auctions">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.filter(p => p.isAuction).map((product, i) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} index={i} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Cart Drawer */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Tu Carrito ({cartItemCount})
            </DialogTitle>
          </DialogHeader>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-accent/30">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.price.toLocaleString()} Credits</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button size="icon" variant="ghost" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{cartTotal.toLocaleString()} Credits</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Comisión TAMV (8%)</span>
                  <span>{(cartTotal * TAMV_COMMISSION).toLocaleString()} Credits</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-gradient-quantum">{(cartTotal * (1 + TAMV_COMMISSION)).toLocaleString()} Credits</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-quantum" 
                onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
              >
                Proceder al Checkout
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Checkout
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Método de Pago</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "tamv-credits", label: "TAMV Credits", icon: Zap, color: "from-purple-500 to-pink-500" },
                  { id: "stripe", label: "Stripe", icon: CreditCard, color: "from-indigo-500 to-blue-500" },
                  { id: "mercadopago", label: "MercadoPago", icon: Wallet, color: "from-blue-500 to-cyan-500" },
                  { id: "paypal", label: "PayPal", icon: Shield, color: "from-blue-600 to-blue-400" },
                ].map((method) => {
                  const Icon = method.icon;
                  return (
                    <Card
                      key={method.id}
                      className={`p-4 cursor-pointer transition-all ${
                        paymentMethod === method.id 
                          ? 'ring-2 ring-primary bg-accent/50' 
                          : 'hover:bg-accent/30'
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{method.label}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{cartTotal.toLocaleString()} Credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comisión TAMV (8%)</span>
                <span>{(cartTotal * TAMV_COMMISSION).toLocaleString()} Credits</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-gradient-quantum">{(cartTotal * (1 + TAMV_COMMISSION)).toLocaleString()}</span>
              </div>
            </div>
            
            <Button className="w-full bg-gradient-quantum" onClick={handleCheckout}>
              <Shield className="w-4 h-4 mr-2" />
              Confirmar Pago Seguro
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Transacciones protegidas por Anubis Sentinel™ y cifrado Quantum
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onAddToCart, index }: { product: any; onAddToCart: (p: any) => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden group cursor-pointer">
        <div className={`h-40 bg-gradient-to-br ${product.gradient} relative`}>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-background/80 text-foreground">{product.category}</Badge>
            {product.isFeatured && (
              <Badge className="bg-yellow-500/90 text-white">
                <Crown className="w-3 h-3 mr-1" /> Destacado
              </Badge>
            )}
          </div>
          
          {/* Auction timer */}
          {product.isAuction && (
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-red-500/90 text-white animate-pulse">
                ⏱ {product.endsIn}
              </Badge>
            </div>
          )}
          
          {/* Quick view on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="secondary" size="sm">
              <Eye className="w-4 h-4 mr-1" /> Ver
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
            <p className="text-xs text-muted-foreground">{product.creator}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.sales})</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            {product.isAuction ? (
              <div>
                <p className="text-xs text-muted-foreground">Puja actual</p>
                <p className="font-bold text-accent">{product.currentBid.toLocaleString()} TAMV</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground">Precio</p>
                <p className="font-bold text-primary">{product.price.toLocaleString()} TAMV</p>
              </div>
            )}
            
            <Button 
              size="sm" 
              className="bg-gradient-quantum hover:opacity-90"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              {product.isAuction ? "Pujar" : "Añadir"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
