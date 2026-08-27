import React, { useState, useMemo } from 'react';
import {
  X,
  BookOpen,
  Search,
  FileText,
  Volume2,
  FileCode,
  Image as ImageIcon,
  ShoppingBag,
  ShieldCheck,
  Code2,
  Building2,
  Sparkles,
  CreditCard,
  Key,
  ChevronRight,
  Terminal,
  HelpCircle,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ManualSection {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  steps: string[];
  tips: string[];
  codeSnippet?: string;
  faq?: { q: string; a: string }[];
}

const MANUAL_SECTIONS: ManualSection[] = [
  {
    id: 'getting-started',
    title: '1. Getting Started & Quick Overview',
    category: 'General',
    icon: 'BookOpen',
    description: 'Learn how to navigate the 42+ all-in-one web utility suite, keyboard shortcuts, and client-side privacy architecture.',
    steps: [
      'Navigate to any utility using the Left Sidebar, the All Tools Hub, or the Quick Command Palette (Press ⌘K or Ctrl+K).',
      'Choose your tool: All file processing (PDFs, Images, Audio, Spreadsheets) executes 100% locally in your browser memory.',
      'Export or Save: Download modified files instantly, or click "Single-File Code" in the header to download a self-contained offline HTML copy of any utility.',
      'Check your quota: Free tier users receive 30 operations per day. Upgrade to Pro Creator for unlimited processing and bulk batch modes.'
    ],
    tips: [
      'Pro Tip: Press "/" on your keyboard anywhere on the page to immediately focus the global tool search bar.',
      'No data ever leaves your device: We do not maintain any cloud file storage or server-side logging for user uploads.'
    ]
  },
  {
    id: 'auth-and-billing',
    title: '2. User Accounts, Subscriptions & Payment Gateway',
    category: 'Billing & Account',
    icon: 'CreditCard',
    description: 'Guide to creating accounts, managing subscription tiers, using cards/UPI/NetBanking, and downloading tax invoices.',
    steps: [
      'Sign In / Sign Up: Click the "Sign In" button in the top right to create your user profile with zero friction.',
      'Select a Plan: Navigate to "Pricing & Upgrade". Choose between Starter (Free), Pro Creator ($12/mo or ₹799/mo), and Enterprise Business ($39/mo or ₹2,499/mo).',
      'Toggle Billing & Currency: Switch between Monthly and Annual billing (with 20% discount), and choose between USD ($) and INR (₹).',
      'Complete Checkout: In the Payment Gateway modal, select your preferred method: Credit/Debit Card (Visa, MasterCard, RuPay), UPI (Google Pay, PhonePe, Paytm, QR Scan), or NetBanking.',
      'Download Tax Invoices: After payment, click "Download Tax Invoice" or access historical receipts anytime via the User Profile Menu > Billing & Invoices.'
    ],
    tips: [
      'Test Sandbox: Use the "Fill Demo Test Card" or "Fill Demo UPI" buttons during checkout for instant interactive testing.',
      'Refund Policy: All subscriptions come with a 30-day money-back guarantee. Subscriptions can be canceled at any time.'
    ],
    faq: [
      {
        q: 'What payment methods are supported in the gateway?',
        a: 'We support all major Credit & Debit cards (Visa, MasterCard, RuPay, Amex), instant UPI (GPay, PhonePe, Paytm, QR Code scan), NetBanking (50+ banks), and corporate purchase orders.'
      },
      {
        q: 'How do I download tax invoices for business accounting?',
        a: 'Open the User Profile menu in the header, click "Billing & Invoices", and click "Download PDF/TXT" next to any transaction.'
      }
    ]
  },
  {
    id: 'pdf-tools',
    title: '3. PDF Suite Manual (Merge, Split, Protect, OCR)',
    category: 'PDF & Documents',
    icon: 'FileCode',
    description: 'Complete guide for manipulating, password protecting, watermarking, margin-cropping, and compressing PDF documents.',
    steps: [
      'Merge PDF: Drag and drop multiple PDF files. Reorder pages using up/down controls, then click "Merge PDFs & Download".',
      'Split PDF: Enter specific page ranges (e.g. "1-3, 5, 8-10") or split every page into separate individual PDF files.',
      'Rotate PDF: Select 90°, 180°, or 270° clockwise rotation per page or document-wide.',
      'Protect & Unlock: Enter user/owner passwords to encrypt confidential documents, or remove encryption from password-known PDFs.',
      'Watermark PDF: Specify watermark text (e.g. "CONFIDENTIAL" or "SAMPLE"), customize opacity (5% to 80%), and stamp diagonally across all pages.',
      'Page Numbers: Add "Page X of Y" numbering to Header or Footer with customizable alignment (Bottom-Center, Bottom-Right, Top-Right).'
    ],
    tips: [
      'Client-side pdf-lib: Even 500-page documents are manipulated directly in browser RAM without server upload lag.',
      'For thermal shipping labels, use the specialized E-Commerce Label Cropper suite instead of manual PDF cropping.'
    ]
  },
  {
    id: 'image-ocr-tools',
    title: '4. Image Suite & Optical Character Recognition (OCR)',
    category: 'Image & Media',
    icon: 'ImageIcon',
    description: 'How to resize, compress, crop, format-convert, and extract text from images in 11+ languages.',
    steps: [
      'Image To Text (OCR): Upload an image, paste from clipboard, or click "Open Camera" for live document scanning.',
      'Select OCR Language: Choose English, Spanish, French, German, Hindi, Arabic, Japanese, Chinese, Russian, or Portuguese.',
      'Enable Pre-processing Filters: Toggle "High Contrast B&W", "Auto-Sharpening", or "Invert Colors" to enhance low-light camera photos.',
      'Export Text: Copy extracted text directly, click "Listen (TTS)" for voice playback, or download as `.txt` / `.json` with confidence scores.',
      'Universal Format Converter: Convert between AVIF, BMP, GIF, JPG, PNG, TIFF, and WEBP with customizable quality sliders.'
    ],
    tips: [
      'Clipboard Paste: Press Ctrl+V / Cmd+V anywhere inside the Image OCR tool or Paste Image tool for instant inspection.',
      'Multi-threaded workers: Pro and Enterprise users utilize multi-threaded Tesseract.js workers for 10x faster extraction.'
    ]
  },
  {
    id: 'audio-tools',
    title: '5. Audio Suite Manual (Joiner, Speed, Volume, Trim)',
    category: 'Audio & Voice',
    icon: 'Volume2',
    description: 'Manipulate audio sample rates, playback tempo without pitch distortion, gain modulation, and timeline concatenation.',
    steps: [
      'Audio Joiner: Upload multiple tracks (MP3, WAV, AAC, OGG). Drag or reorder them, then merge into a seamless master track.',
      'Speed Changer: Adjust tempo slider between 0.25x (slow study) and 3.0x (speed listening) with pitch correction.',
      'Volume Booster: Amplify quiet audio tracks up to +12dB (300% volume) via Web Audio API gain nodes without clipping.',
      'Audio Trimmer: Set start and end millisecond markers or use the interactive audio scrub bar, preview in real-time, and download.'
    ],
    tips: [
      'Format compatibility: Supports all standard browser-supported audio codecs including MP3, WAV, AAC, M4A, and OGG.'
    ]
  },
  {
    id: 'ecommerce-labels',
    title: '6. E-Commerce Thermal Label Cropper Manual',
    category: 'E-Commerce',
    icon: 'ShoppingBag',
    description: 'Extract 4x6 inch thermal shipping manifests and courier slips from Flipkart, Meesho, Amazon, and Snapdeal invoices.',
    steps: [
      'Select your platform: Flipkart, Meesho, Amazon ATS, or Snapdeal from the Left Sidebar.',
      'Upload the seller PDF invoice provided by the portal.',
      'The engine automatically detects the barcode region and crops the shipping slip precisely to standard 4x6 inch thermal label size.',
      'Click "Crop & Download Thermal Label" to send directly to your TSC, Zebra, or Rollo thermal printer.'
    ],
    tips: [
      'No more wasted A4 paper: Thermal label cropping saves up to 75% on ink and paper costs for daily marketplace sellers.'
    ]
  },
  {
    id: 'email-finder-security',
    title: '7. Email Finder & Network Security Manual',
    category: 'Network & Security',
    icon: 'ShieldCheck',
    description: 'Bulk domain email scraper, Excel/CSV lead discovery, DNS DoH resolver, SSL certificate inspector, and Crypto hasher.',
    steps: [
      'Email Finder from URLs: Paste URLs or upload `.xlsx` / `.csv` files containing company domains.',
      'Scan Modes: Choose Quick Scan or Deep Discovery (which scans contact, about, and team subpages).',
      'Export Leads: Export verified email lists directly to `.xlsx` or `.csv` spreadsheet formats.',
      'Crypto Hasher: Generate SHA-256, SHA-512, SHA-1, MD5, and Base64 hashes for raw text or uploaded binary files.',
      'DNS & SSL Checker: Inspect A, AAAA, MX, TXT, and CNAME records via encrypted Cloudflare DNS-over-HTTPS.'
    ],
    tips: [
      'Bulk spreadsheet support: Drag and drop your company lead list and let the tool crawl and extract contact addresses automatically.'
    ]
  },
  {
    id: 'developer-api',
    title: '8. Developer REST API & Webhook Specifications',
    category: 'Developer API',
    icon: 'Terminal',
    description: 'Enterprise API documentation, authentication headers, cURL examples, and webhook schemas.',
    steps: [
      'Obtain your API Key from your Enterprise User Profile.',
      'Set the Authorization Header: `Authorization: Bearer YOUR_API_KEY`.',
      'All endpoints accept JSON payloads or multipart/form-data for file uploads.',
      'Response format is standard JSON with structured error codes.'
    ],
    tips: [
      'Rate Limits: Enterprise plans include 100,000 API calls/month with 99.9% uptime SLA guarantee.'
    ],
    codeSnippet: `// 1. OCR Text Extraction via REST API
curl -X POST https://api.webutilitiessuite.com/v1/ocr \\
  -H "Authorization: Bearer usr_enterprise_api_key_8892" \\
  -F "file=@invoice_scan.png" \\
  -F "language=eng"

// Response:
{
  "status": "success",
  "data": {
    "text": "Total Due: $1,450.00\\nInvoice Date: 2026-08-26",
    "confidence": 98.4,
    "lines_count": 14
  }
}`
  }
];

export function UserManualModal({ isOpen, onClose }: UserManualModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('getting-started');

  if (!isOpen) return null;

  const filteredSections = MANUAL_SECTIONS.filter(section => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      section.title.toLowerCase().includes(q) ||
      section.category.toLowerCase().includes(q) ||
      section.description.toLowerCase().includes(q) ||
      section.steps.some(s => s.toLowerCase().includes(q))
    );
  });

  const activeSection = MANUAL_SECTIONS.find(s => s.id === activeSectionId) || filteredSections[0] || MANUAL_SECTIONS[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold shadow-md shadow-indigo-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">Official User Manual & Documentation</h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v2026.4
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Comprehensive step-by-step operational guides, subscription management, payment flows & developer API specs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search user manual (e.g. ocr, payment gateway, pdf split, api, refund)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs"
            />
          </div>
        </div>

        {/* Body: Split View (Sidebar + Content) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          
          {/* Left Index Nav (4 cols) */}
          <div className="md:col-span-4 p-4 overflow-y-auto space-y-1.5 bg-slate-50/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Manual Modules ({filteredSections.length})
            </span>
            {filteredSections.map(section => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSectionId(section.id)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeSection.id === section.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <span className="block truncate">{section.title}</span>
                  <span className={`text-[10px] block mt-0.5 ${
                    activeSection.id === section.id ? 'text-indigo-200' : 'text-slate-400'
                  }`}>
                    {section.category}
                  </span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${
                  activeSection.id === section.id ? 'text-white' : 'text-slate-300'
                }`} />
              </button>
            ))}
          </div>

          {/* Right Content Details (8 cols) */}
          <div className="md:col-span-8 p-6 overflow-y-auto space-y-6">
            
            {/* Header of Active Section */}
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {activeSection.category}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 pt-1">
                {activeSection.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeSection.description}
              </p>
            </div>

            {/* Step by step operational guide */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Step-by-Step Instructions</span>
              </h4>
              <div className="space-y-2.5">
                {activeSection.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tips */}
            {activeSection.tips && activeSection.tips.length > 0 && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>Pro Tips & Best Practices</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-800">
                  {activeSection.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Code Snippet (For API / Devs) */}
            {activeSection.codeSnippet && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <span>Developer API Example</span>
                </h4>
                <pre className="p-4 bg-slate-950 text-slate-100 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
                  {activeSection.codeSnippet}
                </pre>
              </div>
            )}

            {/* FAQ section */}
            {activeSection.faq && activeSection.faq.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Frequently Asked Questions</span>
                </h4>
                <div className="space-y-2">
                  {activeSection.faq.map((item, i) => (
                    <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-slate-800 block">Q: {item.q}</span>
                      <p className="text-xs text-slate-600 leading-relaxed">A: {item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Need more assistance? Contact billing & technical support at support@webutilitiessuite.com</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors cursor-pointer"
          >
            Close Manual
          </button>
        </div>

      </div>
    </div>
  );
}
