// src/components/TamvImmersiveBackground.tsx
import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls } from '@react-three/drei';
import type { Points as PointsType } from 'three';

type Phase = 'matrix' | 'shape' | 'spectral';

function MatrixPoints({ phase }: { phase: Phase }) {
  const ref = useRef<PointsType>(null);

  const { positions, baseY } = useMemo(() => {
    const count = 8000;
    const positions = new Float32Array(count * 3);
    const baseY = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const x = (Math.random() - 0.5) * 8;
      const y = Math.random() * 10;
      const z = (Math.random() - 0.5) * 4;

      positions[ix] = x;
      positions[ix + 1] = y;
      positions[ix + 2] = z;

      baseY[i] = y;
    }

    return { positions, baseY };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const pts = ref.current;
    if (!pts) return;

    const arr = pts.geometry.attributes.position.array as Float32Array;
    const count = arr.length / 3;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      let x = arr[ix];
      let y = arr[ix + 1];
      let z = arr[ix + 2];

      // Caída tipo "lluvia matrix"
      if (phase === 'matrix' || phase === 'shape') {
        y -= delta * 4;
        if (y < -5) {
          y = 10;
          x = (Math.random() - 0.5) * 8;
          z = (Math.random() - 0.5) * 4;
        }
      }

      // Fase "shape": insinuar edificios / figuras
      if (phase === 'shape') {
        const noise = Math.sin((x + t) * 1.7) * Math.cos((z - t) * 1.3);
        const mask =
          Math.abs(x) < 1.7 && z > -1.5 && z < 1.5
            ? 1
            : Math.abs(x) < 0.7 && z > 1 && z < 3
            ? 1
            : 0;
        if (mask > 0) {
          const targetY = (Math.floor(baseY[i]) % 6) - 1;
          y += (targetY - y) * delta * 2.0 + noise * 0.15 * delta;
        }
      }

      // Fase "spectral": disolver y flotar
      if (phase === 'spectral') {
        const dist = Math.sqrt(x * x + z * z);
        const dir = dist === 0 ? 0 : 1 / dist;
        x += x * dir * delta * 0.5;
        z += z * dir * delta * 0.5;
        y += Math.sin(t + ix) * delta * 0.4;
      }

      arr[ix] = x;
      arr[ix + 1] = y;
      arr[ix + 2] = z;
    }

    pts.geometry.attributes.position.needsUpdate = true;
  });

  const color =
    phase === 'matrix'
      ? '#22c55e'
      : phase === 'shape'
      ? '#22d3ee'
      : '#a855f7';

  return (
    <Points
      ref={ref}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color={color}
        size={0.02}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

function SpectralAura({ phase }: { phase: Phase }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;

    const mat = ref.current.material as THREE.MeshStandardMaterial;
    // Pulsos espectrales
    const hue = (t * 0.08) % 1;
    const s = 0.9;
    const l = phase === 'spectral' ? 0.6 : 0.2;

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hk = hue;
    const rgb = [hk + 1 / 3, hk, hk - 1 / 3].map((c) => {
      let tc = c;
      if (tc < 0) tc += 1;
      if (tc > 1) tc -= 1;
      if (tc < 1 / 6) return p + (q - p) * 6 * tc;
      if (tc < 1 / 2) return q;
      if (tc < 2 / 3) return p + (q - p) * (2 / 3 - tc) * 6;
      return p;
    });

    mat.emissive.setRGB(rgb[0], rgb[1], rgb[2]);
    mat.emissiveIntensity = phase === 'spectral' ? 1.3 : 0.4;
    ref.current.scale.setScalar(phase === 'spectral' ? 5 : 3.2);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color="#020617"
        emissive="#6366f1"
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

export default function TamvImmersiveBackground() {
  const [phase, setPhase] = useState<Phase>('matrix');

  useFrameInRoot(setPhase);

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.25} />
        <pointLight position={[5, 10, 5]} intensity={1.2} />
        <SpectralAura phase={phase} />
        <MatrixPoints phase={phase} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.15}
        />
      </Canvas>
    </div>
  );
}

// Hook para controlar las fases de forma global
function useFrameInRoot(setPhase: (p: Phase) => void) {
  const phaseRef = useRef<Phase>('matrix');

  useFrame((state) => {
    const t = state.clock.elapsedTime % 21; // ciclo de 21s
    let next: Phase;
    if (t < 7) next = 'matrix'; // lluvia de código
    else if (t < 14) next = 'shape'; // edificios / personas insinuadas
    else next = 'spectral'; // TAMV espectral iridiscente

    if (next !== phaseRef.current) {
      phaseRef.current = next;
      setPhase(next);
    }
  });
}
