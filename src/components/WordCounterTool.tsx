import React, { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Sparkles, FileText, Clock, Mic, AlignLeft } from 'lucide-react';

export const WordCounterTool: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const metrics = useMemo(() => {
    const trimmed = text.trim();
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0) : [];
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.trim().length > 0) : [];
    const lines = text ? text.split('\n') : [];
    const readingTime = Math.ceil(wordCount / 200);
    const speakingTime = Math.ceil(wordCount / 130);

    return {
      charsWithSpaces,
      charsNoSpaces,
      wordCount,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      lineCount: lines.length,
      readingTime: wordCount === 0 ? '0 min' : readingTime < 1 ? '< 1 min' : `${readingTime} min`,
      speakingTime: wordCount === 0 ? '0 min' : speakingTime < 1 ? '< 1 min' : `${speakingTime} min`,
    };
  }, [text]);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertSample = () => {
    setText(
      `The quick brown fox jumps over the lazy dog. Continuous small improvements generate exponential compound growth over time.\n\nIn client-side computing, zero data ever leaves your device, providing instant speed, complete offline reliability, and absolute privacy.`
    );
  };

  const handleCaseChange = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'trim') => {
    if (!text) return;
    if (type === 'upper') setText(text.toUpperCase());
    if (type === 'lower') setText(text.toLowerCase());
    if (type === 'title') {
      setText(text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()));
    }
    if (type === 'sentence') {
      setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()));
    }
    if (type === 'trim') {
      setText(text.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim());
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Word, Character & Text Metrics Pro</h2>
            <p className="text-xs text-slate-500">Live multi-metric analysis & formatting</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="insert-sample-btn"
            onClick={handleInsertSample}
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Sample Text
          </button>
          <button
            id="clear-text-btn"
            onClick={() => setText('')}
            className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Words</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-1">
            {metrics.wordCount.toLocaleString()}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Characters</span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {metrics.charsWithSpaces.toLocaleString()}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">No Spaces</span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {metrics.charsNoSpaces.toLocaleString()}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sentences</span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {metrics.sentenceCount.toLocaleString()}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Paragraphs</span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {metrics.paragraphCount.toLocaleString()}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Lines</span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {metrics.lineCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Reading / Speaking Bar */}
      <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-xs text-indigo-950 font-medium">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Reading Time: <strong className="font-bold text-indigo-900">{metrics.readingTime}</strong> (at 200 wpm)</span>
        </div>
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-indigo-600" />
          <span>Speaking Time: <strong className="font-bold text-indigo-900">{metrics.speakingTime}</strong> (at 130 wpm)</span>
        </div>
      </div>

      {/* Text Area Card with Transformations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <AlignLeft className="w-3.5 h-3.5 text-slate-500" /> Text Input
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => handleCaseChange('upper')}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 font-medium cursor-pointer"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => handleCaseChange('lower')}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 font-medium cursor-pointer"
            >
              lowercase
            </button>
            <button
              onClick={() => handleCaseChange('title')}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 font-medium cursor-pointer"
            >
              Title Case
            </button>
            <button
              onClick={() => handleCaseChange('sentence')}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 font-medium cursor-pointer"
            >
              Sentence case
            </button>
            <button
              onClick={() => handleCaseChange('trim')}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 font-medium cursor-pointer"
            >
              Clean Spaces
            </button>
          </div>
        </div>

        <textarea
          id="word-counter-textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste any text here to see real-time character & word calculations..."
          className="w-full p-4 min-h-[300px] text-sm md:text-base text-slate-800 leading-relaxed focus:outline-none resize-y border-0"
        />

        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {text ? `${metrics.charsWithSpaces.toLocaleString()} total characters` : 'Ready for input'}
          </span>
          <button
            id="copy-text-btn"
            onClick={handleCopy}
            disabled={!text}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : text
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>
      </div>
    </div>
  );
};
