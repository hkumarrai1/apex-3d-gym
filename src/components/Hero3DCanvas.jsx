import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Torus } from '@react-three/drei';

function AnimatedOrb() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} scale={2.2}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#00f0ff"
          attach="material"
          distort={0.4}
          speed={3}
          roughness={0.1}
          metalness={0.8}
          wireframe={false}
          emissive="#003344"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

function GlowingRings() {
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ring1Ref.current) ring1Ref.current.rotation.x = t * 0.4;
    if (ring1Ref.current) ring1Ref.current.rotation.y = t * 0.6;
    if (ring2Ref.current) ring2Ref.current.rotation.y = -t * 0.5;
    if (ring2Ref.current) ring2Ref.current.rotation.z = t * 0.3;
  });

  return (
    <>
      <Torus ref={ring1Ref} args={[3.2, 0.05, 16, 100]} scale={1}>
        <meshStandardMaterial color="#ccff00" emissive="#ccff00" emissiveIntensity={0.8} metalness={0.9} />
      </Torus>
      <Torus ref={ring2Ref} args={[3.8, 0.04, 16, 100]} scale={1}>
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} metalness={0.9} />
      </Torus>
    </>
  );
}

function Dumbbell3D() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.5;
      groupRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Central Handle Bar */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 3.2, 32]} />
        <meshStandardMaterial color="#444" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left Weight Plates */}
      <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.1, 1.1, 0.25, 32]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-1.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.9, 0.9, 0.2, 32]} />
        <meshStandardMaterial color="#00f0ff" emissive="#003344" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Right Weight Plates */}
      <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.1, 1.1, 0.25, 32]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[1.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.9, 0.9, 0.2, 32]} />
        <meshStandardMaterial color="#00f0ff" emissive="#003344" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

export default function Hero3DCanvas() {
  return (
    <div className="w-full h-[450px] md:h-[550px] relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00f0ff" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#ccff00" />
        <pointLight position={[0, 0, 5]} intensity={2} color="#00f0ff" />
        
        <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1.5} />
        <AnimatedOrb />
        <GlowingRings />
        <Dumbbell3D />

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-500/30 text-xs text-cyan-400 font-mono tracking-widest flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        INTERACTIVE 3D STAGE &bull; DRAG TO ROTATE
      </div>
    </div>
  );
}
