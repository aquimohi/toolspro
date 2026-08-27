import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  GitCompare, 
  Copy, 
  Check, 
  Trash2, 
  ArrowRightLeft, 
  Plus, 
  Minus, 
  Sparkles,
  Upload,
  Download,
  FileText,
  Search,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Sliders,
  Settings2,
  Zap,
  Code2,
  FileCheck2,
  RotateCcw,
  Eye,
  Columns,
  ListFilter,
  CheckCircle2,
  FileCode,
  Share2
} from 'lucide-react';
import * as Diff from 'diff';
import { logActivity } from '../utils/activityLogger';

type DiffGranularity = 'words' | 'lines' | 'chars' | 'sentences' | 'json';
type DiffViewMode = 'split' | 'unified' | 'merged' | 'patch';

interface PresetItem {
  id: string;
  name: string;
  category: string;
  original: string;
  modified: string;
}

const PRESETS: PresetItem[] = [
  {
    id: 'code-ts',
    name: 'TypeScript Function Refactor',
    category: 'Code',
    original: `// Legacy User Fetcher
async function fetchUserData(userId: string) {
  var url = "https://api.example.com/v1/users/" + userId;
  var response = await fetch(url);
  if (response.status != 200) {
    throw new Error("Failed to load user");
  }
  var data = await response.json();
  return {
    id: data.id,
    name: data.first_name + " " + data.last_name,
    email: data.user_email
  };
}`,
    modified: `// Modern Type-Safe User Service
export async function fetchUserData(userId: string): Promise<UserProfile> {
  const endpoint = \`https://api.example.com/v2/users/\${encodeURIComponent(userId)}\`;
  const response = await fetch(endpoint, {
    headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' }
  });
  
  if (!response.ok) {
    throw new Error(\`Failed to load user (\${response.status}: \${response.statusText})\`);
  }
  
  const payload: ApiUserResponse = await response.json();
  return {
    id: payload.id,
    name: \`\${payload.firstName} \${payload.lastName}\`.trim(),
    email: payload.email.toLowerCase(),
    avatarUrl: payload.avatarUrl ?? '/default-avatar.png',
    verified: Boolean(payload.isEmailVerified)
  };
}`
  },
  {
    id: 'legal-nda',
    name: 'Legal Contract NDA Clause',
    category: 'Legal',
    original: `1. Confidentiality Obligations.
The Receiving Party agrees that it will hold in strict confidence all Confidential Information disclosed by the Disclosing Party. 
The Receiving Party shall not disclose such information to any third party for a period of 2 (two) years following the date of disclosure.
Liquidated damages for unauthorized disclosure shall be fixed at $10,000 USD per occurrence.`,
    modified: `1. Confidentiality Obligations and Protection Standards.
The Receiving Party agrees that it shall maintain in utmost confidence and secrecy all Confidential Information received from the Disclosing Party. 
The Receiving Party shall not disclose, distribute, or disseminate such proprietary information to any unauthorized third party for a perpetual period or until such information becomes public domain.
Liquidated damages for any willful breach or unauthorized disclosure shall be calculated based on direct damages or a minimum penalty of $50,000 USD per verified incident, including legal fees.`
  },
  {
    id: 'json-config',
    name: 'JSON Config & Feature Flags',
    category: 'Data',
    original: `{
  "appVersion": "1.4.2",
  "environment": "staging",
  "maxUploadSizeMb": 25,
  "features": {
    "darkMode": true,
    "betaAIAssistant": false,
    "realtimeSync": false
  },
  "database": {
    "host": "db-staging.internal.net",
    "port": 5432,
    "ssl": false
  }
}`,
    modified: `{
  "appVersion": "2.0.0",
  "environment": "production",
  "maxUploadSizeMb": 100,
  "features": {
    "darkMode": true,
    "betaAIAssistant": true,
    "realtimeSync": true,
    "pdfToolkitPro": true
  },
  "database": {
    "host": "db-cluster-primary.prod.cloud",
    "port": 5432,
    "ssl": true,
    "poolSize": 20
  }
}`
  },
  {
    id: 'editorial',
    name: 'Editorial Blog Post Revision',
    category: 'Content',
    original: `In the modern digital age, having reliable online productivity tools is essential. Many legacy tools require heavy installation files and slow down your operating system. Web tools provide a quick way to convert files without installing heavy programs on your hard disk.`,
    modified: `In today's fast-paced digital ecosystem, high-speed client-side productivity utilities are indispensable. Unlike outdated desktop software that demands bloated installations and compromises your computer's speed, modern browser-based web tools execute 100% locally with zero latency, complete data privacy, and instant multi-format conversions.`
  }
];

