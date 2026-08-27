import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, Lock, Unlock, Image as ImageIcon, Check } from 'lucide-react';

export const ImageResizerTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [origDimensions, setOrigDimensions] = useState<{ w: number; h: number; size: number }>({ w: 0, h: 0, size: 0 });
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [quality, setQuality] = useState<number>(90);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image (PNG, JPG, WebP, GIF)');
      return;
    }
    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        imageElementRef.current = img;
        setImageSrc(src);
        setOrigDimensions({ w: img.naturalWidth, h: img.naturalHeight, size: file.size });
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Recompute resized canvas output whenever dimension/format/quality changes
  useEffect(() => {
    if (!imageElementRef.current || width <= 0 || height <= 0) return;
    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imageElementRef.current, 0, 0, width, height);

    canvas.toBlob(
      blob => {
        if (blob) {
          if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
          const url = URL.createObjectURL(blob);
          setPreviewBlobUrl(url);
          setPreviewSize(blob.size);
        }
        setIsProcessing(false);
      },
      format,
      quality / 100
    );
  }, [width, height, format, quality, imageSrc]);

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && origDimensions.w > 0) {
      const ratio = origDimensions.w / origDimensions.h;
      setHeight(Math.round(val / ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && origDimensions.h > 0) {
      const ratio = origDimensions.w / origDimensions.h;
      setWidth(Math.round(val * ratio));
    }
  };

  const applyScalePreset = (scale: number) => {
    if (origDimensions.w > 0) {
      setWidth(Math.round(origDimensions.w * scale));
      setHeight(Math.round(origDimensions.h * scale));
    }
  };

  const handleDownload = () => {
    if (!previewBlobUrl) return;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    const link = document.createElement('a');
    link.download = `${fileName}_${width}x${height}.${ext}`;
    link.href = previewBlobUrl;
    link.click();
  };

  const handleReset = () => {
    setImageSrc(null);
    setPreviewBlobUrl(null);
    setWidth(0);
    setHeight(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Client-Side Image Resizer & Converter</h2>
            <p className="text-xs text-slate-500">100% private in-browser canvas processing (no uploads to servers)</p>
          </div>
        </div>
        {imageSrc && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Upload Another
          </button>
        )}
      </div>

      {!imageSrc ? (
        /* Upload Area */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-white rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept="image/png, image/jpeg, image/webp, image/gif"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Click to browse or drop an image</h3>
          <p className="text-xs text-slate-500 max-w-sm">Supports PNG, JPG, WebP. Resized and compressed locally using your device GPU/CPU.</p>
        </div>
      ) : (
        /* Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Dimensions & Ratio</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Width (px)</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={width || ''}
                    onChange={e => handleWidthChange(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Height (px)</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={height || ''}
                    onChange={e => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLockAspect(!lockAspect)}
                className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer self-start"
              >
                {lockAspect ? <Lock className="w-4 h-4 text-indigo-600" /> : <Unlock className="w-4 h-4 text-slate-400" />}
                <span>{lockAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}</span>
              </button>

              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-xs text-slate-500">Presets:</span>
                {[0.25, 0.5, 0.75, 1].map(scale => (
                  <button
                    key={scale}
                    onClick={() => applyScalePreset(scale)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer font-medium"
                  >
                    {scale * 100}%
                  </button>
                ))}
              </div>

              <hr className="border-slate-100 my-1" />

              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Format & Quality</h3>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Output Format</label>
                <select
                  value={format}
                  onChange={e => setFormat(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="image/webp">WebP (.webp) - Optimal for web</option>
                  <option value="image/jpeg">JPEG (.jpg) - Standard compression</option>
                  <option value="image/png">PNG (.png) - Lossless with transparency</option>
                </select>
              </div>

              {format !== 'image/png' && (
                <div>
                  <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1">
                    <span>Quality</span>
                    <span className="font-bold text-indigo-600">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={e => setQuality(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}

              <button
                onClick={handleDownload}
                disabled={isProcessing || !previewBlobUrl}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Resized Image
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-3 border-b border-slate-100 pb-2">
                <span>Original: <strong className="text-slate-800">{origDimensions.w}x{origDimensions.h} ({formatBytes(origDimensions.size)})</strong></span>
                <span>Result: <strong className="text-indigo-600">{width}x{height} (~{formatBytes(previewSize)})</strong></span>
              </div>
              <div className="max-h-[380px] w-full flex items-center justify-center overflow-hidden rounded-xl bg-slate-100/70 p-2">
                {previewBlobUrl && (
                  <img
                    src={previewBlobUrl}
                    alt="Processed Preview"
                    className="max-h-[350px] max-w-full object-contain rounded-lg shadow-sm"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
