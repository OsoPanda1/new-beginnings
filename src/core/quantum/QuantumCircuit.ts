/**
 * ⚛️ Quantum Circuit - TAMV MD-X4™
 * OpenQASM & PennyLane inspired quantum circuit simulator
 * 
 * Based on concepts from:
 * - Microsoft Quantum
 * - TensorFlow Quantum
 * - PennyLane
 * - OpenQASM
 */

export type GateType = 
  | 'H' | 'X' | 'Y' | 'Z'           // Pauli gates
  | 'S' | 'T' | 'Sdg' | 'Tdg'       // Phase gates
  | 'CNOT' | 'CZ' | 'SWAP'          // Two-qubit gates
  | 'Toffoli' | 'Fredkin'           // Three-qubit gates
  | 'Rx' | 'Ry' | 'Rz'              // Rotation gates
  | 'U' | 'U1' | 'U2' | 'U3'        // Universal gates
  | 'Measure';                       // Measurement

export interface QuantumGate {
  type: GateType;
  qubits: number[];
  parameters?: number[];
  classical?: number; // For measurement
}

export interface Qubit {
  id: number;
  amplitude0: { real: number; imag: number };
  amplitude1: { real: number; imag: number };
}

export interface CircuitResult {
  measurements: number[];
  probabilities: number[];
  stateVector: Complex[];
  counts?: Record<string, number>;
  executionTime: number;
  shots: number;
}

export interface Complex {
  real: number;
  imag: number;
}

export interface QuantumProgram {
  name: string;
  qubits: number;
  classicalBits: number;
  gates: QuantumGate[];
  metadata?: Record<string, unknown>;
}

/**
 * OpenQASM-style quantum circuit compiler and executor
 */
class QuantumCircuit {
  private numQubits: number;
  private numClassical: number;
  private gates: QuantumGate[] = [];
  private stateVector: Complex[] = [];
  private classicalRegister: number[] = [];

  constructor(numQubits: number = 4, numClassical?: number) {
    this.numQubits = numQubits;
    this.numClassical = numClassical || numQubits;
    this.reset();
  }

  /**
   * Reset circuit to initial state |0...0⟩
   */
  reset(): void {
    const size = Math.pow(2, this.numQubits);
    this.stateVector = Array(size).fill(null).map((_, i) => ({
      real: i === 0 ? 1 : 0,
      imag: 0
    }));
    this.classicalRegister = Array(this.numClassical).fill(0);
    this.gates = [];
  }

  /**
   * Add Hadamard gate
   */
  h(qubit: number): this {
    this.gates.push({ type: 'H', qubits: [qubit] });
    return this;
  }

  /**
   * Add Pauli-X (NOT) gate
   */
  x(qubit: number): this {
    this.gates.push({ type: 'X', qubits: [qubit] });
    return this;
  }

  /**
   * Add Pauli-Y gate
   */
  y(qubit: number): this {
    this.gates.push({ type: 'Y', qubits: [qubit] });
    return this;
  }

  /**
   * Add Pauli-Z gate
   */
  z(qubit: number): this {
    this.gates.push({ type: 'Z', qubits: [qubit] });
    return this;
  }

  /**
   * Add rotation gates
   */
  rx(qubit: number, theta: number): this {
    this.gates.push({ type: 'Rx', qubits: [qubit], parameters: [theta] });
    return this;
  }

  ry(qubit: number, theta: number): this {
    this.gates.push({ type: 'Ry', qubits: [qubit], parameters: [theta] });
    return this;
  }

  rz(qubit: number, theta: number): this {
    this.gates.push({ type: 'Rz', qubits: [qubit], parameters: [theta] });
    return this;
  }

  /**
   * Add CNOT (controlled-X) gate
   */
  cnot(control: number, target: number): this {
    this.gates.push({ type: 'CNOT', qubits: [control, target] });
    return this;
  }

  /**
   * Add CZ (controlled-Z) gate
   */
  cz(control: number, target: number): this {
    this.gates.push({ type: 'CZ', qubits: [control, target] });
    return this;
  }

