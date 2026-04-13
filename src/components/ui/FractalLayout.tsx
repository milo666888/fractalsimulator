import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function useAutoPlay(value: number, setValue: (v: number) => void, min: number, max: number, interval: number = 1000) {
  const [isPlaying, setIsPlaying] = useState(false);
  const dirRef = React.useRef(1);
  
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setValue(prev => {
        if (prev >= max) {
          dirRef.current = -1;
          return prev - 1;
        }
        if (prev <= min) {
          dirRef.current = 1;
          return prev + 1;
        }
        return prev + dirRef.current;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [isPlaying, max, min, setValue, interval]);

  return { isPlaying, togglePlay: () => setIsPlaying(!isPlaying) };
}

interface FractalLayoutProps {
  dropdownNode: React.ReactNode;
  controlsNode: React.ReactNode;
  mathNode: React.ReactNode;
  canvasNode: React.ReactNode;
  title: string;
  description: React.ReactNode;
  onReset?: () => void;
}

export function FractalLayout({ dropdownNode, controlsNode, mathNode, canvasNode, title, description, onReset }: FractalLayoutProps) {
  const [isDescOpen, setIsDescOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden w-full h-full bg-[#f4f5fa] text-[#1a1f36]">
      
      {/* 手機/平板版上方列 */}
      <div className="lg:hidden flex flex-col bg-white border-b border-[#d8dcea] shrink-0 z-10">
        <div className="p-3 border-b border-[#d8dcea] bg-[#fdf4ff]">
          {dropdownNode}
        </div>
        <div className="p-3 border-b border-[#d8dcea]">
          <button onClick={() => setIsDescOpen(!isDescOpen)} className="w-full flex justify-between items-center font-bold text-[#5a6280] text-left">
            <span className="flex items-center gap-2">
              <span className="text-lg">📖</span> 圖形說明
            </span>
            <span className="text-sm text-[#3060e0]">{isDescOpen ? '▲' : '▼'}</span>
          </button>
          <AnimatePresence>
            {isDescOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-3 text-sm text-[#5a6280] leading-relaxed bg-[#f0f4ff] p-3 rounded-lg border border-[#c8d4f8]">
                  {description}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-widest uppercase text-[#5a6280]">
              <span className="w-2 h-2 rounded-full bg-[#3060e0]"></span>
              參數設定
            </div>
            {onReset && (
              <button onClick={onReset} className="text-xs flex items-center gap-1 text-[#5a6280] hover:text-[#3060e0] transition-colors bg-white border border-[#d8dcea] px-2 py-1 rounded shadow-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                重設
              </button>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {controlsNode}
          </div>
        </div>
      </div>

      {/* 電腦版左側面板 (選單 + 說明 + 參數) */}
      <aside className="hidden lg:flex w-[320px] bg-white border-r border-[#d8dcea] flex-col overflow-y-auto shrink-0 z-10">
        <div className="p-4 border-b border-[#d8dcea] bg-[#fdf4ff]">
          {dropdownNode}
        </div>
        <div className="p-4 border-b border-[#d8dcea]">
          <button onClick={() => setIsDescOpen(!isDescOpen)} className="w-full flex justify-between items-center font-bold text-[#5a6280] text-left hover:text-[#3060e0] transition-colors">
            <span className="flex items-center gap-2">
              <span className="text-lg">📖</span> 圖形說明
            </span>
            <span className="text-sm text-[#3060e0]">{isDescOpen ? '▲' : '▼'}</span>
          </button>
          <AnimatePresence>
            {isDescOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="text-[14px] text-[#5a6280] leading-relaxed mt-3 bg-[#f0f4ff] p-4 rounded-lg border border-[#c8d4f8]">
                  {description}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="p-4 lg:p-5 flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[12px] font-bold tracking-widest uppercase text-[#5a6280]">
              <span className="w-2 h-2 rounded-full bg-[#3060e0]"></span>
              參數設定
            </div>
            {onReset && (
              <button onClick={onReset} className="text-xs flex items-center gap-1 text-[#5a6280] hover:text-[#3060e0] transition-colors bg-white border border-[#d8dcea] px-2 py-1 rounded shadow-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                重設
              </button>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {controlsNode}
          </div>
        </div>
      </aside>

      {/* 中間畫布區域 */}
      <main className="w-full lg:flex-1 relative flex items-center justify-center lg:overflow-hidden p-3 lg:p-4 shrink-0">
        <div className="w-full aspect-square max-h-[400px] lg:aspect-auto lg:h-full lg:max-h-none bg-white rounded-xl shadow-sm border border-[#d8dcea] relative overflow-hidden flex items-center justify-center">
          {canvasNode}
        </div>
      </main>

      {/* 電腦版右側面板 (算術與數據) */}
      <aside className="hidden lg:flex w-[320px] bg-[#f4f5fa] border-l border-[#d8dcea] flex-col overflow-y-auto shrink-0 z-10">
        <div className="p-4 lg:p-5">
          <div className="flex items-center gap-2 text-[12px] font-bold tracking-widest uppercase text-[#5a6280] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#7c3aed]"></span>
            算術與數據
          </div>
          <div className="flex flex-col gap-4">
            {mathNode}
          </div>
        </div>
      </aside>

      {/* 手機/平板版下方區域 (算術與數據) */}
      <div className="lg:hidden flex flex-col shrink-0 z-10 bg-white border-t border-[#d8dcea]">
        <div className="p-4 bg-[#f4f5fa]">
          <div className="flex items-center gap-2 text-[12px] font-bold tracking-widest uppercase text-[#5a6280] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#7c3aed]"></span>
            算術與數據
          </div>
          <div className="flex flex-col gap-4">
            {mathNode}
          </div>
        </div>
      </div>

    </div>
  );
}

// 數學字體輔助元件
export function V({ children }: { children: React.ReactNode }) {
  return <i className="italic font-['Times_New_Roman'] mx-[1px]">{children}</i>;
}

export function N({ children }: { children: React.ReactNode }) {
  return <span className="not-italic font-['Times_New_Roman'] mx-[1px]">{children}</span>;
}

export function Fraction({ num, den }: { num: React.ReactNode, den: React.ReactNode }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle mx-1 text-[0.85em] font-['Times_New_Roman'] leading-none">
      <span className="border-b border-current px-1 pb-[2px]">{num}</span>
      <span className="pt-[2px] px-1">{den}</span>
    </span>
  );
}

export function MathFormula({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-['Times_New_Roman'] not-italic text-[1.15em] tracking-wide inline-flex items-center flex-wrap">
      {children}
    </span>
  );
}

export function DataRow({ title, value, formulaNode, colorClass = "text-[#3060e0]" }: { title: React.ReactNode, value: React.ReactNode, formulaNode: React.ReactNode, colorClass?: string }) {
  return (
    <div className="bg-white border border-[#d8dcea] rounded-lg p-5 flex flex-col gap-2 shadow-sm">
      <div className="text-sm font-bold text-[#5a6280]">{title}</div>
      <motion.div key={String(value)} initial={{ scale: 1.05, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className={`text-3xl font-bold font-['Times_New_Roman'] ${colorClass}`}>
        {value}
      </motion.div>
      <div className="text-sm text-[#5a6280] mt-2 border-t border-[#d8dcea] pt-3 flex items-center flex-wrap gap-1">
        {formulaNode}
      </div>
    </div>
  );
}

export function SliderControl({ label, value, min, max, step = 1, onChange, colorClass = "accent-[#3060e0]", isPlaying, onPlayToggle }: any) {
  const [localValue, setLocalValue] = useState(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setLocalValue(rawValue);
    
    if (rawValue === '' || rawValue === '-') {
      return; // 暫時不觸發 onChange，讓使用者可以清空輸入框或輸入負號
    }
    
    let val = parseFloat(rawValue);
    if (!isNaN(val)) {
      // 只有在合法範圍內才即時更新圖形，超出範圍則等待 onBlur 時回歸
      if (val >= min && val <= max) {
        onChange(e);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let val = parseFloat(localValue);
    // 防呆：如果清空、無效數字、或超出範圍，回歸上一個有效數值 (value)
    if (isNaN(val) || val < min || val > max) {
      e.target.value = value.toString();
      setLocalValue(value.toString());
      // 因為數值回歸到原本的 value，不需要觸發 onChange
    } else {
      e.target.value = val.toString();
      onChange(e);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-[#5a6280] w-28 shrink-0 font-medium flex items-center gap-1">
        {label}
      </div>
      <div className="w-6 flex justify-center shrink-0">
        {onPlayToggle && (
          <button onClick={onPlayToggle} className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors flex items-center justify-center" title={isPlaying ? "暫停自動播放" : "開始自動播放"}>
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
        )}
      </div>
      <div className="w-16 shrink-0">
        <input 
          type="number" 
          value={localValue} 
          min={min} 
          max={max} 
          step={step}
          onChange={handleNumberChange} 
          onBlur={handleBlur}
          className="w-full bg-white border border-[#d8dcea] rounded px-2 py-1.5 text-sm font-['Times_New_Roman'] outline-none focus:border-[#3060e0] transition-colors" 
        />
      </div>
      <div className="flex-1">
        <input type="range" min={min} max={max} step={step} value={value} onChange={onChange} className={`w-full h-1.5 bg-[#d8dcea] rounded-lg appearance-none cursor-pointer ${colorClass}`} />
      </div>
    </div>
  );
}
