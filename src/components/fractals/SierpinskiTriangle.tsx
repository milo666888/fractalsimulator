import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FractalLayout, DataRow, MathFormula, Fraction, SliderControl, V, N, useAutoPlay } from '../ui/FractalLayout';

export default function SierpinskiTriangle({ dropdownNode }: { dropdownNode: React.ReactNode }) {
  const [is3D, setIs3D] = useState(false);
  const [level, setLevel] = useState(0);
  const { isPlaying, togglePlay } = useAutoPlay(level, setLevel, 0, is3D ? 6 : 7, 800);

  // 當切換到 3D 時，如果階數大於 6，自動降回 6 避免效能問題
  useEffect(() => {
    if (is3D && level > 6) setLevel(6);
  }, [is3D, level]);

  const triangles = Math.pow(3, level);
  const areaRatio = Math.pow(3/4, level);
  
  const tetrahedrons = Math.pow(4, level);
  const volumeRatio = Math.pow(1/2, level);

  const controlsNode = (
    <>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setIs3D(false)} className={`flex-1 py-1.5 rounded text-sm font-bold transition-colors ${!is3D ? 'bg-[#27ae60] text-white' : 'bg-[#eef0f8] text-[#5a6280]'}`}>2D 平面</button>
        <button onClick={() => setIs3D(true)} className={`flex-1 py-1.5 rounded text-sm font-bold transition-colors ${is3D ? 'bg-[#27ae60] text-white' : 'bg-[#eef0f8] text-[#5a6280]'}`}>3D 立體</button>
      </div>
      <SliderControl 
        label={<>階數 (<V>n</V>)</>} 
        value={level} min={0} max={is3D ? 6 : 7} 
        onChange={(e: any) => setLevel(parseInt(e.target.value, 10))} 
        colorClass="accent-[#27ae60]"
        isPlaying={isPlaying}
        onPlayToggle={togglePlay}
      />
    </>
  );

  const mathNode = is3D ? (
    <>
      <DataRow 
        title="四面體數量" 
        value={tetrahedrons} 
        formulaNode={<MathFormula><V>N</V> <N>=</N> <N>4</N><sup><V>n</V></sup></MathFormula>} 
        colorClass="text-[#27ae60]"
      />
      <DataRow 
        title="剩餘體積比例" 
        value={volumeRatio.toFixed(4)} 
        formulaNode={<MathFormula><V>V</V> <N>=</N> (<Fraction num={<N>1</N>} den={<N>2</N>}/>)<sup><V>n</V></sup></MathFormula>} 
        colorClass="text-[#27ae60]"
      />
    </>
  ) : (
    <>
      <DataRow 
        title="實心三角形數量" 
        value={triangles} 
        formulaNode={<MathFormula><V>N</V> <N>=</N> <N>3</N><sup><V>n</V></sup></MathFormula>} 
        colorClass="text-[#27ae60]"
      />
      <DataRow 
        title="剩餘面積比例" 
        value={areaRatio.toFixed(4)} 
        formulaNode={<MathFormula><V>A</V> <N>=</N> (<Fraction num={<N>3</N>} den={<N>4</N>}/>)<sup><V>n</V></sup></MathFormula>} 
        colorClass="text-[#27ae60]"
      />
    </>
  );

  return (
    <FractalLayout
      dropdownNode={dropdownNode}
      title={is3D ? "謝爾賓斯基四面體" : "謝爾賓斯基三角形"}
      description={
        <p><strong>{is3D ? "謝爾賓斯基四面體" : "謝爾賓斯基三角形"}</strong>是一種{is3D ? "立體" : "平面"}碎形。它的構造方法是：取一個實心的{is3D ? "正四面體，將其分成四個較小的正四面體，並挖去中間的八面體" : "等邊三角形，將其分成四個全等的小等邊三角形，並挖去中間的那一個"}。然後對剩下的{is3D ? "四" : "三"}個小{is3D ? "四面體" : "三角形"}重複這個過程。</p>
      }
      controlsNode={controlsNode}
      mathNode={mathNode}
      canvasNode={
        is3D ? <Sierpinski3D level={level} /> : (
          <svg viewBox="-20 -10 140 120" className="w-full h-full drop-shadow-md">
            <Sierpinski2D level={level} x={0} y={86.6} size={100} />
          </svg>
        )
      }
      onReset={() => {
        setLevel(0);
        setIs3D(false);
      }}
    />
  );
}

