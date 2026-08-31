import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  LogOut,
  Sparkles,
  Zap,
  Receipt,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  Download,
  Clock,
  Layers,
  Crown
} from 'lucide-react';
import { UserProfile, UserInvoice } from '../types';

interface UserProfileMenuProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenSubscription: () => void;
  onOpenProfile?: () => void;
  onOpenAdminPanel?: () => void;
  onLogout: () => void;
}

export function UserProfileMenu({
  user,
  onOpenAuth,
  onOpenSubscription,
  onOpenProfile,
  onOpenAdminPanel,
  onLogout
}: UserProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-purple-700 bg-slate-100/80 hover:bg-purple-50 rounded-xl border border-slate-200/60 transition-colors cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>
      </div>
    );
  }

  const isProOrEnterprise = user.tier === 'pro' || user.tier === 'enterprise';
  const usagePercent = isProOrEnterprise ? 100 : Math.min(100, Math.round((user.dailyOperationsCount / user.dailyOperationsLimit) * 100));

  return (
    <div className="relative" ref={menuRef}>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
      >
        <div className="relative">
          <img
            src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`}
            alt={user.name}
            className="w-7 h-7 rounded-xl bg-purple-100 border border-purple-200 object-cover"
          />
          {isProOrEnterprise && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center text-[7px]">
              ⭐
            </span>
          )}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[95px] group-hover:text-purple-700 transition-colors">
            {user.name}
          </span>
          <span className="text-[10px] font-semibold text-purple-700 flex items-center gap-0.5 uppercase tracking-wider">
            {user.tier === 'enterprise' ? 'Enterprise' : user.tier === 'pro' ? 'Pro Plan' : 'Free Tier'}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-purple-100 shadow-2xl p-4 z-50 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          
          {/* User Details */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`}
              alt={user.name}
              className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 object-cover"
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate">{user.name}</span>
              <span className="text-[11px] text-slate-500 block truncate">{user.email}</span>
              <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-full mt-0.5 ${
                user.tier === 'enterprise'
                  ? 'bg-purple-100 text-purple-800'
                  : user.tier === 'pro'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {user.tier.toUpperCase()} PLAN
              </span>
            </div>
          </div>

          {/* Usage Quota Card */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-700">
              <span>Daily Operations Quota</span>
              <span className="text-indigo-600">
                {isProOrEnterprise ? 'Unlimited ✨' : `${user.dailyOperationsCount} / ${user.dailyOperationsLimit}`}
              </span>
            </div>
            
            {!isProOrEnterprise && (
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            )}

            {isProOrEnterprise ? (
              <span className="text-[10px] text-slate-400 block">
                Renews on {user.subscriptionExpiresAt || 'Next month'}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 block">
                Free limit resets every 24 hours.
              </span>
            )}
          </div>

          {/* Action Links */}
          <div className="space-y-1 text-xs">
            {onOpenProfile && (
              <button
                type="button"
                onClick={() => { setIsOpen(false); onOpenProfile(); }}
                className="w-full py-2 px-3 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer text-left"
              >
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>My Profile & Activity Logs</span>
              </button>
            )}



            <button
              type="button"
              onClick={() => { setIsOpen(false); setShowInvoicesModal(true); }}
              className="w-full py-2 px-3 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer text-left"
            >
              <Receipt className="w-3.5 h-3.5 text-slate-400" />
              <span>Billing & Invoices ({user.invoices?.length || 0})</span>
            </button>



            {user.role === 'admin' && onOpenAdminPanel && (
              <button
                type="button"
                onClick={() => { setIsOpen(false); onOpenAdminPanel(); }}
                className="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer text-left border border-purple-100"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin Dashboard</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => { setIsOpen(false); onLogout(); }}
              className="w-full py-2 px-3 hover:bg-rose-50 text-rose-600 font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer text-left border-t border-slate-100 mt-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      )}

      {/* Invoices & Receipts Modal */}
      {showInvoicesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Billing History & Tax Receipts</h3>
              </div>
              <button
                onClick={() => setShowInvoicesModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {!user.invoices || user.invoices.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No invoices found. Upgrade your plan to generate tax invoices.
                </div>
              ) : (
                user.invoices.map(inv => (
                  <div
                    key={inv.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{inv.planName}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          {inv.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {inv.date} • {inv.paymentMethod} • ID: {inv.id}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">{inv.amount}</span>
                      <button
                        onClick={() => {
                          const content = `Invoice ID: ${inv.id}\nPlan: ${inv.planName}\nAmount: ${inv.amount}\nDate: ${inv.date}\nPayment: ${inv.paymentMethod}\nStatus: ${inv.status}`;
                          const blob = new Blob([content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `Invoice_${inv.id}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer mt-1"
                      >
                        Download PDF/TXT
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInvoicesModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
