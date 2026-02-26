import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Float, Stars } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface DreamSpaceViewerProps {
  sceneData?: any;
  spaceType?: string;
  onClose: () => void;
}

function QuantumCube() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00a8ff"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

function FloatingRings() {
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <Float key={i} speed={2 + i} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={[Math.cos(i * 2) * 3, i * 2 - 2, Math.sin(i * 2) * 3]} rotation={[0, i * 0.5, 0]}>
            <torusGeometry args={[1.5, 0.3, 16, 100]} />
            <meshStandardMaterial
              color={i === 0 ? '#ff00ff' : i === 1 ? '#00ffff' : '#ffff00'}
              emissive={i === 0 ? '#ff00ff' : i === 1 ? '#00ffff' : '#ffff00'}
              emissiveIntensity={0.3}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function ParticleField() {
  const particlesCount = 1000;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
}

export default function DreamSpaceViewer({ sceneData, spaceType, onClose }: DreamSpaceViewerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 px-4 py-2 glass-effect text-foreground hover:bg-primary/20 rounded-lg transition-all"
      >
        Cerrar Espacio
      </button>

      <div className="absolute top-4 left-4 z-50 glass-effect p-4 rounded-lg">
        <h2 className="text-xl font-orbitron font-bold text-gradient-quantum">
          {spaceType || 'DreamSpace Quantum'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Explora este espacio 3D inmersivo
        </p>
      </div>

      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <OrbitControls enableDamping dampingFactor={0.05} />

          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00f5ff" />

          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ParticleField />
          <QuantumCube />
          <FloatingRings />

          <Environment preset="night" />

          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
          </mesh>
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