  /**
   * Add SWAP gate
   */
  swap(qubit1: number, qubit2: number): this {
    this.gates.push({ type: 'SWAP', qubits: [qubit1, qubit2] });
    return this;
  }

  /**
   * Add Toffoli (CCNOT) gate
   */
  toffoli(control1: number, control2: number, target: number): this {
    this.gates.push({ type: 'Toffoli', qubits: [control1, control2, target] });
    return this;
  }

  /**
   * Add measurement
   */
  measure(qubit: number, classical: number): this {
    this.gates.push({ type: 'Measure', qubits: [qubit], classical });
    return this;
  }

  /**
   * Measure all qubits
   */
  measureAll(): this {
    for (let i = 0; i < this.numQubits; i++) {
      this.measure(i, i);
    }
    return this;
  }

  /**
   * Execute circuit with multiple shots
   */
  async execute(shots: number = 1024): Promise<CircuitResult> {
    const startTime = performance.now();
    const counts: Record<string, number> = {};

    // Execute all gates on state vector
    for (const gate of this.gates) {
      if (gate.type !== 'Measure') {
        this.applyGate(gate);
      }
    }

    // Calculate probabilities
    const probabilities = this.stateVector.map(c => 
      c.real * c.real + c.imag * c.imag
    );

    // Run measurements
    for (let shot = 0; shot < shots; shot++) {
      const measurement = this.sampleMeasurement(probabilities);
      const bitstring = measurement.toString(2).padStart(this.numQubits, '0');
      counts[bitstring] = (counts[bitstring] || 0) + 1;
    }

    // Get most likely measurement
    const maxCount = Math.max(...Object.values(counts));
    const mostLikely = Object.entries(counts).find(([_, c]) => c === maxCount)?.[0] || '';
    const measurements = mostLikely.split('').map(Number);

    return {
      measurements,
      probabilities,
      stateVector: [...this.stateVector],
      counts,
      executionTime: performance.now() - startTime,
      shots
    };
  }

  /**
   * Apply gate to state vector
   */
  private applyGate(gate: QuantumGate): void {
    const matrix = this.getGateMatrix(gate);
    const size = Math.pow(2, this.numQubits);

    switch (gate.qubits.length) {
      case 1:
        this.applySingleQubitGate(matrix, gate.qubits[0]);
        break;
      case 2:
        this.applyTwoQubitGate(matrix, gate.qubits[0], gate.qubits[1]);
        break;
      case 3:
        this.applyThreeQubitGate(matrix, gate.qubits[0], gate.qubits[1], gate.qubits[2]);
        break;
    }
  }

  /**
   * Apply single qubit gate
   */
  private applySingleQubitGate(matrix: Complex[][], qubit: number): void {
    const size = Math.pow(2, this.numQubits);
    const step = Math.pow(2, qubit);

    for (let i = 0; i < size; i += step * 2) {
      for (let j = 0; j < step; j++) {
        const idx0 = i + j;
        const idx1 = i + j + step;

        const a0 = this.stateVector[idx0];
        const a1 = this.stateVector[idx1];

        this.stateVector[idx0] = this.complexAdd(
          this.complexMult(matrix[0][0], a0),
          this.complexMult(matrix[0][1], a1)
        );
        this.stateVector[idx1] = this.complexAdd(
          this.complexMult(matrix[1][0], a0),
          this.complexMult(matrix[1][1], a1)
        );
      }
    }
  }

  /**
   * Apply two qubit gate
   */
  private applyTwoQubitGate(matrix: Complex[][], control: number, target: number): void {
    const size = Math.pow(2, this.numQubits);

    for (let i = 0; i < size; i++) {
      const controlBit = (i >> control) & 1;
      const targetBit = (i >> target) & 1;

      if (controlBit === 1 && targetBit === 0) {
        const j = i ^ (1 << target);
        const temp = this.stateVector[i];
        this.stateVector[i] = this.stateVector[j];
        this.stateVector[j] = temp;
      }
    }
  }

