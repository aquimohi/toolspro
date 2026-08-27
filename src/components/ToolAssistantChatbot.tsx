import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Minimize2,
  Maximize2,
  RotateCcw,
  Zap,
  BookOpen,
  FileCode,
  Volume2,
  Sliders,
  Scissors,
  CheckCircle2
} from 'lucide-react';
import { ToolMeta, ToolId } from '../types';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestedTools?: ToolId[];
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

interface ToolAssistantChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolMeta[];
  onSelectTool: (id: ToolId) => void;
  onOpenManual: () => void;
}

export function ToolAssistantChatbot({
  isOpen,
  onClose,
  tools,
  onSelectTool,
  onOpenManual
}: ToolAssistantChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: '👋 Hello! I am your **Web Utility AI Assistant**. I can help you find the right tool for any task, explain how to merge PDFs, convert audio, extract text with OCR, or troubleshoot issues. What are you looking to do today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedTools: ['pdf-merge', 'image-resizer', 'audio-joiner', 'word-counter']
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isTyping]);

  if (!isOpen) return null;

  // Intelligent matching engine for tool queries
  const generateBotResponse = (query: string): { text: string; tools: ToolId[] } => {
    const q = query.toLowerCase().trim();

    // 1. PDF queries
    if (q.includes('pdf') || q.includes('merge') || q.includes('combine documents') || q.includes('split') || q.includes('rotate') || q.includes('watermark') || q.includes('compress pdf') || q.includes('protect')) {
      if (q.includes('merge') || q.includes('combine') || q.includes('join pdf')) {
        return {
          text: `📄 To **Merge PDFs**, use our **Merge PDF Documents** utility. You can drag and drop multiple PDF files, reorder pages intuitively, and download a single unified document.\n\n🔒 *All PDF processing runs directly in your browser's WebAssembly sandbox for total privacy.*`,
          tools: ['pdf-merge', 'pdf-split', 'pdf-rotate']
        };
      }
      if (q.includes('split') || q.includes('extract') || q.includes('separate')) {
        return {
          text: `✂️ To **Split or Extract Pages**, the **Split PDF Pages** tool lets you specify individual page numbers or ranges (e.g. 1-5, 8, 12-15) and download separated documents instantly.`,
          tools: ['pdf-split', 'pdf-merge', 'pdf-crop']
        };
      }
      if (q.includes('protect') || q.includes('lock') || q.includes('password') || q.includes('unlock')) {
        return {
          text: `🔐 For document security, use **Protect PDF** to add standard AES encryption, or **Unlock PDF** to remove passwords from files you own.`,
          tools: ['pdf-protect', 'pdf-unlock']
        };
      }
      return {
        text: `📑 We have a complete **PDF Suite** with 10 client-side utilities including Merge, Split, Rotate, Compress, Watermark, and Page Numbering!`,
        tools: ['pdf-merge', 'pdf-split', 'pdf-rotate', 'pdf-compress', 'pdf-watermark']
      };
    }

    // 2. Audio queries
    if (q.includes('audio') || q.includes('mp3') || q.includes('wav') || q.includes('music') || q.includes('song') || q.includes('volume') || q.includes('speed') || q.includes('trim') || q.includes('cut sound') || q.includes('sound')) {
      if (q.includes('join') || q.includes('merge') || q.includes('combine')) {
        return {
          text: `🎵 To combine multiple MP3/WAV tracks, open **Audio Joiner & Merger**. You can arrange the sequence, crossfade, and export a master audio file.`,
          tools: ['audio-joiner', 'audio-trim', 'audio-volume']
        };
      }
      if (q.includes('volume') || q.includes('boost') || q.includes('loud') || q.includes('amplify')) {
        return {
          text: `🔊 Use the **Audio Volume Booster** to amplify quiet recordings up to 300% gain with built-in peak limiter prevention.`,
          tools: ['audio-volume', 'audio-speed']
        };
      }
      if (q.includes('speed') || q.includes('tempo') || q.includes('slow') || q.includes('fast')) {
        return {
          text: `⏱️ The **Audio Speed Changer** alters tempo from 0.25x to 3.0x pitch-preserved playback without distorting frequencies.`,
          tools: ['audio-speed', 'audio-trim']
        };
      }
      return {
        text: `🎧 Our **Audio Suite** handles audio trimming, multi-track joining, volume modulation, and playback speed manipulation with high-precision Web Audio API.`,
        tools: ['audio-joiner', 'audio-trim', 'audio-volume', 'audio-speed']
      };
    }

    // 3. OCR / Image to Text
    if (q.includes('ocr') || q.includes('image to text') || q.includes('extract text') || q.includes('read photo') || q.includes('scan document') || q.includes('tesseract')) {
      return {
        text: `👁️ For extracting text from photos, scans, and receipts, use our **Image to Text (OCR)** tool. It supports 100+ languages including English, Spanish, Hindi, German, and French, with confidence metrics and export options.`,
        tools: ['image-to-text', 'paste-image', 'word-counter']
      };
    }

    // 4. Image Resizing / Crop / Format
    if (q.includes('image') || q.includes('photo') || q.includes('resize') || q.includes('compress image') || q.includes('png') || q.includes('jpeg') || q.includes('webp') || q.includes('crop')) {
      if (q.includes('compress') || q.includes('reduce size') || q.includes('smaller')) {
        return {
          text: `🖼️ Use the **Image Compressor** to drastically reduce file sizes while maintaining sharp visual quality. You can select target quality or exact KB targets.`,
          tools: ['image-compressor', 'image-resizer', 'format-converter']
        };
      }
      if (q.includes('format') || q.includes('convert') || q.includes('webp')) {
        return {
          text: `🔄 The **Format Converter** converts between PNG, JPEG, WEBP, GIF, BMP, and ICO formats instantly in client memory.`,
          tools: ['format-converter', 'image-resizer', 'crop-image']
        };
      }
      return {
        text: `🖼️ You can resize, crop, convert format, and compress images with our **Image & Media suite** without uploading photos anywhere.`,
        tools: ['image-resizer', 'crop-image', 'image-compressor', 'format-converter']
      };
    }

    // 5. Label Cropper
    if (q.includes('flipkart') || q.includes('amazon') || q.includes('meesho') || q.includes('snapdeal') || q.includes('shipping label') || q.includes('barcode') || q.includes('label')) {
      return {
        text: `📦 For e-commerce sellers, our specialized **Label Croppers** automatically isolate barcodes, addresses, and remove unnecessary invoice margins for 4x6 thermal printers:`,
        tools: ['flipkart-label-crop', 'meesho-label-crop', 'amazon-label-crop', 'snapdeal-label-crop']
      };
    }

    // 6. Text, Word count & Diff
    if (q.includes('word') || q.includes('count') || q.includes('diff') || q.includes('compare text') || q.includes('character') || q.includes('reading time') || q.includes('tts') || q.includes('speech')) {
      if (q.includes('compare') || q.includes('diff')) {
        return {
          text: `📝 Use **Text & Diff Compare** to compare two versions of text, scripts, or code side-by-side with color-coded additions and deletions.`,
          tools: ['text-compare', 'word-counter']
        };
      }
      if (q.includes('speech') || q.includes('read aloud') || q.includes('tts') || q.includes('voice')) {
        return {
          text: `🗣️ **Text to Speech (TTS)** provides natural synthetic speech narration with customizable voices, pitch, and playback speeds.`,
          tools: ['text-to-speech', 'word-counter']
        };
      }
      return {
        text: `✍️ Check out our **Word & Character Counter** for real-time word stats, character density, readability index, and case transforms.`,
        tools: ['word-counter', 'text-compare', 'text-to-speech']
      };
    }

    // 7. Network / DNS / SSL / Regex
    if (q.includes('dns') || q.includes('ip') || q.includes('ssl') || q.includes('regex') || q.includes('base64') || q.includes('hash') || q.includes('security') || q.includes('email finder')) {
      return {
        text: `🌐 For developers and network diagnostics, check our **Network & Security** tools: Regex testing with live match captures, SSL certificate checker, Hostname to IP, DNS lookups, and Base64/SHA-256 encoder.`,
        tools: ['regex-tester', 'ssl-checker', 'dns-lookup', 'crypto-base64', 'email-finder']
      };
    }

    // 8. Financial / Calculators
    if (q.includes('loan') || q.includes('calc') || q.includes('calculator') || q.includes('emi') || q.includes('age') || q.includes('interest') || q.includes('mortgage') || q.includes('car')) {
      return {
        text: `💰 We offer comprehensive financial and date utilities: **Home Loan EMI Calculator**, **Car Loan EMI Calculator**, and **Exact Age & Date Calculator** with breakdown charts.`,
        tools: ['home-loan-calc', 'car-loan-calc', 'age-calculator']
      };
    }

    // 9. Banking & Postal
    if (q.includes('ifsc') || q.includes('bank') || q.includes('branch') || q.includes('pincode') || q.includes('postal') || q.includes('zip code')) {
      return {
        text: `🏦 Look up any Indian bank branch details instantly with **IFSC Code Finder**, or verify postal locations with **PIN Code Finder**.`,
        tools: ['ifsc-finder', 'pincode-finder']
      };
    }

    // 10. General / Privacy / Offline questions
    if (q.includes('privacy') || q.includes('safe') || q.includes('server') || q.includes('cloud') || q.includes('upload')) {
      return {
        text: `🛡️ **100% Client-Side Guarantee**: None of your files or inputs are sent to remote servers. All computation happens locally inside your browser's JavaScript V8 engine and WebAssembly. You can even use the downloaded HTML files offline!`,
        tools: ['pdf-merge', 'word-counter', 'image-to-text']
      };
    }

    // Default fallback recommendation
    return {
      text: `I'm here to help you get the most out of our 60+ tools! You can ask me things like:\n- *"How do I merge two PDF documents?"*\n- *"What tool converts image to editable text?"*\n- *"How do I crop Meesho shipping labels?"*\n- *"How to boost audio volume?"*\n\nHere are some of our most popular utilities:`,
      tools: ['pdf-merge', 'image-to-text', 'word-counter', 'audio-joiner']
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputQuery.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const response = generateBotResponse(text);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedTools: response.tools
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 500);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: '🧹 Chat cleared! How can I assist you with the tools today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedTools: ['pdf-merge', 'image-resizer', 'audio-joiner', 'word-counter']
      }
    ]);
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isExpanded
          ? 'inset-4 sm:inset-10 flex items-center justify-center'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px]'
      }`}
    >
      <div
        className={`bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
          isExpanded ? 'w-full h-full max-w-4xl max-h-[850px]' : 'h-[580px] max-h-[85vh]'
        }`}
      >
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/40 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">AI Tool Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-slate-300 block">Instant answers for all 60+ utilities</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Reset Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title={isExpanded ? 'Minimize' : 'Expand'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-slate-50 border-b border-slate-100 p-2.5 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
          <span className="text-slate-400 font-semibold pl-1 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>Try:</span>
          </span>
          <button
            onClick={() => handleSendMessage('How to merge PDFs?')}
            className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg whitespace-nowrap text-slate-600 font-medium transition-colors cursor-pointer"
          >
            How to merge PDFs?
          </button>
          <button
            onClick={() => handleSendMessage('Extract text from photo')}
            className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg whitespace-nowrap text-slate-600 font-medium transition-colors cursor-pointer"
          >
            Extract text from photo
          </button>
          <button
            onClick={() => handleSendMessage('Boost audio volume')}
            className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg whitespace-nowrap text-slate-600 font-medium transition-colors cursor-pointer"
          >
            Boost audio volume
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                </div>

                {/* Interactive Tool Badges (if bot suggested tools) */}
                {msg.suggestedTools && msg.suggestedTools.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedTools.map((tId) => {
                      const toolObj = tools.find(t => t.id === tId);
                      if (!toolObj) return null;
                      return (
                        <button
                          key={tId}
                          onClick={() => {
                            onSelectTool(tId);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/80 rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                        >
                          <Zap className="w-3 h-3 text-indigo-600 shrink-0" />
                          <span>Open {toolObj.name}</span>
                          <ChevronRight className="w-3 h-3 text-indigo-400" />
                        </button>
                      );
                    })}
                  </div>
                )}

                <span className="text-[9px] text-slate-400 block px-1">
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-xs flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about using our 60+ tools..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer shadow-xs"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <button
              type="button"
              onClick={() => {
                onOpenManual();
                onClose();
              }}
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer font-medium"
            >
              <BookOpen className="w-3 h-3" />
              <span>Full User Manual</span>
            </button>

            <span>🔒 Zero Server AI Logic</span>
          </div>
        </div>

      </div>
    </div>
  );
}
