/**
 * ⚛️ Quantum Boost Hub - TAMV MD-X4™
 * Superpoderes cuántico-inspirados para todos los usuarios
 * 3 capas: Mortal → Pro → Simbólica
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Search, Lightbulb, ArrowDownUp, Shield, Atom, Zap,
  Cpu, Database, Play, RotateCcw, Clock, CheckCircle,
  XCircle, Loader2, ChevronRight, ChevronDown, Share2,
  Sparkles, Eye, BookOpen
} from "lucide-react";
import { toast } from "sonner";
import QuantumBoostCards from "@/components/quantum/QuantumBoostCards";
import QuantumAdvancedPanel from "@/components/quantum/QuantumAdvancedPanel";
import QuantumJobHistory from "@/components/quantum/QuantumJobHistory";

export interface QuantumJob {
  id: string;
  type: string;
  boost: "discover" | "create" | "decide" | "trust";
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  createdAt: Date;
  evidence_hash?: string;
  summary?: string;
}

const mockJobs: QuantumJob[] = [
  {
    id: "qj-001", type: "grover", boost: "discover", status: "completed", progress: 100,
    createdAt: new Date(Date.now() - 3600000),
    evidence_hash: "sha512:a1b2c3d4e5f6",
    summary: "Exploramos 1,327 opciones y encontramos 5 candidatas perfectas para ti.",
  },
  {
    id: "qj-002", type: "vqe", boost: "decide", status: "running", progress: 67,
    createdAt: new Date(Date.now() - 1800000),
    summary: "Optimizando la combinación de parámetros para tu decisión.",
  },
  {
    id: "qj-003", type: "qml", boost: "create", status: "pending", progress: 0,
    createdAt: new Date(Date.now() - 600000),
    summary: "Preparando un modelo ligero para sugerirte nuevas ideas.",
  },
];

const QuantumBoostHub = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedBoost, setSelectedBoost] = useState<QuantumJob["boost"] | null>(null);
  const [jobs, setJobs] = useState<QuantumJob[]>(mockJobs);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleBoostClick = (boostId: QuantumJob["boost"], defaultEngine: string) => {
    setSelectedBoost(boostId);
    setSelectedType(defaultEngine);
    toast.message("Quantum Boost preparado", {
      description: `Motor ${defaultEngine.toUpperCase()} seleccionado automáticamente.`,
    });
  };

  const buildSummary = (boost: QuantumJob["boost"]): string => {
    const summaries: Record<string, string> = {
      discover: "Exploramos un espacio enorme de opciones para mostrarte solo lo que vale la pena.",
      create: "Generamos combinaciones y patrones para inspirar tu siguiente movimiento creativo.",
      decide: "Comparamos alternativas para ayudarte a quedarte con las mejores opciones.",
      trust: "Analizamos señales para detectar riesgos y anomalías antes de que confíes.",
    };
    return summaries[boost] || "Ejecutando motor cuántico-inspirado.";
  };

  const handleSubmitJob = async () => {
    if (!selectedType || !selectedBoost) {
      toast.error("Selecciona un Quantum Boost primero");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newJob: QuantumJob = {
      id: `qj-${Date.now()}`,
      type: selectedType,
      boost: selectedBoost,
      status: "pending",
      progress: 0,
      createdAt: new Date(),
      summary: buildSummary(selectedBoost),
    };

    setJobs((prev) => [newJob, ...prev]);
    setIsSubmitting(false);

    toast.success("Quantum Boost enviado", { description: `Job ID: ${newJob.id}` });

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === newJob.id
            ? {
                ...job,
                status: progress < 100 ? "running" : "completed",
                progress: Math.min(progress, 100),
                evidence_hash:
                  progress >= 100
                    ? `sha512:${Math.random().toString(36).substr(2, 12)}`
                    : job.evidence_hash,
              }
            : job
        )
      );
      if (progress >= 100) {
        clearInterval(interval);
        toast.success("Quantum Boost completado ✨", {
          description: "Evidencia registrada en BookPI™.",
        });
      }
    }, 800);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 px-4 relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px]" />
        </div>

        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary mb-6 shadow-glow"
        >
          <Zap className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-gradient-quantum mb-4 relative z-10">
          Quantum Boost
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto relative z-10">
          El mismo poder que usan bancos, IA y gobiernos, ahora para tus decisiones, 
          tu contenido y tu mundo digital.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Boost Cards + Advanced */}
          <div className="lg:col-span-3 space-y-6">
            <QuantumBoostCards
              selectedBoost={selectedBoost}
              selectedType={selectedType}
              isSubmitting={isSubmitting}
              onBoostClick={handleBoostClick}
              onSubmit={handleSubmitJob}
            />

            <QuantumAdvancedPanel
              showAdvanced={showAdvanced}
              selectedType={selectedType}
              onToggle={() => setShowAdvanced(!showAdvanced)}
              onSelectType={setSelectedType}
            />

            {/* BookPI Evidence footer */}
            <Card className="glass-effect p-4 border-accent/20">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Evidencia verificable BookPI™</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cada Quantum Boost genera un hash criptográfico, registrado en BookPI™, 
                    para que puedas demostrar qué hiciste y cuándo. Auditabilidad civilizatoria total.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Job History */}
          <div className="lg:col-span-2">
            <QuantumJobHistory jobs={jobs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumBoostHub;