  /**
   * Apply three qubit gate (simplified)
   */
  private applyThreeQubitGate(matrix: Complex[][], c1: number, c2: number, target: number): void {
    const size = Math.pow(2, this.numQubits);

    for (let i = 0; i < size; i++) {
      const c1Bit = (i >> c1) & 1;
      const c2Bit = (i >> c2) & 1;
      const targetBit = (i >> target) & 1;

      if (c1Bit === 1 && c2Bit === 1 && targetBit === 0) {
        const j = i ^ (1 << target);
        const temp = this.stateVector[i];
        this.stateVector[i] = this.stateVector[j];
        this.stateVector[j] = temp;
      }
    }
  }

  /**
   * Get gate matrix
   */
  private getGateMatrix(gate: QuantumGate): Complex[][] {
    const sqrt2 = Math.sqrt(2);
    const theta = gate.parameters?.[0] || 0;

    const matrices: Record<string, Complex[][]> = {
      H: [
        [{ real: 1/sqrt2, imag: 0 }, { real: 1/sqrt2, imag: 0 }],
        [{ real: 1/sqrt2, imag: 0 }, { real: -1/sqrt2, imag: 0 }]
      ],
      X: [
        [{ real: 0, imag: 0 }, { real: 1, imag: 0 }],
        [{ real: 1, imag: 0 }, { real: 0, imag: 0 }]
      ],
      Y: [
        [{ real: 0, imag: 0 }, { real: 0, imag: -1 }],
        [{ real: 0, imag: 1 }, { real: 0, imag: 0 }]
      ],
      Z: [
        [{ real: 1, imag: 0 }, { real: 0, imag: 0 }],
        [{ real: 0, imag: 0 }, { real: -1, imag: 0 }]
      ],
      S: [
        [{ real: 1, imag: 0 }, { real: 0, imag: 0 }],
        [{ real: 0, imag: 0 }, { real: 0, imag: 1 }]
      ],
      T: [
        [{ real: 1, imag: 0 }, { real: 0, imag: 0 }],
        [{ real: 0, imag: 0 }, { real: Math.cos(Math.PI/4), imag: Math.sin(Math.PI/4) }]
      ],
      Rx: [
        [{ real: Math.cos(theta/2), imag: 0 }, { real: 0, imag: -Math.sin(theta/2) }],
        [{ real: 0, imag: -Math.sin(theta/2) }, { real: Math.cos(theta/2), imag: 0 }]
      ],
      Ry: [
        [{ real: Math.cos(theta/2), imag: 0 }, { real: -Math.sin(theta/2), imag: 0 }],
        [{ real: Math.sin(theta/2), imag: 0 }, { real: Math.cos(theta/2), imag: 0 }]
      ],
      Rz: [
        [{ real: Math.cos(theta/2), imag: -Math.sin(theta/2) }, { real: 0, imag: 0 }],
        [{ real: 0, imag: 0 }, { real: Math.cos(theta/2), imag: Math.sin(theta/2) }]
      ]
    };

    return matrices[gate.type] || matrices.H;
  }

  /**
   * Complex number multiplication
   */
  private complexMult(a: Complex, b: Complex): Complex {
    return {
      real: a.real * b.real - a.imag * b.imag,
      imag: a.real * b.imag + a.imag * b.real
    };
  }

  /**
   * Complex number addition
   */
  private complexAdd(a: Complex, b: Complex): Complex {
    return {
      real: a.real + b.real,
      imag: a.imag + b.imag
    };
  }

  /**
   * Sample measurement from probabilities
   */
  private sampleMeasurement(probabilities: number[]): number {
    const rand = Math.random();
    let cumulative = 0;

    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (rand < cumulative) return i;
    }

