export const STANDALONE_TEMPLATES: Record<string, { title: string; filename: string; code: string }> = {
  'word-counter': {
    title: 'Word & Character Counter Pro',
    filename: 'word-counter.html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Word & Character Counter Pro</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>body { font-family: 'Inter', system-ui, sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col antialiased">
  <header class="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
    <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">W</div>
        <div>
          <h1 class="text-lg font-bold text-slate-900 leading-tight">Word & Character Counter</h1>
          <p class="text-xs text-slate-500">Real-time client-side text metrics & tools</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button id="sampleBtn" class="text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors">Insert Sample</button>
        <button id="clearBtn" class="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors">Clear</button>
      </div>
    </div>
  </header>
  <main class="max-w-5xl w-full mx-auto px-4 py-6 flex-1 flex flex-col gap-6">
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
        <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Words</span>
        <span id="wordCount" class="text-2xl sm:text-3xl font-bold text-indigo-600 mt-1">0</span>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
        <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Characters</span>
        <span id="charCount" class="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">0</span>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
        <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">No Spaces</span>
        <span id="charNoSpaceCount" class="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">0</span>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
        <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Sentences</span>
        <span id="sentenceCount" class="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">0</span>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
        <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Paragraphs</span>
        <span id="paragraphCount" class="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">0</span>
      </div>
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
        <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Lines</span>
        <span id="lineCount" class="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">0</span>
      </div>
    </div>
    <div class="bg-indigo-50/70 border border-indigo-100 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-xs text-indigo-900">
      <div>Reading Time: <strong id="readingTime">0 min</strong> (200 wpm)</div>
      <div>Speaking Time: <strong id="speakingTime">0 min</strong> (130 wpm)</div>
    </div>
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
      <div class="p-3 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
        <span class="text-xs font-semibold text-slate-600">Text Input</span>
        <div class="flex flex-wrap items-center gap-1.5 text-xs">
          <button id="btnUpper" class="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 font-medium">UPPERCASE</button>
          <button id="btnLower" class="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 font-medium">lowercase</button>
          <button id="btnTitle" class="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 font-medium">Title Case</button>
          <button id="btnTrim" class="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 font-medium">Clean Spaces</button>
        </div>
      </div>
      <textarea id="textInput" placeholder="Type or paste text here..." class="w-full p-4 flex-1 min-h-[260px] focus:outline-none resize-y text-slate-800 text-sm md:text-base border-0"></textarea>
      <div class="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <span id="toast" class="text-xs text-emerald-600 font-medium opacity-0 transition-opacity">Copied!</span>
        <button id="copyBtn" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">Copy Text</button>
      </div>
    </div>
  </main>
  <script>
    (function () {
      const textInput = document.getElementById('textInput');
      const wordCount = document.getElementById('wordCount');
      const charCount = document.getElementById('charCount');
      const charNoSpace = document.getElementById('charNoSpaceCount');
      const sentenceCount = document.getElementById('sentenceCount');
      const paragraphCount = document.getElementById('paragraphCount');
      const lineCount = document.getElementById('lineCount');
      const readingTime = document.getElementById('readingTime');
      const speakingTime = document.getElementById('speakingTime');
      const toast = document.getElementById('toast');

      function calculate() {
        const text = textInput.value;
        const trimmed = text.trim();
        charCount.textContent = text.length.toLocaleString();
        charNoSpace.textContent = text.replace(/\\s/g, '').length.toLocaleString();
        const words = trimmed ? trimmed.split(/\\s+/).filter(Boolean) : [];
        const nw = words.length;
        wordCount.textContent = nw.toLocaleString();
        const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0) : [];
        sentenceCount.textContent = sentences.length.toLocaleString();
        const paragraphs = trimmed ? trimmed.split(/\\n+/).filter(p => p.trim().length > 0) : [];
        paragraphCount.textContent = paragraphs.length.toLocaleString();
        const lines = text ? text.split('\\n') : [];
        lineCount.textContent = lines.length.toLocaleString();
        const rm = Math.ceil(nw / 200);
        readingTime.textContent = nw === 0 ? '0 min' : (rm < 1 ? '< 1 min' : rm + ' min');
        const sm = Math.ceil(nw / 130);
        speakingTime.textContent = nw === 0 ? '0 min' : (sm < 1 ? '< 1 min' : sm + ' min');
      }

      textInput.addEventListener('input', calculate);
      document.getElementById('clearBtn').addEventListener('click', () => { textInput.value = ''; calculate(); });
      document.getElementById('sampleBtn').addEventListener('click', () => {
        textInput.value = "The quick brown fox jumps over the lazy dog. Continuous improvements compound daily.\\n\\nEverything runs 100% in your browser.";
        calculate();
      });
      document.getElementById('btnUpper').addEventListener('click', () => { textInput.value = textInput.value.toUpperCase(); calculate(); });
      document.getElementById('btnLower').addEventListener('click', () => { textInput.value = textInput.value.toLowerCase(); calculate(); });
      document.getElementById('btnTitle').addEventListener('click', () => {
        textInput.value = textInput.value.toLowerCase().replace(/\\b\\w/g, c => c.toUpperCase());
        calculate();
      });
      document.getElementById('btnTrim').addEventListener('click', () => {
        textInput.value = textInput.value.replace(/[ \\t]+/g, ' ').replace(/\\n\\s*\\n/g, '\\n\\n').trim();
        calculate();
      });
      document.getElementById('copyBtn').addEventListener('click', async () => {
        if (!textInput.value) return;
        await navigator.clipboard.writeText(textInput.value);
        toast.style.opacity = '1';
        setTimeout(() => toast.style.opacity = '0', 2000);
      });
      calculate();
    })();
  </script>
</body>
</html>`
  },
  'image-resizer': {
    title: 'Client-Side Image Resizer & Converter',
    filename: 'image-resizer.html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Image Resizer & Converter</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>body { font-family: 'Inter', system-ui, sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col antialiased">
  <header class="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
    <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">🖼️</div>
        <div>
          <h1 class="text-lg font-bold text-slate-900 leading-tight">Image Resizer & Converter</h1>
          <p class="text-xs text-slate-500">In-browser Canvas API processing</p>
        </div>
      </div>
    </div>
  </header>
  <main class="max-w-5xl w-full mx-auto px-4 py-6 flex-1 flex flex-col gap-6">
    <div id="dropZone" class="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
      <input type="file" id="fileInput" accept="image/*" class="hidden" />
      <h3 class="text-sm font-semibold text-slate-800 mb-1">Click or drag & drop an image here</h3>
      <p class="text-xs text-slate-500">Supports PNG, JPG, WebP (Private in-browser conversion)</p>
    </div>
    <div id="workspace" class="hidden grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
        <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Resize Options</h2>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Width (px)</label>
            <input type="number" id="widthInput" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" min="1" max="10000" />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Height (px)</label>
            <input type="number" id="heightInput" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" min="1" max="10000" />
          </div>
        </div>
        <label class="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
          <input type="checkbox" id="aspectLock" checked class="w-4 h-4 text-indigo-600 rounded" />
          <span>Lock Aspect Ratio</span>
        </label>
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1">Format</label>
          <select id="formatSelect" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
            <option value="image/jpeg">JPEG (.jpg)</option>
            <option value="image/png">PNG (.png)</option>
            <option value="image/webp" selected>WebP (.webp)</option>
          </select>
        </div>
        <div id="qualityContainer">
          <div class="flex justify-between text-xs font-medium text-slate-600 mb-1">
            <span>Quality</span><span id="qualityVal">90%</span>
          </div>
          <input type="range" id="qualitySlider" min="10" max="100" value="90" class="w-full accent-indigo-600" />
        </div>
        <button id="downloadBtn" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors">Download Processed Image</button>
      </div>
      <div class="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <img id="previewImg" class="max-h-[350px] max-w-full object-contain rounded" alt="Preview" />
      </div>
    </div>
  </main>
  <script>
    (function () {
      const dropZone = document.getElementById('dropZone');
      const fileInput = document.getElementById('fileInput');
      const workspace = document.getElementById('workspace');
      const widthInput = document.getElementById('widthInput');
      const heightInput = document.getElementById('heightInput');
      const aspectLock = document.getElementById('aspectLock');
      const formatSelect = document.getElementById('formatSelect');
      const qualitySlider = document.getElementById('qualitySlider');
      const qualityVal = document.getElementById('qualityVal');
      const previewImg = document.getElementById('previewImg');
      const downloadBtn = document.getElementById('downloadBtn');

      let originalImage = new Image();
      let naturalWidth = 0, naturalHeight = 0, aspectRatio = 1;

      dropZone.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) handleFile(e.target.files[0]);
      });
      dropZone.addEventListener('dragover', (e) => { e.preventDefault(); });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
      });

      function handleFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          originalImage.onload = () => {
            naturalWidth = originalImage.naturalWidth;
            naturalHeight = originalImage.naturalHeight;
            aspectRatio = naturalWidth / naturalHeight;
            widthInput.value = naturalWidth;
            heightInput.value = naturalHeight;
            dropZone.classList.add('hidden');
            workspace.classList.remove('hidden');
            render();
          };
          originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }

      function render() {
        const tw = parseInt(widthInput.value) || 1;
        const th = parseInt(heightInput.value) || 1;
        const canvas = document.createElement('canvas');
        canvas.width = tw; canvas.height = th;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(originalImage, 0, 0, tw, th);
        previewImg.src = canvas.toDataURL(formatSelect.value, parseInt(qualitySlider.value) / 100);
      }

      widthInput.addEventListener('input', () => {
        if (aspectLock.checked) heightInput.value = Math.round((parseInt(widthInput.value) || 1) / aspectRatio);
        render();
      });
      heightInput.addEventListener('input', () => {
        if (aspectLock.checked) widthInput.value = Math.round((parseInt(heightInput.value) || 1) * aspectRatio);
        render();
      });
      qualitySlider.addEventListener('input', () => { qualityVal.textContent = qualitySlider.value + '%'; render(); });
      formatSelect.addEventListener('change', render);

      downloadBtn.addEventListener('click', () => {
        const tw = parseInt(widthInput.value) || 1;
        const th = parseInt(heightInput.value) || 1;
        const canvas = document.createElement('canvas');
        canvas.width = tw; canvas.height = th;
        canvas.getContext('2d').drawImage(originalImage, 0, 0, tw, th);
        const link = document.createElement('a');
        link.download = 'resized_' + Date.now() + (formatSelect.value === 'image/png' ? '.png' : formatSelect.value === 'image/webp' ? '.webp' : '.jpg');
        link.href = canvas.toDataURL(formatSelect.value, parseInt(qualitySlider.value) / 100);
        link.click();
      });
    })();
  </script>
</body>
</html>`
  },
  'json-formatter': {
    title: 'JSON Formatter, Validator & Minifier',
    filename: 'json-formatter.html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>JSON Formatter & Validator</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col">
  <header class="bg-white border-b border-slate-200 p-4 font-bold text-lg text-indigo-600">JSON Formatter & Validator</header>
  <main class="max-w-6xl w-full mx-auto p-4 flex flex-col gap-4 flex-1">
    <div class="flex gap-2">
      <button id="fmt2" class="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold">Format (2 Spaces)</button>
      <button id="fmt4" class="px-3 py-1.5 bg-slate-100 border text-slate-700 rounded text-xs font-semibold">Format (4 Spaces)</button>
      <button id="mini" class="px-3 py-1.5 bg-slate-100 border text-slate-700 rounded text-xs font-semibold">Minify</button>
      <button id="fix" class="px-3 py-1.5 bg-amber-100 text-amber-900 rounded text-xs font-semibold">Fix Quotes & Commas</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
      <textarea id="jin" placeholder="Input JSON..." class="p-3 bg-white border rounded-xl font-mono text-xs min-h-[350px]"></textarea>
      <textarea id="jout" readonly placeholder="Output..." class="p-3 bg-slate-100 border rounded-xl font-mono text-xs min-h-[350px]"></textarea>
    </div>
  </main>
  <script>
    const jin = document.getElementById('jin');
    const jout = document.getElementById('jout');
    function fmt(spaces) {
      try {
        jout.value = JSON.stringify(JSON.parse(jin.value), null, spaces);
      } catch(e) { jout.value = 'Invalid JSON: ' + e.message; }
    }
    jin.addEventListener('input', () => fmt(2));
    document.getElementById('fmt2').addEventListener('click', () => fmt(2));
    document.getElementById('fmt4').addEventListener('click', () => fmt(4));
    document.getElementById('mini').addEventListener('click', () => fmt(0));
    document.getElementById('fix').addEventListener('click', () => {
      jin.value = jin.value.replace(/,\\s*([}\\]])/g, '$1').replace(/'/g, '"');
      fmt(2);
    });
  </script>
