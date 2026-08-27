import React, { useState, useMemo } from 'react';
import { 
  Code2, 
  FileCode, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles, 
  Minimize2, 
  Maximize2,
  ListTree,
  AlertCircle
} from 'lucide-react';
import { ToolId } from '../types';

interface CodeMinifierToolsProps {
  toolId: 'code-minifier' | 'json-editor';
}

export const CodeMinifierTools: React.FC<CodeMinifierToolsProps> = ({ toolId }) => {
  const [language, setLanguage] = useState<'css' | 'js' | 'html' | 'json'>('css');
  const [mode, setMode] = useState<'minify' | 'unminify'>('minify');
  const [inputCode, setInputCode] = useState(`/* Standard CSS Stylesheet */
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.nav-link:hover {
  color: #4f46e5;
  text-decoration: underline;
}`);

  const [copied, setCopied] = useState(false);

  // Minify / Beautify Engine
  const processedOutput = useMemo(() => {
    if (!inputCode.trim()) return '';

    try {
      if (language === 'json') {
        const parsed = JSON.parse(inputCode);
        return mode === 'minify' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
      }

      if (language === 'css') {
        if (mode === 'minify') {
          return inputCode
            .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
            .replace(/\s+/g, ' ') // collapse whitespace
            .replace(/\s*([{}:;,])\s*/g, '$1') // remove spaces around brackets and colons
            .replace(/;}/g, '}') // remove trailing semicolon
            .trim();
        } else {
          // Unminify CSS
          return inputCode
            .replace(/\{/g, ' {\n  ')
            .replace(/;/g, ';\n  ')
            .replace(/\}/g, '\n}\n\n')
            .replace(/\n\s*\n\s*\}/g, '\n}')
            .trim();
        }
      }

      if (language === 'js') {
        if (mode === 'minify') {
          return inputCode
            .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
            .replace(/\/\/.*/g, '') // remove single-line comments
            .replace(/\s+/g, ' ') // collapse whitespaces
            .replace(/\s*([=+\-*/%?:&|!<>{}(),;])\s*/g, '$1') // tighten operators
            .trim();
        } else {
          // Unminify JS
          return inputCode
            .replace(/\{/g, ' {\n  ')
            .replace(/\}/g, '\n}\n')
            .replace(/;/g, ';\n')
            .trim();
        }
      }

      if (language === 'html') {
        if (mode === 'minify') {
          return inputCode
            .replace(/<!--[\s\S]*?-->/g, '') // remove comments
            .replace(/>\s+</g, '><') // collapse whitespace between tags
            .replace(/\s+/g, ' ')
            .trim();
        } else {
          // Unminify HTML
          return inputCode
            .replace(/></g, '>\n<')
            .replace(/(<[^\/][^>]*>)/g, '$1\n  ')
            .trim();
        }
      }

      return inputCode;
    } catch (err: any) {
      return `/* Syntax Error: ${err.message} */`;
    }
  }, [inputCode, language, mode]);

  const copyCode = async () => {
    if (!processedOutput) return;
    await navigator.clipboard.writeText(processedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const samplePresets: Record<string, string> = {
    css: `.card { display: flex; padding: 20px; background: #fff; border-radius: 8px; }`,
    js: `function calculateTotal(items, taxRate){ const subtotal = items.reduce((acc, i) => acc + i.price, 0); return subtotal * (1 + taxRate); }`,
    html: `<div class="container"><header><h1>Dashboard</h1></header><main><p>Welcome user</p></main></div>`,
    json: `{"app":"Web Utilities","version":"2.0.0","active":true,"features":["minify","pdf","audio"]}`,
  };

  const handleLanguageChange = (lang: 'css' | 'js' | 'html' | 'json') => {
    setLanguage(lang);
    setInputCode(samplePresets[lang]);
  };

  const compressionSavings = useMemo(() => {
    if (!inputCode || !processedOutput) return 0;
    const orig = new Blob([inputCode]).size;
    const proc = new Blob([processedOutput]).size;
    if (orig === 0) return 0;
    return Math.round(((orig - proc) / orig) * 100);
  }, [inputCode, processedOutput]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
            {toolId === 'json-editor' ? <ListTree className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {toolId === 'json-editor' ? 'Interactive JSON Tree Editor & Formatter' : 'Code Minifier & Beautifier Engine'}
            </h2>
            <p className="text-xs text-slate-500">
              High-speed CSS, JavaScript, HTML & JSON minification and unminification
            </p>
          </div>
        </div>

        {/* Language & Mode Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            {(['css', 'js', 'html', 'json'] as const).map(l => (
              <button
                key={l}
                onClick={() => handleLanguageChange(l)}
                className={`px-3 py-1 rounded-lg uppercase transition-all cursor-pointer ${
                  language === l ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setMode('minify')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                mode === 'minify' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Minify
            </button>
            <button
              onClick={() => setMode('unminify')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                mode === 'unminify' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unminify (Beautify)
            </button>
          </div>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Input {language.toUpperCase()} Code</span>
            <button
              onClick={() => setInputCode('')}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            value={inputCode}
            onChange={e => setInputCode(e.target.value)}
            placeholder={`Paste your ${language.toUpperCase()} code here...`}
            rows={14}
            className="w-full p-4 text-xs md:text-sm font-mono border-0 focus:outline-none resize-y text-slate-800 leading-relaxed"
          />
        </div>

        {/* Right: Output */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <span className="capitalize">{mode} Output</span>
              {mode === 'minify' && compressionSavings > 0 && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  -{compressionSavings}% Size
                </span>
              )}
            </div>
            <button
              onClick={copyCode}
              className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-bold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={processedOutput}
            rows={14}
            className="w-full p-4 text-xs md:text-sm font-mono bg-slate-50/50 border-0 focus:outline-none resize-y text-indigo-950 leading-relaxed select-all"
          />
        </div>
      </div>
    </div>
  );
};
