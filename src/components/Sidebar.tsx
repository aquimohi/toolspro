import React, { useState, useMemo } from 'react';
import {
  Search,
  Star,
  Clock,
  ChevronDown,
  ChevronRight,
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
  Home as HomeIcon,
  Car,
  Code2,
  Binary,
  Palette,
  Building2,
  MapPin,
  ShieldCheck,
  X,
  Grid,
  Mail,
  BookOpen,
  User,
  Info,
  Headphones,
  Code,
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
  Sparkles,
  Languages
} from 'lucide-react';
import { ToolCategory, ToolId, ToolMeta, UserProfile, AppViewMode } from '../types';

interface SidebarProps {
  tools: ToolMeta[];
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
  favorites: ToolId[];
  onToggleFavorite: (id: ToolId) => void;
  recentTools: ToolId[];
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenSearch: () => void;
  viewMode: AppViewMode;
  onSetViewMode: (mode: AppViewMode) => void;
  onOpenManual?: () => void;
  onOpenSubscription?: () => void;
  onOpenAuth?: () => void;
  onOpenChatbot?: () => void;
  onOpenCode?: () => void;
  currentUser?: UserProfile | null;
}

export function Sidebar({
  tools,
  activeTool,
  onSelectTool,
  favorites,
  onToggleFavorite,
  recentTools,
  isOpen,
  onCloseMobile,
  onOpenSearch,
  viewMode,
  onSetViewMode,
  onOpenManual,
  onOpenSubscription,
  onOpenAuth,
  onOpenChatbot,
  onOpenCode,
  currentUser
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Text & Speech': true,
    'Audio': true,
    'PDF Tools': true,
  });
  const [sidebarFilter, setSidebarFilter] = useState('');

  const categories: ToolCategory[] = [
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

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const favoriteToolMetas = useMemo(() => {
    return favorites
      .map(id => tools.find(t => t.id === id))
      .filter((t): t is ToolMeta => Boolean(t));
  }, [tools, favorites]);

  const recentToolMetas = useMemo(() => {
    return recentTools
      .map(id => tools.find(t => t.id === id))
      .filter((t): t is ToolMeta => Boolean(t));
  }, [tools, recentTools]);

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
      case 'Home': return <HomeIcon className={className} />;
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
      case 'GitCompare': return <GitCompare className={className} />;
      default: return <Layers className={className} />;
    }
  };

  const handleToolClick = (id: ToolId) => {
    onSelectTool(id);
    onSetViewMode('tool');
    onCloseMobile();
  };

  // If mobile drawer is not open, do not render backdrop or capture clicks
  return (
    <>
      {/* Mobile Slide-Over Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Slide-Over Drawer Navigation Menu (Mobile & Overlay) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white border-r border-slate-200 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="h-16 px-4 border-b border-purple-100 flex items-center justify-between bg-purple-50/30">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs shrink-0">
              ⚡
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight truncate block">
                Tools Pro
              </span>
              <span className="text-[10px] text-purple-700 font-semibold block">
                {tools.length} In-Browser Tools
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search & Filter in Drawer */}
        <div className="p-3 border-b border-slate-100 bg-white">
          <button
            onClick={() => {
              onCloseMobile();
              onOpenSearch();
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-600 bg-purple-50/40 hover:bg-purple-50 border border-purple-100 rounded-xl transition-all cursor-pointer group shadow-2xs"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-600 shrink-0" />
              <span className="truncate">Search all {tools.length} utilities...</span>
            </span>
            <kbd className="text-[10px] font-mono bg-white text-purple-700 px-1.5 py-0.5 rounded border border-purple-200 shrink-0">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Primary Navigation Hub */}
        <div className="p-3 space-y-1.5 border-b border-slate-100 bg-white">
          {/* Home Page Link */}
          <button
            onClick={() => {
              onSetViewMode('home');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'home'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-700 hover:bg-purple-50/60'
            }`}
          >
            <span className="flex items-center gap-2">
              <HomeIcon className="w-4 h-4" />
              <span>Home & Showcase</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-white/20 text-current">
              Main
            </span>
          </button>

          {/* All Tools Directory */}
          <button
            onClick={() => {
              onSetViewMode('hub');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'hub'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-700 hover:bg-purple-50/60'
            }`}
          >
            <span className="flex items-center gap-2">
              <Grid className="w-4 h-4" />
              <span>All Tools Directory</span>
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                viewMode === 'hub' ? 'bg-slate-800 text-slate-200' : 'bg-purple-100 text-purple-800'
              }`}
            >
              {tools.length}
            </span>
          </button>

          {/* Quick Sub-navigation buttons */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => {
                onSetViewMode('profile');
                onCloseMobile();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                viewMode === 'profile'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-purple-50/40 hover:bg-purple-50 text-slate-700'
              }`}
              title="Profile & Activity Logs"
            >
              <Clock className={`w-3.5 h-3.5 shrink-0 ${viewMode === 'profile' ? 'text-white' : 'text-purple-600'}`} />
              <span className="truncate">Logs & Profile</span>
            </button>

            <button
              onClick={() => {
                onSetViewMode('about');
                onCloseMobile();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                viewMode === 'about'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-purple-50/40 hover:bg-purple-50 text-slate-700'
              }`}
              title="About Us & Query Form"
            >
              <Info className={`w-3.5 h-3.5 shrink-0 ${viewMode === 'about' ? 'text-white' : 'text-purple-600'}`} />
              <span className="truncate">About Us</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {onOpenManual && (
              <button
                onClick={() => {
                  onCloseMobile();
                  onOpenManual();
                }}
                className="flex items-center gap-1.5 px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left"
                title="Open User Manual"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="truncate">User Manual</span>
              </button>
            )}

            {onOpenChatbot && (
              <button
                onClick={() => {
                  onCloseMobile();
                  onOpenChatbot();
                }}
                className="flex items-center gap-1.5 px-2.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-100 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left"
                title="Ask AI Tool Assistant"
              >
                <Headphones className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="truncate">AI Assistant</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Tool Categories & Accordion */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Favorites Section */}
          {favoriteToolMetas.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>Favorites</span>
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded-full border border-amber-200 font-semibold">
                  {favoriteToolMetas.length}
                </span>
              </div>

              <div className="space-y-0.5">
                {favoriteToolMetas.map(tool => {
                  const isActive = activeTool === tool.id && viewMode === 'tool';
                  return (
                    <div
                      key={tool.id}
                      className={`group flex items-center justify-between rounded-xl transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                          : 'hover:bg-amber-50/60 text-slate-700'
                      }`}
                    >
                      <button
                        onClick={() => handleToolClick(tool.id)}
                        className="flex-1 flex items-center gap-2 px-2.5 py-1.5 text-xs text-left cursor-pointer min-w-0"
                      >
                        {getToolIcon(tool.icon, `w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-amber-500'}`)}
                        <span className="truncate">{tool.name}</span>
                      </button>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onToggleFavorite(tool.id);
                        }}
                        className="p-1.5 mr-1 text-amber-400 hover:text-amber-500 cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Tools Section */}
          {recentToolMetas.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Recent Tools</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {recentToolMetas.length}
                </span>
              </div>

              <div className="space-y-0.5">
                {recentToolMetas.map(tool => {
                  const isActive = activeTool === tool.id && viewMode === 'tool';
                  const isFav = favorites.includes(tool.id);

                  return (
                    <div
                      key={tool.id}
                      className={`group flex items-center justify-between rounded-xl transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <button
                        onClick={() => handleToolClick(tool.id)}
                        className="flex-1 flex items-center gap-2 px-2.5 py-1.5 text-xs text-left cursor-pointer min-w-0"
                      >
                        {getToolIcon(tool.icon, `w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`)}
                        <span className="truncate">{tool.name}</span>
                      </button>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onToggleFavorite(tool.id);
                        }}
                        className={`p-1.5 mr-1 rounded-md transition-opacity cursor-pointer ${
                          isFav
                            ? 'opacity-100 text-amber-400'
                            : 'opacity-0 group-hover:opacity-100 text-slate-300 hover:text-amber-400'
                        } ${isActive ? 'text-white/80 hover:text-white' : ''}`}
                        title={isFav ? 'Remove favorite' : 'Add favorite'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Tool Categories Accordion */}
          <div className="space-y-2">
            <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Tool Categories
            </div>

            {categories.map(cat => {
              const catTools = tools.filter(t => t.category === cat);
              if (catTools.length === 0) return null;
              const isExpanded = expandedCategories[cat] ?? false;

              return (
                <div key={cat} className="rounded-xl border border-slate-200/80 overflow-hidden bg-slate-50/50">
                  <button
                    onClick={() => toggleCategory(cat)}
                    className="w-full flex items-center justify-between p-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <span className="truncate">{cat}</span>
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.2 rounded-full shrink-0">
                      {catTools.length}
                    </span>
                  </button>

                  {/* Tools under Category */}
                  {isExpanded && (
                    <div className="p-1 space-y-0.5 bg-white border-t border-slate-100">
                      {catTools.map(tool => {
                        const isActive = activeTool === tool.id && viewMode === 'tool';
                        const isFav = favorites.includes(tool.id);

                        return (
                          <div
                            key={tool.id}
                            className={`group flex items-center justify-between rounded-lg transition-all ${
                              isActive
                                ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <button
                              onClick={() => handleToolClick(tool.id)}
                              className="flex-1 flex items-center gap-2 px-2 py-1.5 text-xs text-left cursor-pointer min-w-0"
                            >
                              {getToolIcon(tool.icon, `w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-indigo-600'}`)}
                              <span className="truncate">{tool.name}</span>
                            </button>

                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                onToggleFavorite(tool.id);
                              }}
                              className={`p-1 mr-1 rounded-md transition-opacity cursor-pointer ${
                                isFav
                                  ? 'opacity-100 text-amber-400'
                                  : 'opacity-0 group-hover:opacity-100 text-slate-300 hover:text-amber-400'
                              } ${isActive ? 'text-white/80 hover:text-white' : ''}`}
                              title={isFav ? 'Remove favorite' : 'Add favorite'}
                            >
                              <Star className={`w-3 h-3 ${isFav ? 'fill-amber-400' : ''}`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80 space-y-2">
          {currentUser ? (
            <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.email)}`}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-lg bg-indigo-100 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-slate-800 block truncate">{currentUser.name}</span>
                  <span className="text-[9px] font-extrabold uppercase text-indigo-600 block">
                    {currentUser.tier === 'enterprise' ? '👑 Enterprise' : currentUser.tier === 'pro' ? '⭐ Pro' : 'Free Tier'}
                  </span>
                </div>
              </div>
              {currentUser.tier === 'free' && onOpenSubscription && (
                <button
                  onClick={() => {
                    onCloseMobile();
                    onOpenSubscription();
                  }}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shrink-0"
                >
                  Upgrade
                </button>
              )}
            </div>
          ) : onOpenAuth ? (
            <button
              onClick={() => {
                onCloseMobile();
                onOpenAuth();
              }}
              className="w-full flex items-center justify-center gap-1.5 p-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-700 transition-all cursor-pointer shadow-2xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Create Account</span>
            </button>
          ) : null}

          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-0.5">
            <span>🔒 100% In-Browser Privacy</span>
            <span className="font-semibold text-indigo-600">v2.4</span>
          </div>
        </div>
      </aside>
    </>
  );
}
