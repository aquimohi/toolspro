import React, { useState, useEffect, useMemo } from 'react';
import {
  User,
  ShieldCheck,
  Crown,
  Sparkles,
  Zap,
  Clock,
  Receipt,
  Trash2,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Edit2,
  Save,
  X,
  FileCode,
  HardDrive,
  RefreshCw
} from 'lucide-react';
import { UserProfile, ActivityLogItem, ToolId, ToolCategory } from '../types';
import { getActivityLogs, clearActivityLogs } from '../utils/activityLogger';

interface ProfilePageProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenSubscription: () => void;
  onSelectTool: (id: ToolId) => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

export function ProfilePage({
  user,
  onOpenAuth,
  onOpenSubscription,
  onSelectTool,
  onUpdateUser
}: ProfilePageProps) {
  // Tab state: 'logs' | 'overview' | 'invoices' | 'settings'
  const [activeTab, setActiveTab] = useState<'logs' | 'overview' | 'invoices' | 'settings'>('logs');
  
  // Activity Logs state
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [logFilterCategory, setLogFilterCategory] = useState<string>('All');
  const [logFilterStatus, setLogFilterStatus] = useState<string>('All');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');

  // Profile Edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  // Load logs on mount and listen to real-time additions
  useEffect(() => {
    setLogs(getActivityLogs());

    const handleLogAdded = (e: any) => {
      if (e.detail) {
        setLogs(prev => [e.detail, ...prev]);
      }
    };

    const handleLogsCleared = () => {
      setLogs([]);
    };

    window.addEventListener('activity_log_added', handleLogAdded);
    window.addEventListener('activity_logs_cleared', handleLogsCleared);

    return () => {
      window.removeEventListener('activity_log_added', handleLogAdded);
      window.removeEventListener('activity_logs_cleared', handleLogsCleared);
    };
  }, []);

  // Update edit state when user changes
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [user]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesCategory = logFilterCategory === 'All' || log.category === logFilterCategory;
      const matchesStatus = logFilterStatus === 'All' || log.status === logFilterStatus;
      const matchesSearch = !logSearchQuery.trim() || 
        log.toolName.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        (log.details && log.details.toLowerCase().includes(logSearchQuery.toLowerCase()));
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [logs, logFilterCategory, logFilterStatus, logSearchQuery]);

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all browser activity logs? This action cannot be undone.')) {
      clearActivityLogs();
      setLogs([]);
    }
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `web-util-activity-logs-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSaveProfile = () => {
    if (!user || !onUpdateUser) return;
    const updated: UserProfile = {
      ...user,
      name: editName.trim() || user.name,
      email: editEmail.trim() || user.email
    };
    onUpdateUser(updated);
    setIsEditingProfile(false);
  };

  // If no user is signed in, display a polite Guest Profile prompt with sign-in trigger
  const effectiveUser: UserProfile = user || {
    id: 'guest-session',
    name: 'Guest Developer',
    email: 'guest.user@local-browser.dev',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GuestDev',
    tier: 'free',
    dailyOperationsCount: logs.length,
    dailyOperationsLimit: 50,
    memberSince: 'Today (Local Session)',
    invoices: []
  };

  const isProOrEnterprise = effectiveUser.tier === 'pro' || effectiveUser.tier === 'enterprise';
  const usagePercentage = isProOrEnterprise ? 100 : Math.min(100, Math.round((effectiveUser.dailyOperationsCount / effectiveUser.dailyOperationsLimit) * 100));

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={effectiveUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(effectiveUser.email)}`}
                alt={effectiveUser.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 border-2 border-indigo-200 object-cover shadow-sm"
              />
              <span className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white shadow-xs ${
                effectiveUser.tier === 'enterprise' ? 'bg-purple-600' : effectiveUser.tier === 'pro' ? 'bg-indigo-600' : 'bg-slate-600'
              }`}>
                {effectiveUser.tier === 'enterprise' ? <Crown className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                  {effectiveUser.name}
                </h1>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                  effectiveUser.tier === 'enterprise'
                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                    : effectiveUser.tier === 'pro'
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {effectiveUser.tier.toUpperCase()} TIER
                </span>
                {!user && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Local Guest Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{effectiveUser.email}</p>
              <p className="text-[11px] text-slate-400">
                Member since {effectiveUser.memberSince} • 🔒 100% In-Browser Privacy Storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!user ? (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Create Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}

            {!isProOrEnterprise && (
              <button
                type="button"
                onClick={onOpenSubscription}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Upgrade Plan</span>
              </button>
            )}
          </div>

        </div>

        {/* Profile Inline Edit Form */}
        {isEditingProfile && user && (
          <div className="pt-4 border-t border-slate-100 space-y-4 animate-in fade-in">
            <h4 className="text-xs font-bold text-slate-800">Update Profile Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-indigo-700"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Activity Logs ({logs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Quota & Usage</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'invoices'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Invoices & Billing ({effectiveUser.invoices?.length || 0})</span>
          </button>
        </div>

      </div>

      {/* TAB 1: ACTIVITY LOGS SECTION */}
      {activeTab === 'logs' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Logs Controls Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={logSearchQuery}
                onChange={e => setLogSearchQuery(e.target.value)}
                placeholder="Search tools, operations, or log details..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Filter Dropdowns & Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={logFilterCategory}
                onChange={e => setLogFilterCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold cursor-pointer focus:outline-hidden"
              >
                <option value="All">All Categories</option>
                <option value="Text & Speech">Text & Speech</option>
                <option value="Audio">Audio Suite</option>
                <option value="PDF Tools">PDF Tools</option>
                <option value="Image & Media">Image & Media</option>
                <option value="Network & Security">Network & Security</option>
                <option value="Financial & Calc">Financial & Calc</option>
                <option value="Code & Data">Code & Data</option>
                <option value="Postal & Bank">Postal & Bank</option>
              </select>

              <select
                value={logFilterStatus}
                onChange={e => setLogFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold cursor-pointer focus:outline-hidden"
              >
                <option value="All">All Statuses</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                <option value="error">Error</option>
              </select>

              <button
                type="button"
                onClick={handleExportLogs}
                disabled={logs.length === 0}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 disabled:opacity-40"
                title="Export Logs as JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>

              <button
                type="button"
                onClick={handleClearLogs}
                disabled={logs.length === 0}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200 disabled:opacity-40"
                title="Clear Browser Logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

          </div>

          {/* Logs Table / List Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Execution & Tool Activity Logs</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Showing {filteredLogs.length} of {logs.length} browser execution events. Recorded locally for auditability.
                </p>
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No activity logs found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Execute any utility (PDF Merge, Image Resizer, Word Counter, Audio Joiner, etc.) to view live operation telemetry.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 overflow-x-auto">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    
                    {/* Left Details */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        log.status === 'success'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : log.status === 'warning'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                      }`}>
                        {log.status === 'success' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : log.status === 'warning' ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <Info className="w-4 h-4" />
                        )}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => onSelectTool(log.toolId)}
                            className="font-bold text-slate-900 hover:text-indigo-600 hover:underline cursor-pointer text-left"
                          >
                            {log.toolName}
                          </button>
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                            {log.category}
                          </span>
                          {log.executionTimeMs && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              ⚡ {log.executionTimeMs}ms
                            </span>
                          )}
                        </div>

                        <p className="font-semibold text-slate-700">{log.action}</p>
                        {log.details && (
                          <p className="text-slate-500 text-[11px] font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block max-w-xl truncate">
                            {log.details}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Timestamp & Direct Launch */}
                    <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1 text-[11px] text-slate-400 shrink-0">
                      <span className="font-medium text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span className="text-[10px]">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectTool(log.toolId)}
                        className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 pt-0.5 cursor-pointer"
                      >
                        <span>Re-open</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 2: QUOTA & USAGE */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Daily Operations</span>
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-900">
                {isProOrEnterprise ? 'Unlimited' : `${effectiveUser.dailyOperationsCount} / ${effectiveUser.dailyOperationsLimit}`}
              </h3>
              <p className="text-xs text-slate-500">
                {isProOrEnterprise ? 'No throttling or rate limits applied.' : 'Operations count refreshes every 24 hours.'}
              </p>
            </div>
            {!isProOrEnterprise && (
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Max File Size Limit</span>
              <HardDrive className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-900">
                {effectiveUser.tier === 'enterprise' ? '2.0 GB' : effectiveUser.tier === 'pro' ? '500 MB' : '50 MB'}
              </h3>
              <p className="text-xs text-slate-500">
                Direct client memory buffer allocations for large audio and PDF files.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Privacy Status</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-emerald-700">
                100% Client-Side
              </h3>
              <p className="text-xs text-slate-500">
                All data, images, text, and logs remain strictly inside your browser sandbox.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: INVOICES & BILLING */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Billing History & Tax Invoices</h3>
              <p className="text-xs text-slate-500">Download official PDF receipts for your subscription payments.</p>
            </div>
            <button
              type="button"
              onClick={onOpenSubscription}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Change Plan
            </button>
          </div>

          {(!effectiveUser.invoices || effectiveUser.invoices.length === 0) ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 space-y-2">
              <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No active invoices found on this account.</p>
              <p>Upgrade to Pro or Enterprise to receive tax invoices and billing receipts.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
              {effectiveUser.invoices.map(inv => (
                <div key={inv.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{inv.planName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Invoice #{inv.id} • {inv.date} via {inv.paymentMethod}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-black text-slate-900 block text-sm">{inv.amount}</span>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="text-indigo-600 hover:underline font-bold flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Print PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