</body>
</html>`
  },
  'crypto-base64': {
    title: 'Base64 & Web Crypto Hasher',
    filename: 'base64-hasher.html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Base64 & Crypto Hash</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen p-6">
  <div class="max-w-4xl mx-auto flex flex-col gap-4">
    <h1 class="text-xl font-bold text-indigo-600">Base64 & Web Crypto Hasher</h1>
    <textarea id="inp" placeholder="Type text..." class="w-full p-3 bg-white border rounded-xl font-mono text-sm"></textarea>
    <div class="bg-white p-4 rounded-xl border flex flex-col gap-3">
      <div><span class="text-xs font-bold text-slate-500">Base64:</span><input id="b64" readonly class="w-full p-2 bg-slate-50 border rounded text-xs font-mono" /></div>
      <div><span class="text-xs font-bold text-slate-500">SHA-256:</span><input id="s256" readonly class="w-full p-2 bg-slate-50 border rounded text-xs font-mono text-indigo-700" /></div>
      <div><span class="text-xs font-bold text-slate-500">SHA-1:</span><input id="s1" readonly class="w-full p-2 bg-slate-50 border rounded text-xs font-mono" /></div>
    </div>
  </div>
  <script>
    const inp = document.getElementById('inp');
    async function hash(str, algo) {
      if(!str) return '';
      const b = await crypto.subtle.digest(algo, new TextEncoder().encode(str));
      return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
    }
    async function run() {
      const v = inp.value;
      document.getElementById('b64').value = v ? btoa(unescape(encodeURIComponent(v))) : '';
      document.getElementById('s256').value = await hash(v, 'SHA-256');
      document.getElementById('s1').value = await hash(v, 'SHA-1');
    }
    inp.addEventListener('input', run);
  </script>
</body>
</html>`
  },
  'color-contrast': {
    title: 'Color & WCAG Contrast Pro',
    filename: 'color-contrast.html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Color & Contrast Checker</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen p-6">
  <div class="max-w-4xl mx-auto flex flex-col gap-4">
    <h1 class="text-xl font-bold text-indigo-600">Color & WCAG 2.1 Contrast Checker</h1>
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white p-4 rounded-xl border flex flex-col gap-2">
        <label class="text-xs font-bold">Text Color</label>
        <input type="color" id="fg" value="#1e1b4b" class="w-full h-10 cursor-pointer" />
      </div>
      <div class="bg-white p-4 rounded-xl border flex flex-col gap-2">
        <label class="text-xs font-bold">Background Color</label>
        <input type="color" id="bg" value="#ffffff" class="w-full h-10 cursor-pointer" />
      </div>
    </div>
    <div id="preview" class="p-8 rounded-xl border text-center font-bold text-2xl" style="background:#ffffff; color:#1e1b4b;">
      Contrast Ratio: <span id="ratio">16.32 : 1</span>
    </div>
  </div>
  <script>
    const fg = document.getElementById('fg');
    const bg = document.getElementById('bg');
    const preview = document.getElementById('preview');
    const ratioEl = document.getElementById('ratio');
    function lum(hex) {
      const rgb = [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return rgb[0]*0.2126 + rgb[1]*0.7152 + rgb[2]*0.0722;
    }
    function update() {
      preview.style.color = fg.value;
      preview.style.backgroundColor = bg.value;
      const l1 = lum(fg.value), l2 = lum(bg.value);
      const r = (Math.max(l1,l2) + 0.05) / (Math.min(l1,l2) + 0.05);
      ratioEl.textContent = r.toFixed(2) + ' : 1';
    }
    fg.addEventListener('input', update);
    bg.addEventListener('input', update);
    update();
  </script>
</body>
</html>`
  },
  'regex-tester': {
    title: 'Interactive Regex Tester & Matcher',
    filename: 'regex-tester.html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Regex Tester</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen p-6">
  <div class="max-w-4xl mx-auto flex flex-col gap-4">
    <h1 class="text-xl font-bold text-indigo-600">Regex Tester & Highlighter</h1>
    <input id="pat" value="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" placeholder="Regex pattern" class="w-full p-2.5 bg-white border rounded font-mono text-sm" />
    <textarea id="txt" class="w-full p-3 bg-white border rounded font-mono text-sm min-h-[140px]">Contact hello@example.com or support@google.com</textarea>
    <div id="out" class="w-full p-4 bg-white border rounded font-mono text-sm"></div>
  </div>
  <script>
    const pat = document.getElementById('pat');
    const txt = document.getElementById('txt');
    const out = document.getElementById('out');
    function test() {
      try {
        const re = new RegExp(pat.value, 'gi');
        const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const safeText = escapeHtml(txt.value);
        out.innerHTML = safeText.replace(re, m => '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded font-bold">' + m + '</mark>');
      } catch(e) { out.textContent = 'Regex error: ' + e.message; }
    }
    pat.addEventListener('input', test);
    txt.addEventListener('input', test);
    test();
  </script>
</body>
</html>`
  },
  'email-finder': {
    title: 'Email Finder from URL (Excel & CSV)',
    filename: 'email-finder.html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Finder from URL</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen p-6 font-sans">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h1 class="text-xl font-bold text-slate-900">Email Finder from URL (Excel / CSV)</h1>
      <p class="text-xs text-slate-500 mt-1">Upload spreadsheet (.xlsx, .csv) or paste URLs to extract emails.</p>
      <div class="mt-4 flex gap-3">
        <input type="file" id="fileIn" accept=".xlsx, .xls, .csv" class="text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100" />
        <button id="findBtn" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold">Find Emails</button>
      </div>
    </div>
    <div id="results" class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hidden">
      <h2 class="text-sm font-bold text-slate-900 mb-3">Extracted Emails</h2>
      <div id="tableContainer" class="overflow-x-auto"></div>
    </div>
  </div>
</body>
</html>`
  },
  'image-to-text': {
    title: 'Text Extractor from Image (OCR)',
    filename: 'image-to-text.html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Text Extractor from Image (OCR)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen p-6 font-sans">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h1 class="text-xl font-bold text-slate-900">Text Extractor from Image (OCR)</h1>
      <p class="text-xs text-slate-500">Select an image to extract text using client-side OCR.</p>
      <input type="file" id="imgIn" accept="image/*" class="text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100" />
      <button id="ocrBtn" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold">Extract Text</button>
      <div id="status" class="text-xs text-indigo-600 font-semibold hidden">Processing...</div>
    </div>
    <div id="outputCard" class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hidden space-y-3">
      <h2 class="text-sm font-bold text-slate-900">Extracted Output</h2>
      <textarea id="outputArea" rows="10" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"></textarea>
    </div>
  </div>
</body>
</html>`
  }
};
