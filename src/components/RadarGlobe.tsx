"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Stars, Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// --- Geodata Mock for Countries (Rough points for continents) ---
const LAND_POINTS = [
  // North America
  [0.5, 0.5, 0.7], [0.6, 0.6, 0.5], [0.7, 0.4, 0.55], [0.4, 0.7, 0.5],
  // South America
  [0.6, -0.4, 0.7], [0.7, -0.6, 0.4], [0.5, -0.7, 0.5],
  // Europe & Africa
  [-0.2, 0.7, 0.6], [-0.1, 0.6, 0.7], [-0.3, 0.4, 0.8], [-0.1, -0.2, 0.9], [-0.3, -0.4, 0.7],
  // Asia & Australia
  [-0.7, 0.5, 0.5], [-0.8, 0.3, 0.4], [-0.6, -0.2, 0.7], [-0.7, -0.6, 0.3], [-0.5, -0.5, 0.6]
].map(p => new THREE.Vector3(...p).normalize());

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y += 0.0015;
    if (scanRef.current) {
      scanRef.current.rotation.y += 0.008;
      const s = 1.02 + Math.sin(state.clock.elapsedTime * 2) * 0.005;
      scanRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Base Globe */}
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshStandardMaterial color="#4f46e5" wireframe transparent opacity={0.1} />
      </Sphere>

      {/* LANDMASS POINTS (COUNTRIES) */}
      <group>
        {LAND_POINTS.map((pos, i) => (
          <mesh key={i} position={pos.clone().multiplyScalar(1.01)}>
             <sphereGeometry args={[0.015, 8, 8]} />
             <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
          </mesh>
        ))}
      </group>

      {/* SCAN LINE RING */}
      <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
         <torusGeometry args={[1, 0.003, 16, 120]} />
         <meshBasicMaterial color="#6366f1" transparent opacity={0.3} />
      </mesh>
      
      {/* Glow */}
      <Sphere args={[0.99, 64, 64]}>
        <meshStandardMaterial color="#4f46e5" transparent opacity={0.03} emissive="#4f46e5" emissiveIntensity={0.5} />
      </Sphere>
    </group>
  );
}

interface PingProps {
  position: [number, number, number];
  user: string;
  ip: string;
}

function Ping({ position, user, ip }: PingProps) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
       const s = (hovered ? 1.5 : 1) + Math.sin(state.clock.elapsedTime * 5) * 0.1;
       ref.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position}>
        <mesh 
          ref={ref}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshBasicMaterial color={hovered ? "#fbbf24" : "#6366f1"} transparent opacity={0.9} />
        </mesh>
        <mesh scale={[2, 2, 2]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#6366f1" transparent opacity={0.1} />
        </mesh>

        {hovered && (
          <Html distanceFactor={10} zIndexRange={[100, 0]}>
            <div className="bg-zinc-950/90 border border-indigo-500/50 backdrop-blur-xl p-3 rounded-xl shadow-2xl min-w-[140px] pointer-events-none animate-in fade-in zoom-in duration-200">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{user}</p>
               <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                  <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{ip}</p>
               </div>
            </div>
          </Html>
        )}
    </group>
  );
}

export function RadarGlobe() {
  // Static nodes for now, could be passed as props
  const nodes: PingProps[] = [
    { position: [0.6, 0.4, 0.7], user: "New_York_Node", ip: "172.64.12.9" },
    { position: [-0.1, 0.7, 0.6], user: "London_Gateway", ip: "185.12.99.23" },
    { position: [-0.7, 0.5, 0.5], user: "Tokyo_Relay", ip: "210.45.72.10" },
    { position: [-0.6, -0.6, 0.4], user: "Sydney_Point", ip: "1.127.4.2" },
  ];

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing group/globe bg-[#050507]">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none z-10" />
      
      {/* SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,33,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
      </div>

      <Canvas camera={{ position: [0, 0, 2.5], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#6366f1" />
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
          <group>
            <Globe />
            {nodes.map((node, i) => (
              <Ping key={i} {...node} />
            ))}
          </group>
        </Float>
      </Canvas>
      
      {/* HUD OVERLAY */}
      <div className="absolute top-8 left-8 z-20 space-y-4 pointer-events-none">
         <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-sm animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.6)]" />
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] leading-none mb-1">Orbital Surveillance</p>
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest italic">Signal Strength: 98.4%</p>
            </div>
         </div>
      </div>

      <div className="absolute bottom-10 right-10 z-20 pointer-events-none text-right">
         <div className="bg-black/40 border border-zinc-900/50 backdrop-blur-md p-4 rounded-2xl">
            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2">Network Topology</p>
            <div className="flex gap-1.5 justify-end">
               {[1, 0.4, 0.7, 0.2, 0.9].map((v, i) => (
                   <div key={i} className="w-1.5 bg-indigo-500/20 rounded-full h-8 relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-indigo-500" style={{ height: `${v * 100}%` }} />
                   </div>
               ))}
            </div>
         </div>
      </div>

      {/* Corners */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-indigo-500/20 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-indigo-500/20 pointer-events-none" />
    </div>
  );
}
