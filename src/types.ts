export type ToolCategory = 
  | 'All'
  | 'Text & Speech'
  | 'Audio'
  | 'PDF Tools'
  | 'SEO & Social'
  | 'Image & Media'
  | 'Label Cropper'
  | 'Network & Security'
  | 'Financial & Calc'
  | 'Code & Data'
  | 'Postal & Bank';

export type AppViewMode = 'home' | 'tool' | 'hub' | 'about' | 'pricing' | 'profile' | 'admin';

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  toolId: ToolId;
  toolName: string;
  category: ToolCategory;
  action: string;
  details?: string;
  status: 'success' | 'warning' | 'info' | 'error';
  executionTimeMs?: number;
}

export interface ContactQuery {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  category: 'Feature Request' | 'Bug Report' | 'Enterprise / Custom Tool' | 'Billing & Subscription' | 'General Query';
  subject: string;
  message: string;
  status: 'Received' | 'In Review' | 'Resolved';
}

export type ToolId = 
  // Text & Core
  | 'word-counter'
  | 'text-compare'
  | 'text-to-speech'
  // Audio Suite
  | 'audio-joiner'
  | 'audio-speed'
  | 'audio-volume'
  | 'audio-trim'
  // PDF Suite - Organize PDF
  | 'pdf-merge'
  | 'pdf-split'
  | 'pdf-remove-pages'
  | 'pdf-extract-pages'
  | 'pdf-organize'
  | 'pdf-scan'
  // PDF Suite - Convert to PDF
  | 'jpg-to-pdf'
  | 'word-to-pdf'
  | 'powerpoint-to-pdf'
  | 'excel-to-pdf'
  | 'html-to-pdf'
  | 'office-to-pdf'
  // PDF Suite - Convert from PDF
  | 'pdf-to-jpg'
  | 'pdf-to-word'
  | 'pdf-to-powerpoint'
  | 'pdf-to-excel'
  | 'pdf-to-markdown'
  | 'pdf-to-pdfa'
  // PDF Suite - Optimize PDF
  | 'pdf-compress'
  | 'pdf-repair'
  // PDF Suite - Edit PDF
  | 'pdf-edit'
  | 'pdf-rotate'
  | 'pdf-page-numbers'
  | 'pdf-watermark'
  | 'pdf-crop'
  | 'pdf-forms'
  // PDF Suite - Security
  | 'pdf-unlock'
  | 'pdf-protect'
  | 'pdf-sign'
  | 'pdf-redact'
  | 'pdf-compare'
  // PDF Suite - Intelligence (AI)
  | 'pdf-ai-summarize'
  | 'pdf-ai-translate'
  // SEO & Creator
  | 'keyword-intent'
  | 'meta-desc-gen'
  | 'meta-title-gen'
  | 'youtube-title-gen'
  | 'youtube-desc-gen'
  | 'youtube-tags-gen'
  // Image & Converters
  | 'image-resizer'
  | 'crop-image'
  | 'image-compressor'
  | 'format-converter'
  | 'paste-image'
  | 'psd-to-json'
  | 'image-to-text'
  // E-commerce Label Croppers
  | 'flipkart-label-crop'
  | 'meesho-label-crop'
  | 'amazon-label-crop'
  | 'snapdeal-label-crop'
  // Social & Utilities
  | 'whatsapp-direct'
  | 'video-downloader'
  // Network & Security
  | 'crypto-base64'
  | 'hostname-to-ip'
  | 'dns-lookup'
  | 'ssl-checker'
  | 'regex-tester'
  | 'email-finder'
  // Calculators
  | 'age-calculator'
  | 'home-loan-calc'
  | 'car-loan-calc'
  // Code & Data
  | 'json-formatter'
  | 'json-editor'
  | 'color-contrast'
  | 'code-minifier'
  // Postal & Bank
  | 'ifsc-finder'
  | 'pincode-finder';

export type PdfSubGroup = 
  | 'Organize PDF'
  | 'Convert to PDF'
  | 'Convert from PDF'
  | 'Optimize PDF'
  | 'Edit PDF'
  | 'PDF Security'
  | 'PDF Intelligence';

export interface ToolMeta {
  id: ToolId;
  name: string;
  shortDesc: string;
  category: ToolCategory;
  pdfGroup?: PdfSubGroup;
  icon: string;
  badge?: string;
  tier?: 'basic' | 'advance' | 'premium';
}

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';
export type Currency = 'USD' | 'INR';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  tagline: string;
  priceMonthlyUSD: number;
  priceYearlyUSD: number;
  priceMonthlyINR: number;
  priceYearlyINR: number;
  badge?: string;
  popular?: boolean;
  features: string[];
  limits: {
    dailyOperations: number | 'Unlimited';
    maxFileSizeMB: number;
    ocrLanguages: number | 'All';
    bulkBatchLimit: number;
    apiAccess: boolean;
    prioritySupport: boolean;
    commercialLicense: boolean;
  };
}

export interface UserInvoice {
  id: string;
  date: string;
  planName: string;
  amount: string;
  currency: Currency;
  status: 'Paid' | 'Pending' | 'Failed';
  paymentMethod: string;
  transactionId: string;
  pdfUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  avatarUrl?: string;
  tier: SubscriptionTier;
  billingCycle?: BillingCycle;
  subscriptionExpiresAt?: string;
  dailyOperationsCount: number;
  dailyOperationsLimit: number;
  memberSince: string;
  invoices: UserInvoice[];
}

