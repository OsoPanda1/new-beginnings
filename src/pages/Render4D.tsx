/**
 * 🔮 Render 4D Page - TAMV MD-X4™
 * Full 4D rendering experience
 */

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Box, Eye, Sparkles, Atom, Activity,
  Layers, Maximize2, Zap
} from "lucide-react";
import Polytope4DViewer from "@/components/Polytope4DViewer";
import { hyperRender4D } from "@/core/render4d/HyperRender4D";

const Render4D = () => {
  const [selectedTab, setSelectedTab] = useState("polytopes");
  const polytopeNames = hyperRender4D.getPolytopeNames();

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600">
            <Box className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-gradient-quantum">
              HyperRender 4D Engine
            </h1>
            <p className="text-muted-foreground">Visualización de politopos y geometría 4D</p>
          </div>
        </div>

        {/* Main Viewer */}
        <Polytope4DViewer height="500px" showControls />

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Polytopes Disponibles", value: polytopeNames.length, icon: Box, color: "text-cyan-400" },
            { label: "Dimensiones", value: "4D", icon: Layers, color: "text-purple-400" },
            { label: "Proyección", value: "Estereográfica", icon: Eye, color: "text-pink-400" },
            { label: "Renderizado", value: "Tiempo Real", icon: Zap, color: "text-green-400" }
          ].map((stat, i) => (
            <Card key={i} className="glass-effect p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-xl font-orbitron font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Polytope Gallery */}
        <Card className="glass-effect p-6">
          <h2 className="text-xl font-orbitron font-bold mb-4">Galería de Politopos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {polytopeNames.map((name) => {
              const polytope = hyperRender4D.getPolytope(name);
              
              return (
                <Card key={name} className="glass-effect p-4 hover:shadow-glow transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-orbitron font-bold text-accent">{polytope?.name}</h3>
                    {polytope?.schlafli && (
                      <Badge variant="outline">{polytope.schlafli}</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div>
                      <p className="text-xs">Vertices</p>
                      <p className="font-bold text-foreground">{polytope?.vertices.length}</p>
                    </div>
                    <div>
                      <p className="text-xs">Edges</p>
                      <p className="font-bold text-foreground">{polytope?.edges.length}</p>
                    </div>
                    <div>
                      <p className="text-xs">Faces</p>
                      <p className="font-bold text-foreground">{polytope?.faces.length}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>

        {/* Technical Info */}
        <Card className="glass-effect p-6">
          <h2 className="text-xl font-orbitron font-bold mb-4">Tecnología</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-accent mb-2">Renderizado</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Proyección estereográfica 4D→3D→2D
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  Rotaciones en 6 planos (XY, XZ, XW, YZ, YW, ZW)
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-pink-400" />
                  Profundidad por color y tamaño
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-accent mb-2">Politopos Regulares</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Tesseract (8-cell) - Hipercubo</li>
                <li>• 16-cell - Hexadecachoron</li>
                <li>• 24-cell - Icositetrachoron</li>
                <li>• 120-cell - Hecatonicosachoron</li>
                <li>• 600-cell - Hexacosichoron</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Render4D;
