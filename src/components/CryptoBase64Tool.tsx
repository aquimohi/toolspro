import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Copy, Check, Upload, Hash, Link2, FileCode } from 'lucide-react';

export const CryptoBase64Tool: React.FC = () => {
  const [input, setInput] = useState('');
  const [base64Result, setBase64Result] = useState('');
  const [sha256Result, setSha256Result] = useState('');
  const [sha1Result, setSha1Result] = useState('');
  const [sha512Result, setSha512Result] = useState('');
  const [urlEncoded, setUrlEncoded] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const computeHash = async (text: string, algorithm: 'SHA-256' | 'SHA-1' | 'SHA-512') => {
    if (!text) return '';
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  useEffect(() => {
    if (!input) {
      setBase64Result('');
      setSha256Result('');
      setSha1Result('');
      setSha512Result('');
      setUrlEncoded('');
      return;
    }

    try {
      setBase64Result(btoa(unescape(encodeURIComponent(input))));
    } catch {
      setBase64Result('Encoding error');
    }

    setUrlEncoded(encodeURIComponent(input));

    computeHash(input, 'SHA-256').then(setSha256Result);
    computeHash(input, 'SHA-1').then(setSha1Result);
    computeHash(input, 'SHA-512').then(setSha512Result);
  }, [input]);

  const handleDecodeBase64 = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input.trim())));
      setInput(decoded);
    } catch {
      alert('Invalid Base64 string to decode');
    }
  };

  const handleDecodeUrl = () => {
    try {
      const decoded = decodeURIComponent(input.trim());
      setInput(decoded);
    } catch {
      alert('Invalid URL-encoded string');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setInput(`[File: ${file.name} (${file.size} bytes)]`);
      setBase64Result(res);
      computeHash(res, 'SHA-256').then(setSha256Result);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = async (text: string, key: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Base64 & Web Crypto Hasher</h2>
            <p className="text-xs text-slate-500">Hardware-accelerated client-side SHA hashing and Base64 transforms</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> File to Base64
          </button>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Input Text or Payload</label>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDecodeBase64}
              className="text-xs font-medium px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-300 transition-colors cursor-pointer"
            >
              Decode as Base64
            </button>
            <button
              onClick={handleDecodeUrl}
              className="text-xs font-medium px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-300 transition-colors cursor-pointer"
            >
              Decode as URL
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type or paste any text to immediately calculate Base64, SHA-256, SHA-1 and URL encodings..."
          className="w-full min-h-[130px] p-3.5 text-xs md:text-sm font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 leading-relaxed"
        />
      </div>

      {/* Output Results */}
      <div className="grid grid-cols-1 gap-4">
        {/* Base64 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">Base64 Output</span>
            </div>
            <button
              onClick={() => copyToClipboard(base64Result, 'b64')}
              className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-300 cursor-pointer font-medium"
            >
              {copiedKey === 'b64' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'b64' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <input
            type="text"
            readOnly
            value={base64Result}
            placeholder="Base64 encoded string..."
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 select-all"
          />
        </div>

        {/* SHA-256 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">SHA-256 Digest (Web Crypto API)</span>
            </div>
            <button
              onClick={() => copyToClipboard(sha256Result, 'sha256')}
              className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-300 cursor-pointer font-medium"
            >
              {copiedKey === 'sha256' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'sha256' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <input
            type="text"
            readOnly
            value={sha256Result}
            placeholder="SHA-256 hash..."
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-indigo-700 font-bold select-all"
          />
        </div>

        {/* 2-Column for SHA-1 & URL Encoded */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-800">SHA-1 Digest</span>
              </div>
              <button
                onClick={() => copyToClipboard(sha1Result, 'sha1')}
                className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-300 cursor-pointer font-medium"
              >
                {copiedKey === 'sha1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'sha1' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={sha1Result}
              placeholder="SHA-1 hash..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 select-all"
            />
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-800">URL Encoded</span>
              </div>
              <button
                onClick={() => copyToClipboard(urlEncoded, 'url')}
                className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-300 cursor-pointer font-medium"
              >
                {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'url' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={urlEncoded}
              placeholder="URL encoded string..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 select-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
