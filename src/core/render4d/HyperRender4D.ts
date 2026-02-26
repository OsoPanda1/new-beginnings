/**
 * 🔮 HyperRender 4D Engine - TAMV MD-X4™
 * 4D Polytope and Gaussian Splatting Renderer
 * 
 * Inspired by:
 * - Polychora/polytwisters
 * - 4D Gaussian Splatting
 * - Julia4D fractals
 * - Sparse Voxel Octrees
 */

export interface Vector4D {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Matrix4x4 {
  m: number[][];
}

export interface Vertex4D {
  position: Vector4D;
  color?: { r: number; g: number; b: number; a: number };
  normal?: Vector4D;
  uv?: { u: number; v: number };
}

export interface Edge4D {
  v1: number;
  v2: number;
}

export interface Face4D {
  vertices: number[];
  normal?: Vector4D;
}

export interface Cell4D {
  faces: number[];
}

export interface Polytope4D {
  name: string;
  vertices: Vertex4D[];
  edges: Edge4D[];
  faces: Face4D[];
  cells: Cell4D[];
  schlafli?: string; // Schläfli symbol
}

export interface GaussianSplat4D {
  position: Vector4D;
  covariance: number[][];
  color: { r: number; g: number; b: number };
  opacity: number;
  scale: Vector4D;
}

export interface SparseVoxelOctree4D {
  center: Vector4D;
  size: number;
  depth: number;
  children?: SparseVoxelOctree4D[];
  data?: unknown;
  isLeaf: boolean;
}

export interface RenderConfig4D {
  projectionDistance: number;
  rotationXY: number;
  rotationXZ: number;
  rotationXW: number;
  rotationYZ: number;
  rotationYW: number;
  rotationZW: number;
  wireframe: boolean;
  solidFaces: boolean;
  gaussianSplatting: boolean;
  timeSlice?: number;
}

/**
 * 4D HyperRender Engine
 */
class HyperRender4D {
  private config: RenderConfig4D;
  private polytopes: Map<string, Polytope4D> = new Map();
  private gaussianSplats: GaussianSplat4D[] = [];

  constructor() {
    this.config = {
      projectionDistance: 3,
      rotationXY: 0,
      rotationXZ: 0,
      rotationXW: 0,
      rotationYZ: 0,
      rotationYW: 0,
      rotationZW: 0,
      wireframe: true,
      solidFaces: true,
      gaussianSplatting: false
    };

    this.initializePolytopes();
  }

  /**
   * Initialize standard 4D polytopes
   */
  private initializePolytopes(): void {
    this.polytopes.set('tesseract', this.generateTesseract());
    this.polytopes.set('16-cell', this.generate16Cell());
    this.polytopes.set('24-cell', this.generate24Cell());
    this.polytopes.set('120-cell', this.generate120CellSimplified());
    this.polytopes.set('600-cell', this.generate600CellSimplified());
  }

  /**
   * Generate Tesseract (8-cell, hypercube)
   * Schläfli symbol: {4,3,3}
   */
  generateTesseract(): Polytope4D {
    const vertices: Vertex4D[] = [];
    
    // Generate 16 vertices (±1, ±1, ±1, ±1)
    for (let x = -1; x <= 1; x += 2) {
      for (let y = -1; y <= 1; y += 2) {
        for (let z = -1; z <= 1; z += 2) {
          for (let w = -1; w <= 1; w += 2) {
            vertices.push({
              position: { x, y, z, w },
              color: {
                r: (x + 1) / 2,
                g: (y + 1) / 2,
                b: (z + 1) / 2,
                a: (w + 1) / 2
              }
            });
          }
        }
      }
    }

    // Generate 32 edges (vertices differ by exactly one coordinate)
    const edges: Edge4D[] = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const v1 = vertices[i].position;
        const v2 = vertices[j].position;
        const diff = Math.abs(v1.x - v2.x) + Math.abs(v1.y - v2.y) + 
                    Math.abs(v1.z - v2.z) + Math.abs(v1.w - v2.w);
        if (diff === 2) {
          edges.push({ v1: i, v2: j });
        }
      }
    }

