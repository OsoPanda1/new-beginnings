/**
 * ⚖️ DAO Dekateotl Governance - TAMV MD-X4™
 * Proposals, voting, simulation and transparency
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Vote, Users, Shield, Clock, CheckCircle, XCircle, TrendingUp, FileText, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import heroTech from "@/assets/hero-tech.webp";

const mockProposals = [
  { id: 1, title: "Aumentar split creador a 80%", description: "Incrementar el porcentaje destinado a creadores del 75% al 80% para incentivar más producción de contenido XR.", author: "Consejo Dekateotl", votes_for: 1234, votes_against: 321, total_votes: 1555, status: "active", category: "Economía", impact: "alto", deadline: "2026-02-15" },
  { id: 2, title: "Nuevo DreamSpace: Tenochtitlán Digital", description: "Crear un DreamSpace histórico-cultural de Tenochtitlán con reconstrucción 3D fidedigna y guías Isabella AI.", author: "CulturalDAO", votes_for: 2100, votes_against: 150, total_votes: 2250, status: "approved", category: "Cultura", impact: "medio", deadline: "2026-02-10" },
  { id: 3, title: "Protocolo anti-deepfake en Lives", description: "Implementar verificación AI en tiempo real para detectar deepfakes en transmisiones en vivo.", author: "Anubis Sentinel", votes_for: 890, votes_against: 45, total_votes: 935, status: "active", category: "Seguridad", impact: "crítico", deadline: "2026-02-20" },
  { id: 4, title: "Subsidio educativo TAMV University", description: "Destinar 5% del Fondo Fénix para becas en cursos de desarrollo XR para comunidades rurales.", author: "FénixDAO", votes_for: 3500, votes_against: 200, total_votes: 3700, status: "approved", category: "Educación", impact: "alto", deadline: "2026-02-08" },
];

export default function DAOGovernance() {
  const [activeTab, setActiveTab] = useState("proposals");

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      active: { label: "Votación Activa", cls: "bg-blue-500/20 text-blue-400" },
      approved: { label: "Aprobada", cls: "bg-green-500/20 text-green-400" },
      rejected: { label: "Rechazada", cls: "bg-red-500/20 text-red-400" },
      simulating: { label: "Simulando", cls: "bg-yellow-500/20 text-yellow-400" },
    };
    const s = map[status] || map.active;
    return <Badge className={s.cls}>{s.label}</Badge>;
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[280px] overflow-hidden">
        <img src={heroTech} alt="DAO Governance" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-600 to-accent">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-foreground">DAO Dekateotl™</h1>
              <p className="text-muted-foreground">Gobernanza civilizatoria: propuestas, votaciones y simulación de impacto</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Propuestas Activas", value: "12", icon: FileText, color: "text-blue-400" },
            { label: "Votantes Únicos", value: "4,521", icon: Users, color: "text-green-400" },
            { label: "Aprobadas", value: "89%", icon: CheckCircle, color: "text-accent" },
            { label: "Impacto Medido", value: "97%", icon: TrendingUp, color: "text-yellow-400" },
          ].map((stat) => (
            <Card key={stat.label} className="glass-effect p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-orbitron font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="glass-effect">
            <TabsTrigger value="proposals">Propuestas</TabsTrigger>
            <TabsTrigger value="constitution">Constitución</TabsTrigger>
            <TabsTrigger value="council">Consejo</TabsTrigger>
          </TabsList>

          <TabsContent value="proposals" className="space-y-4 mt-4">
            {mockProposals.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="glass-effect p-6 hover:border-accent/50 transition-all">
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-orbitron font-bold text-foreground text-lg">{p.title}</h3>
                        {getStatusBadge(p.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>Por: <span className="text-accent">{p.author}</span></span>
                        <Badge variant="outline" className="text-xs">{p.category}</Badge>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.deadline}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Voting Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" />A favor: {p.votes_for.toLocaleString()}</span>
                      <span className="text-red-400 flex items-center gap-1"><XCircle className="w-4 h-4" />En contra: {p.votes_against.toLocaleString()}</span>
                    </div>
                    <Progress value={(p.votes_for / p.total_votes) * 100} className="h-3" />
                    <p className="text-xs text-muted-foreground text-right">{p.total_votes.toLocaleString()} votos totales</p>
                  </div>
                  
                  {p.status === "active" && (
                    <div className="flex gap-3 mt-4">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="w-4 h-4 mr-2" />Votar A Favor</Button>
                      <Button variant="outline" className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"><XCircle className="w-4 h-4 mr-2" />Votar En Contra</Button>
                      <Button variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"><Zap className="w-4 h-4 mr-2" />Simular</Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="constitution" className="mt-4">
            <Card className="glass-effect p-8">
              <h2 className="text-2xl font-orbitron font-bold text-gradient-quantum mb-4">Constitución TAMV™</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
                <p><strong className="text-foreground">Artículo 1 — Dignidad y Transparencia:</strong> Toda acción del ecosistema TAMV respeta la dignidad del usuario y opera bajo transparencia radical verificable en BookPI.</p>
                <p><strong className="text-foreground">Artículo 2 — Gobernanza Constitucional:</strong> La DAO Dekateotl administra reformas, arbitrajes y decisiones estratégicas con votación cuántica verificable.</p>
                <p><strong className="text-foreground">Artículo 3 — Economía Creator-First:</strong> El creador recibe entre 50% y 75% del valor generado. El Protocolo 20/30/50 gobierna la distribución del beneficio neto.</p>
                <p><strong className="text-foreground">Artículo 4 — Antifraude y Compliance:</strong> Anubis Sentinel opera 11 capas de protección. Toda transacción es auditable e inmutable.</p>
                <p><strong className="text-foreground">Artículo 5 — Narrativa Civilizacional:</strong> TAMV es una declaración de excelencia latinoamericana, demostrando que la innovación tecnológica nace de la dignidad y la resiliencia.</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="council" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Dekateotl", role: "Guardián de Gobernanza", desc: "11 salvaguardas: identidad, ABAC, prefilters, gating, model safety, minimización, tamper-evidence, aislamiento, anomalías, drills, post-incident" },
                { name: "Anubis Sentinel", role: "Guardián de Seguridad", desc: "Detección de anomalías, forensic playback, orquestación de rollback y protección post-cuántica" },
                { name: "Isabella AI™", role: "Guardiana Ética", desc: "Supervisión cognitiva, auditoría emocional, human-in-the-loop y mediación de conflictos" },
              ].map((member) => (
                <Card key={member.name} className="glass-effect p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-quantum flex items-center justify-center mb-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-orbitron font-bold text-foreground mb-1">{member.name}</h4>
                  <Badge variant="outline" className="mb-2">{member.role}</Badge>
                  <p className="text-sm text-muted-foreground">{member.desc}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
