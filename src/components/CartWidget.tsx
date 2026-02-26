import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CartWidget() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckout = () => {
    toast.success('Procesando compra con Cattleya Pay™...');
    setTimeout(() => {
      toast.success(`Compra exitosa! ${total()} TAMV Credits debitados`);
      clearCart();
      setIsOpen(false);
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-quantum rounded-full shadow-glow flex items-center justify-center hover:scale-110 transition-transform"
      >
        <ShoppingCart className="w-6 h-6 text-white" />
        {items.length > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-energy text-white">
            {items.length}
          </Badge>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full md:w-[500px] z-50 bg-background border-l border-border shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 className="text-2xl font-orbitron font-bold text-gradient-quantum">
                    Carrito TAMV
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Tu carrito está vacío</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <Card key={item.id} className="glass-effect p-4">
                        <div className="flex gap-4">
                          <div className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-lg flex-shrink-0`} />
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                            <p className="text-lg font-orbitron font-bold text-gradient-gold">
                              {item.price * item.quantity} Credits
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeItem(item.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            
                            <div className="flex items-center gap-2 glass-effect rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>

                {items.length > 0 && (
                  <div className="border-t border-border p-6 space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold">Total:</span>
                      <span className="text-2xl font-orbitron font-bold text-gradient-gold">
                        {total()} Credits
                      </span>
                    </div>
                    
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-quantum hover:shadow-glow h-12 text-lg"
                    >
                      Comprar con Cattleya Pay™
                    </Button>
                    
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      className="w-full border-border"
                    >
                      Vaciar Carrito
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
