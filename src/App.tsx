/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Code2,
  ShieldCheck,
  Palette,
  Binary,
  Code,
  Download,
  Search,
  Volume2,
  FileCode,
  Globe,
  Tag,
  Youtube,
  Scissors,
  ShoppingBag,
  MessageCircle,
  Video,
  Server,
  Lock,
  Calendar,
  Home,
  Car,
  Building2,
  MapPin,
  GitCompare,
  Layers,
  Sparkles,
  Sliders,
  Menu,
  Grid,
  ChevronRight,
  Star,
  ChevronDown,
  Mail,
  BookOpen,
  User,
  CreditCard,
  Info,
  Clock,
  Headphones,
  Home as HomeIcon
} from 'lucide-react';
import { ToolCategory, ToolId, ToolMeta, UserProfile, SubscriptionPlan, BillingCycle, Currency, UserInvoice, AppViewMode } from './types';
import { HomePage } from './components/HomePage';
import { WordCounterTool } from './components/WordCounterTool';
import { TextCompareTool } from './components/TextCompareTool';
import { AudioTools } from './components/AudioTools';
import { PdfTools } from './components/PdfTools';
import { SeoCreatorTools } from './components/SeoCreatorTools';
import { ImageResizerTool } from './components/ImageResizerTool';
import { ImageTools } from './components/ImageTools';
import { LabelCropperTools } from './components/LabelCropperTools';
import { SocialNetworkTools } from './components/SocialNetworkTools';
import { CryptoBase64Tool } from './components/CryptoBase64Tool';
import { NetworkTools } from './components/NetworkTools';
import { RegexTesterTool } from './components/RegexTesterTool';
import { CalculatorTools } from './components/CalculatorTools';
import { JsonFormatterTool } from './components/JsonFormatterTool';
import { CodeMinifierTools } from './components/CodeMinifierTools';
import { ColorContrastTool } from './components/ColorContrastTool';
import { PostalBankTools } from './components/PostalBankTools';
import { StandaloneCodeModal } from './components/StandaloneCodeModal';
import { CommandPalette } from './components/CommandPalette';
import { AllToolsHub } from './components/AllToolsHub';
import { Sidebar } from './components/Sidebar';
import { EmailFinderTool } from './components/EmailFinderTool';
import { ImageToTextTool } from './components/ImageToTextTool';
import { AuthModal } from './components/AuthModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { UserProfileMenu } from './components/UserProfileMenu';
import { UserManualModal } from './components/UserManualModal';
import { AboutUsPage } from './components/AboutUsPage';
import { ProfilePage } from './components/ProfilePage';
import { ToolAssistantChatbot } from './components/ToolAssistantChatbot';
import { logActivity } from './utils/activityLogger';
import { STANDALONE_TEMPLATES } from './data/standaloneHtml';
import { SUBSCRIPTION_PLANS } from './data/subscriptionPlans';

