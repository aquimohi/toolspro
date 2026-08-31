import React, { useState } from 'react';
import {
  Check,
  Zap,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, PLAN_COMPARISON_MATRIX } from '../data/subscriptionPlans';
import { SubscriptionPlan, BillingCycle, Currency, UserProfile } from '../types';

interface PricingPageProps {
  onSelectPlanForCheckout: (plan: SubscriptionPlan, billingCycle: BillingCycle, currency: Currency) => void;
  currentUser: UserProfile | null;
}

export function PricingPage({
  onSelectPlanForCheckout,
  currentUser
}: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [showMatrix, setShowMatrix] = useState(false);

  const currentTier = currentUser?.tier || 'free';

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
            Upgrade & Cloud Quota
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
          Choose the Perfect Plan for Your Workflow
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Unlock unlimited daily operations, multi-threaded high-speed OCR, batch PDF processing, and developer API keys.
        </p>
      </div>

      {/* Controls: Billing cycle & Currency Switchers */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        
        {/* Monthly / Annual Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Billing:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
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
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              type="button"
              onClick={() => setCurrency('INR')}
              className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
                currency === 'INR' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              ₹ INR
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
                currency === 'USD' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
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
                  ? 'border-2 border-indigo-600 bg-white shadow-xl shadow-indigo-100/50 scale-[1.02]'
                  : 'border border-slate-200 bg-white shadow-sm hover:border-slate-300'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center justify-between">
                    <span>{plan.name}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Current Active
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 min-h-[32px] leading-relaxed">{plan.tagline}</p>
                </div>

                {/* Price display */}
                <div className="py-4 border-y border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-slate-900">{displayPrice}</span>
                    {plan.id !== 'free' && (
                      <span className="text-sm text-slate-400 font-semibold">/ month</span>
                    )}
                  </div>
                  {plan.id !== 'free' && billingCycle === 'yearly' && (
                    <span className="text-xs text-emerald-600 font-bold block mt-1">
                      Billed annually (Includes 20% discount)
                    </span>
                  )}
                </div>

                {/* Feature list */}
                <ul className="space-y-3 text-sm text-slate-700 pt-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plan CTA Button */}
              <div className="pt-8 mt-4">
                {isCurrent ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl text-sm font-bold cursor-default"
                  >
                    Currently Active
                  </button>
                ) : plan.id === 'free' ? (
                  <button
                    type="button"
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                  >
                    Continue with Free
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectPlanForCheckout(plan, billingCycle, currency)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Upgrade to {plan.name.split(' ')[0]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Matrix Table Toggle */}
      <div className="pt-8 max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => setShowMatrix(!showMatrix)}
          className="w-full p-4 sm:p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between text-sm font-bold text-slate-800 transition-colors cursor-pointer"
        >
          <span>View Full Detailed Plan Comparison Matrix</span>
          {showMatrix ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showMatrix && (
          <div className="mt-4 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 font-bold text-slate-700">Capabilities</th>
                    <th className="p-4 font-bold text-slate-700">Starter (Free)</th>
                    <th className="p-4 font-bold text-indigo-700">Pro Creator</th>
                    <th className="p-4 font-bold text-purple-700">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PLAN_COMPARISON_MATRIX.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-4 font-medium text-slate-800">{row.feature}</td>
                      <td className="p-4 text-slate-500">{row.free}</td>
                      <td className="p-4 font-semibold text-indigo-900 bg-indigo-50/20">{row.pro}</td>
                      <td className="p-4 font-semibold text-purple-900">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-4 text-center max-w-4xl mx-auto mt-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span className="font-semibold">30-Day Money Back Guarantee • Instant Activation • Cancel Anytime</span>
        </div>
      </div>

    </div>
  );
}
