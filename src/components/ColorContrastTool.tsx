import React, { useState, useMemo } from 'react';
import { Palette, ArrowLeftRight, Check, X, Sparkles, Copy } from 'lucide-react';

export const ColorContrastTool: React.FC = () => {
  const [fgColor, setFgColor] = useState('#1e1b4b');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [copied, setCopied] = useState<string | null>(null);

  const hexToRgb = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
    if (clean.length !== 6) return { r: 0, g: 0, b: 0 };
    const num = parseInt(clean, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const contrastData = useMemo(() => {
    const fgRgb = hexToRgb(fgColor);
    const bgRgb = hexToRgb(bgColor);
    const l1 = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const l2 = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    const ratio = (brightest + 0.05) / (darkest + 0.05);

    return {
      fgRgb,
      bgRgb,
      ratio,
      aaNormal: ratio >= 4.5,
      aaaNormal: ratio >= 7.0,
      aaLarge: ratio >= 3.0,
      aaaLarge: ratio >= 4.5,
    };
  }, [fgColor, bgColor]);

  const handleSwap = () => {
    const temp = fgColor;
    setFgColor(bgColor);
    setBgColor(temp);
  };

  const copyVal = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  const presets = [
    { name: 'Indigo on White', fg: '#1E1B4B', bg: '#FFFFFF' },
    { name: 'Slate Dark', fg: '#F8FAFC', bg: '#0F172A' },
    { name: 'Emerald High', fg: '#064E3B', bg: '#ECFDF5' },
    { name: 'Amber Alert', fg: '#78350F', bg: '#FEF3C7' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Color & WCAG Contrast Pro</h2>
            <p className="text-xs text-slate-500">WCAG 2.1 accessibility checker (AA/AAA) and color conversions</p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {presets.map(p => (
            <button
              key={p.name}
              onClick={() => { setFgColor(p.fg); setBgColor(p.bg); }}
              className="text-xs font-medium px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Color Inputs</h3>

          {/* Text Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Text / Foreground Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={e => setFgColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
              />
              <input
                type="text"
                value={fgColor.toUpperCase()}
                onChange={e => setFgColor(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase"
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={e => setBgColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
              />
              <input
                type="text"
                value={bgColor.toUpperCase()}
                onChange={e => setBgColor(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase"
              />
            </div>
          </div>

          <button
            onClick={handleSwap}
            className="w-full py-2.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-indigo-200 cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" /> Swap Foreground & Background
          </button>

          <hr className="border-slate-100 my-1" />

          {/* Conversions */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-700">RGB Conversions</span>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col gap-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">FG RGB:</span>
                <button
                  onClick={() => copyVal(`rgb(${contrastData.fgRgb.r}, ${contrastData.fgRgb.g}, ${contrastData.fgRgb.b})`, 'fgrgb')}
                  className="flex items-center gap-1 text-slate-800 font-semibold hover:text-indigo-600 cursor-pointer"
                >
                  <span>rgb({contrastData.fgRgb.r}, {contrastData.fgRgb.g}, {contrastData.fgRgb.b})</span>
                  {copied === 'fgrgb' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">BG RGB:</span>
                <button
                  onClick={() => copyVal(`rgb(${contrastData.bgRgb.r}, ${contrastData.bgRgb.g}, ${contrastData.bgRgb.b})`, 'bgrgb')}
                  className="flex items-center gap-1 text-slate-800 font-semibold hover:text-indigo-600 cursor-pointer"
                >
                  <span>rgb({contrastData.bgRgb.r}, {contrastData.bgRgb.g}, {contrastData.bgRgb.b})</span>
                  {copied === 'bgrgb' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview & WCAG Assessment */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
          {/* Live Stage */}
          <div
            className="p-6 rounded-2xl border border-slate-200 flex flex-col gap-2 transition-colors shadow-inner"
            style={{ backgroundColor: bgColor, color: fgColor }}
          >
            <span className="text-xs opacity-75 uppercase tracking-wider font-semibold">Live Preview Surface</span>
            <h4 className="text-2xl font-extrabold">The Quick Brown Fox Jumps</h4>
            <p className="text-sm leading-relaxed">
              Accessible design guarantees digital experiences are readable and intuitive across all lighting environments and accessibility needs.
            </p>
          </div>

          {/* Calculated Contrast Ratio */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase">Contrast Ratio</span>
              <div className="text-3xl font-extrabold text-indigo-600 mt-0.5">
                {contrastData.ratio.toFixed(2)} : 1
              </div>
            </div>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full border ${
                contrastData.aaaNormal
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : contrastData.aaNormal
                  ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                  : contrastData.aaLarge
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}
            >
              {contrastData.aaaNormal ? 'AAA Pass' : contrastData.aaNormal ? 'AA Pass' : contrastData.aaLarge ? 'Large Only' : 'Fail'}
            </span>
          </div>

          {/* Detailed Criteria Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-center text-center">
              <span className="text-[11px] font-medium text-slate-500">Normal AA (≥4.5)</span>
              <span className={`mt-1 text-xs font-bold px-2 py-0.5 rounded ${contrastData.aaNormal ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {contrastData.aaNormal ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-center text-center">
              <span className="text-[11px] font-medium text-slate-500">Normal AAA (≥7.0)</span>
              <span className={`mt-1 text-xs font-bold px-2 py-0.5 rounded ${contrastData.aaaNormal ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {contrastData.aaaNormal ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-center text-center">
              <span className="text-[11px] font-medium text-slate-500">Large AA (≥3.0)</span>
              <span className={`mt-1 text-xs font-bold px-2 py-0.5 rounded ${contrastData.aaLarge ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {contrastData.aaLarge ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-center text-center">
              <span className="text-[11px] font-medium text-slate-500">Large AAA (≥4.5)</span>
              <span className={`mt-1 text-xs font-bold px-2 py-0.5 rounded ${contrastData.aaaLarge ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {contrastData.aaaLarge ? 'PASS' : 'FAIL'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
