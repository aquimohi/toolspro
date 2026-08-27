import React, { useState, useMemo } from 'react';
import { Binary, Sparkles, Trash2, Check, Copy, AlertCircle } from 'lucide-react';

export const RegexTesterTool: React.FC = () => {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState({ g: true, i: true, m: false, s: false });
  const [testString, setTestString] = useState(
    'Contact team@example.com or support@google.com for assistance. Inquiries can also be sent to hr@company.org.'
  );
  const [preset, setPreset] = useState('');
  const [copied, setCopied] = useState<number | null>(null);

  const presets: Record<string, { pattern: string; sample: string }> = {
    email: {
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      sample: 'Contact hello@company.org or sales@domain.co.uk for inquiries.',
    },
    url: {
      pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
      sample: 'Visit https://google.com or https://news.ycombinator.com/item?id=123',
    },
    ipv4: {
      pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
      sample: 'Gateway 192.168.1.1 and DNS 8.8.8.8 are operational. Invalid: 999.1.2.3',
    },
    uuid: {
      pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}',
      sample: 'Session Token: c9bf9e57-1685-4c89-bafb-ff5af830be8a (UUID v4)',
    },
    phone: {
      pattern: '\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})',
      sample: 'Call (555) 123-4567 or 800-555-0199 for bookings.',
    },
  };

  const handlePresetSelect = (val: string) => {
    setPreset(val);
    if (presets[val]) {
      setPattern(presets[val].pattern);
      setTestString(presets[val].sample);
    }
  };

  const flagStr = useMemo(() => {
    let f = '';
    if (flags.g) f += 'g';
    if (flags.i) f += 'i';
    if (flags.m) f += 'm';
    if (flags.s) f += 's';
    return f;
  }, [flags]);

  const regexEvaluation = useMemo(() => {
    if (!pattern) {
      return { matches: [], highlighted: testString, error: null };
    }
    try {
      const regex = new RegExp(pattern, flagStr);
      const matches: Array<{ text: string; index: number; groups: string[] }> = [];

      if (flags.g) {
        let m: RegExpExecArray | null;
        let guard = 0;
        while ((m = regex.exec(testString)) !== null && guard < 1000) {
          guard++;
          matches.push({ text: m[0], index: m.index, groups: m.slice(1) });
          if (m.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        const m = regex.exec(testString);
        if (m) matches.push({ text: m[0], index: m.index, groups: m.slice(1) });
      }

      return { matches, error: null };
    } catch (err: any) {
      return { matches: [], error: err.message };
    }
  }, [pattern, flagStr, testString, flags.g]);

  const renderHighlighted = () => {
    if (regexEvaluation.error || regexEvaluation.matches.length === 0) {
      return <span>{testString}</span>;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    regexEvaluation.matches.forEach((m, i) => {
      elements.push(testString.slice(lastIndex, m.index));
      elements.push(
        <mark
          key={i}
          className="bg-yellow-200 text-yellow-900 px-1 py-0.5 rounded font-semibold border border-yellow-300"
        >
          {m.text}
        </mark>
      );
      lastIndex = m.index + m.text.length;
    });
    elements.push(testString.slice(lastIndex));
    return elements;
  };

  const copyMatch = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Interactive Regex Tester & Matcher</h2>
            <p className="text-xs text-slate-500">Live regular expression tester with capture group decomposition</p>
          </div>
        </div>
        <select
          value={preset}
          onChange={e => handlePresetSelect(e.target.value)}
          className="text-xs font-medium text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="">-- Load Regex Preset --</option>
          <option value="email">Email Address</option>
          <option value="url">URL with Protocol</option>
          <option value="ipv4">IPv4 Address</option>
          <option value="uuid">UUID v4</option>
          <option value="phone">US Phone Number</option>
        </select>
      </div>

      {/* Regex Pattern Input Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-mono text-lg select-none">/</span>
          <input
            type="text"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            className="flex-1 min-w-[200px] px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <span className="text-slate-400 font-mono text-lg select-none">/</span>

          {/* Flags */}
          <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono select-none">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.g}
                onChange={e => setFlags({ ...flags, g: e.target.checked })}
                className="rounded text-indigo-600 cursor-pointer"
              />
              <span className="font-bold">g</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.i}
                onChange={e => setFlags({ ...flags, i: e.target.checked })}
                className="rounded text-indigo-600 cursor-pointer"
              />
              <span className="font-bold">i</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.m}
                onChange={e => setFlags({ ...flags, m: e.target.checked })}
                className="rounded text-indigo-600 cursor-pointer"
              />
              <span className="font-bold">m</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.s}
                onChange={e => setFlags({ ...flags, s: e.target.checked })}
                className="rounded text-indigo-600 cursor-pointer"
              />
              <span className="font-bold">s</span>
            </label>
          </div>
        </div>

        {regexEvaluation.error && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>Regex Error: {regexEvaluation.error}</span>
          </div>
        )}
      </div>

      {/* Dual Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input + Highlighted */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Test String</span>
              <button
                onClick={() => setTestString('')}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
            <textarea
              value={testString}
              onChange={e => setTestString(e.target.value)}
              placeholder="Enter text to match against here..."
              className="w-full p-4 min-h-[140px] text-xs md:text-sm font-mono border-0 focus:outline-none resize-y text-slate-800 leading-relaxed"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 flex justify-between items-center">
              <span>Live Highlighted Output</span>
              <span className="text-xs font-bold text-indigo-600">
                {regexEvaluation.matches.length} match{regexEvaluation.matches.length === 1 ? '' : 'es'}
              </span>
            </div>
            <div className="w-full p-4 min-h-[150px] text-xs md:text-sm font-mono whitespace-pre-wrap break-all leading-relaxed text-slate-800 bg-slate-50/50">
              {renderHighlighted()}
            </div>
          </div>
        </div>

        {/* Right Column: Match Inspector */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Match Inspection ({regexEvaluation.matches.length})
          </h3>
          <div className="flex-1 overflow-y-auto max-h-[460px] flex flex-col gap-2.5 pr-1">
            {regexEvaluation.matches.length === 0 ? (
              <span className="text-xs text-slate-400 py-8 text-center">No matches found in test string.</span>
            ) : (
              regexEvaluation.matches.map((m, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono">
                  <div className="flex justify-between items-center font-bold text-slate-800 mb-1.5">
                    <span>Match #{idx + 1}</span>
                    <span className="text-slate-400 font-normal">Index: {m.index}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-indigo-600 font-bold break-all">{m.text}</span>
                    <button
                      onClick={() => copyMatch(m.text, idx)}
                      className="p-1 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      title="Copy match"
                    >
                      {copied === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {m.groups.length > 0 && (
                    <div className="mt-2 text-[11px] text-slate-600 flex flex-col gap-1">
                      <span className="font-semibold text-slate-500">Capture Groups:</span>
                      {m.groups.map((g, gi) => (
                        <span key={gi} className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                          Group {gi + 1}: {g || 'undefined'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
