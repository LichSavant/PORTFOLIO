"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const HEIGHT = 11.4;
const TURNS = 1.42;
const RADIUS = 1.58;

function helixPoint(t: number, phase: number) {
  const angle = t * Math.PI * 2 * TURNS + phase;
  const swell = RADIUS + Math.sin(t * Math.PI * 5.1 + phase) * 0.13;
  return new THREE.Vector3(
    Math.cos(angle) * swell + Math.sin(t * 9.2 + phase) * 0.07,
    (t - 0.5) * HEIGHT,
    Math.sin(angle) * swell + Math.cos(t * 7.4 + phase) * 0.08,
  );
}

function strandCurve(phase: number) {
  return new THREE.CatmullRomCurve3(
    Array.from({ length: 50 }, (_, index) => helixPoint(index / 49, phase)),
    false,
    "centripetal",
    0.45,
  );
}

function ChromeMaterial({ dark = false }: { dark?: boolean }) {
  return (
    <meshPhysicalMaterial
      color={dark ? "#7c858f" : "#e8edf2"}
      metalness={0.72}
      roughness={0.055}
      transmission={dark ? 0.08 : 0.2}
      thickness={1.8}
      ior={1.46}
      clearcoat={1}
      clearcoatRoughness={0.025}
      envMapIntensity={3.6}
    />
  );
}

function Strand({ phase, dark = false }: { phase: number; dark?: boolean }) {
  const geometry = useMemo(
    () => new THREE.TubeGeometry(strandCurve(phase), 180, 0.43, 16, false),
    [phase],
  );
  return <mesh geometry={geometry}><ChromeMaterial dark={dark} /></mesh>;
}

function Bridge({ t, index }: { t: number; index: number }) {
  const a = helixPoint(t, 0);
  const b = helixPoint(t, Math.PI);
  const midpoint = a.clone().add(b).multiplyScalar(0.5);
  const direction = b.clone().sub(a);
  const length = direction.length();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize(),
  );

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <capsuleGeometry args={[0.24 + (index % 3) * 0.018, length - 0.48, 8, 14]} />
      <ChromeMaterial dark={index % 2 === 0} />
    </mesh>
  );
}

function LiquidDNA() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.055;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.28) * 0.055;
    group.current.rotation.z = -0.1 + Math.sin(state.clock.elapsedTime * 0.18) * 0.014;
  });

  return (
    <group ref={group} rotation={[0.03, -0.42, -0.1]} scale={0.96}>
      <Strand phase={0} />
      <Strand phase={Math.PI} dark />
      {Array.from({ length: 13 }, (_, index) => (
        <Bridge key={index} index={index} t={0.08 + index * 0.07} />
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.42} />
      <directionalLight position={[6, 8, 9]} intensity={5.2} />
      <directionalLight position={[-5, 1, 6]} intensity={3.1} />
      <directionalLight position={[-3, 5, -7]} intensity={3.4} />
      <directionalLight position={[2, -6, 4]} intensity={1.8} />
      <LiquidDNA />
      <Environment preset="studio" background={false} environmentIntensity={1.45} />
    </>
  );
}

export default function PortraitField() {
  return (
    <div aria-hidden="true" className="portrait-field pointer-events-none absolute hidden lg:block">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.05, 13.8], fov: 26, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
