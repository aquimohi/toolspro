import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Copy, 
  Check, 
  Youtube, 
  FileText, 
  Tag, 
  Compass, 
  Globe, 
  Smartphone, 
  Monitor,
  Lightbulb,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { ToolId } from '../types';

interface SeoCreatorToolsProps {
  toolId: 
    | 'keyword-intent'
    | 'meta-desc-gen'
    | 'meta-title-gen'
    | 'youtube-title-gen'
    | 'youtube-desc-gen'
    | 'youtube-tags-gen';
}

export const SeoCreatorTools: React.FC<SeoCreatorToolsProps> = ({ toolId }) => {
  const [keyword, setKeyword] = useState('best wireless noise cancelling headphones 2026');
  const [topic, setTopic] = useState('How to build a web app with React and TypeScript in 10 minutes');
  const [brandName, setBrandName] = useState('TechRadar Pro');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClip = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Keyword Intent Heuristic Engine
  const analyzeIntent = (query: string) => {
    const q = query.toLowerCase().trim();
    let intent: 'Informational' | 'Navigational' | 'Commercial' | 'Transactional' = 'Informational';
    let confidence = 85;
    let description = 'Searcher is looking for knowledge, answers, tutorials or guides.';
    let recommendations: string[] = [];

    const transactionalTerms = ['buy', 'discount', 'cheap', 'coupon', 'purchase', 'order', 'pricing', 'store', 'deal', 'quote', 'hire'];
    const commercialTerms = ['best', 'top', 'review', 'vs', 'comparison', 'recommended', 'ratings', 'alternative'];
    const navigationalTerms = ['login', 'sign in', 'portal', 'official site', 'download', 'website', 'app'];
    const informationalTerms = ['how to', 'what is', 'guide', 'tutorial', 'why', 'when', 'tips', 'examples', 'meaning'];

    if (transactionalTerms.some(t => q.includes(t))) {
      intent = 'Transactional';
      confidence = 94;
      description = 'Searcher is actively ready to make a purchase or convert immediately.';
      recommendations = [
        'Place clear Buy / Add to Cart CTA buttons above the fold',
        'Include transparent pricing, discount badges and customer guarantees',
        'Highlight fast shipping, secure payment badges and return policies'
      ];
    } else if (commercialTerms.some(t => q.includes(t))) {
      intent = 'Commercial';
      confidence = 92;
      description = 'Searcher is comparing options, researching products or reading reviews before buying.';
      recommendations = [
        'Include a structured comparison table with pros & cons',
        'Add verified customer reviews and expert scoring',
        'Provide direct affiliate / purchase links for top rated picks'
      ];
    } else if (navigationalTerms.some(t => q.includes(t))) {
      intent = 'Navigational';
      confidence = 88;
      description = 'Searcher is attempting to reach a specific brand, portal, or login destination.';
      recommendations = [
        'Ensure direct canonical URL and site breadcrumbs are optimized',
        'Display clear login/dashboard navigation shortcuts',
        'Implement Sitelinks Searchbox schema markup'
      ];
    } else {
      intent = 'Informational';
      confidence = 89;
      description = 'Searcher seeks clear educational answers, how-to guides, or conceptual definitions.';
      recommendations = [
        'Answer the primary question directly in the first 100 words (Featured Snippet target)',
        'Use numbered step-by-step H2 subheadings',
        'Incorporate FAQ schema markup and visual diagrams'
      ];
    }

    return { intent, confidence, description, recommendations };
  };

  const intentResult = analyzeIntent(keyword);

  // Meta Title Generation
  const generateMetaTitles = (kw: string, brand: string) => [
    `${kw.charAt(0).toUpperCase() + kw.slice(1)} | ${brand}`,
    `10 Best ${kw} (Tested & Reviewed for 2026) - ${brand}`,
    `Ultimate Guide to ${kw} - Expert Tips & Insights | ${brand}`,
    `${kw}: Complete Checklist & Top Strategies (${brand})`,
    `How to Master ${kw} in 2026 [Step-by-Step Tutorial]`,
  ];

  // Meta Description Generation
  const generateMetaDescriptions = (kw: string) => [
    `Looking for the top ${kw}? Discover our expert tested ratings, in-depth comparison, pros & cons, and find the perfect match today. Click here to read more!`,
    `Master ${kw} with our complete 2026 guide. Learn proven techniques, actionable tips, and avoid costly mistakes with our comprehensive step-by-step breakdown.`,
    `Explore verified insights on ${kw}. Compare top features, pricing, benchmarks, and real user reviews to make the smartest decision in 2026.`,
  ];

  // YouTube Title Generation
  const generateYouTubeTitles = (top: string) => [
    `I Tried ${top} For 30 Days (Here's What Happened)`,
    `How to ${top} in 2026 (Beginners Guide)`,
    `The TRUTH About ${top} Nobody Is Telling You`,
    `Don't Do ${top} Until You Watch This!`,
    `${top} - Step-by-Step Walkthrough (Zero to Pro)`,
    `Top 5 Secrets For ${top} in 2026 🔥`,
  ];

  // YouTube Description Generation
  const generateYouTubeDescription = (top: string) => {
    return `In this video, we dive deep into ${top}! Whether you're a complete beginner or looking to scale your skills in 2026, this step-by-step guide covers everything you need to know.

📌 TIMESTAMPS:
0:00 - Introduction & Overview
1:15 - Core Concepts Explained
3:45 - Live Step-by-Step Demo
7:20 - Common Pitfalls to Avoid
9:50 - Pro Tips & Next Steps

🔗 RESOURCES & LINKS:
• Official Website: https://example.com
• Source Code & Templates: https://github.com/example
• Follow on Twitter/X: https://x.com/yourhandle

👍 If you found this video helpful, please give it a LIKE, subscribe to the channel, and hit the bell icon so you never miss an update!

#${top.split(' ').slice(0, 2).join('')} #Tutorial #Tech2026 #WebDevelopment`;
  };

  // YouTube Tags Generation
  const generateYouTubeTags = (top: string) => {
    const words = top.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(w => w.length > 2);
    const generated = [
      top.toLowerCase(),
      ...words.map(w => `${w} tutorial`),
      ...words.map(w => `best ${w}`),
      `${words.slice(0, 3).join(' ')} 2026`,
      'how to',
      'beginner guide',
      'tips and tricks',
      'walkthrough',
      'step by step'
    ];
    return Array.from(new Set(generated));
  };

  const generatedTags = generateYouTubeTags(topic);
  const tagsString = generatedTags.join(', ');

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* 1. Keyword Intent Checker */}
      {toolId === 'keyword-intent' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Search Keyword Intent Checker</h2>
              <p className="text-xs text-slate-500">Classify Informational, Navigational, Commercial, and Transactional search query intent</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-700">Target Search Query / Keyword</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Enter any search keyword (e.g. buy nike air max, what is docker, figma login)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Intent Assessment Card */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold uppercase">Detected Intent:</span>
                <span className={`px-3 py-1 text-xs font-extrabold rounded-full border ${
                  intentResult.intent === 'Transactional'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : intentResult.intent === 'Commercial'
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                    : intentResult.intent === 'Navigational'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-sky-100 text-sky-800 border-sky-300'
                }`}>
                  {intentResult.intent} ({intentResult.confidence}% match)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {intentResult.description}
            </p>

            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-600" /> Recommended On-Page Strategy:
              </span>
              <ul className="list-disc list-inside text-xs text-slate-600 flex flex-col gap-1 pl-1">
                {intentResult.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. Meta Title Generator */}
      {toolId === 'meta-title-gen' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">SEO Meta Title Generator</h2>
              <p className="text-xs text-slate-500">Generate high-CTR, 50-60 character page titles optimized for Google rankings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Keyword / Topic</label>
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name / Suffix</label>
              <input
                type="text"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Generated CTR-Optimized Titles
            </span>
            <div className="flex flex-col gap-2.5">
              {generateMetaTitles(keyword, brandName).map((title, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-semibold text-slate-800 truncate">{title}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {title.length} chars (Target: 50-60)
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClip(title, `title-${idx}`)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-bold transition-colors cursor-pointer"
                  >
                    {copiedKey === `title-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === `title-${idx}` ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Meta Description Generator */}
      {toolId === 'meta-desc-gen' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">SEO Meta Description Generator & SERP Preview</h2>
              <p className="text-xs text-slate-500">Craft 150-160 character snippets with real-time Google search snippet rendering</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Keyword / Topic</label>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* SERP Preview Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Google SERP Live Preview</span>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs font-sans max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-slate-700 mb-0.5">
                <span className="font-semibold text-slate-800">https://www.example.com › blog › {keyword.toLowerCase().replace(/ /g, '-')}</span>
              </div>
              <h3 className="text-base text-blue-800 hover:underline font-semibold cursor-pointer leading-snug">
                {keyword.charAt(0).toUpperCase() + keyword.slice(1)}: Complete Guide 2026
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {generateMetaDescriptions(keyword)[0]}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Variations (150-160 Chars)
            </span>
            <div className="flex flex-col gap-2.5">
              {generateMetaDescriptions(keyword).map((desc, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-slate-800 leading-relaxed">{desc}</p>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {desc.length} characters (Optimal: 155-160)
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClip(desc, `desc-${idx}`)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-bold transition-colors cursor-pointer shrink-0"
                  >
                    {copiedKey === `desc-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === `desc-${idx}` ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. YouTube Title Generator */}
      {toolId === 'youtube-title-gen' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Viral YouTube Title Generator</h2>
              <p className="text-xs text-slate-500">Curiosity, challenge, tutorial & listicle titles engineered for high click-through rates</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Video Topic / Core Idea</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            {generateYouTubeTitles(topic).map((t, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <span className="font-bold text-slate-800">{t}</span>
                <button
                  onClick={() => copyToClip(t, `yt-${idx}`)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  {copiedKey === `yt-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === `yt-${idx}` ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. YouTube Description Generator */}
      {toolId === 'youtube-desc-gen' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">
                <Youtube className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Structured YouTube Description Generator</h2>
                <p className="text-xs text-slate-500">Auto-formatted descriptions with chapters, timestamps, social links & hashtags</p>
              </div>
            </div>
            <button
              onClick={() => copyToClip(generateYouTubeDescription(topic), 'yt-desc')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {copiedKey === 'yt-desc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'yt-desc' ? 'Copied Full Description' : 'Copy Description'}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Video Topic</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <textarea
            rows={10}
            readOnly
            value={generateYouTubeDescription(topic)}
            className="w-full p-4 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800 leading-relaxed"
          />
        </div>
      )}

      {/* 6. YouTube Tags Generator */}
      {toolId === 'youtube-tags-gen' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">YouTube Tags & Keyword Extractor</h2>
                <p className="text-xs text-slate-500">Comma-separated tags ready to paste into YouTube Studio (Max 500 characters)</p>
              </div>
            </div>
            <button
              onClick={() => copyToClip(tagsString, 'yt-tags')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold cursor-pointer"
            >
              {copiedKey === 'yt-tags' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'yt-tags' ? 'Copied Tags!' : 'Copy All Tags'}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Video Keyword</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tags Chips Display */}
          <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            {generatedTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1 shadow-2xs"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
              <span>Comma Separated String (YouTube Studio Format)</span>
              <span className={`font-mono ${tagsString.length > 500 ? 'text-rose-600' : 'text-slate-500'}`}>
                {tagsString.length} / 500 characters
              </span>
            </div>
            <textarea
              rows={3}
              readOnly
              value={tagsString}
              className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl select-all"
            />
          </div>
        </div>
      )}
    </div>
  );
};
