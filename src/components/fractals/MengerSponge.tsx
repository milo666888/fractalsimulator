import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FractalLayout, DataRow, MathFormula, Fraction, SliderControl, V, N, useAutoPlay } from '../ui/FractalLayout';

export default function MengerSponge({ dropdownNode }: { dropdownNode: React.ReactNode }) {
  const [n, setN] = useState(0);
  const { isPlaying, togglePlay } = useAutoPlay(n, setN, 0, 4, 1500);

  const pow20 = Math.pow(20, n);
  const pow8 = Math.pow(8, n);
  const pow8_plus_1 = Math.pow(8, n + 1);

  const vertices = Math.round((32 / 19) * pow20 + (24 / 7) * pow8 + 384 / 133);
  const edges = Math.round(4 * pow20 + pow8_plus_1);
  const faces = Math.round(2 * pow20 + 4 * pow8);
  const cubes = Math.round(pow20);

  const controlsNode = (
    <SliderControl 
      label={<>階數 (<V>n</V>)</>} 
      value={n} min={0} max={4} 
      onChange={(e: any) => setN(parseInt(e.target.value, 10))} 
      colorClass="accent-[#e74c3c]"
      isPlaying={isPlaying}
      onPlayToggle={togglePlay}
    />
  );

  const mathNode = (
    <>
      <DataRow 
        title={<>立方體數量 <V>C</V>(<V>M</V><sub><V>n</V></sub>)</>} 
        value={cubes} 
        formulaNode={<MathFormula><V>C</V> <N>=</N> <N>20</N><sup><V>n</V></sup></MathFormula>} 
        colorClass="text-[#e74c3c]"
      />
      <DataRow 
        title={<>點數量 <V>V</V>(<V>M</V><sub><V>n</V></sub>)</>} 
        value={vertices} 
        formulaNode={
          <MathFormula>
            <V>V</V> <N>=</N> <Fraction num={<N>32</N>} den={<N>19</N>}/> <N>&times;</N> <N>20</N><sup><V>n</V></sup> <N>+</N> <Fraction num={<N>24</N>} den={<N>7</N>}/> <N>&times;</N> <N>8</N><sup><V>n</V></sup> <N>+</N> <Fraction num={<N>384</N>} den={<N>133</N>}/>
          </MathFormula>
        } 
        colorClass="text-[#e74c3c]"
      />
      <DataRow 
        title={<>邊數量 <V>E</V>(<V>M</V><sub><V>n</V></sub>)</>} 
        value={edges} 
        formulaNode={<MathFormula><V>E</V> <N>=</N> <N>4</N> <N>&times;</N> <N>20</N><sup><V>n</V></sup> <N>+</N> <N>8</N><sup><V>n</V><N>+</N><N>1</N></sup></MathFormula>} 
        colorClass="text-[#e74c3c]"
      />
      <DataRow 
        title={<>面數量 <V>F</V>(<V>M</V><sub><V>n</V></sub>)</>} 
        value={faces} 
        formulaNode={<MathFormula><V>F</V> <N>=</N> <N>2</N> <N>&times;</N> <N>20</N><sup><V>n</V></sup> <N>+</N> <N>4</N> <N>&times;</N> <N>8</N><sup><V>n</V></sup></MathFormula>} 
        colorClass="text-[#e74c3c]"
      />
    </>
  );

  return (
    <FractalLayout
      dropdownNode={dropdownNode}
      title="門格海綿 (Menger Sponge)"
      description={
        <p><strong>門格海綿</strong>是一個將正立方體不斷遞迴分割與挖空的立體碎形。這個互動面板將其幾何結構視覺化，並展示了將其視為「點、線、面、體」組合而成的幾何形體時，在不同階數（<MathFormula><V>n</V></MathFormula>）下，其拓樸性質和組成立方體數量的驚人變化。</p>
      }
      controlsNode={controlsNode}
      mathNode={mathNode}
      canvasNode={<MengerSponge3D level={n} />}
      onReset={() => setN(0)}
    />
  );
}

function MengerSponge3D({ level }: { level: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    const width = mountNode.clientWidth || 800;
    const height = mountNode.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(1.0, 1.0, 1.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountNode.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, -5, -5);
    scene.add(fillLight);

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountNode) return;
      const newWidth = mountNode.clientWidth;
      const newHeight = mountNode.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      
      group.children.forEach((child) => {
        if (child instanceof THREE.InstancedMesh) {
          child.geometry.dispose();
          const mat = child.material as THREE.MeshStandardMaterial;
          if (mat.map) mat.map.dispose();
          mat.dispose();
        }
      });
      
      renderer.dispose();
      if (mountNode && mountNode.contains(renderer.domElement)) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    group.children.forEach((child) => {
      if (child instanceof THREE.InstancedMesh) {
        child.geometry.dispose();
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.map) mat.map.dispose();
        mat.dispose();
      }
    });
    group.clear();

    const size = 1;
    const cubeCount = Math.pow(20, level);
    const baseSize = size / Math.pow(3, level);
    const cubeGeometry = new THREE.BoxGeometry(baseSize, baseSize, baseSize);
    
    // 使用乾淨的淡藍色材質，拉大受光面與背光面的對比
    const cubeMaterial = new THREE.MeshStandardMaterial({ 
      color: '#a3c2f0', 
      roughness: 0.8, 
      metalness: 0.0 
    });

    const instancedMesh = new THREE.InstancedMesh(cubeGeometry, cubeMaterial, cubeCount);
    
    const dummy = new THREE.Object3D();
    let index = 0;

    const generatePositions = (lvl: number, x: number, y: number, z: number, currentSize: number) => {
      if (lvl === 0) {
        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(index++, dummy.matrix);
        return;
      }

      const newSize = currentSize / 3;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          for (let k = -1; k <= 1; k++) {
            const absSum = Math.abs(i) + Math.abs(j) + Math.abs(k);
            if (absSum > 1) {
              generatePositions(lvl - 1, x + i * newSize, y + j * newSize, z + k * newSize, newSize);
            }
          }
        }
      }
    };

    generatePositions(level, 0, 0, 0, size);
    instancedMesh.instanceMatrix.needsUpdate = true;
    group.add(instancedMesh);

  }, [level]);

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-slate-600 font-medium shadow-sm pointer-events-none font-sans">
        可拖曳旋轉 / 滾輪縮放
      </div>
    </div>
  );
}
