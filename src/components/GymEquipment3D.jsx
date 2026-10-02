import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Float } from '@react-three/drei';
import { ShieldCheck, Cpu, Zap, Activity } from 'lucide-react';

function Kettlebell3D() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <group position={[0, -0.5, 0]}>
        {/* Main Sphere Body */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial color="#1a1c23" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Handle */}
        <mesh position={[0, 1.4, 0]}>
          <torusGeometry args={[0.7, 0.16, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Weight Engraving Badge */}
        <mesh position={[0, 0, 1.15]}>
          <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#00f0ff" emissive="#003344" metalness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

function BarbellPlate3D() {
  return (
    <Float speed={2} rotationIntensity={1.2} floatIntensity={1}>
      <group position={[0, 0, 0]}>
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <cylinderGeometry args={[1.8, 1.8, 0.4, 32]} />
          <meshStandardMaterial color="#111319" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.45, 32]} />
          <meshStandardMaterial color="#ccff00" emissive="#334400" metalness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

export default function GymEquipment3D() {
  const [activeTab, setActiveTab] = useState('kettlebell');

  return (
    <div className="my-16 bg-gym-card/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full -z-10"></div>
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Side Info */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Cpu className="w-4 h-4" /> 3D Equipment Engine
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white">
            Precision Built <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">Gym Technology</span>
          </h2>
          
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Experience our military-grade biomechanical weights, polyurethane custom dumbbells, and smart biometric tracking equipment engineered for maximum muscle tension and safety.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('kettlebell')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'kettlebell'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/30 font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              <Zap className="w-4 h-4" /> 32KG Smart Kettlebell
            </button>
            <button
              onClick={() => setActiveTab('plate')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'plate'
                  ? 'bg-gradient-to-r from-lime-400 to-emerald-500 text-black shadow-lg shadow-lime-400/30 font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              <Activity className="w-4 h-4" /> Olympic Calibrated Bumper
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 mt-1" />
              <div>
                <h4 className="text-white font-semibold text-sm">Anti-Slip Diamond Grip</h4>
                <p className="text-slate-500 text-xs">Laser knurled steel chrome handles</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-lime-400 mt-1" />
              <div>
                <h4 className="text-white font-semibold text-sm">Calibrated Weight Precision</h4>
                <p className="text-slate-500 text-xs">Within &plusmn;10g accuracy standards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side 3D Canvas */}
        <div className="w-full lg:w-1/2 h-[350px] md:h-[420px] bg-black/40 rounded-2xl border border-white/10 relative overflow-hidden">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={1} />
            <directionalLight position={[5, 10, 5]} intensity={2} color="#00f0ff" />
            <directionalLight position={[-5, -10, -5]} intensity={1.5} color="#ccff00" />
            
            <Stage environment="city" intensity={0.5}>
              {activeTab === 'kettlebell' ? <Kettlebell3D /> : <BarbellPlate3D />}
            </Stage>
            
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
          </Canvas>

          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md text-[10px] text-slate-300 font-mono border border-white/10">
            3D MODEL VIEWER &bull; REALTIME SHADERS
          </div>
        </div>

      </div>
    </div>
  );
}
