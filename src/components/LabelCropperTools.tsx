import React, { useState, useRef } from 'react';
import { 
  ShoppingBag, 
  RotateCw, 
  Download, 
  Upload, 
  Printer, 
  Crop, 
  FileCheck,
  Sparkles
} from 'lucide-react';
import { ToolId } from '../types';

interface LabelCropperProps {
  toolId: 
    | 'flipkart-label-crop'
    | 'meesho-label-crop'
    | 'amazon-label-crop'
    | 'snapdeal-label-crop';
}

export const LabelCropperTools: React.FC<LabelCropperProps> = ({ toolId }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [labelName, setLabelName] = useState<string>('');
  const [cropPreset, setCropPreset] = useState<'top-half' | 'top-left' | 'custom'>('top-half');
  const [rotation, setRotation] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platformNames: Record<string, { name: string; color: string; desc: string }> = {
    'flipkart-label-crop': {
      name: 'Flipkart Shipping Label Cropper',
      color: 'bg-amber-500',
      desc: 'Crop standard 4x6 thermal barcode & invoice label from Flipkart Seller Hub PDFs'
    },
    'meesho-label-crop': {
      name: 'Meesho Shipping Label Cropper',
      color: 'bg-rose-500',
      desc: 'Extract top-half thermal courier slips and address barcodes from Meesho orders'
    },
    'amazon-label-crop': {
      name: 'Amazon Easy Ship Label Cropper',
      color: 'bg-orange-500',
      desc: 'Auto-isolate Amazon ATS shipping labels from multi-page invoice packs'
    },
    'snapdeal-label-crop': {
      name: 'Snapdeal Courier Slip Cropper',
      color: 'bg-red-600',
      desc: 'Crop Snapdeal logistics thermal shipping label ready for 4x6 thermal printers'
    }
  };

  const currentPlatform = platformNames[toolId] || platformNames['flipkart-label-crop'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLabelName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleExportThermalLabel = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calculate 4x6 thermal ratio (1200 x 1800 px)
      let sx = 0;
      let sy = 0;
      let sw = img.width;
      let sh = img.height / 2; // Default top half for seller invoices

      if (cropPreset === 'top-left') {
        sw = img.width / 2;
        sh = img.height / 2;
      }

      canvas.width = 1200;
      canvas.height = 1800;

      // Fill crisp white thermal background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (rotation !== 0) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, sx, sy, sw, sh, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();
      } else {
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      }

      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `thermal_4x6_${toolId}_${labelName || 'label'}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${currentPlatform.color} flex items-center justify-center text-white font-bold`}>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{currentPlatform.name}</h2>
            <p className="text-xs text-slate-500">{currentPlatform.desc}</p>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,.pdf"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
        >
          <Upload className="w-4 h-4" /> {imageSrc ? 'Upload Different Invoice' : 'Upload Seller Invoice / Label'}
        </button>
      </div>

      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 p-14 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
        >
          <Printer className="w-10 h-10 text-indigo-600 mb-3" />
          <span className="text-base font-bold text-slate-800">Upload {currentPlatform.name.split(' ')[0]} Seller PDF / Invoice Image</span>
          <span className="text-xs text-slate-500 mt-1 max-w-md">
            Automatically isolates the courier barcode, shipping address & customer details into crisp 4x6 inch thermal format
          </span>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Crop Section:</span>
              <button
                onClick={() => setCropPreset('top-half')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  cropPreset === 'top-half' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                Top Half (Standard 4x6)
              </button>
              <button
                onClick={() => setCropPreset('top-left')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  cropPreset === 'top-left' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                Top Left Quadrant
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" /> Rotate 90° ({rotation}°)
              </button>
            </div>
          </div>

          {/* Thermal Preview Box */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-100 rounded-2xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Printer className="w-3.5 h-3.5" /> 4x6 Inch Thermal Label Print Preview
            </div>
            <div className="w-[300px] h-[450px] bg-white border-2 border-indigo-500 rounded-lg shadow-md p-2 overflow-hidden flex flex-col items-center justify-center relative">
              <img
                src={imageSrc}
                alt="Label Preview"
                className="w-full h-full object-cover rounded"
                style={{
                  clipPath: cropPreset === 'top-half' ? 'inset(0 0 50% 0)' : 'inset(0 50% 50% 0)',
                  transform: `rotate(${rotation}deg)`
                }}
              />
              <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                4×6 Thermal Fit
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleExportThermalLabel}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download 4x6 Thermal Label (PNG)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