function Sierpinski2D({ level, x, y, size }: { level: number; x: number; y: number; size: number }) {
  if (level === 0) {
    const height = (size * Math.sqrt(3)) / 2;
    return (
      <polygon
        points={`${x},${y} ${x + size},${y} ${x + size / 2},${y - height}`}
        className="fill-[#27ae60]"
      />
    );
  }

  const newSize = size / 2;
  const height = (newSize * Math.sqrt(3)) / 2;

  return (
    <>
      <Sierpinski2D level={level - 1} x={x} y={y} size={newSize} />
      <Sierpinski2D level={level - 1} x={x + newSize} y={y} size={newSize} />
      <Sierpinski2D level={level - 1} x={x + newSize / 2} y={y - height} size={newSize} />
    </>
  );
}

function Sierpinski3D({ level }: { level: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    const width = mountNode.clientWidth || 800;
    const height = mountNode.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // 降低 FOV (從 75 降到 35) 以減少透視變形，並將攝影機往後拉
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountNode.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    // 將視角目標對準原點偏上，讓三角形置中
    controls.target.set(0, 0.2, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, -5, -5);
    scene.add(fillLight);

    const group = new THREE.Group();
    // 將四面體稍微往下移，使其視覺中心對齊原點
    group.position.y = -0.3;
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

    // 定義一個平放的正四面體頂點 (底面在 XZ 平面)
    const sq32 = Math.sqrt(3/2);
    const sq16 = Math.sqrt(1/6);
    const sq43 = Math.sqrt(4/3);
    const sq3 = Math.sqrt(3);

    const v0 = new THREE.Vector3(0, sq32, 0); // 頂點
    const v1 = new THREE.Vector3(0, -sq16, sq43); // 底面頂點 1
    const v2 = new THREE.Vector3(-1, -sq16, -1/sq3); // 底面頂點 2
    const v3 = new THREE.Vector3(1, -sq16, -1/sq3); // 底面頂點 3
    const vertices = [v0, v1, v2, v3];

    const count = Math.pow(4, level);
    
    const geometry = new THREE.BufferGeometry();
    const verticesArray = new Float32Array([
      // Base (v1, v3, v2)
      v1.x, v1.y, v1.z,
      v3.x, v3.y, v3.z,
      v2.x, v2.y, v2.z,
      // Front-right (v0, v1, v3)
      v0.x, v0.y, v0.z,
      v1.x, v1.y, v1.z,
      v3.x, v3.y, v3.z,
      // Back (v0, v3, v2)
      v0.x, v0.y, v0.z,
      v3.x, v3.y, v3.z,
      v2.x, v2.y, v2.z,
      // Front-left (v0, v2, v1)
      v0.x, v0.y, v0.z,
      v2.x, v2.y, v2.z,
      v1.x, v1.y, v1.z,
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: '#2ecc71', // 稍微調亮一點的綠色，讓受光面更明顯
      roughness: 0.8,
      metalness: 0.0,
      flatShading: true,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    const dummy = new THREE.Object3D();
    let idx = 0;

    const generate = (lvl: number, center: THREE.Vector3, size: number) => {
      if (lvl === 0) {
        dummy.position.copy(center);
        dummy.scale.set(size, size, size);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx++, dummy.matrix);
        return;
      }
      const newSize = size / 2;
      for (let i = 0; i < 4; i++) {
        const offset = vertices[i].clone().multiplyScalar(newSize);
        const newCenter = center.clone().add(offset);
        generate(lvl - 1, newCenter, newSize);
      }
    };

    generate(level, new THREE.Vector3(0, 0, 0), 1);
    mesh.instanceMatrix.needsUpdate = true;
    group.add(mesh);

  }, [level]);

  return <div ref={mountRef} className="w-full h-full cursor-move" />;
}
