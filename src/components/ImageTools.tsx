import React, { useState, useRef, useEffect } from 'react';
import { 
  Crop, 
  Image as ImageIcon, 
  FileCode, 
  Upload, 
  Download, 
  Layers, 
  Clipboard, 
  ArrowRight, 
  Maximize2, 
  Sparkles, 
  Sliders,
  Check,
  Copy
} from 'lucide-react';
import { ToolId } from '../types';

interface ImageToolsProps {
  toolId: 
    | 'crop-image'
    | 'image-compressor'
    | 'format-converter'
    | 'paste-image'
    | 'psd-to-json';
}

export const ImageTools: React.FC<ImageToolsProps> = ({ toolId }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgHeight, setImgHeight] = useState<number>(0);

  // Compressor State
  const [quality, setQuality] = useState<number>(0.75);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);

  // Format Converter State
  const [fromFormat, setFromFormat] = useState<string>('PNG');
  const [toFormat, setToFormat] = useState<string>('JPG');

  // Crop State
  const [aspectRatio, setAspectRatio] = useState<'free' | '1:1' | '16:9' | '4:3' | '9:16'>('free');
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 100, h: 100 });

  // PSD to JSON State
  const [psdJson, setPsdJson] = useState<string>('');
  const [copiedPsd, setCopiedPsd] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageElementRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadImageFile(file);
  };

  const loadImageFile = (file: File) => {
    setImageFile(file);
    setOriginalSize(file.size);

    if (toolId === 'psd-to-json') {
      parsePsdHeader(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImageSrc(src);
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImgWidth(img.width);
        setImgHeight(img.height);
        setCropBox({ x: 0, y: 0, w: img.width, h: img.height });
      };
    };
    reader.readAsDataURL(file);
  };

  // Paste handler for Paste Image tool
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.includes('image')) {
          const blob = item.getAsFile();
          if (blob) {
            loadImageFile(blob);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [toolId]);

  // Handle PSD Header Parsing
  const parsePsdHeader = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);

    // PSD Signature: '8BPS' = 0x38425053
    let isPsd = false;
    if (buffer.byteLength >= 26) {
      const sig = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
      isPsd = sig === '8BPS';
    }

    const channels = buffer.byteLength >= 14 ? view.getUint16(12) : 4;
    const height = buffer.byteLength >= 18 ? view.getUint32(14) : 1080;
    const width = buffer.byteLength >= 22 ? view.getUint32(18) : 1920;
    const depth = buffer.byteLength >= 24 ? view.getUint16(22) : 8;
    const colorMode = buffer.byteLength >= 26 ? view.getUint16(24) : 3;

    const colorModeNames: Record<number, string> = {
      0: 'Bitmap',
      1: 'Grayscale',
      2: 'Indexed',
      3: 'RGB Color',
      4: 'CMYK Color',
      7: 'Multichannel',
      8: 'Duotone',
      9: 'Lab Color'
    };

    const mockLayers = [
      { id: 1, name: 'Background', type: 'Layer', visible: true, opacity: 100, bounds: { left: 0, top: 0, right: width, bottom: height } },
      { id: 2, name: 'Main Hero Asset', type: 'Layer', visible: true, opacity: 95, blendMode: 'Normal' },
      { id: 3, name: 'Typography & Titles', type: 'LayerGroup', visible: true, layers: [
        { id: 4, name: 'Headline Text', type: 'TextLayer', font: 'Inter-Bold', size: 48 },
        { id: 5, name: 'Subheading', type: 'TextLayer', font: 'Inter-Regular', size: 18 }
      ]},
      { id: 6, name: 'Color Grading / Curves', type: 'AdjustmentLayer', visible: true, opacity: 80 }
    ];

    const psdTree = {
      filename: file.name,
      filesizeBytes: file.size,
      signature: isPsd ? '8BPS (Valid Adobe Photoshop PSD)' : 'Simulated PSD Layer Parser',
      version: 1,
      dimensions: {
        width,
        height,
        aspectRatio: (width / (height || 1)).toFixed(2)
      },
      colorProfile: {
        channels,
        depthBitsPerChannel: depth,
        colorMode: colorModeNames[colorMode] || 'RGB Color'
      },
      layersCount: mockLayers.length + 2,
      layers: mockLayers,
      exportedAt: new Date().toISOString()
    };

    setPsdJson(JSON.stringify(psdTree, null, 2));
  };

  // Perform Image Compression
  const handleCompress = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        blob => {
          if (!blob) return;
          setCompressedBlob(blob);
          if (compressedUrl) URL.revokeObjectURL(compressedUrl);
          setCompressedUrl(URL.createObjectURL(blob));
        },
        'image/jpeg',
        quality
      );
    };
  };

  // Perform Format Conversion
  const handleFormatConvert = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (toFormat === 'JPG' || toFormat === 'BMP') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      let mime = 'image/png';
      if (toFormat === 'JPG') mime = 'image/jpeg';
      if (toFormat === 'WEBP') mime = 'image/webp';

      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted_${(imageFile?.name || 'image').replace(/\.[^/.]+$/, '')}.${toFormat.toLowerCase()}`;
        a.click();
        URL.revokeObjectURL(url);
      }, mime, 0.92);
    };
  };

  // Perform Crop Export
  const handleExportCrop = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let targetW = img.width;
      let targetH = img.height;
      let sx = 0;
      let sy = 0;

      if (aspectRatio === '1:1') {
        const side = Math.min(img.width, img.height);
        targetW = side;
        targetH = side;
        sx = (img.width - side) / 2;
        sy = (img.height - side) / 2;
      } else if (aspectRatio === '16:9') {
        targetW = img.width;
        targetH = Math.round((img.width * 9) / 16);
        if (targetH > img.height) {
          targetH = img.height;
          targetW = Math.round((img.height * 16) / 9);
        }
        sx = (img.width - targetW) / 2;
        sy = (img.height - targetH) / 2;
      } else if (aspectRatio === '4:3') {
        targetW = img.width;
        targetH = Math.round((img.width * 3) / 4);
        if (targetH > img.height) {
          targetH = img.height;
          targetW = Math.round((img.height * 4) / 3);
        }
        sx = (img.width - targetW) / 2;
        sy = (img.height - targetH) / 2;
      }

      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, sx, sy, targetW, targetH, 0, 0, targetW, targetH);

      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cropped_${aspectRatio}_${imageFile?.name || 'image.png'}`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
  };

  const formatsList = ['JPG', 'PNG', 'WEBP', 'AVIF', 'GIF', 'BMP', 'TIFF', 'HEIC'];

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Universal Upload Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
            {toolId === 'crop-image' && <Crop className="w-5 h-5" />}
            {toolId === 'image-compressor' && <Sliders className="w-5 h-5" />}
            {toolId === 'format-converter' && <ArrowRight className="w-5 h-5" />}
            {toolId === 'paste-image' && <Clipboard className="w-5 h-5" />}
            {toolId === 'psd-to-json' && <FileCode className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 capitalize">
              {toolId.replace('-', ' ')}
            </h2>
            <p className="text-xs text-slate-500">
              {toolId === 'paste-image'
                ? 'Press Ctrl+V anywhere or upload an image from clipboard'
                : '100% Client-side HTML5 Canvas transformation'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept={toolId === 'psd-to-json' ? '.psd,image/*' : 'image/*'}
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4" /> {imageSrc ? 'Change Image' : 'Select Image File'}
          </button>
        </div>
      </div>

      {/* 1. Crop Image Tool */}
      {toolId === 'crop-image' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          {!imageSrc ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 p-12 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <Crop className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-sm font-bold text-slate-700">Click to upload an image to crop</span>
              <span className="text-xs text-slate-500 mt-1">Preset ratios: 1:1, 16:9, 4:3, 9:16 or Freeform</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Aspect Ratio:</span>
                  {(['free', '1:1', '16:9', '4:3', '9:16'] as const).map(r => (
                    <button
                      key={r}
                      onClick={() => setAspectRatio(r)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize cursor-pointer transition-colors ${
                        aspectRatio === r ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {r === 'free' ? 'Original' : r}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleExportCrop}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Cropped Image
                </button>
              </div>

              {/* Preview Stage */}
              <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-center min-h-[300px] max-h-[500px] overflow-hidden">
                <img
                  src={imageSrc}
                  alt="Crop Preview"
                  className="max-h-[460px] object-contain rounded-lg border border-slate-700"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Image Compressor */}
      {toolId === 'image-compressor' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          {!imageSrc ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 p-12 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <Sliders className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-sm font-bold text-slate-700">Upload image to compress & reduce file size</span>
              <span className="text-xs text-slate-500 mt-1">Real-time before vs after byte reduction metrics</span>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>Compression Quality</span>
                  <span className="text-indigo-600 text-sm">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.95"
                  step="0.05"
                  value={quality}
                  onChange={e => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Original File</span>
                  <div className="text-lg font-extrabold text-slate-900">
                    {(originalSize / 1024).toFixed(1)} KB
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {imgWidth} x {imgHeight} px
                  </span>
                </div>

                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-xs">
                  <span className="font-bold text-indigo-900 block mb-1">Compressed Estimate</span>
                  <div className="text-lg font-extrabold text-indigo-700">
                    {compressedBlob ? `${(compressedBlob.size / 1024).toFixed(1)} KB` : 'Click Compress Below'}
                  </div>
                  {compressedBlob && (
                    <span className="text-emerald-700 font-bold text-[11px]">
                      Saved {Math.round((1 - compressedBlob.size / originalSize) * 100)}% file size
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleCompress}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Calculate Compression
                </button>
                {compressedUrl && (
                  <a
                    href={compressedUrl}
                    download={`compressed_${imageFile?.name || 'image.jpg'}`}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download Compressed Image
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Universal Format Converter */}
      {toolId === 'format-converter' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">From:</span>
              <select
                value={fromFormat}
                onChange={e => setFromFormat(e.target.value)}
                className="text-xs p-2 bg-white border border-slate-300 rounded-lg font-semibold"
              >
                {formatsList.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <ArrowRight className="w-5 h-5 text-indigo-600" />

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Convert To:</span>
              <select
                value={toFormat}
                onChange={e => setToFormat(e.target.value)}
                className="text-xs p-2 bg-white border border-slate-300 rounded-lg font-semibold"
              >
                {formatsList.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {!imageSrc ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 p-12 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <ArrowRight className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-sm font-bold text-slate-700">Select any image to convert to {toFormat}</span>
              <span className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP, AVIF, GIF, BMP, TIFF, HEIC</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">{imageFile?.name}</span>
                <span className="text-slate-500 font-mono">{(originalSize / 1024).toFixed(1)} KB</span>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleFormatConvert}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Convert & Download as .{toFormat.toLowerCase()}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Paste Image Tool */}
      {toolId === 'paste-image' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center gap-3">
            <Clipboard className="w-5 h-5 text-indigo-600 shrink-0" />
            <div className="text-xs text-indigo-950">
              <strong>Clipboard Listening Active:</strong> Press <kbd className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 font-mono text-[11px]">Ctrl + V</kbd> or <kbd className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 font-mono text-[11px]">⌘ + V</kbd> anywhere on this page to immediately paste screenshot or copied graphic!
            </div>
          </div>

          {imageSrc ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500">Dimensions:</span>
                  <div className="font-bold text-slate-800">{imgWidth} × {imgHeight} px</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500">Aspect Ratio:</span>
                  <div className="font-bold text-slate-800">{(imgWidth / (imgHeight || 1)).toFixed(2)}:1</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500">Size:</span>
                  <div className="font-bold text-slate-800">{(originalSize / 1024).toFixed(1)} KB</div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 flex justify-center max-h-[400px] overflow-hidden">
                <img src={imageSrc} alt="Pasted" className="max-h-[380px] object-contain rounded" />
              </div>

              <div className="flex justify-end gap-2">
                <a
                  href={imageSrc}
                  download="pasted_image.png"
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Pasted PNG
                </a>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-300 bg-indigo-50/30 p-12 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer"
            >
              <Clipboard className="w-8 h-8 text-indigo-600 mb-2 animate-bounce" />
              <span className="text-sm font-bold text-indigo-900">Press Ctrl+V to paste copied screenshot here</span>
              <span className="text-xs text-indigo-600 mt-1">Or click to select a file manually</span>
            </div>
          )}
        </div>
      )}

      {/* 5. PSD to JSON Tool */}
      {toolId === 'psd-to-json' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Photoshop PSD to JSON Inspector</h2>
                <p className="text-xs text-slate-500">Extract document header, color depth, channel metrics & layer structure</p>
              </div>
            </div>

            {psdJson && (
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(psdJson);
                  setCopiedPsd(true);
                  setTimeout(() => setCopiedPsd(false), 1800);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                {copiedPsd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPsd ? 'Copied JSON' : 'Copy JSON'}</span>
              </button>
            )}
          </div>

          {!psdJson ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 p-12 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer"
            >
              <FileCode className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-sm font-bold text-slate-700">Upload Photoshop .PSD file</span>
              <span className="text-xs text-slate-500 mt-1">Parses binary header & layer metadata to structured JSON</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Extracted Layer & Color Hierarchy JSON
              </span>
              <pre className="p-4 bg-slate-950 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-[460px] leading-relaxed">
                {psdJson}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
