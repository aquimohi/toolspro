import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  CreditCard,
  MessageSquare,
  Palette,
  Search,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Activity,
  Edit2,
  Trash2,
  LayoutDashboard
} from 'lucide-react';
import { UserProfile, SubscriptionPlan, ContactQuery } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/subscriptionPlans';

// Initial Mock Data (used only if localStorage is empty)
const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr_1',
    name: 'Admin User',
    email: 'admin@toolspro.com',
    role: 'admin',
    tier: 'enterprise',
    dailyOperationsCount: 120,
    dailyOperationsLimit: 10000,
    memberSince: '2025-01-01',
    invoices: []
  },
  {
    id: 'usr_2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    tier: 'pro',
    dailyOperationsCount: 45,
    dailyOperationsLimit: 500,
    memberSince: '2026-02-15',
    invoices: []
  },
  {
    id: 'usr_3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    tier: 'free',
    dailyOperationsCount: 10,
    dailyOperationsLimit: 10,
    memberSince: '2026-08-01',
    invoices: []
  }
];

const INITIAL_QUERIES: ContactQuery[] = [
  {
    id: 'q_1',
    createdAt: '2026-08-26T10:00:00Z',
    name: 'Alice Cooper',
    email: 'alice@example.com',
    category: 'Feature Request',
    subject: 'Add PDF to Excel feature',
    message: 'It would be great if you could add a tool to convert PDF to Excel!',
    status: 'Received'
  },
  {
    id: 'q_2',
    createdAt: '2026-08-25T14:30:00Z',
    name: 'Bob Builder',
    email: 'bob@example.com',
    category: 'Bug Report',
    subject: 'Image resizer failing on large images',
    message: 'When I upload a 10MB image, it just spins forever.',
    status: 'In Review'
  }
];