    return probabilities.length - 1;
  }

  /**
   * Export to OpenQASM format
   */
  toOpenQASM(): string {
    let qasm = 'OPENQASM 3.0;\n';
    qasm += `qubit[${this.numQubits}] q;\n`;
    qasm += `bit[${this.numClassical}] c;\n\n`;

    for (const gate of this.gates) {
      const qubits = gate.qubits.map(q => `q[${q}]`).join(', ');
      const params = gate.parameters?.join(', ') || '';

      switch (gate.type) {
        case 'H':
          qasm += `h ${qubits};\n`;
          break;
        case 'X':
          qasm += `x ${qubits};\n`;
          break;
        case 'Y':
          qasm += `y ${qubits};\n`;
          break;
        case 'Z':
          qasm += `z ${qubits};\n`;
          break;
        case 'CNOT':
          qasm += `cx ${qubits};\n`;
          break;
        case 'CZ':
          qasm += `cz ${qubits};\n`;
          break;
        case 'Rx':
          qasm += `rx(${params}) ${qubits};\n`;
          break;
        case 'Ry':
          qasm += `ry(${params}) ${qubits};\n`;
          break;
        case 'Rz':
          qasm += `rz(${params}) ${qubits};\n`;
          break;
        case 'Measure':
          qasm += `c[${gate.classical}] = measure ${qubits};\n`;
          break;
      }
    }

    return qasm;
  }

  /**
   * Get circuit statistics
   */
  getStats(): {
    qubits: number;
    depth: number;
    gateCount: number;
    gates: Record<GateType, number>;
  } {
    const gates: Record<string, number> = {};
    
    for (const gate of this.gates) {
      gates[gate.type] = (gates[gate.type] || 0) + 1;
    }

    return {
      qubits: this.numQubits,
      depth: this.gates.length,
      gateCount: this.gates.length,
      gates: gates as Record<GateType, number>
    };
  }
}

/**
 * Create common quantum circuits
 */
export const QuantumCircuits = {
  /**
   * Bell state circuit
   */
  bellState(): QuantumCircuit {
    return new QuantumCircuit(2)
      .h(0)
      .cnot(0, 1)
      .measureAll();
  },

  /**
   * GHZ state circuit
   */
  ghzState(n: number = 3): QuantumCircuit {
    const circuit = new QuantumCircuit(n);
    circuit.h(0);
    for (let i = 1; i < n; i++) {
      circuit.cnot(0, i);
    }
    return circuit.measureAll();
  },

  /**
   * Quantum Fourier Transform
   */
  qft(n: number = 3): QuantumCircuit {
    const circuit = new QuantumCircuit(n);
    
    for (let i = 0; i < n; i++) {
      circuit.h(i);
      for (let j = i + 1; j < n; j++) {
        const angle = Math.PI / Math.pow(2, j - i);
        circuit.rz(j, angle);
      }
    }
    
    return circuit.measureAll();
  },

  /**
   * Grover's search iteration
   */
  groverIteration(n: number = 3, oracle: number = 5): QuantumCircuit {
    const circuit = new QuantumCircuit(n);
    
    // Initial superposition
    for (let i = 0; i < n; i++) {
      circuit.h(i);
    }
    
    // Oracle (mark target state)
    for (let i = 0; i < n; i++) {
      if ((oracle >> i) & 1) {
        circuit.x(i);
      }
    }
    
    // Diffusion operator
    for (let i = 0; i < n; i++) {
      circuit.h(i);
      circuit.x(i);
    }
    
    return circuit.measureAll();
  },

  /**
   * VQE ansatz circuit
   */
  vqeAnsatz(n: number = 2, layers: number = 2): QuantumCircuit {
    const circuit = new QuantumCircuit(n);
    
    for (let l = 0; l < layers; l++) {
      // Rotation layer
      for (let i = 0; i < n; i++) {
        circuit.ry(i, Math.random() * Math.PI);
        circuit.rz(i, Math.random() * Math.PI);
      }
      
      // Entanglement layer
      for (let i = 0; i < n - 1; i++) {
        circuit.cnot(i, i + 1);
      }
    }
    
    return circuit.measureAll();
  }
};

export { QuantumCircuit };
