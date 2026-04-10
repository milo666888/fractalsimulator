import React, { useState, useMemo } from 'react';
import { FractalLayout, DataRow, MathFormula, Fraction, SliderControl, V, N, useAutoPlay } from '../ui/FractalLayout';

export default function FractalTree({ dropdownNode }: { dropdownNode: React.ReactNode }) {
  const [level, setLevel] = useState(7);
  const { isPlaying, togglePlay } = useAutoPlay(level, setLevel, 1, 11, 800);
  const [angle, setAngle] = useState(25);
  const [skewAngle, setSkewAngle] = useState(0);
  const [lengthScale, setLengthScale] = useState(0.75);

  const branchesCount = Math.pow(2, level + 1) - 1;

  const elements = useMemo(() => {
    const lines: React.ReactNode[] = [];
    const generateBranch = (x: number, y: number, len: number, ang: number, depth: number, isRoot: boolean, step: number) => {
      if (depth === 0) return;
      
      const x2 = x + len * Math.sin(ang * Math.PI / 180);
      const y2 = y - len * Math.cos(ang * Math.PI / 180);
      
      // 樹幹為棕色，樹枝為綠色漸層，越末端越細。使用 step (距離根部的步數) 來計算，避免階數改變時粗細跳動
      const strokeColor = isRoot ? "#5c4033" : `hsl(90, 70%, ${30 + step * 5}%)`;
      const strokeWidth = Math.max(1, 10 - step * 0.8);

      lines.push(
        <line key={`line-${depth}-${x}-${y}-${ang}`} x1={x} y1={y} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      );
      
      generateBranch(x2, y2, len * lengthScale, ang - angle + skewAngle, depth - 1, false, step + 1);
      generateBranch(x2, y2, len * lengthScale, ang + angle + skewAngle, depth - 1, false, step + 1);
    };

    generateBranch(250, 450, 100, 0, level + 1, true, 0);
    return lines;
  }, [level, angle, skewAngle, lengthScale]);

  const controlsNode = (
    <>
      <SliderControl label={<>階數 (<V>n</V>)</>} value={level} min={1} max={11} onChange={(e: any) => setLevel(parseInt(e.target.value, 10))} colorClass="accent-[#16a34a]" isPlaying={isPlaying} onPlayToggle={togglePlay} />
      <SliderControl label={<>分岔角度 (<N>&deg;</N>)</>} value={angle} min={5} max={90} onChange={(e: any) => setAngle(parseInt(e.target.value, 10))} colorClass="accent-[#16a34a]" />
      <SliderControl label={<>傾斜角度 (<N>&deg;</N>)</>} value={skewAngle} min={-45} max={45} onChange={(e: any) => setSkewAngle(parseInt(e.target.value, 10))} colorClass="accent-[#16a34a]" />
      <SliderControl label="長度縮放" value={lengthScale} min={0.5} max={0.85} step={0.01} onChange={(e: any) => setLengthScale(parseFloat(e.target.value))} colorClass="accent-[#16a34a]" />
    </>
  );

  const mathNode = (
    <>
      <DataRow title="樹枝總數" value={branchesCount} formulaNode={<MathFormula><V>N</V> <N>=</N> <N>2</N><sup><V>n</V><N>+</N><N>1</N></sup> <N>&minus;</N> <N>1</N></MathFormula>} colorClass="text-[#16a34a]" />
      <DataRow title="末端樹葉數" value={Math.pow(2, level)} formulaNode={<MathFormula><V>L</V> <N>=</N> <N>2</N><sup><V>n</V></sup></MathFormula>} colorClass="text-[#16a34a]" />
    </>
  );

  return (
    <FractalLayout
      dropdownNode={dropdownNode}
      title="碎形樹枝 (Fractal Tree)"
      description={<p><strong>碎形樹枝</strong>模擬了自然界中植物的生長模式。一根樹幹分岔為兩根較短的樹枝，每根樹枝再繼續分岔。透過調整分岔角度、傾斜角度與長度縮放比例，可以創造出各種型態。</p>}
      controlsNode={controlsNode}
      mathNode={mathNode}
      canvasNode={<svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-md">{elements}</svg>}
    />
  );
}
