/**
 * ⚛️ Quantum Job History — "Symbolic Layer"
 * Human-readable job results with shareable proofs
 */

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle, XCircle, Loader2, Clock, RotateCcw,
  Share2, Eye, Atom, Database, Cpu, Zap, Search,
  Lightbulb, ArrowDownUp, Shield
} from "lucide-react";
import { toast } from "sonner";
import type { QuantumJob } from "@/pages/QuantumDemo";

const engineIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  grover: Database,
  vqe: Atom,
  qml: Cpu,
  custom: Zap,
};

const boostLabels: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  discover: { label: "Descubrimiento", icon: Search },
  create: { label: "Creativo", icon: Lightbulb },
  decide: { label: "Decisión", icon: ArrowDownUp },
  trust: { label: "Confianza", icon: Shield },
};

const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  completed: { icon: CheckCircle, color: "text-green-400", label: "Completado" },
  running: { icon: Loader2, color: "text-accent animate-spin", label: "Ejecutando" },
  pending: { icon: Clock, color: "text-muted-foreground", label: "Pendiente" },
  failed: { icon: XCircle, color: "text-destructive", label: "Fallido" },
};

interface Props {
  jobs: QuantumJob[];
}

export default function QuantumJobHistory({ jobs }: Props) {
  const handleShare = (job: QuantumJob) => {
    const boostInfo = boostLabels[job.boost];
    const text = `Usé Quantum Boost (${boostInfo.label}) del TAMV para potenciar mis decisiones. ${job.summary || ""} ⚛️✨`;
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles", { description: "¡Comparte tu Quantum Boost!" });
  };

  return (
    <Card className="glass-effect p-6 border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-orbitron font-bold text-gradient-quantum">
            Historial de Boosts
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Resultados con trazabilidad y evidencia BookPI™
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-border/50"
          onClick={() => toast.info("Historial actualizado")}
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Actualizar
        </Button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
        {jobs.map((job, i) => {
          const status = statusConfig[job.status];
          const boost = boostLabels[job.boost];
          const StatusIcon = status.icon;
          const BoostIcon = boost.icon;
          const EngineIcon = engineIcons[job.type] || Atom;

          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 transition-all space-y-3"
            >
              {/* Header row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <BoostIcon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Boost de {boost.label}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <EngineIcon className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {job.type.toUpperCase()} · {job.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <StatusIcon className={`w-4 h-4 ${status.color}`} />
                  <span className={`text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Summary */}
              {job.summary && (
                <p className="text-xs text-muted-foreground bg-background/30 rounded-lg p-2.5 leading-relaxed">
                  {job.summary}
                </p>
              )}

              {/* Progress bar */}
              {job.status === "running" && (
                <div className="space-y-1">
                  <Progress value={job.progress} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground text-right">{job.progress}%</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{job.createdAt.toLocaleString()}</span>

                <div className="flex items-center gap-2">
                  {job.evidence_hash && (
                    <Badge variant="outline" className="text-[9px] border-accent/30 text-accent font-mono">
                      {job.evidence_hash.slice(0, 18)}…
                    </Badge>
                  )}

                  {job.status === "completed" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[10px]"
                      onClick={() => handleShare(job)}
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Compartir
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[10px]"
                    onClick={() =>
                      toast.message("Detalles técnicos", {
                        description: `Motor: ${job.type} | Hash: ${job.evidence_hash || "pendiente"} | Progress: ${job.progress}%`,
                      })
                    }
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Detalles
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <Atom className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No hay Quantum Boosts recientes</p>
            <p className="text-xs text-muted-foreground mt-1">Elige un boost para comenzar</p>
          </div>
        )}
      </div>
    </Card>
  );
}
