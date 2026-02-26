import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars, Float, MeshDistortMaterial } from "@react-three/drei";
import { 
  Shield, Scale, Eye, Lock, FileText, 
  Globe, Users, Zap, AlertTriangle, CheckCircle, 
  Database, Network, Award, Heart,
  Gavel, Building2, Fingerprint, Atom
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 3D Blockchain Node
function BlockchainNode({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={position}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <MeshDistortMaterial
          color={color}
          distort={0.2}
          speed={2}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

const constitutionalPrinciples = [
  {
    icon: Globe,
    title: "Soberanía Civilizatoria",
    description: "Latinoamérica como epicentro de innovación blockchain, estableciendo precedentes tecnológicos y éticos para el mundo.",
    color: "from-accent to-primary"
  },
  {
    icon: Database,
    title: "Memoria Inalterable pero Reparada",
    description: "Registro histórico inmutable con mecanismos de corrección constitucional para casos excepcionales.",
    color: "from-primary to-secondary"
  },
  {
    icon: Scale,
    title: "Ética Operacional",
    description: "Validación ética descentralizada en cada transacción, garantizando integridad moral del ecosistema.",
    color: "from-secondary to-accent"
  }
];

const rights = [
  { icon: Lock, title: "Derecho a la Privacidad", description: "Garantizado mediante ZKPs y cifrado avanzado post-quantum." },
  { icon: Eye, title: "Obligación de Transparencia", description: "Paneles públicos con métricas de seguridad, ética y economía." },
  { icon: Heart, title: "Derecho a Reparación", description: "Fondos reencaminados en caso de fraude, sin borrar historia." }
];

const certifications = [
  {
    title: "ISO/IEC 19790:2025",
    items: [
      "Requisitos de módulos criptográficos: Roles, servicios, estados, mitigación de ataques",
      "Auto-tests y manejo de claves: Generación segura, rotación, borrado verificado",
      "Auditorías externas: Certificación periódica por entidades acreditadas"
    ]
  },
  {
    title: "Plan FIPS 140-3",
    items: [
      "Módulos certificados: HSM/KMS para validadores y tesorería",
      "Políticas de ciclo de vida: Generación en hardware, rotación programada",
      "Resiliencia operativa: Respuesta ante errores y canales laterales"
    ]
  },
  {
    title: "Cripto-Agilidad PQ",
    items: [
      "Inventario de algoritmos: RSA/ECDSA actuales, Dilithium-like para gobernanza",
      "Roadmap de transición: Fase 0 (doble firma), Fase 1 (PQ en gobernanza), Fase 2 (PQ en validadores)",
      "Métricas: % rutas PQ activas, tiempo de rotación, compatibilidad"
    ]
  }
];

const operationalMatrices = [
  { title: "Infraestructura", items: ["Salud de nodos", "Latencia", "Sincronización"], icon: Network },
  { title: "Contratos", items: ["Auditorías formales", "Fuzzing", "Timelocks"], icon: FileText },
  { title: "Puentes y Oráculos", items: ["MPC", "Feeds redundantes", "Slashing"], icon: Database }
];

const dashboards = [
  {
    title: "Tablero de Seguridad",
    metrics: ["Finalidad efectiva", "Disponibilidad de validadores", "Reorg rate"],
    color: "from-accent to-primary"
  },
  {
    title: "Tablero Ético",
    metrics: ["Incidentes reparados", "MTTR-R", "Transacciones con evidencia ética"],
    color: "from-primary to-secondary"
  },
  {
    title: "Tablero Económico",
    metrics: ["Fee medio", "Slippage/MEV mitigado", "Costo operativo por nodo"],
    color: "from-secondary to-accent"
  }
];

export default function MSRBlockchain() {
  return (
    <div className="min-h-screen relative">
      
      {/* 3D Background */}
      <div className="fixed inset-0 z-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00bcd4" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9c27b0" />
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
          
          {/* Blockchain nodes */}
          <BlockchainNode position={[-4, 2, 0]} color="#00bcd4" />
          <BlockchainNode position={[4, 2, 0]} color="#9c27b0" />
          <BlockchainNode position={[0, -2, 0]} color="#1a237e" />
          <BlockchainNode position={[-3, -1, 2]} color="#00bcd4" />
          <BlockchainNode position={[3, -1, 2]} color="#9c27b0" />
        </Canvas>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(0,188,212,0.3)",
                  "0 0 60px rgba(0,188,212,0.5)",
                  "0 0 20px rgba(0,188,212,0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-background/50 backdrop-blur-xl border border-accent/30"
            >
              <Atom className="w-6 h-6 text-accent animate-spin" style={{ animationDuration: '10s' }} />
              <span className="font-orbitron text-accent">DOCUMENTO CONSTITUCIONAL TÉCNICO-JURÍDICO</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-orbitron font-black text-gradient-quantum">
              TAMV Blockchain MSR
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              El primer protocolo blockchain con gobernanza constitucional, memoria reparable y ética operacional descentralizada.
              Desde Real del Monte, Hidalgo - México.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-accent/20 text-accent border border-accent/30 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" /> Post-Quantum Ready
              </Badge>
              <Badge className="bg-primary/20 text-primary border border-primary/30 px-4 py-2">
                <Gavel className="w-4 h-4 mr-2" /> Constitucional
              </Badge>
              <Badge className="bg-secondary/20 text-secondary border border-secondary/30 px-4 py-2">
                <Building2 className="w-4 h-4 mr-2" /> Soberanía Digital
              </Badge>
            </div>
          </motion.div>

          {/* Constitutional Principles */}
          <section className="space-y-8">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-3xl font-orbitron font-bold text-center"
            >
              <span className="text-gradient-quantum">I. Marco Constitucional</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {constitutionalPrinciples.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <Card className="p-6 h-full glass-effect border-accent/30 relative overflow-hidden group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${principle.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${principle.color} flex items-center justify-center mb-4 shadow-glow`}
                    >
                      <principle.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-orbitron font-bold mb-3">{principle.title}</h3>
                    <p className="text-muted-foreground">{principle.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Rights and Obligations */}
          <section className="space-y-8">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-2xl font-orbitron font-bold"
            >
              Derechos y Obligaciones Fundamentales
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rights.map((right, index) => (
                <motion.div
                  key={right.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-5 glass-effect border-primary/30 hover:border-accent/50 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center shrink-0 group-hover:shadow-glow transition-shadow">
                        <right.icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{right.title}</h4>
                        <p className="text-sm text-muted-foreground">{right.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Certifications Tabs */}
          <section className="space-y-8">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-3xl font-orbitron font-bold text-center"
            >
              <span className="text-gradient-quantum">II. Anexos de Certificación</span>
            </motion.h2>

            <Tabs defaultValue="iso" className="w-full">
              <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-3 glass-effect">
                <TabsTrigger value="iso">ISO/IEC 19790</TabsTrigger>
                <TabsTrigger value="fips">FIPS 140-3</TabsTrigger>
                <TabsTrigger value="pq">Cripto-Agilidad PQ</TabsTrigger>
              </TabsList>

              {certifications.map((cert, i) => (
                <TabsContent key={i} value={i === 0 ? "iso" : i === 1 ? "fips" : "pq"}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="p-6 glass-effect border-accent/30">
                      <h3 className="text-xl font-orbitron font-bold mb-4 flex items-center gap-3">
                        <Award className="w-6 h-6 text-accent" />
                        {cert.title}
                      </h3>
                      <ul className="space-y-3">
                        {cert.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </section>

          {/* Operational Package */}
          <section className="space-y-8">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-3xl font-orbitron font-bold text-center"
            >
              <span className="text-gradient-quantum">III. Paquete Operativo</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {operationalMatrices.map((matrix, index) => (
                <motion.div
                  key={matrix.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-5 glass-effect border-primary/30 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <matrix.icon className="w-6 h-6 text-accent" />
                      <h4 className="font-orbitron font-bold">{matrix.title}</h4>
                    </div>
                    <ul className="space-y-2">
                      {matrix.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Zap className="w-3 h-3 text-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Runbooks & Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 glass-effect border-accent/30">
                <h4 className="font-orbitron font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Runbooks de Incidentes
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Procedimientos de pausa y comunicación pública</li>
                  <li>• Roles definidos: Técnica, Comunitaria, Económica</li>
                  <li>• MTTR objetivo: {"<"} 2 horas para incidentes graves</li>
                  <li>• Plantillas de Post-Mortem con publicación en panel público</li>
                </ul>
              </Card>

              <Card className="p-6 glass-effect border-accent/30">
                <h4 className="font-orbitron font-bold mb-4 flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-accent" />
                  Pruebas de Atestación
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Secure boot y enclaves TEE</li>
                  <li>• Verificación remota de integridad</li>
                  <li>• Logs firmados y auditables</li>
                  <li>• Simulacros trimestrales obligatorios</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Public Dashboards */}
          <section className="space-y-8">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-3xl font-orbitron font-bold text-center"
            >
              <span className="text-gradient-quantum">IV. Panel Público</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboards.map((dashboard, index) => (
                <motion.div
                  key={dashboard.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className={`p-6 glass-effect border-accent/30 relative overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${dashboard.color} opacity-10`} />
                    <h4 className="font-orbitron font-bold mb-4 relative">{dashboard.title}</h4>
                    <ul className="space-y-3 relative">
                      {dashboard.metrics.map((metric, j) => (
                        <li key={j} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{metric}</span>
                          <motion.span 
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, delay: j * 0.3 }}
                            className="text-accent font-mono"
                          >
                            ●
                          </motion.span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Civilizational Declaration */}
          <section className="space-y-8">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-3xl font-orbitron font-bold text-center"
            >
              <span className="text-gradient-quantum">V. Declaración Civilizatoria</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Card className="p-8 glass-effect border-accent/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/10 to-secondary/10" />
                
                <div className="relative text-center space-y-6">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <Globe className="w-16 h-16 mx-auto text-accent" />
                  </motion.div>
                  
                  <blockquote className="text-xl md:text-2xl font-light italic text-foreground max-w-4xl mx-auto leading-relaxed">
                    "TAMV MSR se erige como blockchain global desde Real del Monte, Hidalgo, con{" "}
                    <span className="text-accent font-semibold">justicia sobre velocidad</span>,{" "}
                    <span className="text-primary font-semibold">memoria reparable</span> y{" "}
                    <span className="text-secondary font-semibold">dignidad digital</span>."
                  </blockquote>
                  
                  <p className="text-muted-foreground">
                    Cada bloque honra a <strong className="text-accent">Reina Trejo Serrano</strong> como ofrenda de soberanía y ética comunitaria.
                  </p>

                  <div className="flex justify-center gap-4 pt-4">
                    <Badge className="bg-background/50 border-accent/30 px-4 py-2">
                      <Heart className="w-4 h-4 mr-2 text-pink-500" /> In Memoriam
                    </Badge>
                    <Badge className="bg-background/50 border-accent/30 px-4 py-2">
                      <Users className="w-4 h-4 mr-2 text-accent" /> Comunidad TAMV
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
}
