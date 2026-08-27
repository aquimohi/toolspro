import React, { useState } from 'react';
import {
  X,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, PLAN_COMPARISON_MATRIX } from '../data/subscriptionPlans';
import { SubscriptionPlan, BillingCycle, Currency, UserProfile } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlanForCheckout: (plan: SubscriptionPlan, billingCycle: BillingCycle, currency: Currency) => void;
  currentUser: UserProfile | null;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  onSelectPlanForCheckout,
  currentUser
}: SubscriptionModalProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [showMatrix, setShowMatrix] = useState(false);

  if (!isOpen) return null;

  const currentTier = currentUser?.tier || 'free';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Upgrade & Cloud Quota
              </span>
            </div>
            <h2 className="text-xl font-extrabold mt-1 text-white">
              Choose the Perfect Plan for Your Workflow
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Unlock unlimited daily operations, multi-threaded high-speed OCR, batch PDF processing, and developer API keys.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Controls: Billing cycle & Currency Switchers */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            
            {/* Monthly / Annual Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Billing:</span>
              <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    billingCycle === 'yearly' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Yearly</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    billingCycle === 'yearly' ? 'bg-indigo-700 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Currency:</span>
              <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    currency === 'INR' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    currency === 'USD' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>

          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map(plan => {
              const isCurrent = currentTier === plan.id;
              const isPopular = plan.popular;

              const displayPrice = currency === 'USD'
                ? (billingCycle === 'yearly' ? `$${plan.priceYearlyUSD.toFixed(2)}` : `$${plan.priceMonthlyUSD}`)
                : (billingCycle === 'yearly' ? `₹${plan.priceYearlyINR}` : `₹${plan.priceMonthlyINR}`);

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
                    isPopular
                      ? 'border-2 border-indigo-600 bg-white shadow-xl shadow-indigo-100/50'
                      : 'border border-slate-200 bg-white shadow-xs hover:border-slate-300'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center justify-between">
                        <span>{plan.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Current Active
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.tagline}</p>
                    </div>

                    {/* Price display */}
                    <div className="py-2 border-y border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-slate-900">{displayPrice}</span>
                        {plan.id !== 'free' && (
                          <span className="text-xs text-slate-400 font-semibold">/ month</span>
                        )}
                      </div>
                      {plan.id !== 'free' && billingCycle === 'yearly' && (
                        <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
                          Billed annually (Includes 20% discount)
                        </span>
                      )}
                    </div>

                    {/* Feature list */}
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Plan CTA Button */}
                  <div className="pt-6 mt-4 border-t border-slate-100">
                    {isCurrent ? (
                      <button
                        type="button"
                        disabled
                        className="w-full py-2.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold cursor-default"
                      >
                        Currently Active
                      </button>
                    ) : plan.id === 'free' ? (
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Continue with Free
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectPlanForCheckout(plan, billingCycle, currency)}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 fill-white" />
                        <span>Upgrade to {plan.name.split(' ')[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Matrix Table Toggle */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setShowMatrix(!showMatrix)}
              className="w-full p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
            >
              <span>View Full Detailed Plan Comparison Matrix</span>
              {showMatrix ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showMatrix && (
              <div className="mt-3 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3.5 font-bold text-slate-700">Capabilities</th>
                      <th className="p-3.5 font-bold text-slate-700">Starter (Free)</th>
                      <th className="p-3.5 font-bold text-indigo-700">Pro Creator</th>
                      <th className="p-3.5 font-bold text-purple-700">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PLAN_COMPARISON_MATRIX.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-medium text-slate-800">{row.feature}</td>
                        <td className="p-3 text-slate-500">{row.free}</td>
                        <td className="p-3 font-semibold text-indigo-900 bg-indigo-50/20">{row.pro}</td>
                        <td className="p-3 font-semibold text-purple-900">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>30-Day Money Back Guarantee • Instant Activation • Cancel Anytime</span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">
              Supports UPI, Visa, MasterCard, RuPay & NetBanking
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
