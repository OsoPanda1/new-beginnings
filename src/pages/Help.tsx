import { motion } from "framer-motion";
import { 
  HelpCircle, Search, Book, MessageCircle, Video, FileText,
  Zap, Shield, Wallet, Sparkles, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const categories = [
  { id: "getting-started", label: "Primeros Pasos", icon: Zap, color: "text-yellow-500" },
  { id: "dreamspaces", label: "DreamSpaces", icon: Sparkles, color: "text-purple-500" },
  { id: "wallet", label: "Wallet & Credits", icon: Wallet, color: "text-green-500" },
  { id: "security", label: "Seguridad", icon: Shield, color: "text-red-500" },
  { id: "social", label: "Social", icon: Users, color: "text-blue-500" },
];

const faqs = [
  {
    question: "¿Cómo empiezo a usar TAMV?",
    answer: "Bienvenido a TAMV MD-X4™. Para comenzar, crea tu cuenta, personaliza tu perfil y explora los DreamSpaces disponibles. Isabella AI te guiará en tu primera experiencia.",
    category: "getting-started"
  },
  {
    question: "¿Qué son los DreamSpaces?",
    answer: "Los DreamSpaces son espacios 3D/4D inmersivos donde puedes crear, explorar y compartir experiencias sensoriales únicas con otros usuarios del metaverso.",
    category: "dreamspaces"
  },
  {
    question: "¿Cómo gano Credits?",
    answer: "Puedes ganar Credits de múltiples formas: creando contenido popular, participando en eventos, completando misiones diarias, referidos, y vendiendo assets en el Marketplace.",
    category: "wallet"
  },
  {
    question: "¿Cómo protege TAMV mis datos?",
    answer: "TAMV utiliza Anubis Sentinel, un sistema de seguridad de 11 capas con cifrado cuántico, ZKPs para privacidad, y auditorías constantes para proteger tu información.",
    category: "security"
  },
  {
    question: "¿Puedo monetizar mi contenido?",
    answer: "Sí, TAMV ofrece múltiples vías de monetización: venta directa, suscripciones, propinas durante lives, NFTs, y participación en el programa de creadores.",
    category: "wallet"
  },
  {
    question: "¿Qué es Isabella AI?",
    answer: "Isabella AI es tu asistente personal inteligente integrada en TAMV. Te ayuda a navegar, crear contenido, y optimizar tu experiencia en el ecosistema.",
    category: "getting-started"
  },
  {
    question: "¿Cómo creo un DreamSpace?",
    answer: "Ve a la sección DreamSpaces, selecciona 'Crear Nuevo', elige una plantilla o empieza desde cero, y usa el editor 3D para personalizar tu espacio.",
    category: "dreamspaces"
  },
  {
    question: "¿Cómo reporto contenido inapropiado?",
    answer: "Usa el botón de reporte en cualquier contenido. Anubis Sentinel revisará el caso en menos de 24 horas y tomará las medidas necesarias.",
    category: "security"
  },
];

const resources = [
  { title: "Guía de Inicio Rápido", type: "PDF", icon: FileText },
  { title: "Video Tutoriales", type: "Video", icon: Video },
  { title: "Documentación API", type: "Docs", icon: Book },
  { title: "Chat con Soporte", type: "Live", icon: MessageCircle },
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <motion.div
            className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-accent via-primary to-secondary flex items-center justify-center"
            animate={{ 
              boxShadow: [
                "0 0 30px rgba(0,188,212,0.5)",
                "0 0 50px rgba(156,39,176,0.5)",
                "0 0 30px rgba(0,188,212,0.5)",
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <HelpCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="font-orbitron text-4xl font-bold text-gradient-quantum">
            Centro de Ayuda
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Encuentra respuestas, tutoriales y soporte para maximizar tu experiencia en TAMV
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en la ayuda..."
            className="pl-12 h-14 text-lg crystal-glass"
          />
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className="gap-2"
            >
              <cat.icon className={`w-4 h-4 ${selectedCategory === cat.id ? "" : cat.color}`} />
              {cat.label}
            </Button>
          ))}
        </motion.div>

        {/* Quick Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-semibold text-lg mb-4">Recursos Rápidos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {resources.map((resource, index) => (
              <Card 
                key={index} 
                className="crystal-glass cursor-pointer hover:bg-accent/10 transition-colors group"
              >
                <CardContent className="p-4 text-center">
                  <resource.icon className="w-8 h-8 mx-auto mb-2 text-accent group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-sm">{resource.title}</p>
                  <Badge variant="secondary" className="mt-2">{resource.type}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="crystal-glass">
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50">
                    <AccordionTrigger className="text-left hover:no-underline hover:text-accent">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No se encontraron resultados para "{searchQuery}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="crystal-glass bg-gradient-to-br from-accent/10 to-primary/10">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold mb-1">¿No encontraste lo que buscabas?</h3>
                <p className="text-muted-foreground">Contacta a nuestro equipo de soporte o habla con Isabella AI</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat con Soporte
                </Button>
                <Button className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Preguntar a Isabella
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
