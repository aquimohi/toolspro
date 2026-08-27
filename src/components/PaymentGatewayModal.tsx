import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Building,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Download,
  Receipt,
  FileText,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Smartphone
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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  
  // Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || '');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // UPI state
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [copiedUpi, setCopiedUpi] = useState(false);
  
  // NetBanking state
  const [selectedBank, setSelectedBank] = useState('hdfc');

  // Checkout workflow state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [paymentDone, setPaymentDone] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState<UserInvoice | null>(null);

  if (!isOpen) return null;

  // Calculate pricing
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

  // Card formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      setExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setExpiry(val);
    }
  };

  // Demo auto-fill helpers
  const fillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardHolder(currentUser?.name || 'Alexander Pierce');
    setExpiry('12/28');
    setCvv('789');
  };

  const fillTestUpi = () => {
    setUpiId('alexander@okhdfcbank');
  };

  // Process payment simulation
  const handlePayNow = () => {
    setIsProcessing(true);
    setProcessStep('Verifying payment gateway handshake...');

    setTimeout(() => {
      setProcessStep(
        paymentMethod === 'card'
          ? 'Contacting 3D-Secure 2.0 Banking Network...'
          : paymentMethod === 'upi'
          ? 'Verifying UPI Handle & NPCI Settlement...'
          : 'Connecting to NetBanking Secure Gateway...'
      );
    }, 900);

    setTimeout(() => {
      setProcessStep('Generating Tax Invoice & Activating Tier Quota...');
    }, 1800);

    setTimeout(() => {
      setIsProcessing(false);
      const invoiceId = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const txnId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      
      const newInvoice: UserInvoice = {
        id: invoiceId,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        planName: `${plan.name} (${billingCycle === 'yearly' ? 'Annual' : 'Monthly'})`,
        amount: formattedTotal,
        currency,
        status: 'Paid',
        paymentMethod: paymentMethod === 'card' ? `Card ending in ${cardNumber.slice(-4) || '4242'}` : paymentMethod === 'upi' ? `UPI (${upiId || 'GPay'})` : `NetBanking (${selectedBank.toUpperCase()})`,
        transactionId: txnId
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
        name: cardHolder || 'Pro Subscriber',
        email: 'subscriber@example.com',
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
    }, 2600);
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
Status:           PAID (Verified via Payment Gateway)
------------------------------------------------------------
Customer:         ${currentUser?.name || cardHolder || 'Valued Subscriber'}
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
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
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
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                Welcome to {plan.name}!
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Your payment of <strong>{completedInvoice.amount}</strong> was processed successfully. Unlimited operations and high-speed multi-threaded workers are now enabled.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-slate-500">
                <span>Invoice ID:</span>
                <span className="font-mono font-bold text-slate-800">{completedInvoice.id}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Transaction Ref:</span>
                <span className="font-mono font-semibold text-slate-700">{completedInvoice.transactionId}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Method:</span>
                <span className="font-semibold text-slate-800">{completedInvoice.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Date:</span>
                <span className="font-semibold text-slate-800">{completedInvoice.date}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
                <span>Amount Paid:</span>
                <span className="text-indigo-600 text-sm">{completedInvoice.amount}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={downloadReceipt}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Download Tax Invoice</span>
              </button>
              
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-100"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form & Order Summary */
          <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            
            {/* Left Col (3 cols): Payment Gateways */}
            <div className="md:col-span-3 p-6 space-y-5">
              
              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'card' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'upi' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'netbanking' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>NetBanking</span>
                </button>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Card Details</span>
                    <button
                      type="button"
                      onClick={fillTestCard}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100"
                    >
                      Fill Demo Test Card
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Card Number</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4242 4242 4242 4242"
                        className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                      placeholder="Name on card"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">Expiry Date</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cvv}
                        onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI / QR Payment */}
              {paymentMethod === 'upi' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">UPI Instant Payment</span>
                    <button
                      type="button"
                      onClick={fillTestUpi}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100"
                    >
                      Fill Demo UPI
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                    {/* Visual QR Code Representation */}
                    <div className="w-20 h-20 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center justify-center shrink-0">
                      <QrCode className="w-14 h-14 text-slate-800" />
                      <span className="text-[8px] font-mono text-slate-400">Scan to Pay</span>
                    </div>

                    <div className="text-xs space-y-1">
                      <span className="font-bold text-slate-800 block">Scan with any UPI App</span>
                      <p className="text-[11px] text-slate-500">
                        Open Google Pay, PhonePe, Paytm, or BHIM and scan this dynamic code to approve.
                      </p>
                      <span className="text-[10px] font-mono font-bold text-indigo-600">
                        Amount: {formattedTotal}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Or Enter UPI ID / VPA</label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NetBanking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-3.5">
                  <span className="text-xs font-bold text-slate-700 block">Select Your Bank</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'hdfc', name: 'HDFC Bank' },
                      { id: 'icici', name: 'ICICI Bank' },
                      { id: 'sbi', name: 'State Bank of India' },
                      { id: 'axis', name: 'Axis Bank' },
                      { id: 'kotak', name: 'Kotak Mahindra' },
                      { id: 'other', name: 'Other 50+ Banks' }
                    ].map(bank => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-colors cursor-pointer ${
                          selectedBank === bank.id
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-2xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {bank.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Col (2 cols): Order Breakdown */}
            <div className="md:col-span-2 p-6 bg-slate-50/70 flex flex-col justify-between space-y-4">
              
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                  Order Summary
                </span>

                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{plan.name}</span>
                    <span className="text-xs font-bold text-indigo-600">{formattedSubtotal}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Billed {billingCycle === 'yearly' ? 'Annually (20% Savings)' : 'Monthly'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">{formattedSubtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST / VAT (18%)</span>
                    <span className="font-semibold text-slate-800">{formattedTax}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-slate-900 text-sm">
                    <span>Total Payable</span>
                    <span className="text-indigo-600">{formattedTotal}</span>
                  </div>
                </div>
              </div>

              {/* Pay Button & Security Badges */}
              <div className="space-y-2 pt-4">
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{processStep || 'Processing Payment...'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay {formattedTotal}</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  Instant activation • Cancel anytime from account settings • Money-back guarantee
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
