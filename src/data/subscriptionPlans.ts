import { SubscriptionPlan } from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Starter (Free)',
    tagline: '10 Essential tools for everyday tasks',
    priceMonthlyUSD: 0,
    priceYearlyUSD: 0,
    priceMonthlyINR: 0,
    priceYearlyINR: 0,
    features: [
      'Access to 10 Basic Utilities',
      'Daily limit: 10 operations',
      'Standard community support',
      'Max 25 MB file size limit'
    ],
    limits: {
      dailyOperations: 10,
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
    name: 'Pro Creator',
    tagline: '70 Tools (Basic + Advance) for Professionals',
    priceMonthlyUSD: 4.5,
    priceYearlyUSD: 43.5, 
    priceMonthlyINR: 350,
    priceYearlyINR: 3600, // 300/mo on annual
    popular: true,
    badge: 'Basic + Advance',
    features: [
      '✨ 70 Full Power Tools (Basic + Advance)',
      '⚡ Unlimited daily operations',
      '📄 Bulk email finder from unlimited Excel/CSV rows',
      '🔒 High-capacity 200 MB file upload limit',
      '💼 Commercial use license',
      '🚀 Priority support'
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
    name: 'Enterprise Updates',
    tagline: '70+ Tools (Basic + Advance + Premium Feature Updates)',
    priceMonthlyUSD: 6,
    priceYearlyUSD: 58,
    priceMonthlyINR: 480,
    priceYearlyINR: 4800, // 400/mo on annual
    badge: 'All Access + Updates',
    features: [
      '👑 Everything in Pro included',
      '🚀 Premium Feature Update Tools (AI & Batch APIs)',
      '☁️ 1 GB file size processing headroom',
      '🔑 Developer REST API & Webhook keys',
      '👥 5 Team seats & centralized admin dashboard',
      '🤝 99.9% Uptime SLA'
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
  { feature: 'Available Tools', free: '10 Basic Tools', pro: '70 Tools (Basic + Advance)', enterprise: '70+ Tools (Basic + Advance + Updates)' },
  { feature: 'Daily Operations Quota', free: '10 / day', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Max File Upload Size', free: '25 MB', pro: '200 MB', enterprise: '1 GB' },
  { feature: 'Feature Updates & AI Tools', free: 'No', pro: 'No', enterprise: 'Yes' },
  { feature: 'Email Finder from URLs', free: '10 rows / file', pro: '500 rows / file', enterprise: 'Unlimited rows' },
  { feature: 'Developer REST API Access', free: 'No', pro: 'No', enterprise: 'Yes (100k calls/mo)' },
  { feature: 'Team Seats', free: '1 User', pro: '1 User', enterprise: '5 Team Seats' },
  { feature: 'Support Level', free: 'Community', pro: 'Priority Email', enterprise: '24/7 Dedicated SLA' },
];
