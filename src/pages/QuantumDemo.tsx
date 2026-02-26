/**
 * ⚛️ Quantum Demo - TAMV MD-X4™
 * Interactive quantum circuit demonstration
 */

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, Play, RotateCcw, Download, Copy, 
  Activity, Target, Atom, Waves, Grid3X3
} from "lucide-react";
import { QuantumCircuit, QuantumCircuits, type CircuitResult, type GateType } from "@/core/quantum/QuantumCircuit";

interface GateDisplay {
  type: GateType;
  qubit: number;
  step: number;
  params?: number[];
}

const GATE_COLORS: Record<string, string> = {
  H: "bg-purple-500",
  X: "bg-red-500",
  Y: "bg-green-500",
  Z: "bg-blue-500",
  CNOT: "bg-cyan-500",
  CZ: "bg-teal-500",
  Rx: "bg-orange-500",
  Ry: "bg-yellow-500",
  Rz: "bg-pink-500",
  Measure: "bg-gray-500"
};

const QuantumDemo = () => {
  const [circuit, setCircuit] = useState<QuantumCircuit | null>(null);
  const [result, setResult] = useState<CircuitResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCircuit, setSelectedCircuit] = useState<'bell' | 'ghz' | 'qft' | 'grover' | 'vqe'>('bell');
  const [gates, setGates] = useState<GateDisplay[]>([]);
  const [qasm, setQasm] = useState<string>('');
  const [numQubits, setNumQubits] = useState(2);

  useEffect(() => {
    loadCircuit(selectedCircuit);
  }, [selectedCircuit]);

  const loadCircuit = (type: string) => {
    let newCircuit: QuantumCircuit;
    let newNumQubits: number;

    switch (type) {
      case 'bell':
        newCircuit = QuantumCircuits.bellState();
        newNumQubits = 2;
        break;
      case 'ghz':
        newCircuit = QuantumCircuits.ghzState(3);
        newNumQubits = 3;
        break;
      case 'qft':
        newCircuit = QuantumCircuits.qft(3);
        newNumQubits = 3;
        break;
      case 'grover':
        newCircuit = QuantumCircuits.groverIteration(3, 5);
        newNumQubits = 3;
        break;
      case 'vqe':
        newCircuit = QuantumCircuits.vqeAnsatz(2, 2);
        newNumQubits = 2;
        break;
      default:
        newCircuit = QuantumCircuits.bellState();
        newNumQubits = 2;
    }

    setCircuit(newCircuit);
    setNumQubits(newNumQubits);
    setQasm(newCircuit.toOpenQASM());
    setResult(null);

    // Extract gates for visualization
    const stats = newCircuit.getStats();
    const displayGates: GateDisplay[] = [];
    let step = 0;

    Object.entries(stats.gates).forEach(([gateType, count]) => {
      for (let i = 0; i < count; i++) {
        displayGates.push({
          type: gateType as GateType,
          qubit: i % newNumQubits,
          step: step++
        });
      }
    });

    setGates(displayGates);
  };

  const runCircuit = async () => {
    if (!circuit) return;
    
    setIsRunning(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const circuitResult = await circuit.execute(1024);
    setResult(circuitResult);
    setIsRunning(false);
  };

  const resetCircuit = () => {
    loadCircuit(selectedCircuit);
  };

  const copyQASM = () => {
    navigator.clipboard.writeText(qasm);
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-gradient-quantum flex items-center gap-3">
              <Atom className="w-8 h-8 text-accent animate-pulse" />
              Quantum Circuit Lab
            </h1>
            <p className="text-muted-foreground">Interactive quantum computing demonstration</p>
          </div>
        </div>

        {/* Circuit Selector */}
        <Card className="glass-effect p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'bell', name: 'Bell State', icon: Waves },
              { id: 'ghz', name: 'GHZ State', icon: Grid3X3 },
              { id: 'qft', name: 'QFT', icon: Activity },
              { id: 'grover', name: 'Grover Search', icon: Target },
              { id: 'vqe', name: 'VQE Ansatz', icon: Zap }
            ].map((c) => (
              <Button
                key={c.id}
                variant={selectedCircuit === c.id ? "default" : "outline"}
                onClick={() => setSelectedCircuit(c.id as typeof selectedCircuit)}
                className={selectedCircuit === c.id ? "bg-primary" : ""}
              >
                <c.icon className="w-4 h-4 mr-2" />
                {c.name}
              </Button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Circuit Visualization */}
          <Card className="lg:col-span-2 glass-effect p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-orbitron font-bold">Circuit Diagram</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={resetCircuit}>
                  <RotateCcw className="w-4 h-4 mr-1" /> Reset
                </Button>
                <Button 
                  size="sm" 
                  onClick={runCircuit} 
                  disabled={isRunning}
                  className="bg-accent hover:bg-accent/80"
                >
                  <Play className="w-4 h-4 mr-1" /> 
                  {isRunning ? 'Running...' : 'Run'}
                </Button>
              </div>
            </div>

            {/* Qubit Lines */}
            <div className="bg-background/50 rounded-lg p-4 overflow-x-auto">
              <div className="min-w-[500px]">
                {Array.from({ length: numQubits }).map((_, qubitIdx) => (
                  <div key={qubitIdx} className="flex items-center gap-2 mb-4">
                    <div className="w-12 text-sm font-mono text-accent">|q{qubitIdx}⟩</div>
                    <div className="flex-1 relative h-12 flex items-center">
                      {/* Wire */}
                      <div className="absolute inset-y-1/2 left-0 right-0 h-0.5 bg-border" />
                      
                      {/* Gates */}
                      <div className="relative z-10 flex gap-2">
                        {gates
                          .filter(g => g.qubit === qubitIdx)
                          .slice(0, 8)
                          .map((gate, idx) => (
                            <div
                              key={idx}
                              className={`w-10 h-10 rounded flex items-center justify-center text-white text-xs font-bold ${GATE_COLORS[gate.type] || 'bg-gray-500'}`}
                            >
                              {gate.type.length > 3 ? gate.type.slice(0, 2) : gate.type}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-muted flex items-center justify-center">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gate Legend */}
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(GATE_COLORS).slice(0, 6).map(([gate, color]) => (
                <Badge key={gate} className={`${color} text-white`}>
                  {gate}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Results Panel */}
          <Card className="glass-effect p-6">
            <h2 className="text-xl font-orbitron font-bold mb-4">Results</h2>
            
            {result ? (
              <div className="space-y-4">
                {/* Execution Time */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Execution Time</p>
                  <p className="text-2xl font-orbitron text-accent">
                    {result.executionTime.toFixed(2)}ms
                  </p>
                </div>

                {/* Shots */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Shots</p>
                  <p className="text-lg font-mono">{result.shots}</p>
                </div>

                {/* Measurement Results */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Measurement Counts</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {result.counts && Object.entries(result.counts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 8)
                      .map(([state, count]) => (
                        <div key={state} className="flex items-center gap-2">
                          <code className="text-sm text-accent font-mono">|{state}⟩</code>
                          <Progress value={(count / result.shots) * 100} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {((count / result.shots) * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Probabilities */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">State Probabilities</p>
                  <div className="grid grid-cols-4 gap-1">
                    {result.probabilities.slice(0, 8).map((prob, i) => (
                      <div 
                        key={i} 
                        className="p-1 rounded text-center text-xs"
                        style={{ 
                          backgroundColor: `hsla(180, 100%, 50%, ${prob})`,
                          color: prob > 0.5 ? 'black' : 'white'
                        }}
                      >
                        {(prob * 100).toFixed(0)}%
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Atom className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Run the circuit to see results</p>
              </div>
            )}
          </Card>
        </div>

        {/* OpenQASM Output */}
        <Card className="glass-effect p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-orbitron font-bold">OpenQASM 3.0</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyQASM}>
                <Copy className="w-4 h-4 mr-1" /> Copy
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-1" /> Export
              </Button>
            </div>
          </div>
          
          <pre className="bg-background/50 rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto max-h-48">
            {qasm}
          </pre>
        </Card>

        {/* Circuit Stats */}
        {circuit && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Qubits", value: circuit.getStats().qubits, color: "text-purple-400" },
              { label: "Circuit Depth", value: circuit.getStats().depth, color: "text-cyan-400" },
              { label: "Total Gates", value: circuit.getStats().gateCount, color: "text-pink-400" },
              { label: "Gate Types", value: Object.keys(circuit.getStats().gates).length, color: "text-green-400" }
            ].map((stat, i) => (
              <Card key={i} className="glass-effect p-4 text-center">
                <p className={`text-3xl font-orbitron font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuantumDemo;
