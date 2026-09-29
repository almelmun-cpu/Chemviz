import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import './Structure3D.css';

const ELEMENT_COLORS = {
  H: '#FFFFFF',
  C: '#909090',
  N: '#3050F8',
  O: '#FF0D0D',
  F: '#90E050',
  P: '#FF8000',
  S: '#FFFF30',
  Cl: '#1FF01F',
  Br: '#A62929',
  I: '#940094',
};

function Atom({ position, element, radius, renderStyle }) {
  const color = ELEMENT_COLORS[element] || '#E06633';
  const isSpacefill = renderStyle === 'spacefill';
  const isWireframe = renderStyle === 'wireframe';
  const displayRadius = isSpacefill ? radius * 2.5 : radius;

  return (
    <mesh position={position}>
      <sphereGeometry args={[displayRadius, isWireframe ? 8 : 32, isWireframe ? 8 : 32]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} wireframe={isWireframe} />
      {!isSpacefill && !isWireframe && (
        <Text
          position={[0, 0, displayRadius + 0.1]}
          fontSize={0.4}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#ffffff"
        >
          {element}
        </Text>
      )}
    </mesh>
  );
}

function Bond({ start, end, type, renderStyle }) {
  if (renderStyle === 'spacefill') return null;
  const isWireframe = renderStyle === 'wireframe';

  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const distance = startVec.distanceTo(endVec);
  const position = startVec.clone().lerp(endVec, 0.5);
  const direction = endVec.clone().sub(startVec).normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  const offsets = type === 2 ? [-0.1, 0.1] : type === 3 ? [-0.15, 0, 0.15] : [0];

  return (
    <group position={position} quaternion={quaternion}>
      {offsets.map((offset, idx) => (
        <mesh key={idx} position={[offset, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, distance, isWireframe ? 4 : 16]} />
          <meshStandardMaterial color="#cccccc" roughness={0.5} wireframe={isWireframe} />
        </mesh>
      ))}
    </group>
  );
}

function Molecule({ atoms, bonds, autoRotate, renderStyle }) {
  const groupRef = useRef();

  useFrame(() => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x += 0.002;
    }
  });

  const center = useMemo(() => {
    if (!atoms || atoms.length === 0) return [0, 0, 0];
    const sum = atoms.reduce((acc, a) => [acc[0] + a.x, acc[1] + a.y, acc[2] + a.z], [0, 0, 0]);
    return [sum[0] / atoms.length, sum[1] / atoms.length, sum[2] / atoms.length];
  }, [atoms]);

  return (
    <group ref={groupRef}>
      <group position={[-center[0], -center[1], -center[2]]}>
        {atoms?.map((atom, i) => (
          <Atom
            key={i}
            position={[atom.x, atom.y, atom.z]}
            element={atom.element}
            radius={atom.radius}
            renderStyle={renderStyle}
          />
        ))}
        {bonds?.map((bond, i) => {
          const a1 = atoms[bond.atom1];
          const a2 = atoms[bond.atom2];
          if (!a1 || !a2) return null;
          return (
            <Bond
              key={i}
              start={[a1.x, a1.y, a1.z]}
              end={[a2.x, a2.y, a2.z]}
              type={bond.type}
              renderStyle={renderStyle}
            />
          );
        })}
      </group>
    </group>
  );
}

export default function Structure3D({ atoms, bonds }) {
  const [renderStyle, setRenderStyle] = useState('ball-stick');
  const [autoRotate, setAutoRotate] = useState(true);

  if (!atoms || atoms.length === 0) {
    return (
      <div className="structure-3d-empty">
        <p>No hay coordenadas 3D disponibles para esta molecula.</p>
      </div>
    );
  }

  return (
    <div className="structure-3d-outer">
      <div className="structure-3d-controls">
        <select
          className="style-select"
          value={renderStyle}
          onChange={(e) => setRenderStyle(e.target.value)}
        >
          <option value="ball-stick">Esferas y Enlaces</option>
          <option value="spacefill">Espacio Lleno (VDW)</option>
          <option value="wireframe">Alambre</option>
        </select>
        <button
          className={autoRotate ? 'rotate-btn active' : 'rotate-btn'}
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? 'Pausar rotacion' : 'Reanudar rotacion'}
        >
          {autoRotate ? 'II' : 'Play'}
        </button>
      </div>

      <div className="structure-3d-canvas">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <Molecule atoms={atoms} bonds={bonds} autoRotate={autoRotate} renderStyle={renderStyle} />
          <OrbitControls enablePan enableZoom enableRotate />
        </Canvas>
      </div>

      <p className="structure-3d-hint">Arrastra para rotar | Scroll para zoom</p>
    </div>
  );
}
