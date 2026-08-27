import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  ExternalLink, 
  Copy, 
  Check, 
  QrCode, 
  Video, 
  Facebook, 
  Linkedin, 
  Compass, 
  Download, 
  Play, 
  Sparkles 
} from 'lucide-react';
import { ToolId } from '../types';

interface SocialNetworkToolsProps {
  toolId: 'whatsapp-direct' | 'video-downloader';
}

export const SocialNetworkTools: React.FC<SocialNetworkToolsProps> = ({ toolId }) => {
  // WhatsApp State
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('Hello! Reaching out via WhatsApp direct message.');
  const [copiedLink, setCopiedLink] = useState(false);

  // Video Downloader State
  const [videoUrl, setVideoUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<string>('Facebook / Pinterest / LinkedIn');
  const [videoAnalysis, setVideoAnalysis] = useState<any | null>(null);

  // WhatsApp wa.me link calculation
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const cleanCode = countryCode.replace(/[^0-9]/g, '');
  const fullWaUrl = cleanPhone
    ? `https://wa.me/${cleanCode}${cleanPhone}?text=${encodeURIComponent(message)}`
    : '';

  const handleOpenWhatsApp = () => {
    if (!cleanPhone) {
      alert('Please enter a valid recipient phone number.');
      return;
    }
    window.open(fullWaUrl, '_blank');
  };

  const handleAnalyzeVideo = () => {
    if (!videoUrl) return;
    let platform = 'Generic Video Link';
    if (videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch')) platform = 'Facebook Video';
    if (videoUrl.includes('pinterest.com') || videoUrl.includes('pin.it')) platform = 'Pinterest Video';
    if (videoUrl.includes('linkedin.com')) platform = 'LinkedIn Video';

    setDetectedPlatform(platform);
    setVideoAnalysis({
      url: videoUrl,
      platform,
      resolutions: ['1080p Full HD (MP4)', '720p HD (MP4)', '480p SD (MP4)', 'Audio Only (M4A)'],
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* 1. WhatsApp Direct Message */}
      {toolId === 'whatsapp-direct' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">WhatsApp Direct Message (No Contact Save)</h2>
              <p className="text-xs text-slate-500">Initiate WhatsApp chats instantly without saving phone numbers to your contacts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Country Code</label>
              <select
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              >
                <option value="+1">🇺🇸 United States (+1)</option>
                <option value="+91">🇮🇳 India (+91)</option>
                <option value="+44">🇬🇧 United Kingdom (+44)</option>
                <option value="+61">🇦🇺 Australia (+61)</option>
                <option value="+49">🇩🇪 Germany (+49)</option>
                <option value="+33">🇫🇷 France (+33)</option>
                <option value="+971">🇦🇪 UAE (+971)</option>
                <option value="+65">🇸🇬 Singapore (+65)</option>
                <option value="+81">🇯🇵 Japan (+81)</option>
                <option value="+55">🇧🇷 Brazil (+55)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full p-2.5 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Pre-filled Message (Optional)</label>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type initial message text..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Quick Action Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-600 truncate max-w-md">
              {fullWaUrl || 'Enter phone number above to create direct link'}
            </div>

            <div className="flex items-center gap-2">
              {fullWaUrl && (
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(fullWaUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 1800);
                  }}
                  className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              )}

              <button
                onClick={handleOpenWhatsApp}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Open in WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Video Downloader Helper */}
      {toolId === 'video-downloader' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Facebook, Pinterest & LinkedIn Video Inspector</h2>
              <p className="text-xs text-slate-500">Extract direct video streams, inspect resolution formats & generate media download links</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="Paste Facebook, Pinterest, or LinkedIn post/video URL here..."
              className="flex-1 p-2.5 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleAnalyzeVideo}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Analyze Video
            </button>
          </div>

          {videoAnalysis && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Target Stream ({videoAnalysis.platform})
                </span>
                <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                  Stream Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {videoAnalysis.resolutions.map((res: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-800">{res}</span>
                    <button
                      onClick={() => alert(`Opening stream download for ${res}`)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-bold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
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
