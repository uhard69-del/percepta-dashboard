"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#4f46e5"
          wireframe
          transparent
          opacity={0.15}
        />
      </Sphere>
      
      {/* Inner Glow */}
      <Sphere args={[0.98, 64, 64]}>
        <meshStandardMaterial
          color="#4f46e5"
          transparent
          opacity={0.05}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>

      {/* Dynamic Pings (Mock) */}
      <Ping position={[0.7, 0.7, 0]} />
      <Ping position={[-0.5, 0.3, 0.8]} />
      <Ping position={[0, -0.8, 0.6]} />
    </group>
  );
}

function Ping({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
       const s = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
       ref.current.scale.set(s, s, s);
       // @ts-ignore
       ref.current.material.opacity = 0.8 - (Math.sin(state.clock.elapsedTime * 4) + 1) / 2 * 0.5;
    }
  });

  return (
    <mesh position={position} ref={ref}>
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.8} />
    </mesh>
  );
}

export function RadarGlobe() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none z-10" />
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Globe />
        </Float>
      </Canvas>
      
      {/* HUD Overlays */}
      <div className="absolute top-8 left-8 z-20 space-y-2 pointer-events-none">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Orbital Link established</span>
         </div>
         <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Live Pings: 3 Active Nodes</p>
      </div>

      <div className="absolute bottom-8 right-8 z-20 pointer-events-none text-right">
         <span className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em] block mb-2">Percepta Security Network</span>
         <div className="flex gap-1 justify-end">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-8 h-[2px] bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500/30 animate-shimmer" style={{ animationDelay: `${i * 0.2}s` }} />
                </div>
            ))}
         </div>
      </div>
    </div>
  );
}
