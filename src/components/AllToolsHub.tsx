import React, { useState, useMemo } from 'react';
import {
  Search,
  Star,
  ArrowUpRight,
  Sparkles,
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
  CheckCircle2,
  Filter,
  Mail,
  Split,
  Trash2,
  Grid,
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
  Languages,
  Image as ImgIcon
} from 'lucide-react';
import { ToolCategory, ToolId, ToolMeta, PdfSubGroup } from '../types';

interface AllToolsHubProps {
  tools: ToolMeta[];
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
  favorites: ToolId[];
  onToggleFavorite: (id: ToolId) => void;
  onOpenSearch: () => void;
}

export function AllToolsHub({
  tools,
  activeTool,
  onSelectTool,
  favorites,
  onToggleFavorite,
  onOpenSearch
}: AllToolsHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'All' | 'Favorites'>('All');
  const [selectedPdfSubGroup, setSelectedPdfSubGroup] = useState<PdfSubGroup | 'All'>('All');

  const categories: { label: string; value: ToolCategory | 'All' | 'Favorites'; count: number; colorClass: string }[] = [
    { label: 'All Tools', value: 'All', count: tools.length, colorClass: 'from-purple-500 to-indigo-500' },
    { label: 'Favorites', value: 'Favorites', count: favorites.length, colorClass: 'from-amber-400 to-orange-500' },
    { label: 'PDF Suite', value: 'PDF Tools', count: tools.filter(t => t.category === 'PDF Tools').length, colorClass: 'from-rose-500 to-pink-600' },
    { label: 'Text & Speech', value: 'Text & Speech', count: tools.filter(t => t.category === 'Text & Speech').length, colorClass: 'from-purple-500 to-violet-600' },
    { label: 'Audio Suite', value: 'Audio', count: tools.filter(t => t.category === 'Audio').length, colorClass: 'from-indigo-500 to-blue-600' },
    { label: 'SEO & Social', value: 'SEO & Social', count: tools.filter(t => t.category === 'SEO & Social').length, colorClass: 'from-sky-500 to-cyan-600' },
    { label: 'Image & Media', value: 'Image & Media', count: tools.filter(t => t.category === 'Image & Media').length, colorClass: 'from-fuchsia-500 to-pink-600' },
    { label: 'Label Cropper', value: 'Label Cropper', count: tools.filter(t => t.category === 'Label Cropper').length, colorClass: 'from-amber-500 to-orange-600' },
    { label: 'Network & Security', value: 'Network & Security', count: tools.filter(t => t.category === 'Network & Security').length, colorClass: 'from-teal-500 to-emerald-600' },
    { label: 'Financial & Calc', value: 'Financial & Calc', count: tools.filter(t => t.category === 'Financial & Calc').length, colorClass: 'from-emerald-500 to-green-600' },
    { label: 'Code & Data', value: 'Code & Data', count: tools.filter(t => t.category === 'Code & Data').length, colorClass: 'from-violet-500 to-indigo-600' },
    { label: 'Postal & Bank', value: 'Postal & Bank', count: tools.filter(t => t.category === 'Postal & Bank').length, colorClass: 'from-orange-500 to-amber-600' },
  ];

  const pdfSubGroups: { label: string; value: PdfSubGroup | 'All'; count: number }[] = [
    { label: 'All PDF Tools', value: 'All', count: tools.filter(t => t.category === 'PDF Tools').length },
    { label: 'Organize PDF', value: 'Organize PDF', count: tools.filter(t => t.pdfGroup === 'Organize PDF').length },
    { label: 'Convert to PDF', value: 'Convert to PDF', count: tools.filter(t => t.pdfGroup === 'Convert to PDF').length },
    { label: 'Convert from PDF', value: 'Convert from PDF', count: tools.filter(t => t.pdfGroup === 'Convert from PDF').length },
    { label: 'Optimize PDF', value: 'Optimize PDF', count: tools.filter(t => t.pdfGroup === 'Optimize PDF').length },
    { label: 'Edit PDF', value: 'Edit PDF', count: tools.filter(t => t.pdfGroup === 'Edit PDF').length },
    { label: 'PDF Security', value: 'PDF Security', count: tools.filter(t => t.pdfGroup === 'PDF Security').length },
    { label: 'PDF Intelligence', value: 'PDF Intelligence', count: tools.filter(t => t.pdfGroup === 'PDF Intelligence').length },
  ];

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tools.filter(tool => {
      // Category / Favorite filter
      if (selectedCategory === 'Favorites') {
        if (!favorites.includes(tool.id)) return false;
      } else if (selectedCategory !== 'All') {
        if (tool.category !== selectedCategory) return false;
        if (selectedCategory === 'PDF Tools' && selectedPdfSubGroup !== 'All') {
          if (tool.pdfGroup !== selectedPdfSubGroup) return false;
        }
      }

      // Search query
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.shortDesc.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        (tool.pdfGroup && tool.pdfGroup.toLowerCase().includes(q)) ||
        tool.id.toLowerCase().includes(q)
      );
    });
  }, [tools, searchQuery, selectedCategory, selectedPdfSubGroup, favorites]);

  // Group by category if viewing 'All' or when not filtered down to a single category
  const groupedTools = useMemo(() => {
    const map: Record<string, ToolMeta[]> = {};
    filteredTools.forEach(tool => {
      const cat = tool.category;
      if (!map[cat]) map[cat] = [];
      map[cat].push(tool);
    });
    return map;
  }, [filteredTools]);

  const getToolIcon = (name: string, className = 'w-5 h-5') => {
    switch (name) {
      case 'FileText': return <FileText className={className} />;
      case 'GitCompare': return <GitCompare className={className} />;
      case 'Volume2': return <Volume2 className={className} />;
      case 'Scissors': return <Scissors className={className} />;
      case 'FileCode': return <FileCode className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'Youtube': return <Youtube className={className} />;
      case 'Tag': return <Tag className={className} />;
      case 'ImageIcon':
      case 'Image':
      case 'FileImage': return <ImageIcon className={className} />;
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
      case 'Grid': return <Grid className={className} />;
      case 'Camera': return <Camera className={className} />;
      case 'Presentation': return <Presentation className={className} />;
      case 'FileSpreadsheet': return <FileSpreadsheet className={className} />;
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
    <div className="space-y-6">
      {/* Top Search & Filter Bar (Pastel Styled) */}
      <div className="bg-white/90 backdrop-blur-xs p-4 sm:p-6 rounded-3xl border border-purple-100/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <span>All Web Utilities & Tools</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {tools.length} Available
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Search by name, feature or category. 100% private, instant client-side execution.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g. crop, pdf, speed, audio, minify)..."
                className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-purple-50/20 hover:bg-purple-50/40 focus:bg-white border border-purple-100 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:outline-hidden transition-all text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-2xl transition-colors cursor-pointer"
              title="Open Spotlight Search (Ctrl+K)"
            >
              <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded-md border border-purple-200">⌘K</kbd>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 pt-4 border-t border-purple-100/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  if (cat.value !== 'PDF Tools') {
                    setSelectedPdfSubGroup('All');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap select-none ${
                  isSelected
                    ? 'bg-gradient-to-r ' + cat.colorClass + ' text-white shadow-2xs'
                    : 'bg-purple-50/40 text-slate-600 hover:bg-purple-100/60 hover:text-purple-900 border border-purple-100/50'
                }`}
              >
                {cat.value === 'Favorites' && (
                  <Star className={`w-3.5 h-3.5 ${isSelected ? 'fill-white text-white' : 'fill-amber-400 text-amber-500'}`} />
                )}
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-purple-100/80 text-purple-700'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* PDF Sub-Category Filters (Only when PDF Tools is active) */}
        {selectedCategory === 'PDF Tools' && (
          <div className="mt-3 pt-3 border-t border-rose-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-rose-50/30 p-2 rounded-2xl">
            <span className="text-[11px] font-extrabold text-rose-700 uppercase tracking-wider px-2 shrink-0">
              PDF Modules:
            </span>
            {pdfSubGroups.map(sg => {
              const isSubSelected = selectedPdfSubGroup === sg.value;
              return (
                <button
                  key={sg.value}
                  onClick={() => setSelectedPdfSubGroup(sg.value)}
                  className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap select-none flex items-center gap-1.5 ${
                    isSubSelected
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white text-rose-800 hover:bg-rose-100/80 border border-rose-200/60'
                  }`}
                >
                  <span>{sg.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSubSelected ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {sg.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tools Content */}
      {filteredTools.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-purple-100 text-center shadow-xs">
          <Search className="w-10 h-10 text-purple-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No tools found matching "{searchQuery}"</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try checking for typos or clear your search query. You can also explore categories using the tabs above.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : selectedCategory !== 'All' && selectedCategory !== 'Favorites' ? (
        /* Single Category Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredTools.map(tool => {
            const isFav = favorites.includes(tool.id);
            const isActive = activeTool === tool.id;
            return (
              <ToolCard
                key={tool.id}
                tool={tool}
                isActive={isActive}
                isFav={isFav}
                onSelect={() => onSelectTool(tool.id)}
                onToggleFav={() => onToggleFavorite(tool.id)}
                getIcon={getToolIcon}
              />
            );
          })}
        </div>
      ) : (
        /* Grouped by Category */
        <div className="space-y-8">
          {(Object.entries(groupedTools) as [string, ToolMeta[]][]).map(([category, catTools]) => {
            const categoryColors: Record<string, { dot: string; header: string }> = {
              'Text & Speech': { dot: 'bg-purple-500', header: 'text-purple-900' },
              'Audio': { dot: 'bg-indigo-500', header: 'text-indigo-900' },
              'PDF Tools': { dot: 'bg-rose-500', header: 'text-rose-900' },
              'SEO & Social': { dot: 'bg-sky-500', header: 'text-sky-900' },
              'Image & Media': { dot: 'bg-pink-500', header: 'text-pink-900' },
              'Label Cropper': { dot: 'bg-amber-500', header: 'text-amber-900' },
              'Network & Security': { dot: 'bg-teal-500', header: 'text-teal-900' },
              'Financial & Calc': { dot: 'bg-emerald-500', header: 'text-emerald-900' },
              'Code & Data': { dot: 'bg-violet-500', header: 'text-violet-900' },
              'Postal & Bank': { dot: 'bg-orange-500', header: 'text-orange-900' },
            };
            const cColor = categoryColors[category] || { dot: 'bg-purple-500', header: 'text-slate-900' };

            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cColor.dot}`}></span>
                    <h3 className={`text-sm font-extrabold ${cColor.header} uppercase tracking-wider`}>
                      {category}
                    </h3>
                    <span className="text-xs text-slate-400 font-semibold">({catTools.length})</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {catTools.map(tool => {
                    const isFav = favorites.includes(tool.id);
                    const isActive = activeTool === tool.id;
                    return (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        isActive={isActive}
                        isFav={isFav}
                        onSelect={() => onSelectTool(tool.id)}
                        onToggleFav={() => onToggleFavorite(tool.id)}
                        getIcon={getToolIcon}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ToolCardProps {
  tool: ToolMeta;
  isActive: boolean;
  isFav: boolean;
  onSelect: () => void;
  onToggleFav: () => void;
  getIcon: (name: string, className?: string) => React.ReactNode;
}

const categoryPalette: Record<string, { bg: string; text: string; hoverBorder: string; activeRing: string; iconBg: string; hoverIconBg: string }> = {
  'Text & Speech': {
    bg: 'bg-purple-50/40',
    text: 'text-purple-700',
    hoverBorder: 'hover:border-purple-300',
    activeRing: 'border-purple-500 ring-2 ring-purple-400/20 bg-purple-50/30',
    iconBg: 'bg-purple-100 text-purple-700',
    hoverIconBg: 'group-hover:bg-purple-600 group-hover:text-white'
  },
  'Audio': {
    bg: 'bg-indigo-50/40',
    text: 'text-indigo-700',
    hoverBorder: 'hover:border-indigo-300',
    activeRing: 'border-indigo-500 ring-2 ring-indigo-400/20 bg-indigo-50/30',
    iconBg: 'bg-indigo-100 text-indigo-700',
    hoverIconBg: 'group-hover:bg-indigo-600 group-hover:text-white'
  },
  'PDF Tools': {
    bg: 'bg-rose-50/40',
    text: 'text-rose-700',
    hoverBorder: 'hover:border-rose-300',
    activeRing: 'border-rose-500 ring-2 ring-rose-400/20 bg-rose-50/30',
    iconBg: 'bg-rose-100 text-rose-700',
    hoverIconBg: 'group-hover:bg-rose-600 group-hover:text-white'
  },
  'SEO & Social': {
    bg: 'bg-sky-50/40',
    text: 'text-sky-700',
    hoverBorder: 'hover:border-sky-300',
    activeRing: 'border-sky-500 ring-2 ring-sky-400/20 bg-sky-50/30',
    iconBg: 'bg-sky-100 text-sky-700',
    hoverIconBg: 'group-hover:bg-sky-600 group-hover:text-white'
  },
  'Image & Media': {
    bg: 'bg-pink-50/40',
    text: 'text-pink-700',
    hoverBorder: 'hover:border-pink-300',
    activeRing: 'border-pink-500 ring-2 ring-pink-400/20 bg-pink-50/30',
    iconBg: 'bg-pink-100 text-pink-700',
    hoverIconBg: 'group-hover:bg-pink-600 group-hover:text-white'
  },
  'Label Cropper': {
    bg: 'bg-amber-50/40',
    text: 'text-amber-700',
    hoverBorder: 'hover:border-amber-300',
    activeRing: 'border-amber-500 ring-2 ring-amber-400/20 bg-amber-50/30',
    iconBg: 'bg-amber-100 text-amber-700',
    hoverIconBg: 'group-hover:bg-amber-600 group-hover:text-white'
  },
  'Network & Security': {
    bg: 'bg-teal-50/40',
    text: 'text-teal-700',
    hoverBorder: 'hover:border-teal-300',
    activeRing: 'border-teal-500 ring-2 ring-teal-400/20 bg-teal-50/30',
    iconBg: 'bg-teal-100 text-teal-700',
    hoverIconBg: 'group-hover:bg-teal-600 group-hover:text-white'
  },
  'Financial & Calc': {
    bg: 'bg-emerald-50/40',
    text: 'text-emerald-700',
    hoverBorder: 'hover:border-emerald-300',
    activeRing: 'border-emerald-500 ring-2 ring-emerald-400/20 bg-emerald-50/30',
    iconBg: 'bg-emerald-100 text-emerald-700',
    hoverIconBg: 'group-hover:bg-emerald-600 group-hover:text-white'
  },
  'Code & Data': {
    bg: 'bg-violet-50/40',
    text: 'text-violet-700',
    hoverBorder: 'hover:border-violet-300',
    activeRing: 'border-violet-500 ring-2 ring-violet-400/20 bg-violet-50/30',
    iconBg: 'bg-violet-100 text-violet-700',
    hoverIconBg: 'group-hover:bg-violet-600 group-hover:text-white'
  },
  'Postal & Bank': {
    bg: 'bg-orange-50/40',
    text: 'text-orange-700',
    hoverBorder: 'hover:border-orange-300',
    activeRing: 'border-orange-500 ring-2 ring-orange-400/20 bg-orange-50/30',
    iconBg: 'bg-orange-100 text-orange-700',
    hoverIconBg: 'group-hover:bg-orange-600 group-hover:text-white'
  },
};

const ToolCard: React.FC<ToolCardProps> = ({ tool, isActive, isFav, onSelect, onToggleFav, getIcon }) => {
  const palette = categoryPalette[tool.category] || {
    bg: 'bg-purple-50/40',
    text: 'text-purple-700',
    hoverBorder: 'hover:border-purple-300',
    activeRing: 'border-purple-500 ring-2 ring-purple-400/20 bg-purple-50/30',
    iconBg: 'bg-purple-100 text-purple-700',
    hoverIconBg: 'group-hover:bg-purple-600 group-hover:text-white'
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white/95 backdrop-blur-2xs p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md ${palette.hoverBorder} ${
        isActive
          ? palette.activeRing
          : 'border-slate-200/80 shadow-2xs'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isActive
                ? 'bg-purple-600 text-white shadow-xs'
                : `${palette.iconBg} ${palette.hoverIconBg}`
            }`}
          >
            {getIcon(tool.icon, 'w-5 h-5')}
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${palette.bg} ${palette.text} border border-slate-100`}>
                {tool.badge}
              </span>
            )}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onToggleFav();
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isFav
                  ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                  : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
              }`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors flex items-center justify-between">
          <span>{tool.name}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-700 transition-colors shrink-0" />
        </h4>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {tool.shortDesc}
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className={`font-semibold ${palette.text}`}>{tool.category}</span>
        {isActive ? (
          <span className="text-purple-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Currently Active
          </span>
        ) : (
          <span className="group-hover:text-purple-700 font-bold transition-colors">
            Launch Tool →
          </span>
        )}
      </div>
    </div>
  );
};