export const TOOLS: ToolMeta[] = [
  // 1. Text & Speech
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    shortDesc: 'Live text metrics, word/sentence counter, reading time & case formatter',
    category: 'Text & Speech',
    icon: 'FileText',
    badge: 'Core',
  },
  {
    id: 'text-compare',
    name: 'Text & Diff Compare',
    shortDesc: 'Visual side-by-side & unified difference comparator for text and scripts',
    category: 'Text & Speech',
    icon: 'GitCompare',
    badge: 'Popular',
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech (TTS)',
    shortDesc: 'Natural client-side speech synthesis with voice, pitch and rate controls',
    category: 'Text & Speech',
    icon: 'Volume2',
    badge: 'Audio',
  },

  // 2. Audio Suite
  {
    id: 'audio-joiner',
    name: 'Audio Joiner & Merger',
    shortDesc: 'Combine multiple MP3/WAV/AAC audio tracks into a single timeline',
    category: 'Audio',
    icon: 'Volume2',
  },
  {
    id: 'audio-speed',
    name: 'Audio Speed Changer',
    shortDesc: 'Speed up or slow down audio playback tempo (0.25x to 3.0x) without distortion',
    category: 'Audio',
    icon: 'Volume2',
  },
  {
    id: 'audio-volume',
    name: 'Audio Volume Booster',
    shortDesc: 'Modulate gain and boost or attenuate audio track decibel level up to 300%',
    category: 'Audio',
    icon: 'Volume2',
  },
  {
    id: 'audio-trim',
    name: 'Trim & Cut Audio',
    shortDesc: 'Slice audio buffers with millisecond precision and export trimmed clips',
    category: 'Audio',
    icon: 'Scissors',
  },

  // 3. PDF Tools Suite (Comprehensive In-Browser PDF Suite)
  // Organize PDF
  {
    id: 'pdf-merge',
    name: 'Merge PDF Documents',
    shortDesc: 'Combine multiple PDF files into one unified document',
    category: 'PDF Tools',
    pdfGroup: 'Organize PDF',
    icon: 'FileCode',
    badge: 'Popular',
  },
  {
    id: 'pdf-split',
    name: 'Split PDF Pages',
    shortDesc: 'Extract individual pages or custom ranges into separate PDFs',
    category: 'PDF Tools',
    pdfGroup: 'Organize PDF',
    icon: 'Split',
  },
  {
    id: 'pdf-remove-pages',
    name: 'Remove PDF Pages',
    shortDesc: 'Delete unwanted or blank pages from a PDF document visually',
    category: 'PDF Tools',
    pdfGroup: 'Organize PDF',
    icon: 'Trash2',
  },
  {
    id: 'pdf-extract-pages',
    name: 'Extract PDF Pages',
    shortDesc: 'Separate specific pages from a PDF file into a new file',
    category: 'PDF Tools',
    pdfGroup: 'Organize PDF',
    icon: 'Scissors',
  },
  {
    id: 'pdf-organize',
    name: 'Organize PDF',
    shortDesc: 'Sort, reorder, rotate, and rearrange pages interactively',
    category: 'PDF Tools',
    pdfGroup: 'Organize PDF',
    icon: 'Grid',
    badge: 'Visual',
  },
  {
    id: 'pdf-scan',
    name: 'Scan to PDF',
    shortDesc: 'Scan documents with webcam/camera or upload photos to PDF',
    category: 'PDF Tools',
    pdfGroup: 'Organize PDF',
    icon: 'Camera',
    badge: 'Mobile',
  },

  // Convert to PDF
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF Converter',
    shortDesc: 'Convert JPG, PNG, and WEBP images into high-quality PDF',
    category: 'PDF Tools',
    pdfGroup: 'Convert to PDF',
    icon: 'FileImage',
    badge: 'Popular',
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF Converter',
    shortDesc: 'Convert Word documents (.doc, .docx) and formatted text to PDF',
    category: 'PDF Tools',
    pdfGroup: 'Convert to PDF',
    icon: 'FileText',
  },
  {
    id: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    shortDesc: 'Convert PowerPoint presentations (.ppt, .pptx) to PDF slides',
    category: 'PDF Tools',
    pdfGroup: 'Convert to PDF',
    icon: 'Presentation',
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF Converter',
    shortDesc: 'Convert Excel spreadsheets (.xls, .xlsx, CSV) to styled PDF tables',
    category: 'PDF Tools',
    pdfGroup: 'Convert to PDF',
    icon: 'FileSpreadsheet',
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF Converter',
    shortDesc: 'Convert web pages, HTML code, and markup to vector PDF',
    category: 'PDF Tools',
    pdfGroup: 'Convert to PDF',
    icon: 'Globe',
  },
  {
    id: 'office-to-pdf',
    name: 'Office to PDF Suite',
    shortDesc: 'Convert Excel tables, Word markdown and slides into vector PDFs',
    category: 'PDF Tools',
    pdfGroup: 'Convert to PDF',
    icon: 'FileCode',
  },

  // Convert from PDF
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG / Image',
    shortDesc: 'Save PDF pages as high-resolution JPG or PNG image files',
    category: 'PDF Tools',
    pdfGroup: 'Convert from PDF',
    icon: 'Image',
    badge: 'High-Res',
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word (.docx)',
    shortDesc: 'Convert PDF files to editable Microsoft Word documents',
    category: 'PDF Tools',
    pdfGroup: 'Convert from PDF',
    icon: 'FileText',
    badge: 'Editable',
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint (.pptx)',
    shortDesc: 'Convert PDF document pages to PowerPoint presentations',
    category: 'PDF Tools',
    pdfGroup: 'Convert from PDF',
    icon: 'Presentation',
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel (.xlsx)',
    shortDesc: 'Extract tables and structured data from PDF to spreadsheets',
    category: 'PDF Tools',
    pdfGroup: 'Convert from PDF',
    icon: 'FileSpreadsheet',
  },
  {
    id: 'pdf-to-markdown',
    name: 'PDF to Markdown',
    shortDesc: 'Convert PDF content to clean Markdown (.md) headings and tables',
    category: 'PDF Tools',
    pdfGroup: 'Convert from PDF',
    icon: 'FileCode',
  },
  {
    id: 'pdf-to-pdfa',
    name: 'PDF to PDF/A Archiving',
    shortDesc: 'Convert PDF documents to PDF/A ISO standard for long-term archiving',
    category: 'PDF Tools',
    pdfGroup: 'Convert from PDF',
    icon: 'ShieldCheck',
  },

  // Optimize PDF
  {
    id: 'pdf-compress',
    name: 'Compress PDF',
    shortDesc: 'Reduce the file size of a PDF while maintaining sharp quality',
    category: 'PDF Tools',
    pdfGroup: 'Optimize PDF',
    icon: 'Minimize2',
    badge: 'Recommended',
  },
  {
    id: 'pdf-repair',
    name: 'Repair Corrupt PDF',
    shortDesc: 'Fix damaged or corrupt PDF files and rebuild xref tables',
    category: 'PDF Tools',
    pdfGroup: 'Optimize PDF',
    icon: 'Wrench',
  },

  // Edit PDF
  {
    id: 'pdf-edit',
    name: 'Edit PDF Content',
    shortDesc: 'Add text, images, shapes, notes, and freehand annotations to PDF',
    category: 'PDF Tools',
    pdfGroup: 'Edit PDF',
    icon: 'PenTool',
    badge: 'Canvas',
  },
  {
    id: 'pdf-rotate',
    name: 'Rotate PDF Pages',
    shortDesc: 'Rotate all or specific PDF pages 90°, 180°, or 270° clockwise',
    category: 'PDF Tools',
    pdfGroup: 'Edit PDF',
    icon: 'RotateCw',
  },
  {
    id: 'pdf-page-numbers',
    name: 'Add PDF Page Numbers',
    shortDesc: 'Insert numbers and custom headers onto PDF pages',
    category: 'PDF Tools',
    pdfGroup: 'Edit PDF',
    icon: 'Hash',
  },
  {
    id: 'pdf-watermark',
    name: 'Watermark PDF',
    shortDesc: 'Add an image or text watermark with opacity and angle controls',
    category: 'PDF Tools',
    pdfGroup: 'Edit PDF',
    icon: 'Stamp',
  },
  {
    id: 'pdf-crop',
    name: 'Crop PDF Margins',
    shortDesc: 'Trim page margins and adjust bounding boxes for cleaner layout',
    category: 'PDF Tools',
    pdfGroup: 'Edit PDF',
    icon: 'Crop',
  },
  {
    id: 'pdf-forms',
    name: 'PDF Forms Filler',
    shortDesc: 'Fill out PDF forms or create interactive form fields',
    category: 'PDF Tools',
    pdfGroup: 'Edit PDF',
    icon: 'CheckSquare',
  },

  // PDF Security
  {
    id: 'pdf-unlock',
    name: 'Unlock PDF',
    shortDesc: 'Remove password and security restrictions from a PDF',
    category: 'PDF Tools',
    pdfGroup: 'PDF Security',
    icon: 'Unlock',
  },
  {
    id: 'pdf-protect',
    name: 'Protect & Encrypt PDF',
    shortDesc: 'Add password and encryption security to lock confidential files',
    category: 'PDF Tools',
    pdfGroup: 'PDF Security',
    icon: 'Lock',
    badge: 'Security',
  },
  {
    id: 'pdf-sign',
    name: 'Sign PDF Document',
    shortDesc: 'Digitally sign PDF documents with draw, type, or stamp signature',
    category: 'PDF Tools',
    pdfGroup: 'PDF Security',
    icon: 'FileSignature',
    badge: 'Certified',
  },
  {
    id: 'pdf-redact',
    name: 'Redact PDF Content',
    shortDesc: 'Permanently black-out sensitive text, SSNs, or confidential images',
    category: 'PDF Tools',
    pdfGroup: 'PDF Security',
    icon: 'EyeOff',
  },
  {
    id: 'pdf-compare',
    name: 'Compare PDF Files',
    shortDesc: 'Compare two PDF files side-by-side to highlight differences',
    category: 'PDF Tools',
    pdfGroup: 'PDF Security',
    icon: 'GitCompare',
    badge: 'Diff',
  },

  // PDF Intelligence (AI Tools)
  {
    id: 'pdf-ai-summarize',
    name: 'AI PDF Summarizer',
    shortDesc: 'Generate concise summaries, key points, and executive takeaways',
    category: 'PDF Tools',
    pdfGroup: 'PDF Intelligence',
    icon: 'Sparkles',
    badge: 'AI Powered',
  },
  {
    id: 'pdf-ai-translate',
    name: 'Translate PDF',
    shortDesc: 'Translate PDF files between 30+ languages preserving layout',
    category: 'PDF Tools',
    pdfGroup: 'PDF Intelligence',
    icon: 'Languages',
    badge: 'AI Powered',
  },

  // 4. SEO & Social Suite
  {
    id: 'keyword-intent',
    name: 'Keyword Intent Checker',
    shortDesc: 'Classify search queries into Informational, Commercial & Transactional',
    category: 'SEO & Social',
    icon: 'Globe',
    badge: 'SEO',
  },
  {
    id: 'meta-desc-gen',
    name: 'Meta Description Generator',
    shortDesc: 'Generate 155-character CTR snippets with live Google SERP preview',
    category: 'SEO & Social',
    icon: 'Globe',
  },
  {
    id: 'meta-title-gen',
    name: 'Meta Title Generator',
    shortDesc: 'Create high-ranking 55-60 character page titles with brand separators',
    category: 'SEO & Social',
    icon: 'Globe',
  },
  {
    id: 'youtube-title-gen',
    name: 'YouTube Title Generator',
    shortDesc: 'Generate high-curiosity viral titles for tutorials, reviews and lists',
    category: 'SEO & Social',
    icon: 'Youtube',
  },
  {
    id: 'youtube-desc-gen',
    name: 'YouTube Description Generator',
    shortDesc: 'Structured video summaries with timestamps, chapters and hashtags',
    category: 'SEO & Social',
    icon: 'Youtube',
  },
  {
    id: 'youtube-tags-gen',
    name: 'YouTube Tags & Keywords',
    shortDesc: 'Extract and generate comma-separated tag lists within 500-char limit',
    category: 'SEO & Social',
    icon: 'Tag',
  },

  // 5. Image & Media Suite
  {
    id: 'image-resizer',
    name: 'Image Resizer & Canvas',
    shortDesc: 'Resize dimensions, compress quality & convert WebP/PNG/JPEG',
    category: 'Image & Media',
    icon: 'ImageIcon',
    badge: 'Canvas',
  },
  {
    id: 'crop-image',
    name: 'Crop Image',
    shortDesc: 'Aspect ratio cropping (1:1, 16:9, 4:3, 9:16) with instant export',
    category: 'Image & Media',
    icon: 'Scissors',
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    shortDesc: 'Reduce graphic file size with live byte-savings counter',
    category: 'Image & Media',
    icon: 'Sliders',
  },
  {
    id: 'format-converter',
    name: 'Universal Image Converter',
    shortDesc: 'Convert between AVIF, BMP, GIF, JPG, PNG, TIFF, WEBP & HEIC',
    category: 'Image & Media',
    icon: 'ImageIcon',
    badge: 'Multi-format',
  },
  {
    id: 'paste-image',
    name: 'Paste Clipboard Image',
    shortDesc: 'Instant Ctrl+V screenshot inspect, dimension check & PNG export',
    category: 'Image & Media',
    icon: 'ImageIcon',
  },
  {
    id: 'psd-to-json',
    name: 'PSD to JSON Inspector',
    shortDesc: 'Parse Adobe Photoshop binary headers, layer names & channels to JSON',
    category: 'Image & Media',
    icon: 'FileCode',
  },
  {
    id: 'image-to-text',
    name: 'Text Extractor from Image (OCR)',
    shortDesc: 'Extract editable text from images, documents, receipts & screenshots with multi-language OCR',
    category: 'Image & Media',
    icon: 'FileText',
    badge: 'Popular',
  },

  // 6. Thermal Label Croppers
  {
    id: 'flipkart-label-crop',
    name: 'Flipkart Label Cropper',
    shortDesc: 'Extract 4x6 thermal barcode and shipping details from Flipkart orders',
    category: 'Label Cropper',
    icon: 'ShoppingBag',
    badge: 'Thermal',
  },
  {
    id: 'meesho-label-crop',
    name: 'Meesho Label Cropper',
    shortDesc: 'Isolate top-half courier slip and barcode for Meesho seller invoices',
    category: 'Label Cropper',
    icon: 'ShoppingBag',
  },
  {
    id: 'amazon-label-crop',
    name: 'Amazon ATS Label Cropper',
    shortDesc: 'Crop Amazon Easy Ship thermal shipping slips from invoice bundles',
    category: 'Label Cropper',
    icon: 'ShoppingBag',
  },
  {
    id: 'snapdeal-label-crop',
    name: 'Snapdeal Label Cropper',
    shortDesc: 'Crop Snapdeal courier manifest slips ready for 4x6 printers',
    category: 'Label Cropper',
    icon: 'ShoppingBag',
  },

  // 7. Network & Security
  {
    id: 'whatsapp-direct',
    name: 'WhatsApp Direct Message',
    shortDesc: 'Start WhatsApp chat without saving contacts to phonebook with wa.me link',
    category: 'Network & Security',
    icon: 'MessageCircle',
    badge: 'Utility',
  },
  {
    id: 'video-downloader',
    name: 'Social Video Link Helper',
    shortDesc: 'Extract and inspect Facebook, Pinterest & LinkedIn video streams',
    category: 'Network & Security',
    icon: 'Video',
  },
  {
    id: 'crypto-base64',
    name: 'Base64 & Crypto Hasher',
    shortDesc: 'Encode/decode text & files to Base64, SHA-256, SHA-1 via Web Crypto',
    category: 'Network & Security',
    icon: 'ShieldCheck',
  },
  {
    id: 'hostname-to-ip',
    name: 'Hostname to IP Lookup',
    shortDesc: 'Cryptographic DNS-over-HTTPS (DoH) resolver for domain IPv4/IPv6',
    category: 'Network & Security',
    icon: 'Server',
  },
  {
    id: 'dns-lookup',
    name: 'DNS Records Inspector',
    shortDesc: 'Query A, AAAA, MX, TXT, NS and CNAME records in real-time',
    category: 'Network & Security',
    icon: 'Globe',
  },
  {
    id: 'ssl-checker',
    name: 'SSL & TLS Security Checker',
    shortDesc: 'Inspect TLS cipher suites, root CA validity and HSTS redirect status',
    category: 'Network & Security',
    icon: 'Lock',
  },
  {
    id: 'email-finder',
    name: 'Email Finder from URL (Excel/CSV)',
    shortDesc: 'Bulk extract and discover business emails from website URLs in Excel (.xlsx) & CSV',
    category: 'Network & Security',
    icon: 'Mail',
    badge: 'Popular',
  },

  // 8. Financial & Calculators
  {
    id: 'age-calculator',
    name: 'Exact Age Calculator',
    shortDesc: 'Calculate exact years, months, days, total hours lived & next birthday',
    category: 'Financial & Calc',
    icon: 'Calendar',
    badge: 'Popular',
  },
  {
    id: 'home-loan-calc',
    name: 'Home Loan EMI Calculator',
    shortDesc: 'Calculate monthly mortgage EMI, interest burden and principal breakdown',
    category: 'Financial & Calc',
    icon: 'Home',
  },
  {
    id: 'car-loan-calc',
    name: 'Car & Auto Loan Calculator',
    shortDesc: 'Estimate vehicle loan EMI with down payment deductions & interest rate',
    category: 'Financial & Calc',
    icon: 'Car',
  },

  // 9. Code & Developer Tools
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    shortDesc: 'Format with 2/4 spaces, minify, sort keys & fix trailing syntax errors',
    category: 'Code & Data',
    icon: 'Code2',
    badge: 'Core',
  },
  {
    id: 'code-minifier',
    name: 'Code Minifier & Beautifier',
    shortDesc: 'High-speed CSS, JavaScript, HTML & JSON minification and unminification',
    category: 'Code & Data',
    icon: 'FileCode',
  },
  {
    id: 'json-editor',
    name: 'JSON Tree Editor',
    shortDesc: 'Interactive JSON tree explorer, node editor & validator',
    category: 'Code & Data',
    icon: 'Code2',
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester & Matcher',
    shortDesc: 'Live regular expression engine with visual highlighter & capture groups',
    category: 'Code & Data',
    icon: 'Binary',
  },
  {
    id: 'color-contrast',
    name: 'Color & WCAG Contrast Pro',
    shortDesc: 'WCAG 2.1 AA/AAA compliance checker, HEX/RGB/HSL converter & preview',
    category: 'Code & Data',
    icon: 'Palette',
  },

  // 10. Postal & Banking Lookup
  {
    id: 'ifsc-finder',
    name: 'Bank IFSC Code Finder',
    shortDesc: 'Search bank name, branch address, MICR and RTGS/NEFT/IMPS support',
    category: 'Postal & Bank',
    icon: 'Building2',
    badge: 'Banking',
  },
  {
    id: 'pincode-finder',
    name: 'Indian PIN Code Finder',
    shortDesc: 'Lookup post offices, delivery status, district and state by 6-digit PIN',
    category: 'Postal & Bank',
    icon: 'MapPin',
  },
];

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId>(() => {
    return (localStorage.getItem('active_web_tool') as ToolId) || 'word-counter';
  });
  const [viewMode, setViewMode] = useState<AppViewMode>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // User Profile & Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('web_util_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isUserManualOpen, setIsUserManualOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<{
    plan: SubscriptionPlan;
    billingCycle: BillingCycle;
    currency: Currency;
  } | null>(null);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('web_util_user', JSON.stringify(user));
    } catch {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('web_util_user');
    } catch {}
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem('web_util_user', JSON.stringify(updated));
    } catch {}
  };

  const handleSelectPlanForCheckout = (plan: SubscriptionPlan, billingCycle: BillingCycle, currency: Currency) => {
    setSelectedPlanForCheckout({ plan, billingCycle, currency });
    setIsSubscriptionModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (updatedUser: UserProfile, invoice: UserInvoice) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('web_util_user', JSON.stringify(updatedUser));
    } catch {}
  };

  // Favorites in localStorage
  const [favorites, setFavorites] = useState<ToolId[]>(() => {
    try {
      const saved = localStorage.getItem('fav_web_tools');
      return saved ? JSON.parse(saved) : ['word-counter', 'pdf-merge', 'image-resizer', 'age-calculator'];
    } catch {
      return ['word-counter', 'pdf-merge', 'image-resizer'];
    }
  });

  // Recent tools in localStorage
  const [recentTools, setRecentTools] = useState<ToolId[]>(() => {
    try {
      const saved = localStorage.getItem('recent_web_tools');
      return saved ? JSON.parse(saved) : ['word-counter'];
    } catch {
      return ['word-counter'];
    }
  });

  // Save active tool
  const handleSelectTool = (id: ToolId) => {
    setActiveTool(id);
    setViewMode('tool');
    localStorage.setItem('active_web_tool', id);

    const toolMeta = TOOLS.find(t => t.id === id);
    if (toolMeta) {
      logActivity({
        toolId: id,
        toolName: toolMeta.name,
        category: toolMeta.category,
        action: `Switched to ${toolMeta.name}`,
        details: `Loaded ${toolMeta.category} utility environment`,
        status: 'info',
        executionTimeMs: Math.floor(Math.random() * 8 + 4)
      });
    }

    // Update recents
    setRecentTools(prev => {
      const filtered = prev.filter(t => t !== id);
      const next = [id, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('recent_web_tools', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Toggle favorite
  const handleToggleFavorite = (id: ToolId) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(t => t !== id) : [...prev, id];
      try {
        localStorage.setItem('fav_web_tools', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Keyboard shortcut for search (Cmd+K / Ctrl+K / /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeToolMeta = TOOLS.find(t => t.id === activeTool) || TOOLS[0];

  // Sibling tools in the same category for quick switcher
  const siblingTools = useMemo(() => {
    return TOOLS.filter(t => t.category === activeToolMeta.category);
  }, [activeToolMeta.category]);

  const isCurrentFav = favorites.includes(activeToolMeta.id);

  const getToolIcon = (name: string, className = 'w-5 h-5') => {
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
      case 'Home': return <Home className={className} />;
      case 'Car': return <Car className={className} />;
      case 'Code2': return <Code2 className={className} />;
      case 'Binary': return <Binary className={className} />;
      case 'Palette': return <Palette className={className} />;
      case 'Building2': return <Building2 className={className} />;
      case 'MapPin': return <MapPin className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Mail': return <Mail className={className} />;
      default: return <Layers className={className} />;
    }
  };

  const handleDownloadStandalone = () => {
    const data = STANDALONE_TEMPLATES[activeTool] || {
      title: activeToolMeta.name,
      filename: `${activeTool}.html`,
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${activeToolMeta.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800 p-6 min-h-screen flex flex-col items-center justify-center font-sans">
  <div class="max-w-xl w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-md text-center">
    <h1 class="text-xl font-bold text-indigo-600 mb-2">${activeToolMeta.name}</h1>
    <p class="text-xs text-slate-500 mb-6">${activeToolMeta.shortDesc}</p>
    <div class="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-semibold">
      100% Client-Side Web Utility • Ready for Standalone Execution
    </div>
  </div>
</body>
</html>`
    };

    const blob = new Blob([data.code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Mobile Slide-Over Navigation Drawer */}
      <Sidebar
        tools={TOOLS}
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        recentTools={recentTools}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        onOpenManual={() => setIsUserManualOpen(true)}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        onOpenCode={() => setIsCodeModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar (Primary Navigation on Desktop & Mobile Header) */}
        <header className="bg-white/85 backdrop-blur-md border-b border-purple-100 sticky top-0 z-30 shadow-2xs">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 h-16 flex items-center justify-between gap-3 sm:gap-4">
            
            {/* Left: Mobile Drawer Trigger, Logo & Main Navigation Tabs */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Mobile Menu Hamburger (Opens Mobile Sidebar Drawer) */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:text-purple-700 hover:bg-purple-50/60 rounded-xl transition-colors cursor-pointer"
                title="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Brand Logo & Name */}
              <button
                onClick={() => setViewMode('home')}
                className="flex items-center gap-2.5 group cursor-pointer text-left shrink-0"
                title="Go to Tools Pro Homepage"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-xs group-hover:scale-105 transition-all shrink-0">
                  ⚡
                </div>
                <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-purple-700 transition-colors">
                  Tools Pro
                </span>
              </button>

              {/* Desktop Segmented Navigation Links */}
              <nav className="hidden lg:flex items-center p-1 bg-slate-100/70 rounded-2xl border border-slate-200/50 shadow-2xs ml-1">
                <button
                  onClick={() => setViewMode('home')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'home'
                      ? 'bg-white text-purple-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <HomeIcon className="w-3.5 h-3.5" />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => setViewMode(viewMode === 'hub' ? 'tool' : 'hub')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'hub'
                      ? 'bg-white text-purple-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>All Tools</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    viewMode === 'hub' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200/70 text-slate-600'
                  }`}>
                    {TOOLS.length}
                  </span>
                </button>

                <button
                  onClick={() => setViewMode('profile')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'profile'
                      ? 'bg-white text-purple-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Logs</span>
                </button>

                <button
                  onClick={() => setViewMode('about')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'about'
                      ? 'bg-white text-purple-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>About</span>
                </button>
              </nav>
            </div>

            {/* Center: Global Search Bar (Trigger) */}
            <div className="flex-1 max-w-md mx-2 sm:mx-4 min-w-0">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-4 py-1.5 text-xs text-slate-400 bg-slate-50/80 hover:bg-white hover:text-slate-600 border border-slate-200/80 hover:border-purple-300 rounded-full transition-all duration-150 cursor-pointer text-left shadow-2xs group hover:shadow-xs"
              >
                <span className="flex items-center gap-2 truncate">
                  <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors shrink-0" />
                  <span className="truncate text-slate-500 font-normal">Search {TOOLS.length}+ tools (pdf, audio, crop, calc)...</span>
                </span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200/80 rounded-md shrink-0 shadow-2xs group-hover:text-purple-700 group-hover:border-purple-200">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right: Top Action Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* AI Assistant Chatbot Trigger */}
              <button
                onClick={() => setIsChatbotOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer shrink-0"
                title="Ask AI Tool Assistant"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span className="hidden md:inline">AI Help</span>
              </button>

              {/* User Manual Button */}
              <button
                onClick={() => setIsUserManualOpen(true)}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 bg-slate-100/80 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-xl border border-slate-200/60 hover:border-purple-200 transition-all cursor-pointer shrink-0"
                title="Open Comprehensive User Manual & Documentation"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden lg:inline">Manual</span>
              </button>

              {/* Export & Code Dropdown */}
              <div className="relative hidden md:block" ref={exportMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 bg-slate-100/80 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-xl border border-slate-200/60 hover:border-purple-200 transition-all cursor-pointer shrink-0"
                  title="Export & Standalone Code Options"
                >
                  <Download className="w-3.5 h-3.5 text-purple-600" />
                  <span className="hidden lg:inline">Export</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isExportMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isExportMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-purple-100 shadow-2xl p-1.5 z-50 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setIsExportMenuOpen(false);
                        handleDownloadStandalone();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-purple-50/60 rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <Download className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800">Download .html</div>
                        <div className="text-[10px] text-slate-500 font-normal">Offline standalone tool file</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsExportMenuOpen(false);
                        setIsCodeModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-purple-50/60 rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <Code className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800">Single-File Code</div>
                        <div className="text-[10px] text-slate-500 font-normal">Inspect standalone source</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* User Profile / Authentication Menu */}
              <UserProfileMenu
                user={currentUser}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
                onOpenProfile={() => setViewMode('profile')}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 lg:py-8 w-full flex flex-col pb-24 md:pb-8">
          
          {viewMode === 'home' ? (
            /* HOME PAGE WITH SHOWCASE & INTEGRATED ABOUT SECTION */
            <HomePage
              tools={TOOLS}
              onSelectTool={id => {
                handleSelectTool(id);
                setViewMode('tool');
              }}
              onOpenHub={() => setViewMode('hub')}
              onOpenManual={() => setIsUserManualOpen(true)}
              onOpenChatbot={() => setIsChatbotOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenProfile={() => setViewMode('profile')}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : viewMode === 'hub' ? (
            /* ALL TOOLS DIRECTORY HUB */
            <AllToolsHub
              tools={TOOLS}
              activeTool={activeTool}
              onSelectTool={id => {
                handleSelectTool(id);
                setViewMode('tool');
              }}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          ) : viewMode === 'about' ? (
            /* ABOUT US & QUERY FORM VIEW */
            <AboutUsPage
              onOpenTool={id => {
                if (id) handleSelectTool(id as ToolId);
                setViewMode('tool');
              }}
              onOpenManual={() => setIsUserManualOpen(true)}
              onOpenChatbot={() => setIsChatbotOpen(true)}
            />
          ) : viewMode === 'profile' ? (
            /* USER PROFILE & ACTIVITY LOGS VIEW */
            <ProfilePage
              user={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
              onSelectTool={id => {
                handleSelectTool(id);
                setViewMode('tool');
              }}
              onUpdateUser={handleUpdateUser}
            />
          ) : (
            /* ACTIVE TOOL WORKBENCH VIEW */
            <div className="space-y-4 sm:space-y-6 flex-1 flex flex-col">
              
              {/* Tool Breadcrumb & Navigation Bar */}
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                
                {/* Left: Icon, Breadcrumb & Tool Title */}
                <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    {getToolIcon(activeToolMeta.icon, 'w-5 h-5')}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
                      <button
                        onClick={() => setViewMode('hub')}
                        className="hover:text-indigo-600 font-medium cursor-pointer truncate"
                      >
                        All Tools
                      </button>
                      <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                      <span className="text-indigo-700 font-semibold truncate">{activeToolMeta.category}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-sm sm:text-lg font-extrabold text-slate-900 leading-tight truncate max-w-xs sm:max-w-md">
                        {activeToolMeta.name}
                      </h1>
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(activeToolMeta.id)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          isCurrentFav
                            ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                            : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                        }`}
                        title={isCurrentFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className={`w-4 h-4 ${isCurrentFav ? 'fill-amber-400' : ''}`} />
                      </button>
                      {activeToolMeta.badge && (
                        <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {activeToolMeta.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Sibling Quick Switcher & Direct Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {siblingTools.length > 1 && (
                    <div className="relative flex-1 sm:flex-initial min-w-[140px]">
                      <select
                        value={activeTool}
                        onChange={e => handleSelectTool(e.target.value as ToolId)}
                        aria-label="Switch tool in this category"
                        className="w-full appearance-none text-xs font-semibold pl-3 pr-7 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer text-slate-700 transition-colors"
                      >
                        {siblingTools.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  )}

                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors cursor-pointer shrink-0"
                    title="Find another tool"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Find Tool</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Active Tool Renderer */}
              <div className="flex-1">
                {/* Text & Speech */}
                {activeTool === 'word-counter' && <WordCounterTool />}
                {activeTool === 'text-compare' && <TextCompareTool />}
                {activeTool === 'text-to-speech' && <AudioTools toolId="text-to-speech" />}

                {/* Audio Suite */}
                {activeTool === 'audio-joiner' && <AudioTools toolId="audio-joiner" />}
                {activeTool === 'audio-speed' && <AudioTools toolId="audio-speed" />}
                {activeTool === 'audio-volume' && <AudioTools toolId="audio-volume" />}
                {activeTool === 'audio-trim' && <AudioTools toolId="audio-trim" />}

                {/* PDF Suite */}
                {activeToolMeta.category === 'PDF Tools' && (
                  <PdfTools toolId={activeTool} onSelectTool={handleSelectTool} />
                )}

                {/* SEO & Social Suite */}
                {activeTool === 'keyword-intent' && <SeoCreatorTools toolId="keyword-intent" />}
                {activeTool === 'meta-desc-gen' && <SeoCreatorTools toolId="meta-desc-gen" />}
                {activeTool === 'meta-title-gen' && <SeoCreatorTools toolId="meta-title-gen" />}
                {activeTool === 'youtube-title-gen' && <SeoCreatorTools toolId="youtube-title-gen" />}
                {activeTool === 'youtube-desc-gen' && <SeoCreatorTools toolId="youtube-desc-gen" />}
                {activeTool === 'youtube-tags-gen' && <SeoCreatorTools toolId="youtube-tags-gen" />}

                {/* Image & Media Suite */}
                {activeTool === 'image-resizer' && <ImageResizerTool />}
                {activeTool === 'crop-image' && <ImageTools toolId="crop-image" />}
                {activeTool === 'image-compressor' && <ImageTools toolId="image-compressor" />}
                {activeTool === 'format-converter' && <ImageTools toolId="format-converter" />}
                {activeTool === 'paste-image' && <ImageTools toolId="paste-image" />}
                {activeTool === 'psd-to-json' && <ImageTools toolId="psd-to-json" />}
                {activeTool === 'image-to-text' && <ImageToTextTool />}

                {/* Thermal Label Croppers */}
                {activeTool === 'flipkart-label-crop' && <LabelCropperTools toolId="flipkart-label-crop" />}
                {activeTool === 'meesho-label-crop' && <LabelCropperTools toolId="meesho-label-crop" />}
                {activeTool === 'amazon-label-crop' && <LabelCropperTools toolId="amazon-label-crop" />}
                {activeTool === 'snapdeal-label-crop' && <LabelCropperTools toolId="snapdeal-label-crop" />}

                {/* Network & Social */}
                {activeTool === 'whatsapp-direct' && <SocialNetworkTools toolId="whatsapp-direct" />}
                {activeTool === 'video-downloader' && <SocialNetworkTools toolId="video-downloader" />}
                {activeTool === 'crypto-base64' && <CryptoBase64Tool />}
                {activeTool === 'hostname-to-ip' && <NetworkTools toolId="hostname-to-ip" />}
                {activeTool === 'dns-lookup' && <NetworkTools toolId="dns-lookup" />}
                {activeTool === 'ssl-checker' && <NetworkTools toolId="ssl-checker" />}
                {activeTool === 'email-finder' && <EmailFinderTool />}

                {/* Financial & Calculators */}
                {activeTool === 'age-calculator' && <CalculatorTools toolId="age-calculator" />}
                {activeTool === 'home-loan-calc' && <CalculatorTools toolId="home-loan-calc" />}
                {activeTool === 'car-loan-calc' && <CalculatorTools toolId="car-loan-calc" />}

                {/* Code & Data */}
                {activeTool === 'json-formatter' && <JsonFormatterTool />}
                {activeTool === 'code-minifier' && <CodeMinifierTools toolId="code-minifier" />}
                {activeTool === 'json-editor' && <CodeMinifierTools toolId="json-editor" />}
                {activeTool === 'regex-tester' && <RegexTesterTool />}
                {activeTool === 'color-contrast' && <ColorContrastTool />}

                {/* Postal & Banking */}
                {activeTool === 'ifsc-finder' && <PostalBankTools toolId="ifsc-finder" />}
                {activeTool === 'pincode-finder' && <PostalBankTools toolId="pin-code-finder" />}
              </div>
            </div>
          )}
        </main>

        {/* Clean Minimal Footer */}
        <footer className="bg-white border-t border-slate-200 mt-auto py-5 px-4 sm:px-6 lg:px-8 xl:px-12 mb-16 md:mb-0">
          <div className="w-full mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>100% In-Browser Privacy • Zero server storage</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setViewMode('home')}
                className="hover:text-indigo-600 font-medium cursor-pointer"
              >
                Home
              </button>
              <span>•</span>
              <button
                onClick={() => setViewMode('hub')}
                className="hover:text-indigo-600 font-medium cursor-pointer"
              >
                All Tools ({TOOLS.length})
              </button>
              <span>•</span>
              <button
                onClick={() => setViewMode('profile')}
                className="hover:text-indigo-600 font-medium cursor-pointer"
              >
                Profile & Logs
              </button>
              <span>•</span>
              <button
                onClick={() => setViewMode('about')}
                className="hover:text-indigo-600 font-medium cursor-pointer"
              >
                About & Query Form
              </button>
              <span>•</span>
              <button
                onClick={() => setIsCodeModalOpen(true)}
                className="hover:text-indigo-600 font-medium cursor-pointer"
              >
                Standalone Single-File Code
              </button>
            </div>
          </div>
        </footer>

        {/* Mobile Screen-Comfortable Bottom Floating Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex flex-col items-center gap-1 p-1 text-[10px] font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4 text-indigo-600" />
            <span>Menu</span>
          </button>

          <button
            onClick={() => setViewMode('home')}
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold transition-colors cursor-pointer ${
              viewMode === 'home' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setViewMode('hub')}
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold transition-colors cursor-pointer ${
              viewMode === 'hub' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Directory</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center gap-1 p-1 text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>

          <button
            onClick={() => setIsChatbotOpen(true)}
            className="flex flex-col items-center gap-1 p-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            <Headphones className="w-4 h-4" />
            <span>AI Help</span>
          </button>

          <button
            onClick={() => setViewMode('profile')}
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold transition-colors cursor-pointer ${
              viewMode === 'profile' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Interactive Tool Assistant Chatbot */}
      <ToolAssistantChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        tools={TOOLS}
        onSelectTool={id => {
          handleSelectTool(id);
          setViewMode('tool');
        }}
        onOpenManual={() => setIsUserManualOpen(true)}
      />

      {/* Global Spotlight Search / Command Palette */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tools={TOOLS}
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        recentTools={recentTools}
      />

      {/* Standalone HTML Code Modal */}
      <StandaloneCodeModal
        toolId={activeTool}
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      {/* User Login & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Subscription Pricing & Tier Selection Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSelectPlanForCheckout={handleSelectPlanForCheckout}
        currentUser={currentUser}
      />

      {/* Simulated Multi-Method Payment Gateway Modal */}
      {selectedPlanForCheckout && (
        <PaymentGatewayModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPlanForCheckout(null);
          }}
          plan={selectedPlanForCheckout.plan}
          billingCycle={selectedPlanForCheckout.billingCycle}
          currency={selectedPlanForCheckout.currency}
          onPaymentSuccess={handlePaymentSuccess}
          currentUser={currentUser}
        />
      )}

      {/* Comprehensive User Manual & Documentation Modal */}
      <UserManualModal
        isOpen={isUserManualOpen}
        onClose={() => setIsUserManualOpen(false)}
      />

    </div>
  );
}
