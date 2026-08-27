import React, { useState, useRef, useEffect } from 'react';
import { createWorker, Worker } from 'tesseract.js';
import {
  FileText,
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Download,
  RotateCw,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Trash2,
  ExternalLink,
  Camera,
  Layers,
  ZoomIn,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCode,
  FileSpreadsheet,
  Globe,
  Wand2,
  Eye,
  Scissors
} from 'lucide-react';

interface OCRBlock {
  text: string;
  confidence: number;
}

const SUPPORTED_LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish (Español)' },
  { code: 'fra', name: 'French (Français)' },
  { code: 'deu', name: 'German (Deutsch)' },
  { code: 'ita', name: 'Italian (Italiano)' },
  { code: 'por', name: 'Portuguese (Português)' },
  { code: 'hin', name: 'Hindi (हिन्दी)' },
  { code: 'chi_sim', name: 'Chinese Simplified (简体中文)' },
  { code: 'jpn', name: 'Japanese (日本語)' },
  { code: 'rus', name: 'Russian (Русский)' },
  { code: 'ara', name: 'Arabic (العربية)' },
];

export function ImageToTextTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [selectedLang, setSelectedLang] = useState<string>('eng');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string>('');
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [lineBlocks, setLineBlocks] = useState<OCRBlock[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'lines' | 'cleaner'>('text');
  const [searchHighlight, setSearchHighlight] = useState('');
  
  // Image adjustments
  const [rotation, setRotation] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  const [isGrayscale, setIsGrayscale] = useState<boolean>(false);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [isBinarized, setIsBinarized] = useState<boolean>(false);
  const [showAdjustments, setShowAdjustments] = useState<boolean>(false);

  // Camera capture modal state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Speech synthesis
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Handle Clipboard Paste (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            loadImageFromBlob(blob, 'pasted_image.png');
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const loadImageFromBlob = (blob: Blob, name: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageSrc(result);
      setImageName(name);
      resetAdjustments();
      setExtractedText('');
      setConfidenceScore(null);
      setLineBlocks([]);
    };
    reader.readAsDataURL(blob);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadImageFromBlob(file, file.name);
  };

  const resetAdjustments = () => {
    setRotation(0);
    setContrast(100);
    setBrightness(100);
    setIsGrayscale(false);
    setIsInverted(false);
    setIsBinarized(false);
  };

  // Generate processed canvas image data URL for OCR
  const getProcessedCanvasDataUrl = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!imageSrc) {
        reject(new Error('No image loaded'));
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        const isRotated90or270 = rotation % 180 !== 0;
        canvas.width = isRotated90or270 ? img.height : img.width;
        canvas.height = isRotated90or270 ? img.width : img.height;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        // Apply pixel-level filters if required
        if (isGrayscale || isBinarized || isInverted || contrast !== 100 || brightness !== 100) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
          const brightnessOffset = brightness - 100;

          for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            // Brightness
            if (brightnessOffset !== 0) {
              r += brightnessOffset;
              g += brightnessOffset;
              b += brightnessOffset;
            }

            // Contrast
            if (contrast !== 100) {
              r = contrastFactor * (r - 128) + 128;
              g = contrastFactor * (g - 128) + 128;
              b = contrastFactor * (b - 128) + 128;
            }

            // Grayscale
            let gray = 0.299 * r + 0.587 * g + 0.114 * b;

            // Binarization (Otsu-style threshold)
            if (isBinarized) {
              gray = gray > 128 ? 255 : 0;
              r = gray;
              g = gray;
              b = gray;
            } else if (isGrayscale) {
              r = gray;
              g = gray;
              b = gray;
            }

            // Invert
            if (isInverted) {
              r = 255 - r;
              g = 255 - g;
              b = 255 - b;
            }

            data[i] = Math.min(255, Math.max(0, r));
            data[i + 1] = Math.min(255, Math.max(0, g));
            data[i + 2] = Math.min(255, Math.max(0, b));
          }

          ctx.putImageData(imgData, 0, 0);
        }

        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(imageSrc);
      img.src = imageSrc;
    });
  };

  // Run Tesseract OCR
  const extractTextFromImage = async () => {
    if (!imageSrc) return;

    setIsProcessing(true);
    setProgressStatus('Initializing OCR engine...');
    setProgressPercent(5);

    try {
      // Get preprocessed image data
      const processedImageUrl = await getProcessedCanvasDataUrl();

      setProgressStatus(`Loading ${selectedLang} language model...`);
      setProgressPercent(15);

      const worker = await createWorker(selectedLang, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgressStatus('Extracting characters & words...');
            setProgressPercent(Math.round(20 + m.progress * 75));
          } else if (m.status === 'loading tesseract core') {
            setProgressStatus('Loading recognition core...');
            setProgressPercent(10);
          } else if (m.status === 'loading language traineddata') {
            setProgressStatus(`Fetching language dictionary (${selectedLang})...`);
            setProgressPercent(20);
          }
        },
      });

      workerRef.current = worker;

      setProgressStatus('Recognizing text layout...');
      const ret = await worker.recognize(processedImageUrl);

      const fullText = ret.data.text || '';
      const confidence = ret.data.confidence || 0;

      // Extract lines safely
      const rawLines = (ret.data as any).lines || (ret.data as any).paragraphs || [];
      const blocks: OCRBlock[] = rawLines.length > 0 
        ? rawLines.map((line: any) => ({
            text: String(line.text || '').trim(),
            confidence: Math.round(Number(line.confidence || confidence))
          })).filter((b: OCRBlock) => b.text.length > 0)
        : fullText.split('\n').filter(l => l.trim().length > 0).map(l => ({
            text: l.trim(),
            confidence: Math.round(confidence)
          }));

      setExtractedText(fullText.trim());
      setConfidenceScore(Math.round(confidence));
      setLineBlocks(blocks);
      setProgressPercent(100);
      setProgressStatus('Extraction completed!');

      await worker.terminate();
    } catch (err: any) {
      console.error('OCR Error:', err);
      alert('Failed to extract text. Please check the image and try again.');
      setProgressStatus('Error occurred during recognition');
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick Samples
  const loadSample = (type: 'receipt' | 'quote' | 'code' | 'card') => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 340;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f172a';

    if (type === 'receipt') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(40, 20, 520, 300);
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('STARLIGHT CAFE & BAKERY', 140, 60);
      ctx.font = '13px monospace';
      ctx.fillText('104 Tech Boulevard, Suite 400', 160, 85);
      ctx.fillText('Date: 2026-08-26  Time: 11:42 AM', 150, 105);
      ctx.fillText('------------------------------------------', 80, 130);
      ctx.fillText('1x Caramel Macchiato (Large)      $5.75', 80, 155);
      ctx.fillText('2x Almond Butter Croissant        $8.50', 80, 180);
      ctx.fillText('1x Organic Matcha Latte           $6.25', 80, 205);
      ctx.fillText('------------------------------------------', 80, 230);
      ctx.font = 'bold 15px monospace';
      ctx.fillText('SUBTOTAL: $20.50   TAX: $1.64', 80, 255);
      ctx.fillText('TOTAL PAID: $22.14 [VISA ****4921]', 80, 280);
      ctx.font = 'italic 12px monospace';
      ctx.fillText('Thank you for your visit! www.starlightcafe.com', 120, 305);
      setImageName('sample_receipt.png');
    } else if (type === 'quote') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(30, 30, 540, 280);
      ctx.fillStyle = '#334155';
      ctx.font = 'italic 18px Georgia, serif';
      ctx.fillText('"The future belongs to those who believe', 80, 100);
      ctx.fillText('in the beauty of their dreams."', 130, 135);
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('— Eleanor Roosevelt', 210, 180);
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Knowledge is power. Innovation distinguishes between', 70, 230);
      ctx.fillText('a leader and a follower in the modern digital age.', 80, 255);
      setImageName('sample_document_quote.png');
    } else if (type === 'code') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(30, 20, 540, 300);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '14px monospace';
      ctx.fillText('// Fast API Handler in TypeScript', 50, 60);
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('async function', 50, 95);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(' fetchUserData', 165, 95);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText('(userId: string) {', 285, 95);
      ctx.fillText('  const response = await fetch(`/api/users/${userId}`);', 70, 130);
      ctx.fillText('  const data = await response.json();', 70, 165);
      ctx.fillStyle = '#34d399';
      ctx.fillText('  return { status: 200, user: data };', 70, 200);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText('}', 50, 235);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('console.log("Ready for deployment!");', 50, 275);
      setImageName('sample_code_snippet.png');
    } else {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(40, 40, 520, 260);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('ALEXANDER MORGAN', 70, 95);
      ctx.fillStyle = '#818cf8';
      ctx.font = '14px sans-serif';
      ctx.fillText('Chief Technology Officer | Nexus AI Systems', 70, 125);
      ctx.fillStyle = '#e0e7ff';
      ctx.font = '13px sans-serif';
      ctx.fillText('Email: alexander.morgan@nexusai.io', 70, 175);
      ctx.fillText('Phone: +1 (555) 234-8921', 70, 205);
      ctx.fillText('Office: 500 Silicon Avenue, San Francisco, CA', 70, 235);
      ctx.fillText('Web: https://nexusai.io', 70, 265);
      setImageName('sample_business_card.png');
    }

    const dataUrl = canvas.toDataURL('image/png');
    setImageSrc(dataUrl);
    resetAdjustments();
    setExtractedText('');
    setConfidenceScore(null);
    setLineBlocks([]);
  };

  // Webcam Capture
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Unable to access camera. Please allow camera permissions in your browser.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setImageSrc(dataUrl);
      setImageName(`camera_capture_${Date.now()}.png`);
      resetAdjustments();
      setExtractedText('');
      setConfidenceScore(null);
      setLineBlocks([]);
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Clipboard Copy
  const copyExtractedText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download TXT
  const downloadAsTxt = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const base = imageName ? imageName.replace(/\.[^/.]+$/, '') : 'extracted_text';
    a.href = url;
    a.download = `${base}_ocr.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download JSON
  const downloadAsJson = () => {
    if (!extractedText) return;
    const payload = {
      imageName,
      language: selectedLang,
      overallConfidence: confidenceScore,
      totalWords: extractedText.split(/\s+/).filter(Boolean).length,
      totalLines: lineBlocks.length,
      fullText: extractedText,
      lines: lineBlocks
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const base = imageName ? imageName.replace(/\.[^/.]+$/, '') : 'extracted_text';
    a.href = url;
    a.download = `${base}_ocr.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Text Cleaner Utilities
  const cleanRemoveExtraSpaces = () => {
    const cleaned = extractedText
      .split('\n')
      .map(line => line.replace(/\s+/g, ' ').trim())
      .filter(line => line.length > 0)
      .join('\n');
    setExtractedText(cleaned);
  };

  const cleanSingleParagraph = () => {
    const cleaned = extractedText
      .replace(/\r?\n|\r/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    setExtractedText(cleaned);
  };

  const cleanUpperCase = () => {
    setExtractedText(extractedText.toUpperCase());
  };

  const cleanLowerCase = () => {
    setExtractedText(extractedText.toLowerCase());
  };

  const cleanCapitalizeSentences = () => {
    const cleaned = extractedText.replace(/(^\s*|\.\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
    setExtractedText(cleaned);
  };

  // Text to Speech
  const toggleSpeech = () => {
    if (!window.speechSynthesis) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (!extractedText.trim()) return;
      const utterance = new SpeechSynthesisUtterance(extractedText);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Word and Char counts
  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0;
  const charCount = extractedText.length;
  const lineCount = extractedText.trim() ? extractedText.trim().split('\n').length : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Text Extractor from Image (Optical Character Recognition)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                OCR Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Extract editable text, receipts, documents, screenshots, and business cards with high-accuracy multi-language OCR.
            </p>
          </div>

          {/* Preset Samples */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Samples:</span>
            <button
              onClick={() => loadSample('receipt')}
              disabled={isProcessing}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Receipt
            </button>
            <button
              onClick={() => loadSample('quote')}
              disabled={isProcessing}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Document
            </button>
            <button
              onClick={() => loadSample('card')}
              disabled={isProcessing}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Business Card
            </button>
            <button
              onClick={() => loadSample('code')}
              disabled={isProcessing}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Code
            </button>
          </div>
        </div>

        {/* Quick Language & Config Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-700">Recognition Language:</span>
            <select
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value)}
              disabled={isProcessing}
              aria-label="Select recognition language"
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdjustments(!showAdjustments)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                showAdjustments ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Image Enhancer / Filters</span>
            </button>

            <button
              onClick={startCamera}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors cursor-pointer"
            >
              <Camera className="w-3 h-3 text-indigo-600" />
              <span>Camera Capture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Camera Capture Modal */}
      {isCameraActive && (
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-2">
              <Camera className="w-4 h-4 text-indigo-400" />
              Capture Document with Camera
            </span>
            <button
              onClick={stopCamera}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center max-h-80 mx-auto">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={capturePhoto}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Camera className="w-4 h-4" />
              <span>Snap & Extract</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Dual Workspace: Left (Image Viewer / Upload) - Right (Extracted Text Output) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Image Dropzone & Preview */}
        <div className="space-y-4">
          
          {!imageSrc ? (
            /* Upload Dropzone */
            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-white rounded-2xl p-8 text-center transition-colors shadow-xs h-96 flex flex-col items-center justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="ocr-file-input"
                className="hidden"
              />
              <label
                htmlFor="ocr-file-input"
                className="cursor-pointer flex flex-col items-center justify-center w-full"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <span className="text-sm font-bold text-slate-800">
                  Click to upload image or drag & drop
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  Supports PNG, JPG, JPEG, WEBP, BMP, GIF, TIFF
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 mt-2 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  Tip: You can also press Ctrl+V / Cmd+V to paste screenshots
                </span>
              </label>
            </div>
          ) : (
            /* Image Preview Card */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
              
              {/* Preview Header */}
              <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/60 text-xs">
                <span className="font-bold text-slate-800 truncate max-w-xs">
                  {imageName || 'Loaded Image'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    Change Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => {
                      setImageSrc(null);
                      setImageName('');
                      setExtractedText('');
                      setConfidenceScore(null);
                      setLineBlocks([]);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Adjustments Toolbar if expanded */}
              {showAdjustments && (
                <div className="p-3 bg-slate-900 text-white text-xs border-b border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-[11px] text-slate-300">
                    <span>Preprocessing & Image Enhancement</span>
                    <button
                      onClick={resetAdjustments}
                      className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      Reset All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Contrast: {contrast}%</label>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={contrast}
                        onChange={e => setContrast(Number(e.target.value))}
                        aria-label="Adjust image contrast"
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Brightness: {brightness}%</label>
                      <input
                        type="range"
                        min="50"
                        max="180"
                        value={brightness}
                        onChange={e => setBrightness(Number(e.target.value))}
                        aria-label="Adjust image brightness"
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => setRotation((rotation + 90) % 360)}
                      className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3 text-indigo-400" />
                      <span>Rotate 90° ({rotation}°)</span>
                    </button>

                    <button
                      onClick={() => setIsGrayscale(!isGrayscale)}
                      className={`px-2 py-1 rounded text-[11px] cursor-pointer font-semibold ${
                        isGrayscale ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Grayscale
                    </button>

                    <button
                      onClick={() => setIsBinarized(!isBinarized)}
                      className={`px-2 py-1 rounded text-[11px] cursor-pointer font-semibold ${
                        isBinarized ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      High Binarize
                    </button>

                    <button
                      onClick={() => setIsInverted(!isInverted)}
                      className={`px-2 py-1 rounded text-[11px] cursor-pointer font-semibold ${
                        isInverted ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Invert Dark/Light
                    </button>
                  </div>
                </div>
              )}

              {/* Live Canvas / Image Display */}
              <div className="p-4 bg-slate-100/70 flex items-center justify-center min-h-[300px] max-h-[420px] overflow-auto">
                <img
                  src={imageSrc}
                  alt="OCR preview"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    filter: `contrast(${contrast}%) brightness(${brightness}%) ${isGrayscale || isBinarized ? 'grayscale(100%)' : ''} ${isInverted ? 'invert(100%)' : ''}`
                  }}
                  className="max-h-[380px] w-auto object-contain rounded-lg shadow-xs transition-all"
                />
              </div>

              {/* Action Trigger Button */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">
                  Language: <strong className="text-slate-800">{SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.name}</strong>
                </span>
                
                <button
                  onClick={extractTextFromImage}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Extracting Text...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{extractedText ? 'Re-extract Text' : 'Extract Text Now'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          {isProcessing && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold flex items-center gap-1.5 text-indigo-700">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {progressStatus}
                </span>
                <span className="font-mono font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Extracted Text Editor & Insights */}
        <div className="space-y-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full min-h-[460px]">
            
            {/* Output Tabs & Metrics */}
            <div className="p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
              
              {/* Tabs */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'text' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Extracted Text
                </button>
                <button
                  onClick={() => setActiveTab('lines')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'lines' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Line-by-Line ({lineBlocks.length})
                </button>
                <button
                  onClick={() => setActiveTab('cleaner')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'cleaner' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Formatting Tools
                </button>
              </div>

              {/* Confidence Badge */}
              {confidenceScore !== null && (
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="text-slate-400">Confidence:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    confidenceScore >= 80
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : confidenceScore >= 50
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {confidenceScore}%
                  </span>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="p-4 flex-1 flex flex-col">
              
              {activeTab === 'text' && (
                <div className="flex-1 flex flex-col space-y-2">
                  <textarea
                    value={extractedText}
                    onChange={e => setExtractedText(e.target.value)}
                    placeholder="Extracted text will appear here automatically after scanning... You can also edit the text directly."
                    rows={12}
                    className="w-full flex-1 p-3 text-xs sm:text-sm font-sans bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none"
                  />

                  {/* Highlight Search Bar */}
                  {extractedText && (
                    <div className="flex items-center gap-2 pt-1">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchHighlight}
                          onChange={e => setSearchHighlight(e.target.value)}
                          placeholder="Search in extracted text..."
                          className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      {searchHighlight && (
                        <span className="text-[11px] text-slate-500 font-semibold">
                          {(extractedText.match(new RegExp(searchHighlight, 'gi')) || []).length} match(es)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'lines' && (
                <div className="flex-1 overflow-y-auto max-h-[380px] space-y-2 pr-1">
                  {lineBlocks.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No lines extracted yet. Click "Extract Text Now" to scan.
                    </div>
                  ) : (
                    lineBlocks.map((block, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-2"
                      >
                        <div className="flex items-start gap-2 flex-1">
                          <span className="text-slate-400 font-mono text-[10px] select-none pt-0.5">
                            {idx + 1}.
                          </span>
                          <span className="text-slate-800 font-medium select-all">
                            {block.text}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">
                          {block.confidence}%
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'cleaner' && (
                <div className="flex-1 space-y-4 py-2">
                  <div className="text-xs text-slate-500">
                    Apply quick formatting transformations to the extracted text:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      onClick={cleanRemoveExtraSpaces}
                      className="p-3 text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800 block">Trim & Remove Blank Lines</span>
                      <span className="text-[11px] text-slate-500">Cleans redundant white space and empty lines</span>
                    </button>

                    <button
                      onClick={cleanSingleParagraph}
                      className="p-3 text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800 block">Single Paragraph</span>
                      <span className="text-[11px] text-slate-500">Merges all line breaks into a single flowing block</span>
                    </button>

                    <button
                      onClick={cleanCapitalizeSentences}
                      className="p-3 text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800 block">Sentence Case</span>
                      <span className="text-[11px] text-slate-500">Capitalizes the first letter of each sentence</span>
                    </button>

                    <button
                      onClick={cleanUpperCase}
                      className="p-3 text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800 block">UPPERCASE</span>
                      <span className="text-[11px] text-slate-500">Convert all characters to uppercase</span>
                    </button>

                    <button
                      onClick={cleanLowerCase}
                      className="p-3 text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800 block">lowercase</span>
                      <span className="text-[11px] text-slate-500">Convert all characters to lowercase</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions & Stats Bar */}
            <div className="p-3 border-t border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              
              {/* Quick Counter */}
              <div className="flex items-center gap-3 text-slate-500 font-semibold text-[11px]">
                <span><strong>{wordCount}</strong> Words</span>
                <span>•</span>
                <span><strong>{charCount}</strong> Characters</span>
                <span>•</span>
                <span><strong>{lineCount}</strong> Lines</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                
                {/* Text to Speech */}
                <button
                  onClick={toggleSpeech}
                  disabled={!extractedText.trim()}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
                    isSpeaking ? 'bg-indigo-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                  title="Listen to extracted text"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
                  <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                </button>

                {/* Copy */}
                <button
                  onClick={copyExtractedText}
                  disabled={!extractedText.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                {/* Download TXT */}
                <button
                  onClick={downloadAsTxt}
                  disabled={!extractedText.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold transition-colors cursor-pointer disabled:opacity-50"
                  title="Download .txt file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>TXT</span>
                </button>

                {/* Download JSON */}
                <button
                  onClick={downloadAsJson}
                  disabled={!extractedText.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
                  title="Download structured JSON"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>JSON</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
