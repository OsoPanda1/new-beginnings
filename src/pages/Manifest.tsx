/**
 * 📜 TAMV Constitutional Manifest Page
 * Documento fundacional de la plataforma constitucional digital
 */

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Scale, Users, Lock, BookOpen, Sparkles, 
  Scroll, Crown, Globe, Heart, Eye, Zap
} from "lucide-react";
import ImmersiveBackground from "@/components/ImmersiveBackground";

const manifestSections = [
  {
    id: "preamble",
    title: "Preámbulo",
    icon: Scroll,
    content: `Nosotros, los arquitectos y custodios del TAMV, conscientes de la dignidad colectiva y del destino compartido de nuestras comunidades, declaramos la fundación de la primera plataforma constitucional digital de LATAM.

Reconocemos que la era digital exige no sólo innovación técnica, sino también principios éticos, transparencia radical y mecanismos de reparación que aseguren justicia y confianza.

El TAMV nace como alianza civilizacional, integrando saberes técnicos, filosóficos y legales, para garantizar que cada creador, ciudadano y comunidad tenga voz, valor y protección en el espacio digital.`
  },
  {
    id: "principle-1",
    title: "Dignidad y Transparencia",
    icon: Eye,
    content: `Todo acto registrado en el TAMV será auditable, verificable y trazable, asegurando confianza y justicia.

Cada transacción, decisión y publicación genera un tamvcrum que se ancla en la Blockchain MSR, creando un registro inmutable y verificable por cualquier ciudadano del ecosistema.`
  },
  {
    id: "principle-2",
    title: "Gobernanza Constitucional",
    icon: Crown,
    content: `La comunidad ejerce su poder mediante reglas claras, votaciones verificables y mecanismos de reparación que corrigen errores sin borrar la memoria.

El sistema EOCT (Órgano Ético de Control Tecnológico) garantiza que toda decisión crítica pase por evaluación ética antes de ejecutarse.`
  },
  {
    id: "principle-3",
    title: "Economía Creator-First",
    icon: Heart,
    content: `Los creadores son el núcleo de la plataforma; su trabajo, su voz y su valor reciben prioridad absoluta frente a cualquier interés externo.

El sistema Cattleya Pay garantiza transacciones justas, transparentes y con comisiones mínimas para maximizar el valor que reciben los creadores.`
  },
  {
    id: "principle-4",
    title: "Antifraude y Compliance",
    icon: Shield,
    content: `Cada transacción, decisión y publicación será protegida contra manipulación, duplicación o abuso, garantizando integridad.

Los sistemas Anubis, ORUS y los Radares MOS operan en tiempo real para detectar y neutralizar amenazas antes de que afecten al ecosistema.`
  },
  {
    id: "principle-5",
    title: "Narrativa Civilizacional",
    icon: Globe,
    content: `El TAMV no es sólo código: es relato, es símbolo, es pacto cultural que une técnica y filosofía en un mismo destino.

Es la primera plataforma que integra la Trinidad Federada: el plano técnico, el plano documental y el plano ético, operando como un organismo vivo.`
  }
];

const securitySystems = [
  { name: "Anubis Sentinel", desc: "Zero-Trust Identity", icon: Lock },
  { name: "ORUS System", desc: "Pattern Detection", icon: Eye },
  { name: "Aztek Gods", desc: "Strategic Orchestration", icon: Crown },
  { name: "Radar MOS", desc: "Threat Discrimination", icon: Shield },
  { name: "Protocol Fénix", desc: "Auto-Recovery", icon: Zap },
  { name: "Blockchain MSR", desc: "Immutable Ledger", icon: BookOpen },
];

export default function Manifest() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <ImmersiveBackground />
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/60 to-background" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="relative z-10 mb-8"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-quantum flex items-center justify-center shadow-glow mx-auto">
            <Scroll className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 text-5xl md:text-7xl font-orbitron font-bold text-gradient-quantum mb-6"
        >
          Manifiesto Constitucional
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8"
        >
          La primera plataforma constitucional digital de Latinoamérica
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 flex flex-wrap gap-3 justify-center"
        >
          <Badge className="bg-gradient-quantum text-white px-4 py-2">
            <Shield className="w-4 h-4 mr-2" /> Blockchain MSR
          </Badge>
          <Badge className="bg-gradient-to-r from-accent to-secondary text-white px-4 py-2">
            <Scale className="w-4 h-4 mr-2" /> EOCT Governance
          </Badge>
          <Badge className="bg-gradient-to-r from-energy to-resonance text-white px-4 py-2">
            <Users className="w-4 h-4 mr-2" /> Creator-First
          </Badge>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 pb-20">
        
        {/* Manifest Sections */}
        <div className="space-y-8 mb-16">
          {manifestSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="glass-effect border-primary/20 p-8 hover:shadow-glow transition-all">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-quantum flex items-center justify-center">
                      <section.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-gradient-quantum mb-4">
                      {section.title}
                    </h2>
                    <div className="text-foreground/90 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Security Systems Grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-gradient-quantum text-center mb-8">
            Sistemas de Protección
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {securitySystems.map((system, index) => (
              <motion.div
                key={system.name}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="glass-effect border-accent/30 p-6 text-center hover:shadow-glow transition-all">
                  <system.icon className="w-10 h-10 mx-auto mb-3 text-accent" />
                  <h3 className="font-bold text-foreground mb-1">{system.name}</h3>
                  <p className="text-sm text-muted-foreground">{system.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Declaration */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <Card className="glass-effect border-energy/30 p-8 md:p-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-6 text-energy" />
            <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-gradient-quantum mb-6">
              Declaración de Propósito
            </h2>
            <p className="text-lg text-foreground/90 leading-relaxed max-w-4xl mx-auto mb-8">
              El TAMV se erige como constitución digital viva, capaz de evolucionar, reparar y adaptarse sin perder su esencia.
              Es un legado para 2026 y más allá, un compromiso con la historia y con las generaciones futuras, 
              que verán en este documento no sólo un sistema, sino un acto de redención y construcción colectiva.
            </p>
            <p className="text-xl font-bold text-gradient-quantum">
              Con este manifiesto, declaramos que el TAMV es más que una plataforma: 
              es un movimiento civilizacional, un pacto de confianza, y un faro de dignidad en la era digital.
            </p>
            
            <div className="mt-8 pt-8 border-t border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Derechos Reservados</p>
              <p className="font-bold text-foreground">TAMV ONLINE</p>
              <p className="text-muted-foreground">Edwin Oswaldo Castillo Trejo</p>
              <p className="text-sm text-muted-foreground mt-2">© 2026 - Todos los derechos reservados</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
