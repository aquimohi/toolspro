import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Star,
  Clock,
  Layers,
  FileText,
  GitCompare,
  Volume2,
  Scissors,
  FileCode,
  Globe,
  Youtube,
  Tag,
  ImageIcon,
  Sliders,
  ShoppingBag,
  MessageCircle,
  Video,
  Server,
  Lock,
  Calendar,
  Home,
  Car,
  Code2,
  Binary,
  Palette,
  Building2,
  MapPin,
  ShieldCheck,
  Mail,
  Split,
  Trash2,
  Camera,
  Presentation,
  FileSpreadsheet,
  Minimize2,
  Wrench,
  PenTool,
  RotateCw,
  Hash,
  Stamp,
  Crop,
  CheckSquare,
  Unlock,
  FileSignature,
  EyeOff,
  Languages
} from 'lucide-react';
import { ToolCategory, ToolId, ToolMeta } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolMeta[];
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
  favorites: ToolId[];
  onToggleFavorite: (id: ToolId) => void;
  recentTools: ToolId[];
}

export function CommandPalette({
  isOpen,
  onClose,
  tools,
  activeTool,
  onSelectTool,
  favorites,
  onToggleFavorite,
  recentTools
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'All'>('All');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const categories: (ToolCategory | 'All')[] = [
    'All',
    'Text & Speech',
    'Audio',
    'PDF Tools',
    'SEO & Social',
    'Image & Media',
    'Label Cropper',
    'Network & Security',
    'Financial & Calc',
    'Code & Data',
    'Postal & Bank'
  ];

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter(tool => {
      const matchCat = selectedCategory === 'All' || tool.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.shortDesc.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.id.toLowerCase().includes(q)
      );
    });
  }, [tools, query, selectedCategory]);

  // Adjust selectedIndex if out of bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredTools.length]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredTools.length || 1));
      scrollActiveIntoView((selectedIndex + 1) % (filteredTools.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredTools.length) % (filteredTools.length || 1));
      scrollActiveIntoView((selectedIndex - 1 + filteredTools.length) % (filteredTools.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        onSelectTool(filteredTools[selectedIndex].id);
        onClose();
      }
    }
  };

  const scrollActiveIntoView = (index: number) => {
    if (!listRef.current) return;
    const item = listRef.current.children[index] as HTMLElement;
    if (item) {
      item.scrollIntoView({ block: 'nearest' });
    }
  };

  if (!isOpen) return null;

  const getToolIcon = (name: string, className = 'w-4 h-4') => {
    switch (name) {
      case 'FileText': return <FileText className={className} />;
      case 'GitCompare': return <GitCompare className={className} />;
      case 'Volume2': return <Volume2 className={className} />;
      case 'Scissors': return <Scissors className={className} />;
      case 'FileCode': return <FileCode className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'Youtube': return <Youtube className={className} />;
      case 'Tag': return <Tag className={className} />;
      case 'ImageIcon': return <ImageIcon className={className} />;
      case 'Sliders': return <Sliders className={className} />;
      case 'ShoppingBag': return <ShoppingBag className={className} />;
      case 'MessageCircle': return <MessageCircle className={className} />;
      case 'Video': return <Video className={className} />;
      case 'Server': return <Server className={className} />;
      case 'Lock': return <Lock className={className} />;
      case 'Calendar': return <Calendar className={className} />;
      case 'Home': return <Home className={className} />;
      case 'Car': return <Car className={className} />;
      case 'Code2': return <Code2 className={className} />;
      case 'Binary': return <Binary className={className} />;
      case 'Palette': return <Palette className={className} />;
      case 'Building2': return <Building2 className={className} />;
      case 'MapPin': return <MapPin className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Mail': return <Mail className={className} />;
      case 'Split': return <Split className={className} />;
      case 'Trash2': return <Trash2 className={className} />;
      case 'Camera': return <Camera className={className} />;
      case 'Presentation': return <Presentation className={className} />;
      case 'FileSpreadsheet': return <FileSpreadsheet className={className} />;
      case 'FileImage': return <ImageIcon className={className} />;
      case 'Image': return <ImageIcon className={className} />;
      case 'Minimize2': return <Minimize2 className={className} />;
      case 'Wrench': return <Wrench className={className} />;
      case 'PenTool': return <PenTool className={className} />;
      case 'RotateCw': return <RotateCw className={className} />;
      case 'Hash': return <Hash className={className} />;
      case 'Stamp': return <Stamp className={className} />;
      case 'Crop': return <Crop className={className} />;
      case 'CheckSquare': return <CheckSquare className={className} />;
      case 'Unlock': return <Unlock className={className} />;
      case 'FileSignature': return <FileSignature className={className} />;
      case 'EyeOff': return <EyeOff className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Languages': return <Languages className={className} />;
      default: return <Layers className={className} />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search all 60+ tools (e.g. pdf, audio, resize, ifsc, age, minify)..."
            className="w-full bg-transparent border-none text-sm sm:text-base font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/80 rounded border border-slate-300">
            ESC
          </kbd>
        </div>

        {/* Category Pills inside Search */}
        <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 max-h-[50vh] focus:outline-none"
        >
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No matching tools found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for 'pdf', 'image', 'code', 'audio', or browse all categories
              </p>
            </div>
          ) : (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              const isFav = favorites.includes(tool.id);
              const isActive = activeTool === tool.id;

              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/80 border border-indigo-200/80 text-indigo-950'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected || isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {getToolIcon(tool.icon, 'w-4 h-4')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold truncate">
                          {tool.name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                          {tool.category}
                        </span>
                        {tool.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
                            {tool.badge}
                          </span>
                        )}
                        {isActive && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {tool.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onToggleFavorite(tool.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isFav
                          ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                          : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono bg-white border border-slate-200 rounded text-slate-700">↑</kbd>
              <kbd className="px-1.5 py-0.5 font-mono bg-white border border-slate-200 rounded text-slate-700">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono bg-white border border-slate-200 rounded text-slate-700">↵</kbd>
              to select
            </span>
          </div>
          <span>
            Showing <strong>{filteredTools.length}</strong> of <strong>{tools.length}</strong> tools
          </span>
        </div>
      </div>
    </div>
  );
}
