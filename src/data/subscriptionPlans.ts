import { SubscriptionPlan } from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Starter (Free)',
    tagline: 'Essential daily tools for casual developers and everyday users',
    priceMonthlyUSD: 0,
    priceYearlyUSD: 0,
    priceMonthlyINR: 0,
    priceYearlyINR: 0,
    features: [
      'Access to all 42+ web utilities',
      'Up to 30 operations per day',
      'Single-file standalone HTML export',
      'Client-side zero-storage privacy',
      'Max 25 MB file size limit',
      'Standard community support'
    ],
    limits: {
      dailyOperations: 30,
      maxFileSizeMB: 25,
      ocrLanguages: 3,
      bulkBatchLimit: 10,
      apiAccess: false,
      prioritySupport: false,
      commercialLicense: false
    }
  },
  {
    id: 'pro',
    name: 'Pro Creator & Dev',
    tagline: 'Unlimited high-performance power tools for professionals & creators',
    priceMonthlyUSD: 12,
    priceYearlyUSD: 9.6, // 20% discount on yearly
    priceMonthlyINR: 799,
    priceYearlyINR: 639, // 20% discount
    popular: true,
    badge: 'Most Popular',
    features: [
      '✨ Unlimited daily operations & batches',
      '⚡ 10x faster OCR & PDF multi-threaded engine',
      '📄 Bulk email finder from unlimited Excel/CSV rows',
      '📦 Thermal label batch cropping (up to 500 pages)',
      '🌐 Full 11+ OCR language dictionary pack',
      '🔒 High-capacity 200 MB file upload limit',
      '💼 Commercial use license & ad-free experience',
      '🚀 Priority email & chat support (< 2 hrs)'
    ],
    limits: {
      dailyOperations: 'Unlimited',
      maxFileSizeMB: 200,
      ocrLanguages: 'All',
      bulkBatchLimit: 500,
      apiAccess: false,
      prioritySupport: true,
      commercialLicense: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise Business',
    tagline: 'Custom infrastructure, developer API keys, SLA and multi-user seats',
    priceMonthlyUSD: 39,
    priceYearlyUSD: 31.2,
    priceMonthlyINR: 2499,
    priceYearlyINR: 1999,
    badge: 'Teams & API',
    features: [
      '👑 Everything in Pro included',
      '🔑 Dedicated Developer REST API & Webhook keys',
      '👥 5 Team seats with centralized admin dashboard',
      '☁️ 1 GB file size processing headroom',
      '🏷️ Custom white-label branding on exports & receipts',
      '🤝 99.9% Uptime SLA & Dedicated Account Manager',
      '🧾 Automated GST / VAT business invoice tax filing'
    ],
    limits: {
      dailyOperations: 'Unlimited',
      maxFileSizeMB: 1024,
      ocrLanguages: 'All',
      bulkBatchLimit: 5000,
      apiAccess: true,
      prioritySupport: true,
      commercialLicense: true
    }
  }
];

export const PLAN_COMPARISON_MATRIX = [
  { feature: 'Daily Operations Quota', free: '30 / day', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Max File Upload Size', free: '25 MB', pro: '200 MB', enterprise: '1 GB' },
  { feature: 'Image OCR Text Extraction', free: 'Basic (3 langs)', pro: 'Full (11+ langs + Enhancers)', enterprise: 'Full + Batch API' },
  { feature: 'Email Finder from URLs', free: '10 rows / file', pro: '500 rows / file', enterprise: 'Unlimited rows' },
  { feature: 'Thermal Label Croppers', free: 'Single PDF', pro: 'Bulk Multi-Page', enterprise: 'Automated Batch API' },
  { feature: 'Single-File HTML Code Export', free: 'Yes', pro: 'Yes', enterprise: 'Yes (White-label)' },
  { feature: 'Audio Speed & Merger', free: 'Standard', pro: 'HD Lossless', enterprise: 'HD Lossless Studio' },
  { feature: 'Developer REST API Access', free: 'No', pro: 'No', enterprise: 'Yes (100k calls/mo)' },
  { feature: 'Team Seats', free: '1 User', pro: '1 User', enterprise: '5 Team Seats' },
  { feature: 'Support Level', free: 'Community', pro: 'Priority Email', enterprise: '24/7 Dedicated SLA' },
];
