import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Code2, AlertTriangle, Sparkles, Wrench } from 'lucide-react';

export const JsonFormatterTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<{ valid: boolean; message: string }>({ valid: true, message: 'Ready' });
  const [copied, setCopied] = useState(false);

  const formatJson = (indent: number, sortKeys = false) => {
    if (!input.trim()) {
      setOutput('');
      setStatus({ valid: true, message: 'Ready' });
      return;
    }
    try {
      let parsed = JSON.parse(input);
      if (sortKeys && typeof parsed === 'object' && parsed !== null) {
        parsed = sortObjectKeys(parsed);
      }
      const res = indent === 0 ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
      setOutput(res);
      setStatus({ valid: true, message: '✓ Valid JSON' });
    } catch (err: any) {
      setOutput(`Syntax Error: ${err.message}`);
      setStatus({ valid: false, message: '✕ Invalid JSON' });
    }
  };

  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(sortObjectKeys);
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((acc: any, key) => {
          acc[key] = sortObjectKeys(obj[key]);
          return acc;
        }, {});
    }
    return obj;
  };

  const handleFixCommonIssues = () => {
    let text = input;
    // Replace single quotes around keys/strings and remove trailing commas in objects and arrays
    text = text
      .replace(/,\s*([}\]])/g, '$1')
      .replace(/'/g, '"');
    setInput(text);
    try {
      const parsed = JSON.parse(text);
      setOutput(JSON.stringify(parsed, null, 2));
      setStatus({ valid: true, message: '✓ Repaired & Formatted' });
    } catch (err: any) {
      setStatus({ valid: false, message: 'Could not auto-repair all syntax errors' });
    }
  };

  const handleInsertSample = () => {
    const sample = {
      project: 'Web Utilities Suite',
      version: '1.0.0',
      active: true,
      features: ['Real-time word counter', 'Client-side image resizer', 'JSON Formatter', 'Crypto Hash & Base64'],
      performance: {
        networkLatencyMs: 0,
        privacyMode: '100% in-browser sandbox'
      }
    };
    const str = JSON.stringify(sample);
    setInput(str);
    setOutput(JSON.stringify(sample, null, 2));
    setStatus({ valid: true, message: '✓ Valid JSON' });
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `data_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">JSON Formatter, Validator & Minifier</h2>
            <p className="text-xs text-slate-500">Instant syntax linting, key sorting, and trailing-comma repair</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleInsertSample}
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Sample
          </button>
          <button
            onClick={() => { setInput(''); setOutput(''); setStatus({ valid: true, message: 'Ready' }); }}
            className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => formatJson(2)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            Format (2 Spaces)
          </button>
          <button
            onClick={() => formatJson(4)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors border border-slate-300 cursor-pointer"
          >
            Format (4 Spaces)
          </button>
          <button
            onClick={() => formatJson(0)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors border border-slate-300 cursor-pointer"
          >
            Minify / Compact
          </button>
          <button
            onClick={() => formatJson(2, true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors border border-slate-300 cursor-pointer"
          >
            Sort Keys
          </button>
          <button
            onClick={handleFixCommonIssues}
            className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Wrench className="w-3 h-3 text-amber-700" /> Fix Commas/Quotes
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
              !input.trim()
                ? 'bg-slate-100 text-slate-600'
                : status.valid
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800 flex items-center gap-1'
            }`}
          >
            {!status.valid && <AlertTriangle className="w-3 h-3 inline" />}
            {status.message}
          </span>
        </div>
      </div>

      {/* Dual Panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 flex justify-between items-center">
            <span>Raw JSON Input</span>
            <span className="text-slate-400 font-normal">{input.length.toLocaleString()} chars</span>
          </div>
          <textarea
            value={input}
            onChange={e => {
              setInput(e.target.value);
            }}
            placeholder="Paste your JSON here..."
            className="w-full flex-1 min-h-[380px] p-4 text-xs md:text-sm font-mono leading-relaxed text-slate-800 focus:outline-none resize-none border-0"
          />
        </div>

        {/* Output */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 flex justify-between items-center">
            <span>Formatted Result</span>
            <span className="text-slate-400 font-normal">{output.length.toLocaleString()} chars</span>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Formatted output will appear here..."
            className="w-full flex-1 min-h-[380px] p-4 text-xs md:text-sm font-mono leading-relaxed bg-slate-50/50 text-slate-800 focus:outline-none resize-none border-0"
          />
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {output && status.valid ? 'Ready to copy or export' : ''}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={!output || !status.valid}
                className="flex items-center gap-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" /> .json
              </button>
              <button
                onClick={handleCopy}
                disabled={!output || !status.valid}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : output && status.valid
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Result'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
