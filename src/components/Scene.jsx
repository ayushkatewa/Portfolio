import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial, Float, Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Scene() {
  const { camera, scene } = useThree();

  const cameraGroup = useRef();
  const coreRef = useRef();

  useLayoutEffect(() => {
    // Pitch black fog for depth
    scene.fog = new THREE.FogExp2(0x000000, 0.02);
  }, [scene]);

  // GSAP Scroll: Fly the camera group deep into the Z-axis
  useLayoutEffect(() => {
    // Wait for DOM to render
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        if (!cameraGroup.current) return;
        
        // As you scroll down the page, the camera flies forward
        gsap.to(cameraGroup.current.position, {
          z: -80, // Fly into the screen
          scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 }
        });
      });
      return () => ctx.revert();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state, delta) => {
    // Parallax mouse effect
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;

    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += ((mouseY * 2 + 5) - camera.position.y) * 0.05;

    camera.lookAt(0, 5, -80);

    // Rotate core
    if (coreRef.current) {
        coreRef.current.rotation.y += 0.5 * delta;
        coreRef.current.rotation.x += 0.2 * delta;
    }
  });

  // Generate random data cubes
  const cubes = useMemo(() => {
    const temp = [];
    for(let i=0; i<60; i++) {
        temp.push({
            position: [(Math.random() - 0.5) * 50, Math.random() * 20, -Math.random() * 100],
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
            scale: Math.random() * 1.5 + 0.5,
            color: Math.random() > 0.5 ? 0x00e6b8 : 0xff3366
        });
    }
    return temp;
  }, []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 20, 10]} intensity={2} color={0x5e6bf0} />
      <pointLight position={[0, 10, -50]} intensity={50} distance={100} color={0xff0066} />

      {/* Camera Rig */}
      <group ref={cameraGroup}>
        <perspectiveCamera makeDefault position={[0, 5, 20]} fov={75} />
      </group>

      {/* Epic Reflective Floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={80}
          roughness={0.2}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.8}
        />
      </mesh>

      {/* Floating Sparkles Array for ambient energy */}
      <Sparkles count={1000} scale={[50, 20, 100]} position={[0, 10, -40]} size={2} speed={0.4} opacity={0.5} color="#5e6bf0" />

      {/* 3D Text Header */}
      <Float speed={2} floatIntensity={1.5} floatingRange={[0, 2]}>
        <Text
          position={[0, 8, -10]}
          fontSize={4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NJtEtq.woff"
        >
          AYUSH KATEWA
          <meshStandardMaterial emissive="#5e6bf0" emissiveIntensity={0.5} roughness={0.1} metalness={0.8} />
        </Text>
      </Float>

      {/* Massive Geometric Core way back in the scene */}
      <Float speed={1} floatIntensity={2} rotationIntensity={1}>
        <group position={[0, 15, -70]}>
            <mesh ref={coreRef}>
                <octahedronGeometry args={[15, 0]} />
                <meshStandardMaterial color={0x000000} roughness={0} metalness={1} wireframe={false} />
            </mesh>
            <mesh scale={1.2}>
                <octahedronGeometry args={[15, 0]} />
                <meshStandardMaterial color={0xff0066} wireframe emissive={0xff0066} emissiveIntensity={2} />
            </mesh>
        </group>
      </Float>

      {/* Background Data Cubes to fly past */}
      {cubes.map((props, i) => (
        <Float key={i} speed={Math.random() * 2} floatIntensity={2} rotationIntensity={2}>
            <mesh position={props.position} rotation={props.rotation} scale={props.scale}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={0x111111} emissive={props.color} emissiveIntensity={1.5} roughness={0.2} metalness={0.8} />
            </mesh>
        </Float>
      ))}
    </>
  );
}
