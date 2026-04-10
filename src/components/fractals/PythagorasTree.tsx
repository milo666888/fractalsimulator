import React, { useState } from 'react';
import { FractalLayout, DataRow, MathFormula, Fraction, SliderControl, V, N, useAutoPlay } from '../ui/FractalLayout';

export default function PythagorasTree({ dropdownNode }: { dropdownNode: React.ReactNode }) {
  const [level, setLevel] = useState(5);
  const { isPlaying, togglePlay } = useAutoPlay(level, setLevel, 0, 9, 800);
  const [angleDeg, setAngleDeg] = useState(45);

  const squaresCount = Math.pow(2, level + 1) - 1;

  const controlsNode = (
    <>
      <SliderControl label={<>階數 (<V>n</V>)</>} value={level} min={0} max={9} onChange={(e: any) => setLevel(parseInt(e.target.value, 10))} colorClass="accent-[#f59e0b]" isPlaying={isPlaying} onPlayToggle={togglePlay} />
      <SliderControl label={<>傾斜角度 (<N>&deg;</N>)</>} value={angleDeg} min={20} max={70} onChange={(e: any) => setAngleDeg(parseInt(e.target.value, 10))} colorClass="accent-[#f59e0b]" />
    </>
  );

  const mathNode = (
    <>
      <DataRow title="正方形總數" value={squaresCount} formulaNode={<MathFormula><V>N</V> <N>=</N> <N>2</N><sup><V>n</V><N>+</N><N>1</N></sup> <N>&minus;</N> <N>1</N></MathFormula>} colorClass="text-[#f59e0b]" />
      <DataRow title="當前階數新增" value={Math.pow(2, level)} formulaNode={<MathFormula><V>N</V><sub><V>new</V></sub> <N>=</N> <N>2</N><sup><V>n</V></sup></MathFormula>} colorClass="text-[#f59e0b]" />
    </>
  );

  return (
    <FractalLayout
      dropdownNode={dropdownNode}
      title="畢氏樹 (Pythagoras Tree)"
      description={<p><strong>畢氏樹</strong>是由正方形組成的平面碎形。從一個大正方形開始，在其上方建立一個直角三角形，然後在三角形的另外兩個邊上建立兩個較小的正方形，不斷重複此過程。</p>}
      controlsNode={controlsNode}
      mathNode={mathNode}
      canvasNode={<svg viewBox="-150 -300 300 350" className="w-full h-full drop-shadow-md"><Tree level={level} angle={angleDeg * (Math.PI / 180)} /></svg>}
    />
  );
}

function Tree({ level, angle }: { level: number, angle: number }) {
  const renderBranch = (n: number, size: number): React.ReactNode => {
    if (n < 0) return null;

    const leftSize = size * Math.cos(angle);
    const rightSize = size * Math.sin(angle);
    
    const hue = 30 + (100 * (1 - n / 10)); 
    const color = `hsl(${hue}, 60%, 50%)`;

    return (
      <g>
        <rect x={-size / 2} y={-size} width={size} height={size} fill={color} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        {n > 0 && (
          <>
            <g transform={`translate(${-size / 2}, ${-size}) rotate(${-angle * (180 / Math.PI)}) translate(${leftSize / 2}, 0)`}>
              {renderBranch(n - 1, leftSize)}
            </g>
            <g transform={`translate(${size / 2}, ${-size}) rotate(${(Math.PI / 2 - angle) * (180 / Math.PI)}) translate(${-rightSize / 2}, 0)`}>
              {renderBranch(n - 1, rightSize)}
            </g>
          </>
        )}
      </g>
    );
  };

  return <g transform="translate(0, 0)">{renderBranch(level, 50)}</g>;
}
