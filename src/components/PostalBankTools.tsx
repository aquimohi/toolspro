import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  Check, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Phone,
  Navigation
} from 'lucide-react';
import { ToolId } from '../types';

interface PostalBankToolsProps {
  toolId: 'ifsc-finder' | 'pin-code-finder';
}

export const PostalBankTools: React.FC<PostalBankToolsProps> = ({ toolId }) => {
  const [ifscCode, setIfscCode] = useState('SBIN0000691');
  const [pinCode, setPinCode] = useState('110001');

  const [isLoading, setIsLoading] = useState(false);
  const [ifscResult, setIfscResult] = useState<any | null>(null);
  const [pinResult, setPinResult] = useState<any[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyVal = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Lookup IFSC Code
  const handleLookupIfsc = async () => {
    const code = ifscCode.trim().toUpperCase();
    if (!code) return;
    setIsLoading(true);
    setErrorMsg(null);
    setIfscResult(null);

    try {
      const res = await fetch(`https://ifsc.razorpay.com/${code}`);
      if (!res.ok) throw new Error(`IFSC code "${code}" not found. Please verify the code.`);
      const data = await res.json();
      setIfscResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch IFSC details');
    } finally {
      setIsLoading(false);
    }
  };

  // Lookup Pin Code
  const handleLookupPin = async () => {
    const code = pinCode.trim();
    if (!code) return;
    setIsLoading(true);
    setErrorMsg(null);
    setPinResult(null);

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
      if (!res.ok) throw new Error(`PIN code "${code}" lookup failed.`);
      const data = await res.json();

      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice) {
        setPinResult(data[0].PostOffice);
      } else {
        setErrorMsg(`No post offices found for PIN Code "${code}".`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch PIN code data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* 1. IFSC Code Finder */}
      {toolId === 'ifsc-finder' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Bank IFSC Code & Branch Finder</h2>
              <p className="text-xs text-slate-500">Lookup Bank name, branch address, MICR code, NEFT/RTGS/IMPS/UPI support</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ifscCode}
                onChange={e => setIfscCode(e.target.value.toUpperCase())}
                placeholder="Enter 11-digit IFSC code (e.g. SBIN0000691, HDFC0000240, ICIC0000007)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm font-mono uppercase border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleLookupIfsc}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{isLoading ? 'Searching...' : 'Find Bank Details'}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {ifscResult && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{ifscResult.BANK}</h3>
                  <span className="text-xs font-semibold text-indigo-600">{ifscResult.BRANCH} Branch</span>
                </div>
                <button
                  onClick={() => copyVal(ifscResult.IFSC, 'ifsc-res')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                >
                  {copiedKey === 'ifsc-res' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'ifsc-res' ? 'Copied IFSC' : ifscResult.IFSC}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500">IFSC Code:</span>
                  <div className="font-bold text-slate-800 font-mono mt-0.5">{ifscResult.IFSC}</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500">MICR Code:</span>
                  <div className="font-bold text-slate-800 font-mono mt-0.5">{ifscResult.MICR || 'N/A'}</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500">City / District:</span>
                  <div className="font-bold text-slate-800 mt-0.5">{ifscResult.CITY}, {ifscResult.DISTRICT}</div>
                </div>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs flex flex-col gap-1">
                <span className="font-semibold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Full Branch Address:
                </span>
                <p className="text-slate-800 font-medium">{ifscResult.ADDRESS}</p>
              </div>

              {/* Payment Rail Statuses */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                {['NEFT', 'RTGS', 'IMPS', 'UPI'].map(rail => (
                  <span
                    key={rail}
                    className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      ifscResult[rail]
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border-slate-300'
                    }`}
                  >
                    ✓ {rail} Enabled
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. PIN Code Finder */}
      {toolId === 'pin-code-finder' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Indian Postal PIN Code Finder</h2>
              <p className="text-xs text-slate-500">Search post offices, delivery status, division & circle by 6-digit PIN code</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={pinCode}
                onChange={e => setPinCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="Enter 6-digit Indian PIN code (e.g. 110001, 400001, 560001, 700001)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleLookupPin}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{isLoading ? 'Searching...' : 'Lookup PIN Code'}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {pinResult && (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Post Offices for PIN {pinCode} ({pinResult.length} Results)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pinResult.map((po, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm">{po.Name}</h4>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          po.DeliveryStatus === 'Delivery' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {po.DeliveryStatus}
                        </span>
                      </div>
                      <span className="text-slate-500 text-[11px] block mt-0.5">{po.BranchType}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-slate-600 flex flex-col gap-1 text-[11px]">
                      <div><strong>District:</strong> {po.District}</div>
                      <div><strong>State:</strong> {po.State}</div>
                      <div><strong>Circle / Division:</strong> {po.Circle} ({po.Division})</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