    return {
      name: 'Tesseract',
      schlafli: '{4,3,3}',
      vertices,
      edges,
      faces: this.generateFacesFromEdges(edges, 4),
      cells: []
    };
  }

  /**
   * Generate 16-cell (hexadecachoron)
   * Schläfli symbol: {3,3,4}
   */
  generate16Cell(): Polytope4D {
    const vertices: Vertex4D[] = [
      // ±1 on each axis
      { position: { x: 1, y: 0, z: 0, w: 0 }, color: { r: 1, g: 0, b: 0, a: 1 } },
      { position: { x: -1, y: 0, z: 0, w: 0 }, color: { r: 0, g: 1, b: 0, a: 1 } },
      { position: { x: 0, y: 1, z: 0, w: 0 }, color: { r: 0, g: 0, b: 1, a: 1 } },
      { position: { x: 0, y: -1, z: 0, w: 0 }, color: { r: 1, g: 1, b: 0, a: 1 } },
      { position: { x: 0, y: 0, z: 1, w: 0 }, color: { r: 1, g: 0, b: 1, a: 1 } },
      { position: { x: 0, y: 0, z: -1, w: 0 }, color: { r: 0, g: 1, b: 1, a: 1 } },
      { position: { x: 0, y: 0, z: 0, w: 1 }, color: { r: 1, g: 1, b: 1, a: 1 } },
      { position: { x: 0, y: 0, z: 0, w: -1 }, color: { r: 0.5, g: 0.5, b: 0.5, a: 1 } }
    ];

    // All pairs of vertices are connected (except opposite pairs)
    const edges: Edge4D[] = [];
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 8; j++) {
        // Skip opposite vertices
        if (Math.abs(i - j) !== 1 || i % 2 !== 0) {
          edges.push({ v1: i, v2: j });
        }
      }
    }

    return {
      name: '16-Cell',
      schlafli: '{3,3,4}',
      vertices,
      edges,
      faces: this.generateFacesFromEdges(edges, 3),
      cells: []
    };
  }

  /**
   * Generate 24-cell (icositetrachoron)
   * Schläfli symbol: {3,4,3}
   */
  generate24Cell(): Polytope4D {
    const vertices: Vertex4D[] = [];
    
    // 8 vertices from 16-cell
    const coords = [1, -1];
    for (const x of coords) {
      vertices.push({ position: { x, y: 0, z: 0, w: 0 }, color: { r: 1, g: 0, b: 0, a: 1 } });
    }
    for (const y of coords) {
      vertices.push({ position: { x: 0, y, z: 0, w: 0 }, color: { r: 0, g: 1, b: 0, a: 1 } });
    }
    for (const z of coords) {
      vertices.push({ position: { x: 0, y: 0, z, w: 0 }, color: { r: 0, g: 0, b: 1, a: 1 } });
    }
    for (const w of coords) {
      vertices.push({ position: { x: 0, y: 0, z: 0, w }, color: { r: 1, g: 1, b: 0, a: 1 } });
    }

    // 16 vertices from tesseract (scaled by 1/√2)
    const s = 1 / Math.sqrt(2);
    for (const x of coords) {
      for (const y of coords) {
        for (const z of coords) {
          for (const w of coords) {
            if (x * y * z * w > 0) { // Only even permutations
              vertices.push({
                position: { x: x * s, y: y * s, z: z * s, w: w * s },
                color: { r: 0.5, g: 0.5, b: 0.5, a: 1 }
              });
            }
          }
        }
      }
    }

    const edges: Edge4D[] = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dist = this.distance4D(vertices[i].position, vertices[j].position);
        if (Math.abs(dist - 1) < 0.01) {
          edges.push({ v1: i, v2: j });
        }
      }
    }

    return {
      name: '24-Cell',
      schlafli: '{3,4,3}',
      vertices,
      edges,
      faces: this.generateFacesFromEdges(edges, 3),
      cells: []
    };
  }

  /**
   * Generate simplified 120-cell
   */
  generate120CellSimplified(): Polytope4D {
    // Simplified version with key vertices
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const vertices: Vertex4D[] = [];
    
    // Generate vertices using golden ratio coordinates
    const coords = [
      [2, 2, 0, 0],
      [1, 1, 1, Math.sqrt(5)],
      [phi, phi, phi, 1/phi],
      [1/phi, 1/phi, 1/phi, phi]
    ];

    for (const coord of coords) {
      // Generate all permutations and sign changes
      for (let signs = 0; signs < 16; signs++) {
        const x = ((signs & 1) ? -1 : 1) * coord[0];
        const y = ((signs & 2) ? -1 : 1) * coord[1];
        const z = ((signs & 4) ? -1 : 1) * coord[2];
        const w = ((signs & 8) ? -1 : 1) * coord[3];
        
        vertices.push({
          position: { x, y, z, w },
          color: {
            r: (x + 3) / 6,
            g: (y + 3) / 6,
            b: (z + 3) / 6,
            a: 1
          }
        });
      }
    }

    const edges: Edge4D[] = [];
    const edgeLength = 2 / phi;
    
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dist = this.distance4D(vertices[i].position, vertices[j].position);
        if (Math.abs(dist - edgeLength) < 0.1) {
          edges.push({ v1: i, v2: j });
        }
      }
    }

    return {
      name: '120-Cell',
      schlafli: '{5,3,3}',
      vertices,
      edges,
      faces: [],
      cells: []
    };
  }

  /**
   * Generate simplified 600-cell
   */
  generate600CellSimplified(): Polytope4D {
    const vertices: Vertex4D[] = [];
    const phi = (1 + Math.sqrt(5)) / 2;

    // 24 vertices from 24-cell
    const coords24 = [
      [2, 0, 0, 0], [0, 2, 0, 0], [0, 0, 2, 0], [0, 0, 0, 2]
    ];

    for (const coord of coords24) {
      for (let signs = 0; signs < 2; signs++) {
        const factor = signs ? -1 : 1;
        vertices.push({
          position: {
            x: coord[0] * factor / 2,
            y: coord[1] * factor / 2,
            z: coord[2] * factor / 2,
            w: coord[3] * factor / 2
          },
          color: { r: 0.8, g: 0.2, b: 0.5, a: 1 }
        });
      }
    }

    // Additional golden ratio vertices
    const s = 0.5;
    for (let sx = -1; sx <= 1; sx += 2) {
      for (let sy = -1; sy <= 1; sy += 2) {
        for (let sz = -1; sz <= 1; sz += 2) {
          for (let sw = -1; sw <= 1; sw += 2) {
            vertices.push({
              position: {
                x: sx * s,
                y: sy * s,
                z: sz * s,
                w: sw * s
              },
              color: {
                r: (sx + 1) / 2,
                g: (sy + 1) / 2,
                b: (sz + 1) / 2,
                a: 1
              }
            });
          }
        }
      }
    }

    const edges: Edge4D[] = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dist = this.distance4D(vertices[i].position, vertices[j].position);
        if (dist < 1.2 && dist > 0.3) {
          edges.push({ v1: i, v2: j });
        }
      }
    }

    return {
      name: '600-Cell',
      schlafli: '{3,3,5}',
      vertices,
      edges,
      faces: [],
      cells: []
    };
  }

  /**
   * Calculate 4D distance
   */
  private distance4D(v1: Vector4D, v2: Vector4D): number {
    return Math.sqrt(
      Math.pow(v2.x - v1.x, 2) +
      Math.pow(v2.y - v1.y, 2) +
      Math.pow(v2.z - v1.z, 2) +
      Math.pow(v2.w - v1.w, 2)
    );
  }

  /**
   * Generate faces from edges
   */
  private generateFacesFromEdges(edges: Edge4D[], sidesPerFace: number): Face4D[] {
    // Simplified face generation
    const faces: Face4D[] = [];
    
    // Find cycles of the required length
    const adjacency = new Map<number, Set<number>>();
    
    for (const edge of edges) {
      if (!adjacency.has(edge.v1)) adjacency.set(edge.v1, new Set());
      if (!adjacency.has(edge.v2)) adjacency.set(edge.v2, new Set());
      adjacency.get(edge.v1)!.add(edge.v2);
      adjacency.get(edge.v2)!.add(edge.v1);
    }

    // Find triangles/squares
    for (const [v1, neighbors1] of adjacency) {
      for (const v2 of neighbors1) {
        if (v2 > v1) {
          const neighbors2 = adjacency.get(v2);
          if (neighbors2) {
            for (const v3 of neighbors2) {
              if (v3 > v2 && neighbors1.has(v3)) {
                faces.push({ vertices: [v1, v2, v3] });
              }
            }
          }
        }
      }
    }

    return faces;
  }

  /**
   * Create 4D rotation matrix
   */
  createRotationMatrix(plane: 'XY' | 'XZ' | 'XW' | 'YZ' | 'YW' | 'ZW', angle: number): Matrix4x4 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const m = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];

    switch (plane) {
      case 'XY':
        m[0][0] = c; m[0][1] = -s;
        m[1][0] = s; m[1][1] = c;
        break;
      case 'XZ':
        m[0][0] = c; m[0][2] = -s;
        m[2][0] = s; m[2][2] = c;
        break;
      case 'XW':
        m[0][0] = c; m[0][3] = -s;
        m[3][0] = s; m[3][3] = c;
        break;
      case 'YZ':
        m[1][1] = c; m[1][2] = -s;
        m[2][1] = s; m[2][2] = c;
        break;
      case 'YW':
        m[1][1] = c; m[1][3] = -s;
        m[3][1] = s; m[3][3] = c;
        break;
      case 'ZW':
        m[2][2] = c; m[2][3] = -s;
        m[3][2] = s; m[3][3] = c;
        break;
    }

    return { m };
  }

  /**
   * Transform vertex by matrix
   */
  transformVertex(v: Vector4D, matrix: Matrix4x4): Vector4D {
    const m = matrix.m;
    return {
      x: m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z + m[0][3] * v.w,
      y: m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z + m[1][3] * v.w,
      z: m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z + m[2][3] * v.w,
      w: m[3][0] * v.x + m[3][1] * v.y + m[3][2] * v.z + m[3][3] * v.w
    };
  }

  /**
   * Project 4D to 3D using stereographic projection
   */
  project4Dto3D(v: Vector4D, distance: number = 3): { x: number; y: number; z: number } {
    const scale = distance / (distance - v.w);
    return {
      x: v.x * scale,
      y: v.y * scale,
      z: v.z * scale
    };
  }

  /**
   * Generate Julia set in 4D
   */
  generateJulia4D(c: Vector4D, resolution: number = 32, maxIterations: number = 50): GaussianSplat4D[] {
    const splats: GaussianSplat4D[] = [];
    const step = 4 / resolution;

    for (let x = -2; x < 2; x += step) {
      for (let y = -2; y < 2; y += step) {
        for (let z = -2; z < 2; z += step) {
          for (let w = -2; w < 2; w += step) {
            let qx = x, qy = y, qz = z, qw = w;
            let iterations = 0;

            // Quaternion Julia iteration
            while (iterations < maxIterations) {
              const nx = qx * qx - qy * qy - qz * qz - qw * qw + c.x;
              const ny = 2 * qx * qy + c.y;
              const nz = 2 * qx * qz + c.z;
              const nw = 2 * qx * qw + c.w;

              qx = nx; qy = ny; qz = nz; qw = nw;

              if (qx * qx + qy * qy + qz * qz + qw * qw > 4) break;
              iterations++;
            }

            if (iterations === maxIterations) {
              const hue = (x + y + z + w + 8) / 16;
              splats.push({
                position: { x, y, z, w },
                covariance: [[0.1, 0, 0, 0], [0, 0.1, 0, 0], [0, 0, 0.1, 0], [0, 0, 0, 0.1]],
                color: this.hslToRgb(hue, 0.8, 0.5),
                opacity: 0.8,
                scale: { x: step, y: step, z: step, w: step }
              });
            }
          }
        }
      }
    }

    return splats;
  }

  /**
   * HSL to RGB conversion
   */
  private hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return { r, g, b };
  }

  /**
   * Get polytope by name
   */
  getPolytope(name: string): Polytope4D | undefined {
    return this.polytopes.get(name);
  }

  /**
   * Get all polytope names
   */
  getPolytopeNames(): string[] {
    return Array.from(this.polytopes.keys());
  }

  /**
   * Render polytope to 3D vertices
   */
  renderPolytopeTo3D(name: string, time: number = 0): {
    vertices: { x: number; y: number; z: number; color: { r: number; g: number; b: number; a: number } }[];
    edges: { v1: number; v2: number }[];
  } {
    const polytope = this.polytopes.get(name);
    if (!polytope) return { vertices: [], edges: [] };

    // Create combined rotation matrix
    const rotXW = this.createRotationMatrix('XW', time * 0.5);
    const rotYW = this.createRotationMatrix('YW', time * 0.3);
    const rotZW = this.createRotationMatrix('ZW', time * 0.2);

    const vertices = polytope.vertices.map(v => {
      let pos = v.position;
      pos = this.transformVertex(pos, rotXW);
      pos = this.transformVertex(pos, rotYW);
      pos = this.transformVertex(pos, rotZW);
      
      const projected = this.project4Dto3D(pos, this.config.projectionDistance);
      
      return {
        ...projected,
        color: v.color || { r: 1, g: 1, b: 1, a: 1 }
      };
    });

    return {
      vertices,
      edges: polytope.edges
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<RenderConfig4D>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): RenderConfig4D {
    return { ...this.config };
  }
}

export const hyperRender4D = new HyperRender4D();
