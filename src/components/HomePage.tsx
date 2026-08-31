import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  Terminal,
  FileCode,
  Headphones,
  CheckCircle2,
  Layers,
  FileText,
  Volume2,
  Scissors,
  ShoppingBag,
  Binary,
  Globe,
  Sliders,
  DollarSign,
  MapPin,
  Tag,
  ImageIcon,
  Send,
  HelpCircle,
  Clock,
  ChevronRight,
  ExternalLink,
  BookOpen,
  ArrowUpRight,
  Star,
  Check,
  Server,
  Download,
  AlertCircle,
  Database,
  GitCompare
} from 'lucide-react';
import { ToolCategory, ToolId, ToolMeta, ContactQuery } from '../types';

interface HomePageProps {
  tools: ToolMeta[];
  onSelectTool: (id: ToolId) => void;
  onOpenHub: () => void;
  onOpenManual: () => void;
  onOpenChatbot: () => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  favorites: ToolId[];
  onToggleFavorite: (id: ToolId) => void;
}

const STORAGE_KEY_QUERIES = 'web_util_contact_queries';

export function HomePage({
  tools,
  onSelectTool,
  onOpenHub,
  onOpenManual,
  onOpenChatbot,
  onOpenSearch,
  onOpenProfile,
  favorites,
  onToggleFavorite
}: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<ToolCategory | 'All'>('All');

  // Contact Query Form State
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
  const [pastQueries, setPastQueries] = useState<ContactQuery[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_QUERIES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);

  // Filter tools based on query or category tab
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = !searchQuery.trim() || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategoryTab === 'All' || tool.category === selectedCategoryTab;
      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategoryTab]);

  // Featured Highlight Suites with accurate ToolIds & pastel themes
  const featuredSuites = [
    {
      id: 'text-compare-suite',
      title: 'Text & Word Tools',
      category: 'Text & Speech',
      icon: GitCompare,
      badge: 'Popular',
      desc: 'Easily compare text, count words, and convert text to speech.',
      tools: [
        { id: 'text-compare' as ToolId, name: 'Text & Diff Compare' },
        { id: 'word-counter' as ToolId, name: 'Word Counter' },
        { id: 'text-to-speech' as ToolId, name: 'Text to Speech' },
      ],
      theme: {
        cardBg: 'bg-indigo-50/40 hover:bg-indigo-50/70',
        border: 'border-indigo-200/80 hover:border-indigo-300',
        iconBg: 'bg-indigo-100 text-indigo-600',
        badge: 'bg-indigo-100/80 text-indigo-800 border-indigo-200',
        button: 'bg-white hover:bg-indigo-100/60 text-slate-700 hover:text-indigo-900 border-indigo-100',
        headerText: 'text-indigo-950 group-hover:text-indigo-700'
      }
    },
    {
      id: 'pdf-suite',
      title: 'PDF Tools',
      category: 'PDF Tools',
      icon: FileText,
      badge: 'Most Used',
      desc: 'Merge, split, protect, and edit your PDF files quickly and securely.',
      tools: [
        { id: 'pdf-merge' as ToolId, name: 'PDF Merger' },
        { id: 'pdf-split' as ToolId, name: 'PDF Splitter' },
        { id: 'pdf-watermark' as ToolId, name: 'Watermark PDF' },
        { id: 'pdf-protect' as ToolId, name: 'Protect / Lock' },
      ],
      theme: {
        cardBg: 'bg-rose-50/40 hover:bg-rose-50/70',
        border: 'border-rose-200/80 hover:border-rose-300',
        iconBg: 'bg-rose-100 text-rose-600',
        badge: 'bg-rose-100/80 text-rose-800 border-rose-200',
        button: 'bg-white hover:bg-rose-100/60 text-slate-700 hover:text-rose-900 border-rose-100',
        headerText: 'text-rose-950 group-hover:text-rose-700'
      }
    },
    {
      id: 'audio-suite',
      title: 'Audio Tools',
      category: 'Audio',
      icon: Volume2,
      badge: 'Fast',
      desc: 'Join, cut, and change the speed of your audio files.',
      tools: [
        { id: 'audio-joiner' as ToolId, name: 'Audio Joiner' },
        { id: 'audio-trim' as ToolId, name: 'Trim & Cut' },
        { id: 'audio-speed' as ToolId, name: 'Speed Changer' },
        { id: 'text-to-speech' as ToolId, name: 'Text to Speech' },
      ],
      theme: {
        cardBg: 'bg-purple-50/40 hover:bg-purple-50/70',
        border: 'border-purple-200/80 hover:border-purple-300',
        iconBg: 'bg-purple-100 text-purple-600',
        badge: 'bg-purple-100/80 text-purple-800 border-purple-200',
        button: 'bg-white hover:bg-purple-100/60 text-slate-700 hover:text-purple-900 border-purple-100',
        headerText: 'text-purple-950 group-hover:text-purple-700'
      }
    },
    {
      id: 'label-suite',
      title: 'Shipping Label Cropper',
      category: 'Label Cropper',
      icon: ShoppingBag,
      badge: 'For Sellers',
      desc: 'Crop Amazon, Flipkart, and Meesho shipping labels for easy printing.',
      tools: [
        { id: 'amazon-label-crop' as ToolId, name: 'Amazon Cropper' },
        { id: 'flipkart-label-crop' as ToolId, name: 'Flipkart Cropper' },
        { id: 'meesho-label-crop' as ToolId, name: 'Meesho Cropper' },
        { id: 'snapdeal-label-crop' as ToolId, name: 'Snapdeal Cropper' },
      ],
      theme: {
        cardBg: 'bg-amber-50/40 hover:bg-amber-50/70',
        border: 'border-amber-200/80 hover:border-amber-300',
        iconBg: 'bg-amber-100 text-amber-700',
        badge: 'bg-amber-100/80 text-amber-800 border-amber-200',
        button: 'bg-white hover:bg-amber-100/60 text-slate-700 hover:text-amber-900 border-amber-100',
        headerText: 'text-amber-950 group-hover:text-amber-700'
      }
    },
    {
      id: 'ocr-suite',
      title: 'Image & Photo Tools',
      category: 'Image & Media',
      icon: ImageIcon,
      badge: 'Extract Text',
      desc: 'Extract text from images, resize photos, and crop them easily.',
      tools: [
        { id: 'image-to-text' as ToolId, name: 'Image OCR Extractor' },
        { id: 'image-resizer' as ToolId, name: 'Image Resizer' },
        { id: 'crop-image' as ToolId, name: 'Crop Image' },
        { id: 'color-contrast' as ToolId, name: 'WCAG Contrast' },
      ],
      theme: {
        cardBg: 'bg-emerald-50/40 hover:bg-emerald-50/70',
        border: 'border-emerald-200/80 hover:border-emerald-300',
        iconBg: 'bg-emerald-100 text-emerald-600',
        badge: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
        button: 'bg-white hover:bg-emerald-100/60 text-slate-700 hover:text-emerald-900 border-emerald-100',
        headerText: 'text-emerald-950 group-hover:text-emerald-700'
      }
    },
    {
      id: 'dev-suite',
      title: 'Developer Tools',
      category: 'Code & Data',
      icon: Binary,
      badge: 'Secure',
      desc: 'Format JSON, test code, and generate secure passwords.',
      tools: [
        { id: 'json-formatter' as ToolId, name: 'JSON Formatter' },
        { id: 'regex-tester' as ToolId, name: 'Regex Playground' },
        { id: 'crypto-base64' as ToolId, name: 'Hash & HMAC Studio' },
        { id: 'code-minifier' as ToolId, name: 'Code Minifier' },
      ],
      theme: {
        cardBg: 'bg-sky-50/40 hover:bg-sky-50/70',
        border: 'border-sky-200/80 hover:border-sky-300',
        iconBg: 'bg-sky-100 text-sky-600',
        badge: 'bg-sky-100/80 text-sky-800 border-sky-200',
        button: 'bg-white hover:bg-sky-100/60 text-slate-700 hover:text-sky-900 border-sky-100',
        headerText: 'text-sky-950 group-hover:text-sky-700'
      }
    },
    {
      id: 'network-suite',
      title: 'Network & Security Tools',
      category: 'Network & Security',
      icon: Globe,
      badge: 'Browser Probes',
      desc: 'Inspect DNS records, resolve hostnames to IP, analyze TLS certificates, and discover email patterns.',
      tools: [
        { id: 'dns-lookup' as ToolId, name: 'DNS Lookup' },
        { id: 'ssl-checker' as ToolId, name: 'SSL / TLS Checker' },
        { id: 'hostname-to-ip' as ToolId, name: 'Hostname to IP' },
        { id: 'email-finder' as ToolId, name: 'Email Permutator' },
      ],
      theme: {
        cardBg: 'bg-indigo-50/40 hover:bg-indigo-50/70',
        border: 'border-indigo-200/80 hover:border-indigo-300',
        iconBg: 'bg-indigo-100 text-indigo-600',
        badge: 'bg-indigo-100/80 text-indigo-800 border-indigo-200',
        button: 'bg-white hover:bg-indigo-100/60 text-slate-700 hover:text-indigo-900 border-indigo-100',
        headerText: 'text-indigo-950 group-hover:text-indigo-700'
      }
    }
  ];

  const handleQuerySubmit = (e: React.FormEvent) => {
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
        subject: formData.subject.trim() || `${formData.category} Inquiry`,
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
    }, 600);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-300 pb-20">
      
      {/* 1. HERO SECTION (Flat) */}
      <section className="relative text-slate-900 p-8 sm:p-12 lg:p-14">
        <div className="relative z-10 max-w-4xl mx-auto space-y-8 flex flex-col items-center text-center">
          
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 text-purple-800 border border-purple-200/80 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Fast • Free • Secure</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3 sm:space-y-4 flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
              All The Tools You Need. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600">
                In One Place.
              </span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-lg font-normal leading-relaxed max-w-2xl text-center">
              We have 70+ easy-to-use tools. Edit PDFs, crop photos, format text, and change audio speed — all for free, right here in your browser without downloading anything!
            </p>
          </div>

          {/* Interactive Search Bar on Hero */}
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-purple-200/70 shadow-md flex flex-col sm:flex-row items-center gap-2 max-w-2xl">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search PDF, Audio, OCR, Label Cropper, JSON, Regex..."
                className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 border border-purple-100 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenHub}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span>Browse All ({tools.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>



          {/* Quick Pastel Stats Grid (Hidden on Mobile to save space) */}
          <div className="hidden sm:grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4">
            <div className="bg-purple-100/60 border border-purple-200/80 p-3.5 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-black text-purple-900">70+</div>
              <div className="text-xs text-purple-700 font-bold">Free Tools</div>
            </div>
            <div className="bg-emerald-100/60 border border-emerald-200/80 p-3.5 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-black text-emerald-900">100%</div>
              <div className="text-xs text-emerald-700 font-bold">Safe</div>
            </div>
            <div className="bg-sky-100/60 border border-sky-200/80 p-3.5 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-black text-sky-900">⚡</div>
              <div className="text-xs text-sky-700 font-bold">Super Fast</div>
            </div>
            <div className="bg-amber-100/60 border border-amber-200/80 p-3.5 rounded-2xl">
              <div className="text-2xl sm:text-3xl font-black text-amber-900">✓</div>
              <div className="text-xs text-amber-700 font-bold">Works Offline</div>
            </div>
          </div>

        </div>
      </section>


      {/* 3. QUICK SEARCH & CATALOG BROWSER (Pastel Multi-Color Tabs & Cards) */}
      <section className="space-y-6 pt-8 border-t border-slate-200/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Explore Complete Tool Catalog</h2>
            <p className="text-xs text-slate-500">Instant client execution — choose any tool below to begin immediately.</p>
          </div>

          {/* Category Tabs with pastel colors */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {[
              { id: 'All', label: 'All', active: 'bg-purple-600 text-white', inactive: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60' },
              { id: 'Text & Speech', label: 'Text', active: 'bg-purple-600 text-white', inactive: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60' },
              { id: 'Audio', label: 'Audio', active: 'bg-indigo-600 text-white', inactive: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60' },
              { id: 'PDF Tools', label: 'PDF', active: 'bg-rose-600 text-white', inactive: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60' },
              { id: 'Label Cropper', label: 'Labels', active: 'bg-amber-600 text-white', inactive: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60' },
              { id: 'Code & Data', label: 'Dev & Data', active: 'bg-sky-600 text-white', inactive: 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/60' },
              { id: 'Network & Security', label: 'Network', active: 'bg-blue-600 text-white', inactive: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60' },
            ].map(cat => {
              const isSelected = selectedCategoryTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryTab(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected ? cat.active + ' shadow-2xs' : cat.inactive
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Grid with pastel hover states */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5 sm:gap-4">
          {filteredTools.slice(0, 16).map((tool) => {
            const isFav = favorites.includes(tool.id);
            return (
              <div
                key={tool.id}
                className="p-3 rounded-2xl hover:bg-slate-100 transition-all flex flex-col justify-between space-y-2 group cursor-pointer"
                onClick={() => onSelectTool(tool.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-110 transition-transform">
                    {/* Simplified Icon */}
                    <div className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-purple-700 truncate block text-left transition-colors">
                      {tool.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleFavorite(tool.id)}
                    className="text-slate-300 hover:text-amber-400 p-1 cursor-pointer"
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed ml-11">
                  {tool.shortDesc}
                </p>
              </div>
            );
          })}
        </div>


        {/* 3 Core Engineering Pillars (Multi-Pastel Bento Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50/50 p-6 sm:p-8 rounded-3xl border border-emerald-200/80 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-2xs">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950">Zero-Data Leak Guarantee</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              All PDF manipulations, audio cuts, OCR scans, and regex parses happen in client memory buffers. We never inspect, store, or sell user inputs.
            </p>
          </div>

          <div className="bg-purple-50/50 p-6 sm:p-8 rounded-3xl border border-purple-200/80 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200 shadow-2xs">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-purple-950">Web Workers & WASM</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              High-load jobs run on isolated background threads, preventing browser UI freezing and delivering consistent 60 frames per second.
            </p>
          </div>

          <div className="bg-sky-50/50 p-6 sm:p-8 rounded-3xl border border-sky-200/80 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200 shadow-2xs">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-sky-950">Standalone Offline HTML</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Download any tool as a standalone `.html` file with all scripts bundled inline to run indefinitely on air-gapped computers.
            </p>
          </div>
        </div>

        {/* Integrated Support & Query Desk Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Query Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-purple-700 tracking-wider">Direct Desk</span>
                {pastQueries.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-xs text-purple-700 hover:text-purple-900 font-semibold cursor-pointer underline"
                  >
                    {showHistory ? 'Back to Form' : `Your Submitted Tickets (${pastQueries.length})`}
                  </button>
                )}
              </div>
              <h3 className="text-2xl font-black text-slate-900">Send a Query or Request a Tool</h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                Need a specialized utility, discovered an issue, or seeking enterprise self-hosting? Reach out directly.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <h4 className="font-bold text-base">Inquiry Successfully Logged!</h4>
                </div>
                <p className="text-xs text-emerald-800">
                  Your ticket <strong>#{ticketId}</strong> is registered. Our developer team reviews submissions regularly.
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
                    View My Queries
                  </button>
                </div>
              </div>
            ) : showHistory ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900">Previous Submissions ({pastQueries.length})</h4>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-xs font-semibold text-purple-700 hover:underline cursor-pointer"
                  >
                    + New Query
                  </button>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {pastQueries.map((q) => (
                    <div key={q.id} className="p-4 bg-purple-50/40 rounded-xl border border-purple-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{q.subject}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {q.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{q.message}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>Ref: #{q.id} • {q.category}</span>
                        <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuerySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 rounded-xl text-xs text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    >
                      <option value="General Query">General Inquiry</option>
                      <option value="Feature Request">Request a New Tool</option>
                      <option value="Bug Report">Report a Bug / Issue</option>
                      <option value="Enterprise / Custom Tool">Enterprise / Air-Gapped Deployment</option>
                      <option value="Billing & Subscription">Billing & Pro Subscription</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief topic or tool name..."
                      className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Message or Detailed Requirements *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your question, request, or proposal in detail..."
                    className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right: FAQ & Assistant Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* AI Assistant Help Box */}
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-purple-700/50 shadow-md space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Need Instant Tool Assistance?</h4>
                <p className="text-xs text-purple-200 leading-relaxed">
                  Our interactive AI Tool Assistant can match you with the exact utility, guide you through audio splices, or explain regex parameters.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenChatbot}
                className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span>Launch AI Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick FAQ List */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <span>Frequently Asked Questions</span>
              </h4>

              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="pt-2 space-y-1">
                  <p className="font-bold text-slate-800">Are my files ever transmitted over the network?</p>
                  <p className="text-slate-500">No. All file reading, PDF manipulation, and audio rendering occur in your browser's local sandbox memory.</p>
                </div>

                <div className="pt-2 space-y-1">
                  <p className="font-bold text-slate-800">Can I use these tools completely offline?</p>
                  <p className="text-slate-500">Yes! You can download single-file HTML standalone templates from any tool page to execute offline forever.</p>
                </div>

                <div className="pt-2 space-y-1">
                  <p className="font-bold text-slate-800">How do the thermal shipping croppers work?</p>
                  <p className="text-slate-500">Our cropping algorithms detect shipping label boundaries on PDF pages and extract them to 4x6 inch format for standard thermal roll printers.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* 5. BOTTOM CTA BANNER (Pastel Gradient Border / Modern Look) */}
      <section className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-purple-700/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 text-center md:text-left relative z-10">
          <h3 className="text-2xl sm:text-3xl font-black">
            Ready to Supercharge Your Daily Workflow?
          </h3>
          <p className="text-xs sm:text-sm text-purple-200 max-w-lg">
            Jump directly into our 60+ tool workbench with zero registration, zero ads, and zero server uploads.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center relative z-10">
          <button
            type="button"
            onClick={onOpenHub}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer"
          >
            Open All Tools Directory
          </button>
          <button
            type="button"
            onClick={onOpenManual}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
          >
            User Manual
          </button>
        </div>
      </section>

    </div>
  );
}
