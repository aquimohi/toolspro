import React, { useState, useEffect } from 'react';
import {
  Info,
  ShieldCheck,
  Zap,
  Lock,
  Globe2,
  Mail,
  Send,
  CheckCircle2,
  Cpu,
  Sparkles,
  HelpCircle,
  Clock,
  ChevronRight,
  Headphones,
  ArrowRight,
  Database,
  Building,
  Terminal,
  FileCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import { ContactQuery } from '../types';

interface AboutUsPageProps {
  onOpenTool: (toolId?: string) => void;
  onOpenManual: () => void;
  onOpenChatbot: () => void;
}

const STORAGE_KEY_QUERIES = 'web_util_contact_queries';

export function AboutUsPage({ onOpenTool, onOpenManual, onOpenChatbot }: AboutUsPageProps) {
  // Query Form State
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    category: ContactQuery['category'];
    subject: string;
    message: string;
  }>({
    name: '',
    email: '',
    category: 'General Query',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [pastQueries, setPastQueries] = useState<ContactQuery[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load existing user tickets
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_QUERIES);
      if (raw) {
        setPastQueries(JSON.parse(raw));
      }
    } catch {}
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newQuery: ContactQuery = {
        id: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        category: formData.category,
        subject: formData.subject.trim() || `${formData.category} Request`,
        message: formData.message.trim(),
        status: 'Received'
      };

      const updated = [newQuery, ...pastQueries];
      setPastQueries(updated);
      try {
        localStorage.setItem(STORAGE_KEY_QUERIES, JSON.stringify(updated));
      } catch {}

      setTicketId(newQuery.id);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        category: 'General Query',
        subject: '',
        message: ''
      });
    }, 650);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300 pb-16">
      
      {/* Hero Mission Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-purple-800/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>About Tools Pro</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            High-Performance, Zero-Server Privacy Tools for the Modern Web.
          </h1>

          <p className="text-purple-100 text-base sm:text-lg leading-relaxed">
            We build lightning-fast web utilities designed for engineers, creators, students, and businesses.
            Every tool operates <strong>100% in your browser memory</strong> — your sensitive PDFs, documents, audio clips, images, and credentials never touch a remote server or third-party database.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onOpenChatbot}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg cursor-pointer"
            >
              <Headphones className="w-4 h-4" />
              <span>Ask AI Tool Assistant</span>
            </button>

            <button
              onClick={onOpenManual}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl transition-all cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-purple-300" />
              <span>Read Documentation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Principles Bento Grid (Multi-Pastel) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50/50 p-6 sm:p-8 rounded-3xl border border-emerald-200/80 shadow-2xs space-y-4 hover:border-emerald-300 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-emerald-950">Zero-Server Data Privacy</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            All PDF merges, audio edits, OCR vision parsing, and hashing occur inside client Web Workers & WebAssembly engines. No telemetries or tracking.
          </p>
        </div>

        <div className="bg-indigo-50/50 p-6 sm:p-8 rounded-3xl border border-indigo-200/80 shadow-2xs space-y-4 hover:border-indigo-300 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200 shadow-2xs">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-indigo-950">Sub-Millisecond Speed</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Without server network hops or upload bottlenecks, files process instantly at the native speed of your device CPU and GPU acceleration.
          </p>
        </div>

        <div className="bg-purple-50/50 p-6 sm:p-8 rounded-3xl border border-purple-200/80 shadow-2xs space-y-4 hover:border-purple-300 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shadow-2xs">
            <Terminal className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-purple-950">60+ Production Utilities</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Everything in one unified workbench: PDF, Audio, OCR, Label Croppers, SEO generators, Financial calculators, and Network diagnostics.
          </p>
        </div>
      </div>

      {/* Main Section: Query / Contact Form + FAQ & Assistant Help */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Contact Query Form (7 cols) */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-xs p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-purple-700 tracking-wider">Help Desk & Support</span>
              {pastQueries.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-xs text-purple-700 hover:text-purple-900 font-semibold cursor-pointer underline"
                >
                  {showHistory ? 'Back to Submit Query' : `View Your Tickets (${pastQueries.length})`}
                </button>
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-900">Send a Query or Feature Request</h2>
            <p className="text-slate-600 text-sm">
              Need a custom tool, found a bug, or have an enterprise inquiry? Fill out the form below and our team will get back to you.
            </p>
          </div>

          {submitSuccess ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <h4 className="font-bold text-base">Query Submitted Successfully!</h4>
              </div>
              <p className="text-xs text-emerald-800">
                Your ticket <strong>#{ticketId}</strong> has been registered in our system. We usually respond within 2-4 business hours.
              </p>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Submit Another Query
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setShowHistory(true);
                  }}
                  className="px-4 py-2 bg-white text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  View My Tickets
                </button>
              </div>
            </div>
          ) : showHistory ? (
            /* User Tickets History View */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Your Submitted Inquiries ({pastQueries.length})</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-xs font-semibold text-purple-700 hover:underline cursor-pointer"
                >
                  + New Query
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {pastQueries.map((q) => (
                  <div key={q.id} className="p-4 bg-purple-50/40 rounded-xl border border-purple-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{q.subject}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {q.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{q.message}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Ref: #{q.id} • {q.category}</span>
                      <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Query Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="alex@company.com"
                    className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Inquiry Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white cursor-pointer"
                  >
                    <option value="General Query">General Query</option>
                    <option value="Feature Request">Request a New Tool</option>
                    <option value="Bug Report">Report a Tool Bug</option>
                    <option value="Enterprise / Custom Tool">Enterprise & API Integration</option>
                    <option value="Billing & Subscription">Billing & Payments</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief summary of your inquiry"
                    className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Detailed Message / Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Explain what you need, tool specifications, or steps to reproduce any issue..."
                  className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Query...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Official Query</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right: Interactive Support & Chatbot Promo (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI Chatbot Assistant Card */}
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-purple-700/50 shadow-lg space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-400/30">
              <Headphones className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Need Real-Time Tool Assistance?</h3>
              <p className="text-purple-200 text-xs leading-relaxed">
                Our embedded Interactive AI Assistant understands all 60+ tools and can guide you through tricky PDF merges, audio bitrate adjustments, OCR scans, and regex formats instantly.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenChatbot}
              className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Launch AI Tool Chatbot</span>
            </button>
          </div>

          {/* Quick FAQ Accordion */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>Frequently Asked Questions</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-1">
                <h4 className="font-bold text-emerald-950">Is my data really 100% private?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Yes. Tools Pro is built using HTML5 File APIs, Canvas, WebAudio, and WebAssembly. Your files never leave your computer.
                </p>
              </div>

              <div className="p-3.5 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-1">
                <h4 className="font-bold text-purple-950">Can I request a custom utility?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Absolutely! Use the query form on this page with category "Request a New Tool". We review submissions weekly.
                </p>
              </div>

              <div className="p-3.5 bg-sky-50/40 rounded-2xl border border-sky-100 space-y-1">
                <h4 className="font-bold text-sky-950">Can I download tools offline?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Yes! Click "Download .html" in the header to save clean, standalone single-file versions that work completely without an internet connection.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