type AdminTab = 'dashboard' | 'users' | 'subscriptions' | 'queries' | 'design';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  
  // LocalStorage-backed state
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('admin_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [queries, setQueries] = useState<ContactQuery[]>(() => {
    try {
      const saved = localStorage.getItem('admin_queries');
      return saved ? JSON.parse(saved) : INITIAL_QUERIES;
    } catch {
      return INITIAL_QUERIES;
    }
  });

  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    try {
      const saved = localStorage.getItem('admin_plans');
      return saved ? JSON.parse(saved) : SUBSCRIPTION_PLANS;
    } catch {
      return SUBSCRIPTION_PLANS;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('admin_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('admin_queries', JSON.stringify(queries));
  }, [queries]);

  useEffect(() => {
    localStorage.setItem('admin_plans', JSON.stringify(plans));
  }, [plans]);

  // Handlers for User Actions
  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleToggleUserRole = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, role: u.role === 'admin' ? 'user' : 'admin' };
      }
      return u;
    }));
  };

  // Handlers for Query Actions
  const handleQueryStatusChange = (id: string, newStatus: ContactQuery['status']) => {
    setQueries(prev => prev.map(q => {
      if (q.id === id) {
        return { ...q, status: newStatus };
      }
      return q;
    }));
  };

  // --- Subcomponents for Tabs ---

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Users', value: users.length.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { title: 'Pro Subscribers', value: users.filter(u => u.tier === 'pro' || u.tier === 'enterprise').length.toString(), icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { title: 'Monthly Revenue', value: '$14,500', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
          { title: 'Open Queries', value: queries.filter(q => q.status !== 'Resolved').length.toString(), icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {users.slice(0, 3).map((u, i) => (
              <div key={u.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">New Registration</p>
                  <p className="text-xs text-slate-500">{u.email} joined as {u.tier}</p>
                </div>
                <span className="text-xs text-slate-400">Recently</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-rose-500" />
            Urgent Queries
          </h3>
          <div className="space-y-4">
            {queries.filter(q => q.status !== 'Resolved').slice(0, 3).map(q => (
              <div key={q.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">{q.category}</span>
                    <span className="text-xs text-slate-400 truncate">{q.email}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 truncate">{q.subject}</p>
                </div>
                <button onClick={() => setActiveTab('queries')} className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer">View</button>
              </div>
            ))}
            {queries.filter(q => q.status !== 'Resolved').length === 0 && (
              <p className="text-sm text-slate-500">All queries resolved!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          User Management
        </h3>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none w-64"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Tier</th>
              <th className="px-6 py-4">Usage</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`}
                      alt={u.name}
                      className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleToggleUserRole(u.id)}
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold cursor-pointer transition-colors ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}>
                    {u.role || 'user'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${
                    u.tier === 'enterprise' ? 'bg-indigo-100 text-indigo-700'
                      : u.tier === 'pro' ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {u.tier}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 w-24">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                      <span>{u.dailyOperationsCount}</span>
                      <span>{u.dailyOperationsLimit}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (u.dailyOperationsCount / u.dailyOperationsLimit) * 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" title="Edit user (Coming soon)">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500 text-sm">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-600" />
          Subscription Plans Management
        </h3>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors cursor-pointer" onClick={() => alert('New plan creation dialog would open here.')}>
          Add New Plan
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative">
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-extrabold text-slate-900 capitalize">{plan.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{plan.tagline}</p>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" onClick={() => alert('Plan editor dialog would open here.')}>
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="py-4 border-y border-slate-100 my-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">${plan.priceMonthlyUSD}</span>
              <span className="text-sm font-semibold text-slate-500">/ mo</span>
            </div>
            
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase">Features</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Daily Limit: {plan.limits.dailyOperations}
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Max File: {plan.limits.maxFileSizeMB}MB
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  {plan.limits.apiAccess ? (
                     <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                     <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  API Access
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQueries = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          Support Queries
        </h3>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer">
            <option>All Statuses</option>
            <option>Received</option>
            <option>In Review</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>
      
      <div className="divide-y divide-slate-100">
        {queries.map(q => (
          <div key={q.id} className="p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    q.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700'
                    : q.status === 'In Review' ? 'bg-amber-100 text-amber-700'
                    : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {q.status}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(q.createdAt).toLocaleString()}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{q.subject}</h4>
                <div className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                  <span className="font-semibold text-slate-700">{q.name}</span>
                  <span className="text-slate-400">({q.email})</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-indigo-600 font-semibold">{q.category}</span>
                </div>
                <p className="mt-3 text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                  {q.message}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors text-center cursor-pointer" onClick={() => alert(`Reply to ${q.email}`)}>
                  Reply
                </button>
                <select 
                  className="px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg text-slate-600 cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={q.status}
                  onChange={(e) => handleQueryStatusChange(q.id, e.target.value as ContactQuery['status'])}
                >
                  <option value="Received">Received</option>
                  <option value="In Review">In Review</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {queries.length === 0 && (
          <div className="p-8 text-center text-slate-500">No support queries found.</div>
        )}
      </div>
    </div>
  );

  const renderDesign = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-indigo-600" />
          Theme & Design Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 shadow-inner border border-indigo-700"></div>
                <input type="text" value="#4F46E5" readOnly className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono w-28" />
                <button className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer">Change</button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Application Logo</label>
              <div className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 justify-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-lg shadow-sm">
                  ⚡
                </div>
                <div>
                  <button className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 cursor-pointer">Upload New</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
             <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Font Family</label>
              <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer">
                <option>Inter (Default)</option>
                <option>Roboto</option>
                <option>Outfit</option>
                <option>System UI</option>
              </select>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <h4 className="text-sm font-bold text-indigo-900 mb-1">Live Preview</h4>
              <p className="text-xs text-indigo-700">Changes here will apply globally across all components in Tools Pro.</p>
              <button className="mt-3 px-4 py-2 w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white rounded-lg text-sm font-bold shadow-sm cursor-pointer" onClick={() => alert('Settings saved to localStorage!')}>Save Design Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[70vh]">
      {/* Admin Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 space-y-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm h-fit">
        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 px-2">Admin Control</h2>
        
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors text-left cursor-pointer ${
            activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Overview
        </button>
        
        <button
          onClick={() => setActiveTab('users')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors text-left cursor-pointer ${
            activeTab === 'users' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Users & Roles
        </button>
        
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors text-left cursor-pointer ${
            activeTab === 'subscriptions' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Subscriptions
        </button>
        
        <button
          onClick={() => setActiveTab('queries')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors text-left cursor-pointer ${
            activeTab === 'queries' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Queries & Support
          {queries.filter(q => q.status === 'Received').length > 0 && (
            <span className="ml-auto bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {queries.filter(q => q.status === 'Received').length}
            </span>
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('design')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors text-left cursor-pointer ${
            activeTab === 'design' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Palette className="w-4 h-4" />
          Design Config
        </button>
      </div>

      {/* Main Admin Content Area */}
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 capitalize">
              {activeTab === 'dashboard' ? 'Admin Dashboard' : 
               activeTab === 'queries' ? 'Support Queries' :
               activeTab}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage application settings, users, and data.
            </p>
          </div>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'subscriptions' && renderSubscriptions()}
        {activeTab === 'queries' && renderQueries()}
        {activeTab === 'design' && renderDesign()}
      </div>
    </div>
  );
}
