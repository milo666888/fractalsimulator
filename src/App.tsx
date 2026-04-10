/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import MengerSponge from './components/fractals/MengerSponge';
import SierpinskiTriangle from './components/fractals/SierpinskiTriangle';
import PythagorasTree from './components/fractals/PythagorasTree';
import KochSnowflake from './components/fractals/KochSnowflake';
import FractalTree from './components/fractals/FractalTree';

const fractals = [
  { id: 'menger', name: '門格海綿 (Menger Sponge)', component: MengerSponge },
  { id: 'pythagoras', name: '畢氏樹 (Pythagoras Tree)', component: PythagorasTree },
  { id: 'sierpinski', name: '謝爾賓斯基三角形 (Sierpinski Triangle)', component: SierpinskiTriangle },
  { id: 'tree', name: '碎形樹枝 (Fractal Tree)', component: FractalTree },
  { id: 'koch', name: '科赫雪花 (Koch Snowflake)', component: KochSnowflake },
];

export default function App() {
  const [selectedFractal, setSelectedFractal] = useState(fractals[0].id);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const CurrentFractalComponent = fractals.find(f => f.id === selectedFractal)?.component || MengerSponge;

  const dropdownNode = (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-[#5a6280] uppercase tracking-wider">選擇圖形</label>
      <select 
        className="w-full p-2.5 bg-white rounded-lg border border-[#d8dcea] text-[#1a1f36] font-medium outline-none focus:border-[#3060e0] cursor-pointer shadow-sm"
        value={selectedFractal}
        onChange={(e) => setSelectedFractal(e.target.value)}
      >
        {fractals.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f4f5fa] overflow-hidden" style={{ fontFamily: '"Times New Roman", "Noto Sans TC", "Microsoft JhengHei", sans-serif' }}>
      {/* Header */}
      <header className="h-16 flex items-center px-5 bg-white border-b border-[#d8dcea] shrink-0 gap-4 z-20">
        <div className="h-10 w-10 shrink-0 relative flex items-center justify-center">
          {/* 支援使用者自行上傳的 logo.png */}
          <img 
            src="/logo.png" 
            alt="Logo" 
            className={`max-h-full max-w-full object-contain z-10 transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`} 
            onLoad={() => setLogoLoaded(true)}
            onError={(e) => e.currentTarget.style.display = 'none'} 
          />
          {!logoLoaded && (
            <div className="absolute inset-0 bg-[#eef0f8] border-2 border-dashed border-[#c0c8e0] rounded-lg flex items-center justify-center text-[10px] text-[#9098b8] font-bold text-center leading-tight z-0">
              公司<br/>LOGO
            </div>
          )}
        </div>
        <div className="w-px h-8 bg-[#d8dcea]"></div>
        <div>
          <h1 className="text-xl font-bold text-[#1a1f36] leading-tight">碎形模擬器</h1>
          <p className="text-[13px] text-[#5a6280] mt-0.5 hidden sm:block">觀察數學圖形：遞迴、維度與極限</p>
        </div>
      </header>

      {/* Main Content */}
      <CurrentFractalComponent dropdownNode={dropdownNode} />
    </div>
  );
}
