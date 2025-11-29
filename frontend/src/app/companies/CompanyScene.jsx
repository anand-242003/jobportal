"use client";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';

function FloatingShape({ position, color, scale }) {
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[1, 32, 32]} scale={scale} position={position}>
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={0.5}
                    speed={1.5}
                    roughness={0.2}
                />
            </Sphere>
        </Float>
    );
}

export default function CompanyScene() {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />

            <FloatingShape position={[-2, 1, 0]} color="#6366f1" scale={1} />
            <FloatingShape position={[2, -1, -1]} color="#10b981" scale={0.8} />
            <FloatingShape position={[0, 0, -2]} color="#f59e0b" scale={1.2} />

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
            />
        </Canvas>
    );
}
