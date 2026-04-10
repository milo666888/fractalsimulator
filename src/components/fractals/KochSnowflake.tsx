import React, { useState, useMemo } from 'react';
import { FractalLayout, DataRow, MathFormula, Fraction, SliderControl, V, N, useAutoPlay } from '../ui/FractalLayout';

export default function KochSnowflake({ dropdownNode }: { dropdownNode: React.ReactNode }) {
  const [level, setLevel] = useState(3);
  const { isPlaying, togglePlay } = useAutoPlay(level, setLevel, 0, 6, 800);

  const segments = 3 * Math.pow(4, level);
  const perimeterRatio = Math.pow(4/3, level);

  const pathData = useMemo(() => {
    const p1 = { x: 150, y: 50 };
    const p2 = { x: 250, y: 50 + 100 * Math.sqrt(3) };
    const p3 = { x: 50, y: 50 + 100 * Math.sqrt(3) };

    const getKochPoints = (a: {x: number, y: number}, b: {x: number, y: number}, depth: number): {x: number, y: number}[] => {
      if (depth === 0) return [a];
      
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      
      const pA = { x: a.x + dx / 3, y: a.y + dy / 3 };
      const pC = { x: a.x + dx * 2 / 3, y: a.y + dy * 2 / 3 };
      
      const angle = -Math.PI / 3;
      const pB = {
        x: pA.x + (pC.x - pA.x) * Math.cos(angle) - (pC.y - pA.y) * Math.sin(angle),
        y: pA.y + (pC.x - pA.x) * Math.sin(angle) + (pC.y - pA.y) * Math.cos(angle)
      };

      return [
        ...getKochPoints(a, pA, depth - 1),
        ...getKochPoints(pA, pB, depth - 1),
        ...getKochPoints(pB, pC, depth - 1),
        ...getKochPoints(pC, b, depth - 1)
      ];
    };

    const points = [
      ...getKochPoints(p1, p2, level),
      ...getKochPoints(p2, p3, level),
      ...getKochPoints(p3, p1, level)
    ];

    return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
  }, [level]);

  const controlsNode = (
    <SliderControl label={<>階數 (<V>n</V>)</>} value={level} min={0} max={6} onChange={(e: any) => setLevel(parseInt(e.target.value, 10))} colorClass="accent-[#0ea5e9]" isPlaying={isPlaying} onPlayToggle={togglePlay} />
  );

  const mathNode = (
    <>
      <DataRow title="線段總數" value={segments} formulaNode={<MathFormula><V>N</V> <N>=</N> <N>3</N> <N>&times;</N> <N>4</N><sup><V>n</V></sup></MathFormula>} colorClass="text-[#0ea5e9]" />
      <DataRow title="周長倍率" value={perimeterRatio.toFixed(2) + 'x'} formulaNode={<MathFormula><V>P</V> <N>=</N> (<Fraction num={<N>4</N>} den={<N>3</N>}/>)<sup><V>n</V></sup></MathFormula>} colorClass="text-[#0ea5e9]" />
    </>
  );

  return (
    <FractalLayout
      dropdownNode={dropdownNode}
      title="科赫雪花 (Koch Snowflake)"
      description={<p><strong>科赫雪花</strong>從一個正三角形開始，將每條邊分成三等分，並在中間那段向外凸出一個新的小正三角形。隨著階數增加，它的周長會趨近於無限大，但面積卻是有限的！</p>}
      controlsNode={controlsNode}
      mathNode={mathNode}
      canvasNode={<svg viewBox="0 0 300 300" className="w-full h-full max-w-2xl drop-shadow-md"><path d={pathData} fill="#bae6fd" stroke="#0284c7" strokeWidth="1" strokeLinejoin="round" /></svg>}
    />
  );
}