export const TextCompareTool: React.FC = () => {
  const [originalText, setOriginalText] = useState(PRESETS[0].original);
  const [modifiedText, setModifiedText] = useState(PRESETS[0].modified);

  const [diffType, setDiffType] = useState<DiffGranularity>('words');
  const [viewMode, setViewMode] = useState<DiffViewMode>('split');
  
  // Diff Filter & Sanitization Options
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreEmptyLines, setIgnoreEmptyLines] = useState(false);
  const [trimLines, setTrimLines] = useState(false);

  // Search & Navigation in Diff
  const [diffSearchQuery, setDiffSearchQuery] = useState('');
  const [currentDiffIndex, setCurrentDiffIndex] = useState(0);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'compare' | 'analytics' | 'patch'>('compare');

  const originalFileInputRef = useRef<HTMLInputElement>(null);
  const modifiedFileInputRef = useRef<HTMLInputElement>(null);
  const diffContainerRef = useRef<HTMLDivElement>(null);

  // Clean / Preprocess Text according to toggles
  const processedOriginal = useMemo(() => {
    let text = originalText;
    if (ignoreCase) text = text.toLowerCase();
    if (trimLines) text = text.split('\n').map(l => l.trimEnd()).join('\n');
    if (ignoreEmptyLines) text = text.split('\n').filter(l => l.trim().length > 0).join('\n');
    if (ignoreWhitespace) text = text.replace(/[ \t]+/g, ' ');
    return text;
  }, [originalText, ignoreCase, trimLines, ignoreEmptyLines, ignoreWhitespace]);

  const processedModified = useMemo(() => {
    let text = modifiedText;
    if (ignoreCase) text = text.toLowerCase();
    if (trimLines) text = text.split('\n').map(l => l.trimEnd()).join('\n');
    if (ignoreEmptyLines) text = text.split('\n').filter(l => l.trim().length > 0).join('\n');
    if (ignoreWhitespace) text = text.replace(/[ \t]+/g, ' ');
    return text;
  }, [modifiedText, ignoreCase, trimLines, ignoreEmptyLines, ignoreWhitespace]);

  // Compute Diff based on selected granularity
  const diffResult = useMemo(() => {
    try {
      if (diffType === 'words') {
        return Diff.diffWordsWithSpace(processedOriginal, processedModified);
      } else if (diffType === 'lines') {
        return Diff.diffLines(processedOriginal, processedModified);
      } else if (diffType === 'chars') {
        return Diff.diffChars(processedOriginal, processedModified);
      } else if (diffType === 'sentences') {
        return Diff.diffSentences(processedOriginal, processedModified);
      } else if (diffType === 'json') {
        try {
          const obj1 = JSON.parse(originalText);
          const obj2 = JSON.parse(modifiedText);
          const formatted1 = JSON.stringify(obj1, null, 2);
          const formatted2 = JSON.stringify(obj2, null, 2);
          return Diff.diffLines(formatted1, formatted2);
        } catch {
          // Fallback to lines if invalid JSON
          return Diff.diffLines(processedOriginal, processedModified);
        }
      }
      return Diff.diffWords(processedOriginal, processedModified);
    } catch (e) {
      console.error('Diff error:', e);
      return [];
    }
  }, [processedOriginal, processedModified, diffType, originalText, modifiedText]);

  // Generate Standard Unified Patch String
  const unifiedPatchString = useMemo(() => {
    try {
      return Diff.createTwoFilesPatch(
        'original.txt',
        'modified.txt',
        processedOriginal,
        processedModified,
        'Original Document',
        'Modified Document'
      );
    } catch {
      return '--- original.txt\n+++ modified.txt\n';
    }
  }, [processedOriginal, processedModified]);

  // Comprehensive Metrics & Statistical Breakdown
  const stats = useMemo(() => {
    let additions = 0;
    let deletions = 0;
    let unchanged = 0;
    let addedWords = 0;
    let deletedWords = 0;
    let deltaBlocks = 0;

    diffResult.forEach(part => {
      const len = part.value.length;
      const wordsCount = part.value.trim() ? part.value.trim().split(/\s+/).length : 0;

      if (part.added) {
        additions += len;
        addedWords += wordsCount;
        deltaBlocks++;
      } else if (part.removed) {
        deletions += len;
        deletedWords += wordsCount;
        deltaBlocks++;
      } else {
        unchanged += len;
      }
    });

    const origWords = originalText.trim() ? originalText.trim().split(/\s+/).length : 0;
    const modWords = modifiedText.trim() ? modifiedText.trim().split(/\s+/).length : 0;
    const origLines = originalText ? originalText.split('\n').length : 0;
    const modLines = modifiedText ? modifiedText.split('\n').length : 0;

    // Similarity Score Calculation (Levenshtein-approx / Token matching ratio)
    const totalContentLen = Math.max(originalText.length, modifiedText.length);
    let similarityPct = 100;
    if (totalContentLen > 0) {
      const differenceAmount = additions + deletions;
      const ratio = Math.max(0, 1 - differenceAmount / (unchanged + differenceAmount || 1));
      similarityPct = Math.round(ratio * 1000) / 10;
    }

    return {
      additions,
      deletions,
      unchanged,
      addedWords,
      deletedWords,
      deltaBlocks,
      origWords,
      modWords,
      origLines,
      modLines,
      similarityPct: Math.min(100, Math.max(0, similarityPct))
    };
  }, [diffResult, originalText, modifiedText]);

  // Handle Text Swap
  const handleSwap = () => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
    logActivity({
      toolId: 'text-compare',
      toolName: 'Text & Diff Compare',
      category: 'Text & Speech',
      action: 'Swapped comparison texts',
      status: 'info'
    });
  };

  // Copy Helpers
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(label);
      setTimeout(() => setCopiedMessage(null), 2500);
      logActivity({
        toolId: 'text-compare',
        toolName: 'Text & Diff Compare',
        category: 'Text & Speech',
        action: `Copied ${label} to clipboard`,
        status: 'success'
      });
    } catch {
      // Fallback
    }
  };

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'original' | 'modified') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (target === 'original') {
        setOriginalText(content);
      } else {
        setModifiedText(content);
      }
      logActivity({
        toolId: 'text-compare',
        toolName: 'Text & Diff Compare',
        category: 'Text & Speech',
        action: `Loaded ${file.name} into ${target} editor`,
        details: `File size: ${(file.size / 1024).toFixed(1)} KB`,
        status: 'success'
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Download Diff Report as HTML / Markdown / Patch
  const downloadReport = (format: 'html' | 'patch' | 'json') => {
    let mime = 'text/plain';
    let filename = `diff-report-${Date.now()}`;
    let content = '';

    if (format === 'patch') {
      content = unifiedPatchString;
      filename += '.patch';
      mime = 'text/x-diff';
    } else if (format === 'json') {
      content = JSON.stringify({
        metadata: {
          timestamp: new Date().toISOString(),
          similarity: `${stats.similarityPct}%`,
          diffType,
          additions: stats.additions,
          deletions: stats.deletions
        },
        differences: diffResult
      }, null, 2);
      filename += '.json';
      mime = 'application/json';
    } else {
      // Standalone HTML report with styling
      content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tools Pro - Visual Text Diff Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; background: #f8fafc; color: #0f172a; }
    .header { background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px; }
    .stats { display: flex; gap: 16px; margin-top: 12px; font-size: 14px; font-weight: 600; }
    .stat-add { color: #047857; background: #d1fae5; padding: 4px 10px; border-radius: 6px; }
    .stat-del { color: #b91c1c; background: #fee2e2; padding: 4px 10px; border-radius: 6px; }
    .stat-sim { color: #4338ca; background: #e0e7ff; padding: 4px 10px; border-radius: 6px; }
    .diff-box { background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
    .added { background: #dcfce7; color: #14532d; font-weight: 600; text-decoration: none; padding: 1px 3px; border-radius: 3px; }
    .removed { background: #fee2e2; color: #7f1d1d; text-decoration: line-through; padding: 1px 3px; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0 0 8px 0; font-size: 22px;">Visual Text Diff Report</h1>
    <div style="color: #64748b; font-size: 13px;">Generated via Tools Pro on ${new Date().toLocaleString()}</div>
    <div class="stats">
      <span class="stat-sim">Similarity: ${stats.similarityPct}%</span>
      <span class="stat-add">+ ${stats.additions} Chars Added</span>
      <span class="stat-del">- ${stats.deletions} Chars Removed</span>
      <span>Granularity: ${diffType.toUpperCase()}</span>
    </div>
  </div>
  <div class="diff-box">
${diffResult.map(part => {
  const escaped = part.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  if (part.added) return `<span class="added">${escaped}</span>`;
  if (part.removed) return `<span class="removed">${escaped}</span>`;
  return escaped;
}).join('')}
  </div>
</body>
</html>`;
      filename += '.html';
      mime = 'text/html';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    logActivity({
      toolId: 'text-compare',
      toolName: 'Text & Diff Compare',
      category: 'Text & Speech',
      action: `Exported diff report (${format.toUpperCase()})`,
      status: 'success'
    });
  };

  // Structured Side-by-Side Line Matrix Computation
  const sideBySideLines = useMemo(() => {
    const lines1 = processedOriginal.split('\n');
    const lines2 = processedModified.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);

    const rows: {
      leftNum: number | null;
      leftContent: string | null;
      rightNum: number | null;
      rightContent: string | null;
      isModified: boolean;
      isAdded: boolean;
      isDeleted: boolean;
      subDiffLeft?: Diff.Change[];
      subDiffRight?: Diff.Change[];
    }[] = [];

    // Line diff mapping
    const lineDiff = Diff.diffLines(processedOriginal, processedModified);
    let lIdx = 1;
    let rIdx = 1;

    lineDiff.forEach(part => {
      const partLines = part.value.replace(/\n$/, '').split('\n');
      
      if (part.added) {
        partLines.forEach(line => {
          rows.push({
            leftNum: null,
            leftContent: null,
            rightNum: rIdx++,
            rightContent: line,
            isModified: false,
            isAdded: true,
            isDeleted: false
          });
        });
      } else if (part.removed) {
        partLines.forEach(line => {
          rows.push({
            leftNum: lIdx++,
            leftContent: line,
            rightNum: null,
            rightContent: null,
            isModified: false,
            isAdded: false,
            isDeleted: true
          });
        });
      } else {
        partLines.forEach(line => {
          rows.push({
            leftNum: lIdx++,
            leftContent: line,
            rightNum: rIdx++,
            rightContent: line,
            isModified: false,
            isAdded: false,
            isDeleted: false
          });
        });
      }
    });

    return rows;
  }, [processedOriginal, processedModified]);

  // AI-Style Instant Change Explainer Summary
  const changeSummary = useMemo(() => {
    const highlights: string[] = [];

    if (stats.similarityPct === 100) {
      return {
        headline: 'Both texts are 100% identical.',
        details: 'No character, word, or whitespace variations detected.',
        points: ['Zero additions or deletions.', 'Perfect match across all lines.']
      };
    }

    if (stats.additions > 0 && stats.deletions === 0) {
      highlights.push(`New text was appended or inserted (+${stats.addedWords} words, +${stats.additions} characters).`);
    } else if (stats.deletions > 0 && stats.additions === 0) {
      highlights.push(`Content was redacted or deleted (-${stats.deletedWords} words, -${stats.deletions} characters).`);
    } else {
      highlights.push(`Substantial editing detected: +${stats.addedWords} words inserted, -${stats.deletedWords} words replaced.`);
    }

    if (stats.modLines !== stats.origLines) {
      const delta = stats.modLines - stats.origLines;
      highlights.push(`Line structure adjusted: ${delta > 0 ? `+${delta} lines added` : `${Math.abs(delta)} lines condensed`}.`);
    }

    return {
      headline: `${stats.similarityPct}% Text Match (${stats.deltaBlocks} distinct difference blocks)`,
      details: `Comparing ${stats.origWords} original words against ${stats.modWords} modified words across ${stats.origLines} to ${stats.modLines} lines.`,
      points: highlights
    };
  }, [stats]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12" id="text-compare-app">
      {/* Top Header & Overview Bar */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200">
            <GitCompare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">Text & Code Comparison Suite</h1>
              <span className="bg-indigo-50 text-indigo-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-200/60">
                Visual Diff 2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side & unified difference comparator for text documents, TypeScript/JavaScript code, JSON payloads, and legal terms
            </p>
          </div>
        </div>

        {/* Quick Actions & Preset Selector */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Preset dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Presets:</span>
            <select
              onChange={e => {
                const found = PRESETS.find(p => p.id === e.target.value);
                if (found) {
                  setOriginalText(found.original);
                  setModifiedText(found.modified);
                }
              }}
              className="text-xs font-semibold text-slate-800 bg-transparent border-0 focus:outline-none cursor-pointer"
            >
              {PRESETS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.category}: {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Swap Left & Right Texts"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Swap</span>
          </button>

          <div className="relative">
            <button
              onClick={() => downloadReport('html')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Summary & Quick Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Similarity Score</div>
            <div className="text-xl font-extrabold text-indigo-700 mt-0.5">
              {stats.similarityPct}%
            </div>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
            stats.similarityPct >= 90 ? 'bg-emerald-50 text-emerald-700' : stats.similarityPct >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
          }`}>
            {stats.similarityPct >= 90 ? 'High' : stats.similarityPct >= 60 ? 'Med' : 'Low'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Additions (+)</div>
            <div className="text-xl font-extrabold text-emerald-600 mt-0.5">
              +{stats.additions} <span className="text-xs font-semibold text-slate-400">chars</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deletions (-)</div>
            <div className="text-xl font-extrabold text-rose-600 mt-0.5">
              -{stats.deletions} <span className="text-xs font-semibold text-slate-400">chars</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Minus className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Delta Blocks</div>
            <div className="text-xl font-extrabold text-slate-800 mt-0.5">
              {stats.deltaBlocks} <span className="text-xs font-semibold text-slate-400">changes</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Toolbar: View Modes, Granularity, Sanitization */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: View Mode Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'split' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>

          <button
            onClick={() => setViewMode('unified')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'unified' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Unified Inline</span>
          </button>

          <button
            onClick={() => setViewMode('merged')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'merged' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visual Highlight</span>
          </button>

          <button
            onClick={() => setViewMode('patch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'patch' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Patch (.diff)</span>
          </button>
        </div>

        {/* Center: Granularity Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(['words', 'lines', 'chars', 'sentences', 'json'] as const).map(dt => (
            <button
              key={dt}
              onClick={() => setDiffType(dt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                diffType === dt ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {dt}
            </button>
          ))}
        </div>

        {/* Right: Sanitization Toggles */}
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 flex-wrap">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={e => setIgnoreCase(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Ignore Case</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={e => setIgnoreWhitespace(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Ignore Whitespace</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ignoreEmptyLines}
              onChange={e => setIgnoreEmptyLines(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Ignore Empty Lines</span>
          </label>
        </div>
      </div>

      {/* Main Dual Editor Area (Inputs) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Original (Before) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-3.5 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="font-bold text-rose-900">Original Document (Before)</span>
              <span className="text-[11px] text-rose-600 font-medium">
                {stats.origLines} lines · {stats.origWords} words
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={originalFileInputRef}
                type="file"
                accept=".txt,.json,.js,.ts,.html,.css,.py,.md,.csv,.sql"
                className="hidden"
                onChange={e => handleFileUpload(e, 'original')}
              />
              <button
                onClick={() => originalFileInputRef.current?.click()}
                className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                title="Upload file"
              >
                <Upload className="w-3 h-3" /> Upload
              </button>

              <button
                onClick={() => copyToClipboard(originalText, 'Original Text')}
                className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                title="Copy Original"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>

              <button
                onClick={() => setOriginalText('')}
                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                title="Clear Original"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            value={originalText}
            onChange={e => setOriginalText(e.target.value)}
            rows={10}
            placeholder="Type or paste the original text or upload a source file..."
            className="w-full p-4 text-xs md:text-sm font-mono border-0 focus:outline-none resize-y text-slate-800 leading-relaxed bg-white selection:bg-rose-100"
          />
        </div>

        {/* Right: Modified (After) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-3.5 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-emerald-900">Modified Document (After)</span>
              <span className="text-[11px] text-emerald-600 font-medium">
                {stats.modLines} lines · {stats.modWords} words
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={modifiedFileInputRef}
                type="file"
                accept=".txt,.json,.js,.ts,.html,.css,.py,.md,.csv,.sql"
                className="hidden"
                onChange={e => handleFileUpload(e, 'modified')}
              />
              <button
                onClick={() => modifiedFileInputRef.current?.click()}
                className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                title="Upload file"
              >
                <Upload className="w-3 h-3" /> Upload
              </button>

              <button
                onClick={() => copyToClipboard(modifiedText, 'Modified Text')}
                className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                title="Copy Modified"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>

              <button
                onClick={() => setModifiedText('')}
                className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer p-1"
                title="Clear Modified"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            value={modifiedText}
            onChange={e => setModifiedText(e.target.value)}
            rows={10}
            placeholder="Type or paste the revised text or upload a target file..."
            className="w-full p-4 text-xs md:text-sm font-mono border-0 focus:outline-none resize-y text-slate-800 leading-relaxed bg-white selection:bg-emerald-100"
          />
        </div>
      </div>

      {/* Copy notification popup */}
      {copiedMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold z-50 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{copiedMessage} copied to clipboard!</span>
        </div>
      )}

      {/* Diff Output Visualization Viewport */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden" ref={diffContainerRef}>
        {/* Output Header with Search & Export */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Rendered Diff Output ({viewMode.toUpperCase()})
            </span>

            <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
              <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Plus className="w-3 h-3" /> {stats.additions} Added
              </span>
              <span className="text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Minus className="w-3 h-3" /> {stats.deletions} Removed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Diff Copy */}
            <button
              onClick={() => copyToClipboard(unifiedPatchString, 'Unified Diff Patch')}
              className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Patch</span>
            </button>

            <button
              onClick={() => downloadReport('patch')}
              className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.diff</span>
            </button>

            <button
              onClick={() => downloadReport('html')}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>HTML Report</span>
            </button>
          </div>
        </div>

        {/* 1. SIDE-BY-SIDE (SPLIT) VIEW */}
        {viewMode === 'split' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse select-text">
              <thead>
                <tr className="bg-slate-100 text-slate-500 text-[11px] border-b border-slate-200">
                  <th className="w-12 py-2 px-3 text-right font-bold border-r border-slate-200">#</th>
                  <th className="w-1/2 py-2 px-4 text-left font-bold border-r border-slate-200">Original Document</th>
                  <th className="w-12 py-2 px-3 text-right font-bold border-r border-slate-200">#</th>
                  <th className="w-1/2 py-2 px-4 text-left font-bold">Modified Document</th>
                </tr>
              </thead>
              <tbody>
                {sideBySideLines.map((row, idx) => {
                  let leftBg = 'bg-white';
                  let rightBg = 'bg-white';
                  let leftText = 'text-slate-800';
                  let rightText = 'text-slate-800';

                  if (row.isDeleted) {
                    leftBg = 'bg-rose-50 text-rose-950';
                    rightBg = 'bg-slate-50 text-slate-400';
                  } else if (row.isAdded) {
                    leftBg = 'bg-slate-50 text-slate-400';
                    rightBg = 'bg-emerald-50 text-emerald-950 font-medium';
                  }

                  return (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-indigo-50/30 transition-colors">
                      {/* Left Line Number */}
                      <td className="w-12 py-1 px-3 text-right text-slate-400 bg-slate-50/80 select-none border-r border-slate-200 text-[11px]">
                        {row.leftNum ?? ''}
                      </td>
                      {/* Left Content */}
                      <td className={`w-1/2 py-1 px-4 border-r border-slate-200 whitespace-pre-wrap break-all ${leftBg} ${leftText}`}>
                        {row.leftContent !== null ? (
                          row.isDeleted ? (
                            <span className="bg-rose-200/70 text-rose-900 px-1 py-0.5 rounded">
                              {row.leftContent}
                            </span>
                          ) : (
                            row.leftContent || <span className="text-slate-300"> </span>
                          )
                        ) : (
                          <span className="text-slate-300 select-none">-</span>
                        )}
                      </td>

                      {/* Right Line Number */}
                      <td className="w-12 py-1 px-3 text-right text-slate-400 bg-slate-50/80 select-none border-r border-slate-200 text-[11px]">
                        {row.rightNum ?? ''}
                      </td>
                      {/* Right Content */}
                      <td className={`w-1/2 py-1 px-4 whitespace-pre-wrap break-all ${rightBg} ${rightText}`}>
                        {row.rightContent !== null ? (
                          row.isAdded ? (
                            <span className="bg-emerald-200/80 text-emerald-900 px-1 py-0.5 rounded">
                              {row.rightContent}
                            </span>
                          ) : (
                            row.rightContent || <span className="text-slate-300"> </span>
                          )
                        ) : (
                          <span className="text-slate-300 select-none">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. UNIFIED (INLINE) VIEW */}
        {viewMode === 'unified' && (
          <div className="p-0 font-mono text-xs select-text overflow-x-auto">
            <div className="flex flex-col divide-y divide-slate-100">
              {diffResult.map((part, index) => {
                const lines = part.value.replace(/\n$/, '').split('\n');
                
                if (part.added) {
                  return lines.map((line, lIdx) => (
                    <div key={`${index}-${lIdx}`} className="flex items-start bg-emerald-50/90 text-emerald-950 py-1 px-4 font-medium">
                      <span className="w-6 text-emerald-600 font-bold select-none shrink-0">+</span>
                      <span className="whitespace-pre-wrap break-all">{line || ' '}</span>
                    </div>
                  ));
                }
                
                if (part.removed) {
                  return lines.map((line, lIdx) => (
                    <div key={`${index}-${lIdx}`} className="flex items-start bg-rose-50/90 text-rose-950 py-1 px-4 opacity-85">
                      <span className="w-6 text-rose-600 font-bold select-none shrink-0">-</span>
                      <span className="line-through whitespace-pre-wrap break-all">{line || ' '}</span>
                    </div>
                  ));
                }

                return lines.map((line, lIdx) => (
                  <div key={`${index}-${lIdx}`} className="flex items-start bg-white text-slate-800 py-1 px-4">
                    <span className="w-6 text-slate-300 font-bold select-none shrink-0"> </span>
                    <span className="whitespace-pre-wrap break-all">{line || ' '}</span>
                  </div>
                ));
              })}
            </div>
          </div>
        )}

        {/* 3. VISUAL HIGHLIGHT VIEW */}
        {viewMode === 'merged' && (
          <div className="p-6 font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap select-text bg-white min-h-[220px]">
            {diffResult.map((part, index) => {
              if (part.added) {
                return (
                  <span
                    key={index}
                    className="bg-emerald-100 text-emerald-950 font-bold px-1 py-0.5 rounded border-b-2 border-emerald-400 mx-0.5 inline-block"
                  >
                    {part.value}
                  </span>
                );
              }
              if (part.removed) {
                return (
                  <span
                    key={index}
                    className="bg-rose-100 text-rose-950 line-through px-1 py-0.5 rounded border-b-2 border-rose-400 opacity-80 mx-0.5 inline-block"
                  >
                    {part.value}
                  </span>
                );
              }
              return <span key={index} className="text-slate-800">{part.value}</span>;
            })}
          </div>
        )}

        {/* 4. RAW PATCH (.DIFF) VIEW */}
        {viewMode === 'patch' && (
          <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed select-text overflow-x-auto whitespace-pre">
            {unifiedPatchString}
          </div>
        )}
      </div>

      {/* AI & Statistical Executive Summary Card */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 rounded-2xl border border-indigo-100 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Diff Intelligence & Summary</h3>
            <p className="text-xs text-slate-500">Automated structural change assessment</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-indigo-100/80 shadow-2xs">
          <div className="text-sm font-bold text-slate-800 mb-1">{changeSummary.headline}</div>
          <div className="text-xs text-slate-600 mb-3">{changeSummary.details}</div>

          <div className="space-y-1.5 border-t border-slate-100 pt-3">
            {changeSummary.points.map((pt, pIdx) => (
              <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
