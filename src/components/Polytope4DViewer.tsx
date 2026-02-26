/**
 * 🔮 Polytope 4D Viewer - TAMV MD-X4™
 * Canvas-based 4D polytope visualization
 * (Three.js version available when dependencies install)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Pause, RotateCcw, Maximize2, 
  Box, Hexagon, Octagon, Circle, Diamond
} from "lucide-react";
import { hyperRender4D, type Polytope4D, type Vector4D } from "@/core/render4d/HyperRender4D";

interface Polytope4DViewerProps {
  defaultPolytope?: string;
  showControls?: boolean;
  height?: string;
}

const POLYTOPE_ICONS: Record<string, typeof Box> = {
  'tesseract': Box,
  '16-cell': Diamond,
  '24-cell': Hexagon,
  '120-cell': Octagon,
  '600-cell': Circle
};

const Polytope4DViewer = ({ 
  defaultPolytope = 'tesseract', 
  showControls = true,
  height = "400px"
}: Polytope4DViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedPolytope, setSelectedPolytope] = useState(defaultPolytope);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [projectionDistance, setProjectionDistance] = useState(3);
  const [time, setTime] = useState(0);
  const [polytopeInfo, setPolytopeInfo] = useState<Polytope4D | null>(null);

  // Load polytope info
  useEffect(() => {
    const info = hyperRender4D.getPolytope(selectedPolytope);
    setPolytopeInfo(info || null);
  }, [selectedPolytope]);

  // Animation loop
  const animate = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'hsla(220, 95%, 5%, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get rendered polytope
    const rendered = hyperRender4D.renderPolytopeTo3D(selectedPolytope, time * rotationSpeed);
    
    // Center and scale
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) * 0.3;

    // Project 3D to 2D
    const project = (v: { x: number; y: number; z: number }) => {
      const perspective = projectionDistance / (projectionDistance + v.z);
      return {
        x: centerX + v.x * scale * perspective,
        y: centerY - v.y * scale * perspective,
        z: v.z
      };
    };

    // Sort edges by depth for proper rendering
    const projectedVertices = rendered.vertices.map(v => ({
      ...project(v),
      color: v.color
    }));

    // Draw edges
    ctx.strokeStyle = 'hsla(180, 100%, 50%, 0.3)';
    ctx.lineWidth = 1;
    
    rendered.edges.forEach(edge => {
      const v1 = projectedVertices[edge.v1];
      const v2 = projectedVertices[edge.v2];
      
      if (v1 && v2) {
        const gradient = ctx.createLinearGradient(v1.x, v1.y, v2.x, v2.y);
        gradient.addColorStop(0, `hsla(180, 100%, 50%, ${0.2 + (v1.z + 2) * 0.2})`);
        gradient.addColorStop(1, `hsla(270, 100%, 60%, ${0.2 + (v2.z + 2) * 0.2})`);
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.stroke();
      }
    });

    // Draw vertices
    projectedVertices.forEach((v, i) => {
      const size = 3 + (v.z + 2) * 2;
      const alpha = 0.5 + (v.z + 2) * 0.25;
      
      // Glow effect
      const gradient = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, size * 3);
      gradient.addColorStop(0, `hsla(180, 100%, 70%, ${alpha})`);
      gradient.addColorStop(0.5, `hsla(180, 100%, 50%, ${alpha * 0.5})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(v.x, v.y, size * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Core vertex
      ctx.beginPath();
      ctx.fillStyle = `hsla(${180 + v.color.r * 90}, 100%, ${50 + v.color.g * 20}%, ${alpha})`;
      ctx.arc(v.x, v.y, size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw info overlay
    ctx.fillStyle = 'hsla(180, 100%, 50%, 0.8)';
    ctx.font = '12px Orbitron';
    ctx.fillText(`Vertices: ${rendered.vertices.length}`, 10, 20);
    ctx.fillText(`Edges: ${rendered.edges.length}`, 10, 36);
    ctx.fillText(`Time: ${time.toFixed(2)}s`, 10, 52);

    if (isPlaying) {
      setTime(t => t + 0.016);
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [selectedPolytope, rotationSpeed, projectionDistance, time, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate, isPlaying]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        if (parent) {
          canvasRef.current.width = parent.clientWidth;
          canvasRef.current.height = parent.clientHeight;
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => setTime(0);

  return (
    <Card className="glass-effect overflow-hidden">
      {showControls && (
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-orbitron font-bold text-lg text-gradient-quantum">
              4D Polytope Viewer
            </h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={togglePlay}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="outline" onClick={reset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Polytope Selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {hyperRender4D.getPolytopeNames().map(name => {
              const Icon = POLYTOPE_ICONS[name] || Box;
              return (
                <Button
                  key={name}
                  size="sm"
                  variant={selectedPolytope === name ? "default" : "outline"}
                  onClick={() => setSelectedPolytope(name)}
                  className={selectedPolytope === name ? "bg-primary" : ""}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {name}
                </Button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Rotation Speed</label>
              <Slider
                value={[rotationSpeed]}
                onValueChange={([v]) => setRotationSpeed(v)}
                min={0}
                max={3}
                step={0.1}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Projection Distance</label>
              <Slider
                value={[projectionDistance]}
                onValueChange={([v]) => setProjectionDistance(v)}
                min={2}
                max={6}
                step={0.1}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* Canvas Container */}
      <div className="relative" style={{ height }}>
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        />
        
        {/* Polytope Info Overlay */}
        {polytopeInfo && (
          <div className="absolute bottom-4 right-4 glass-effect p-3 rounded-lg">
            <p className="font-orbitron text-sm font-bold text-accent">{polytopeInfo.name}</p>
            {polytopeInfo.schlafli && (
              <Badge variant="outline" className="mt-1">{polytopeInfo.schlafli}</Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Polytope4DViewer;
