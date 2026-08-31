import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  AlertCircle
} from 'lucide-react';
import { SubscriptionPlan, BillingCycle, Currency, UserProfile, UserInvoice } from '../types';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  currency: Currency;
  onPaymentSuccess: (updatedUser: UserProfile, invoice: UserInvoice) => void;
  currentUser: UserProfile | null;
}

export function PaymentGatewayModal({
  isOpen,
  onClose,
  plan,
  billingCycle,
  currency,
  onPaymentSuccess,
  currentUser
}: PaymentGatewayModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [paymentDone, setPaymentDone] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState<UserInvoice | null>(null);

  if (!isOpen) return null;

  // For Razorpay, we'll enforce INR conversion (assuming 1 USD = 83 INR for demonstration if USD is selected)
  // Actually, Razorpay supports USD, but since the app uses priceMonthlyINR, we'll just use that if currency is INR, else USD
  const rawPrice = currency === 'USD'
    ? (billingCycle === 'yearly' ? plan.priceYearlyUSD * 12 : plan.priceMonthlyUSD)
    : (billingCycle === 'yearly' ? plan.priceYearlyINR * 12 : plan.priceMonthlyINR);

  const taxRate = 0.18; // 18% GST / VAT
  const taxAmount = rawPrice * taxRate;
  const totalAmount = rawPrice + taxAmount;

  const formattedTotal = currency === 'USD' 
    ? `$${totalAmount.toFixed(2)}`
    : `₹${Math.round(totalAmount).toLocaleString('en-IN')}`;

  const formattedSubtotal = currency === 'USD'
    ? `$${rawPrice.toFixed(2)}`
    : `₹${Math.round(rawPrice).toLocaleString('en-IN')}`;

  const formattedTax = currency === 'USD'
    ? `$${taxAmount.toFixed(2)}`
    : `₹${Math.round(taxAmount).toLocaleString('en-IN')}`;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    setProcessStep('Loading Payment Gateway...');

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      setIsProcessing(false);
      return;
    }

    try {
      setProcessStep('Generating Secure Order...');
      
      const result = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100), // paise/cents
          currency: currency
        }),
      });

      if (!result.ok) throw new Error('Order creation failed from backend');
      const order = await result.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TV5kXAJRxBvunA', 
        amount: order.amount, 
        currency: order.currency,
        name: 'Tools Pro',
        description: `Upgrade to ${plan.name} (${billingCycle})`,
        order_id: order.id,
        handler: async function (response: any) {
          setProcessStep('Verifying Payment Signature...');
          
          const verify = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }),
          });
          
          if (verify.ok) {
            finishPayment(response.razorpay_payment_id);
          } else {
            alert("Payment verification failed.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: currentUser?.name || 'Valued User',
          email: currentUser?.email || 'user@example.com',
        },
        theme: {
          color: '#4F46E5',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      alert(error.message);
      setIsProcessing(false);
    }
  };

  const finishPayment = (transactionId: string) => {
    setProcessStep('Activating Tier Quota...');
    
    setTimeout(() => {
      setIsProcessing(false);
      const invoiceId = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newInvoice: UserInvoice = {
        id: invoiceId,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        planName: `${plan.name} (${billingCycle === 'yearly' ? 'Annual' : 'Monthly'})`,
        amount: formattedTotal,
        currency,
        status: 'Paid',
        paymentMethod: 'Razorpay Payment Gateway',
        transactionId: transactionId
      };

      const updatedUser: UserProfile = currentUser ? {
        ...currentUser,
        tier: plan.id,
        billingCycle,
        subscriptionExpiresAt: billingCycle === 'yearly' ? 'Aug 26, 2027' : 'Sep 26, 2026',
        dailyOperationsLimit: plan.id === 'pro' || plan.id === 'enterprise' ? 999999 : 30,
        invoices: [newInvoice, ...(currentUser.invoices || [])]
      } : {
        id: `usr_${Date.now()}`,
        name: 'Pro Subscriber',
        email: 'subscriber@example.com',
        role: 'user',
        tier: plan.id,
        billingCycle,
        subscriptionExpiresAt: billingCycle === 'yearly' ? 'Aug 26, 2027' : 'Sep 26, 2026',
        dailyOperationsCount: 0,
        dailyOperationsLimit: 999999,
        memberSince: 'Aug 2026',
        invoices: [newInvoice]
      };

      setCompletedInvoice(newInvoice);
      setPaymentDone(true);
      onPaymentSuccess(updatedUser, newInvoice);
    }, 1000);
  };

  const downloadReceipt = () => {
    if (!completedInvoice) return;
    const content = `
============================================================
              WEB UTILITIES SUITE - OFFICIAL INVOICE
============================================================
Invoice ID:       ${completedInvoice.id}
Transaction ID:   ${completedInvoice.transactionId}
Date:             ${completedInvoice.date}
Status:           PAID (Verified via Razorpay)
------------------------------------------------------------
Customer:         ${currentUser?.name || 'Valued Subscriber'}
Email:            ${currentUser?.email || 'N/A'}
Plan:             ${completedInvoice.planName}
Billing:          ${billingCycle.toUpperCase()}
Payment Method:   ${completedInvoice.paymentMethod}
------------------------------------------------------------
Subtotal:         ${formattedSubtotal}
Tax / GST (18%):  ${formattedTax}
TOTAL PAID:       ${completedInvoice.amount}
============================================================
Thank you for subscribing to Web Utilities Suite!
Your cloud limits and unlimited quota are active immediately.
Support: billing@webutilitiessuite.com
============================================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${completedInvoice.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold">Secure Checkout & Payment</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> 256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Upgrading to <strong>{plan.name}</strong> • {billingCycle === 'yearly' ? 'Annual Billing (20% Off)' : 'Monthly Billing'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Successful Confirmation View */}
        {paymentDone && completedInvoice ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-lg shadow-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Payment Successful
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-3 mb-1">
                You're now on {plan.name}!
              </h2>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Thank you for upgrading. Your new cloud limits and pro features have been instantly activated.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-semibold">Invoice No</span>
                <span className="font-bold text-slate-900">{completedInvoice.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-semibold">Transaction ID</span>
                <span className="font-bold text-slate-900">{completedInvoice.transactionId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-semibold">Amount Paid</span>
                <span className="font-bold text-emerald-600">{completedInvoice.amount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={downloadReceipt}
                className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" /> Download Receipt
              </button>
              <button 
                onClick={onClose}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Normal Checkout View */
          <div className="p-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6">
              <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Order Summary</h4>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">{plan.name} Plan ({billingCycle})</span>
                  <span className="font-bold text-slate-900">{formattedSubtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Taxes & GST (18%)</span>
                  <span className="font-bold text-slate-900">{formattedTax}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="font-bold text-slate-900">Total Due</span>
                <span className="text-2xl font-black text-indigo-600">{formattedTotal}</span>
              </div>
            </div>

            {/* Processing Overlay inside modal */}
            {isProcessing ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="font-bold text-indigo-900">{processStep}</p>
                <p className="text-xs text-slate-500">Please do not close this window</p>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handlePayNow}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-4 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.01] active:scale-[0.98]"
                >
                  Pay {formattedTotal} with Razorpay
                </button>
                <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1 mt-2">
                  <Lock className="w-3 h-3" /> Payments are secure and encrypted
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
