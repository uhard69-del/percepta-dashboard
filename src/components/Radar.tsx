"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Sphere } from "@react-three/drei";
import * as THREE from "three";

function Globe() {
  const pointsRef = useRef<THREE.Points>(null!);
  
  // Generate a sphere-like point cloud
  const count = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 2.5; // Radius
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
        pointsRef.current.rotation.y += 0.002;
        pointsRef.current.rotation.x += 0.001;
    }
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#4f46e5"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      {/* Light glow inside */}
      <mesh>
        <sphereGeometry args={[2.45, 32, 32]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

function Pings() {
    // Mock pings for now - later we can pass real coordinate-mapped pings
    const pings = useMemo(() => [
        { pos: [1.5, 1.2, 1.5], color: "#ef4444" }, // Red for fail
        { pos: [-1.2, 0.8, 2.0], color: "#10b981" }, // Green for success
        { pos: [0.5, -2.0, 1.0], color: "#6366f1" }, // Blue for info
    ], []);

    return (
        <group>
            {pings.map((p, i) => (
                <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <mesh position={p.pos as any}>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshBasicMaterial color={p.color} />
                        <pointLight intensity={0.5} color={p.color} />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

export function Radar() {
  return (
    <div className="w-full h-full min-h-[400px] relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={["#08080A"]} />
        <ambientLight intensity={0.5} />
        <Globe />
        <Pings />
      </Canvas>
      <div className="absolute top-8 left-8">
        <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Node Network</span>
        </div>
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Radar Link Active</h3>
      </div>
      
      <div className="absolute bottom-8 right-8 text-right">
        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">System Latency</p>
        <p className="text-xs font-black text-indigo-500 italic">24ms (DIRECT)</p>
      </div>
    </div>
  );
}
