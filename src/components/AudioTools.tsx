import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Upload, 
  Scissors, 
  Combine, 
  Gauge, 
  VolumeX, 
  Sparkles, 
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';
import { ToolId } from '../types';

interface AudioToolsProps {
  toolId: 'text-to-speech' | 'audio-joiner' | 'audio-speed' | 'audio-volume' | 'audio-trim';
}

export const AudioTools: React.FC<AudioToolsProps> = ({ toolId }) => {
  // TTS State
  const [ttsText, setTtsText] = useState('Welcome to the Web Utilities Suite! All audio processing runs directly in your browser with zero latency.');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [ttsRate, setTtsRate] = useState(1);
  const [ttsPitch, setTtsPitch] = useState(1);
  const [ttsVolume, setTtsVolume] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Audio File Processing States
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(10);
  const [speedVal, setSpeedVal] = useState<number>(1.25);
  const [volumeGain, setVolumeGain] = useState<number>(1.5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load browser voices for TTS
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const v = window.speechSynthesis.getVoices();
        setVoices(v);
        if (v.length > 0 && !selectedVoice) {
          const defaultV = v.find(voice => voice.lang.includes('en')) || v[0];
          setSelectedVoice(defaultV.name);
        }
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedVoice]);

  // TTS Handlers
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis API is not supported in this browser.');
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(ttsText);
    const voiceObj = voices.find(v => v.name === selectedVoice);
    if (voiceObj) utterance.voice = voiceObj;
    utterance.rate = ttsRate;
    utterance.pitch = ttsPitch;
    utterance.volume = ttsVolume;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Helper: Buffer to WAV download
  const bufferToWave = (abuffer: AudioBuffer, len: number) => {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    let channels: Float32Array[] = [];
    let sample = 0;
    let offset = 0;
    let pos = 0;

    function setUint16(data: number) {
      out.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data: number) {
      out.setUint32(pos, data, true);
      pos += 4;
    }

    // write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    for (let i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([out], { type: 'audio/wav' });
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (toolId === 'audio-joiner') {
      setAudioFiles(prev => [...prev, ...Array.from(files)]);
    } else {
      const file = files[0];
      setAudioFiles([file]);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);

      const tempAudio = new Audio();
      tempAudio.src = url;
      tempAudio.onloadedmetadata = () => {
        setAudioDuration(tempAudio.duration);
        setTrimStart(0);
        setTrimEnd(Math.min(tempAudio.duration, 30));
      };
    }
  };

  // Audio Trim Execution
  const handleExportTrimmedAudio = async () => {
    if (audioFiles.length === 0) return;
    setIsProcessing(true);
    setStatusMessage('Trimming audio buffer in Web Audio API...');

    try {
      const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuf = await audioFiles[0].arrayBuffer();
      const decodedBuf = await actx.decodeAudioData(arrayBuf);

      const rate = decodedBuf.sampleRate;
      const startOffset = Math.max(0, Math.floor(trimStart * rate));
      const endOffset = Math.min(decodedBuf.length, Math.floor(trimEnd * rate));
      const frameCount = endOffset - startOffset;

      if (frameCount <= 0) {
        alert('Invalid trim start and end range');
        setIsProcessing(false);
        return;
      }

      const trimmedBuffer = actx.createBuffer(
        decodedBuf.numberOfChannels,
        frameCount,
        rate
      );

      for (let ch = 0; ch < decodedBuf.numberOfChannels; ch++) {
        const fromChannel = decodedBuf.getChannelData(ch);
        const toChannel = trimmedBuffer.getChannelData(ch);
        for (let i = 0; i < frameCount; i++) {
          toChannel[i] = fromChannel[startOffset + i];
        }
      }

      const wavBlob = bufferToWave(trimmedBuffer, frameCount);
      const dlUrl = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = `trimmed_${audioFiles[0].name.replace(/\.[^/.]+$/, '')}.wav`;
      a.click();
      setStatusMessage('Audio trimmed successfully!');
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Error trimming audio: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Audio Speed Change Execution
  const handleExportSpeedAudio = async () => {
    if (audioFiles.length === 0) return;
    setIsProcessing(true);
    setStatusMessage(`Applying ${speedVal}x speed resample...`);

    try {
      const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuf = await audioFiles[0].arrayBuffer();
      const decodedBuf = await actx.decodeAudioData(arrayBuf);

      // Offline Audio Context rendering with playback rate
      const newDuration = decodedBuf.duration / speedVal;
      const offlineCtx = new OfflineAudioContext(
        decodedBuf.numberOfChannels,
        Math.ceil(newDuration * decodedBuf.sampleRate),
        decodedBuf.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = decodedBuf;
      source.playbackRate.value = speedVal;
      source.connect(offlineCtx.destination);
      source.start(0);

      const renderedBuffer = await offlineCtx.startRendering();
      const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length);
      const dlUrl = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = `speed_${speedVal}x_${audioFiles[0].name.replace(/\.[^/.]+$/, '')}.wav`;
      a.click();
      setStatusMessage(`Exported audio at ${speedVal}x speed!`);
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Speed adjustment error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Audio Volume Gain Execution
  const handleExportVolumeAudio = async () => {
    if (audioFiles.length === 0) return;
    setIsProcessing(true);
    setStatusMessage(`Modulating volume gain to ${Math.round(volumeGain * 100)}%...`);

    try {
      const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuf = await audioFiles[0].arrayBuffer();
      const decodedBuf = await actx.decodeAudioData(arrayBuf);

      const offlineCtx = new OfflineAudioContext(
        decodedBuf.numberOfChannels,
        decodedBuf.length,
        decodedBuf.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = decodedBuf;

      const gainNode = offlineCtx.createGain();
      gainNode.gain.value = volumeGain;

      source.connect(gainNode);
      gainNode.connect(offlineCtx.destination);
      source.start(0);

      const renderedBuffer = await offlineCtx.startRendering();
      const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length);
      const dlUrl = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = `vol_${Math.round(volumeGain * 100)}pct_${audioFiles[0].name.replace(/\.[^/.]+$/, '')}.wav`;
      a.click();
      setStatusMessage('Volume boosted/adjusted & downloaded!');
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Volume adjust error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Audio Joiner Execution
  const handleJoinAudioFiles = async () => {
    if (audioFiles.length < 2) {
      alert('Please upload at least 2 audio tracks to merge.');
      return;
    }
    setIsProcessing(true);
    setStatusMessage(`Concatenating ${audioFiles.length} audio tracks...`);

    try {
      const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedBuffers: AudioBuffer[] = [];

      for (const f of audioFiles) {
        const ab = await f.arrayBuffer();
        const decoded = await actx.decodeAudioData(ab);
        decodedBuffers.push(decoded);
      }

      const totalLength = decodedBuffers.reduce((acc, b) => acc + b.length, 0);
      const sampleRate = decodedBuffers[0].sampleRate;
      const maxChannels = Math.max(...decodedBuffers.map(b => b.numberOfChannels));

      const mergedBuffer = actx.createBuffer(maxChannels, totalLength, sampleRate);

      let currentOffset = 0;
      for (const buf of decodedBuffers) {
        for (let ch = 0; ch < maxChannels; ch++) {
          const channelData = buf.getChannelData(Math.min(ch, buf.numberOfChannels - 1));
          mergedBuffer.getChannelData(ch).set(channelData, currentOffset);
        }
        currentOffset += buf.length;
      }

      const wavBlob = bufferToWave(mergedBuffer, totalLength);
      const dlUrl = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = `merged_${audioFiles.length}_tracks.wav`;
      a.click();
      setStatusMessage(`Successfully concatenated ${audioFiles.length} tracks into WAV!`);
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Join error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Text to Speech Tool */}
      {toolId === 'text-to-speech' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Natural Text to Speech (TTS)</h2>
                <p className="text-xs text-slate-500">Live speech synthesizer with pitch, speed & voice controls</p>
              </div>
            </div>
            {isSpeaking && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full animate-pulse border border-indigo-200">
                <Sparkles className="w-3.5 h-3.5" /> Speaking...
              </span>
            )}
          </div>

          <textarea
            value={ttsText}
            onChange={e => setTtsText(e.target.value)}
            rows={5}
            placeholder="Type or paste any text to speak aloud in natural voice..."
            className="w-full p-4 text-sm font-sans border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 leading-relaxed"
          />

          {/* Voice & Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Voice ({voices.length})</label>
              <select
                value={selectedVoice}
                onChange={e => setSelectedVoice(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                {voices.map(v => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Speed / Rate</span>
                <span className="text-indigo-600">{ttsRate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={ttsRate}
                onChange={e => setTtsRate(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Pitch</span>
                <span className="text-indigo-600">{ttsPitch}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.1"
                value={ttsPitch}
                onChange={e => setTtsPitch(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100 flex-wrap">
            <button
              onClick={handleSpeak}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" /> {isPaused ? 'Resume' : 'Play Speech'}
            </button>
            <button
              onClick={handlePause}
              disabled={!isSpeaking}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Pause className="w-4 h-4" /> Pause
            </button>
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Square className="w-4 h-4" /> Stop
            </button>
          </div>
        </div>
      )}

      {/* Audio Joiner Tool */}
      {toolId === 'audio-joiner' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Combine className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Audio Joiner & Concatenator</h2>
                <p className="text-xs text-slate-500">Combine multiple MP3, WAV, AAC or OGG tracks into a single unified file</p>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              multiple
              onChange={handleAudioUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Audio Files
            </button>
          </div>

          {audioFiles.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 p-10 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <Upload className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-sm font-bold text-slate-700">Click to upload 2 or more audio files</span>
              <span className="text-xs text-slate-500 mt-1">Supports MP3, WAV, AAC, M4A, OGG</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tracks to Merge ({audioFiles.length})
              </span>
              <div className="flex flex-col gap-2">
                {audioFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[11px]">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-800">{file.name}</div>
                        <div className="text-[11px] text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setAudioFiles(audioFiles.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  + Add more files
                </button>
                <button
                  onClick={handleJoinAudioFiles}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Combine className="w-4 h-4" /> {isProcessing ? 'Merging Tracks...' : 'Join & Download WAV'}
                </button>
              </div>
            </div>
          )}

          {statusMessage && (
            <div className="text-xs font-semibold text-indigo-700 bg-indigo-50 p-3 rounded-xl border border-indigo-200">
              {statusMessage}
            </div>
          )}
        </div>
      )}

      {/* Audio Speed Changer */}
      {toolId === 'audio-speed' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Audio Speed Changer</h2>
                <p className="text-xs text-slate-500">Accelerate (up to 3x) or slow down audio with Web Audio re-sampling</p>
              </div>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="audio/*"
            onChange={handleAudioUpload}
            className="hidden"
          />

          {audioFiles.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 p-10 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <Upload className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-sm font-bold text-slate-700">Upload audio file to change speed</span>
              <span className="text-xs text-slate-500 mt-1">MP3, WAV, OGG, AAC</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">{audioFiles[0].name}</span>
                <button
                  onClick={() => { setAudioFiles([]); setAudioUrl(null); }}
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  Change File
                </button>
              </div>

              {audioUrl && (
                <audio ref={audioRef} controls src={audioUrl} className="w-full" />
              )}

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Playback Speed Factor</span>
                  <span className="text-indigo-600 text-sm">{speedVal}x</span>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="3.0"
                  step="0.05"
                  value={speedVal}
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    setSpeedVal(v);
                    if (audioRef.current) audioRef.current.playbackRate = v;
                  }}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>0.25x (Super Slow)</span>
                  <span>1.0x (Normal)</span>
                  <span>2.0x (Double)</span>
                  <span>3.0x (Max)</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleExportSpeedAudio}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Download className="w-4 h-4" /> {isProcessing ? 'Processing Speed...' : `Export at ${speedVal}x Speed`}
                </button>
              </div>
            </div>
          )}

          {statusMessage && (
            <div className="text-xs font-semibold text-indigo-700 bg-indigo-50 p-3 rounded-xl border border-indigo-200">
              {statusMessage}
            </div>
          )}
        </div>
      )}

      {/* Audio Volume Changer */}
      {toolId === 'audio-volume' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Audio Volume Changer & Gain Booster</h2>
                <p className="text-xs text-slate-500">Boost quiet audio up to 300% or attenuate loud tracks cleanly</p>
              </div>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="audio/*"
            onChange={handleAudioUpload}
            className="hidden"
          />

          {audioFiles.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 p-10 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <Upload className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-sm font-bold text-slate-700">Upload audio file to adjust volume</span>
              <span className="text-xs text-slate-500 mt-1">MP3, WAV, OGG, FLAC</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">{audioFiles[0].name}</span>
                <button
                  onClick={() => { setAudioFiles([]); setAudioUrl(null); }}
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  Change File
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Gain Multiplier</span>
                  <span className="text-indigo-600 text-sm font-bold">{Math.round(volumeGain * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={volumeGain}
                  onChange={e => setVolumeGain(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>10% (Whisper)</span>
                  <span>100% (Original)</span>
                  <span>200% (Double Gain)</span>
                  <span>300% (Max Boost)</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleExportVolumeAudio}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Download className="w-4 h-4" /> {isProcessing ? 'Processing Volume...' : `Export with ${Math.round(volumeGain * 100)}% Volume`}
                </button>
              </div>
            </div>
          )}

          {statusMessage && (
            <div className="text-xs font-semibold text-indigo-700 bg-indigo-50 p-3 rounded-xl border border-indigo-200">
              {statusMessage}
            </div>
          )}
        </div>
      )}

      {/* Audio Trim Tool */}
      {toolId === 'audio-trim' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Trim & Cut Audio</h2>
                <p className="text-xs text-slate-500">Set precise start and end times to extract clips and ringtones</p>
              </div>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="audio/*"
            onChange={handleAudioUpload}
            className="hidden"
          />

          {audioFiles.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 p-10 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <Upload className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-sm font-bold text-slate-700">Upload audio track to trim</span>
              <span className="text-xs text-slate-500 mt-1">MP3, WAV, AAC, M4A, OGG</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-slate-800">{audioFiles[0].name}</span>
                  <span className="text-slate-400 ml-2">Total Duration: {audioDuration.toFixed(1)}s</span>
                </div>
                <button
                  onClick={() => { setAudioFiles([]); setAudioUrl(null); }}
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  Change File
                </button>
              </div>

              {audioUrl && (
                <audio ref={audioRef} controls src={audioUrl} className="w-full" />
              )}

              {/* Range Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Time (seconds)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max={trimEnd}
                    value={trimStart}
                    onChange={e => setTrimStart(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Time (seconds)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={trimStart}
                    max={audioDuration}
                    value={trimEnd}
                    onChange={e => setTrimEnd(parseFloat(e.target.value) || audioDuration)}
                    className="w-full p-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                <span>Selected Clip Length: <strong className="text-indigo-600">{(trimEnd - trimStart).toFixed(1)}s</strong></span>
                <button
                  onClick={handleExportTrimmedAudio}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Scissors className="w-4 h-4" /> {isProcessing ? 'Trimming...' : 'Trim & Download WAV'}
                </button>
              </div>
            </div>
          )}

          {statusMessage && (
            <div className="text-xs font-semibold text-indigo-700 bg-indigo-50 p-3 rounded-xl border border-indigo-200">
              {statusMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
