# Tools Pro

> **Comprehensive In-Browser Productivity & Engineering Suite**  
> 100% Client-Side • Zero Cloud Uploads • Instant Processing • Complete Privacy

Tools Pro is a high-performance, browser-native suite of 50+ online utilities designed for developers, creators, businesses, and everyday productivity. Every operation runs locally inside the user's browser (RAM, HTML5 Canvas, Web Audio API, Web Workers, and Web Crypto Subtle API), ensuring full data privacy with zero external server storage.

---

## 🌟 Key Features & Tool Categories

### 1. In-Browser PDF Suite (23 Tools)
- **Organize**: Merge, Split by custom ranges, Remove Pages, Extract Pages, Organize/Reorder Grid, Scan from Camera.
- **Convert to PDF**: JPG/PNG/WebP to PDF, Word to PDF, PowerPoint to PDF, Excel/CSV to PDF, HTML to PDF.
- **Convert from PDF**: PDF to High-Res JPG/PNG, PDF to Word (`.docx`), PDF to PowerPoint (`.pptx`), PDF to Excel (`.xlsx`), PDF to Markdown, PDF to PDF/A.
- **Edit & Security**: In-Browser PDF Annotator/Drawing Canvas, Rotate Pages, Watermark, Header/Footer Page Numbers, Crop Margins, AcroForm Filler, Unlock & AES Password Encryption, Digital Signature Stamp, Permanent Redaction, Side-by-Side PDF Comparator, AI Summarizer & Multi-language Translator.

### 2. Text & Document Suite
- **Text & Diff Compare (Visual Diff 2.0)**: Side-by-side synchronized matrix, Unified inline diff, Visual highlight, RFC `.patch`/`.diff` exporter, character/word level granularity, case/whitespace filtering, and similarity metrics.
- **Word & Character Counter**: Real-time counts (words, characters, sentences, paragraphs), estimated reading/speaking time, case converters, and Flesch-Kincaid readability scoring.
- **Text to Speech (TTS)**: High-fidelity speech synthesizer with pitch, rate, and volume controls.
- **Optical Character Recognition (OCR)**: In-browser image-to-text extractor using high-contrast thresholding and contour detection.

### 3. Audio & Sound Suite
- **Audio Joiner & Merger**: Multi-track concatenation into lossless WAV.
- **Audio Trimmer & Cutter**: Interactive waveform visualizer with millisecond timeline slicing.
- **Speed Changer & Volume Booster**: Phase-vocoder speed manipulation (0.25x–3.0x) and dynamic gain amplification (up to 300%).

### 4. Image & Media Suite
- **Image Resizer & Canvas**: Custom width/height, aspect ratio lock, and quality compression.
- **Universal Format Converter**: Instant conversion between PNG, JPEG, WEBP, AVIF, and BMP.
- **Image Compressor**: Lossy/lossless byte optimization with live savings preview.
- **Thermal Label Croppers**: Automated 4x6 inch label extractors for Flipkart, Amazon ATS, Meesho, and Snapdeal shipping invoices.
- **Color & WCAG Contrast Pro**: Relative luminance analysis, WCAG 2.1 AA/AAA compliance ratings, and HEX/RGB/HSL conversion.

### 5. Developer & Code Suite
- **JSON Formatter & Validator**: Syntax validator, auto-beautifier, minifier, and key sorting with exact error coordinates.
- **JSON Tree Inspector**: Interactive nested tree view with node editing and data type badges.
- **Code Minifier & Beautifier**: Whitespace and comment optimization for HTML, CSS, JavaScript, and JSON.
- **Regex Tester & Matcher**: Real-time pattern matching with capture group inspection and substitution preview.
- **Crypto & Base64 Hasher**: Browser-native SHA-256, SHA-512, MD5, and UTF-8 Base64 encoder/decoder.

### 6. SEO, Social & Network Suite
- **SEO Title & Meta Description Generators**: High-CTR snippet generator with live Google SERP card preview.
- **YouTube Creators Kit**: Algorithmic viral title generator, chaptered description builder, and hashtag/tag optimizer.
- **DNS & Network Inspector**: DNS over HTTPS (DoH) lookup for A, AAAA, MX, TXT, and CNAME records, plus SSL certificate parameters and WhatsApp direct links.

### 7. Calculators & Banking Lookup
- **Financial Loan Calculators**: Home Loan and Auto Loan EMI amortization schedules with principal vs. interest breakdown charts.
- **Age Calculator**: Precise chronological age, total hours/seconds lived, and upcoming birthday countdown.
- **Indian Banking & Postal Lookup**: RBI master database lookup for 11-digit IFSC codes, branch addresses, and 6-digit Indian PIN codes.

---

## 🔒 Privacy & Architecture

| Feature | Description |
| :--- | :--- |
| **Zero Server Uploads** | All file processing (PDF parsing, OCR, audio slicing, diff computation) is executed inside the client's web browser. |
| **Zero Telemetry on Files** | No files or text data are logged or sent to remote servers. |
| **Local Persistence** | Starred favorites, UI themes, and recent activity logs are saved strictly in `localStorage`. |
| **Offline-Capable** | Most utility tools function even without an active internet connection once loaded in cache. |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling & UI**: Tailwind CSS v4, Lucide Icons, Motion
- **PDF Engine**: `pdf-lib`, `pdfjs-dist`
- **Text & Diff**: `diff` (Myers algorithm)
- **Documents & Spreadsheets**: `docx`, `xlsx`
- **Audio Processing**: Web Audio API (`AudioContext`, `MediaRecorder`, `GainNode`)
- **Cryptography**: Web Crypto API (`window.crypto.subtle`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd <repository-folder>

# Install dependencies
npm install
```

### Development Server

```bash
# Start Vite development server on port 3000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build

```bash
# Type check and build optimized bundle for production
npm run build

# Preview the production build
npm run preview
```

---

## 📁 Project Structure

```text
├── src/
│   ├── components/            # UI components and tool views
│   │   ├── HomePage.tsx       # Main hub and tool catalog
│   │   ├── PdfTools.tsx       # 23-in-1 PDF processing suite
│   │   ├── TextCompareTool.tsx# Visual diff and code comparator
│   │   ├── WordCounterTool.tsx# Text metrics & case converter
│   │   ├── AudioTools.tsx     # Audio trimming, speed & volume
│   │   ├── ImageTools.tsx     # Resizer, compressor & converter
│   │   ├── JsonFormatterTool.tsx # JSON validator & tree editor
│   │   ├── RegexTesterTool.tsx# Regular expression debugger
│   │   ├── CryptoBase64Tool.tsx # Web Crypto hash generator
│   │   ├── ColorContrastTool.tsx# WCAG accessibility analyzer
│   │   ├── CommandPalette.tsx # Universal search modal (Cmd+K)
│   │   └── ...
│   ├── data/                  # Static tool definitions & presets
│   ├── utils/                 # Logging, analytics & helper functions
│   ├── types.ts               # Shared TypeScript interfaces & types
│   ├── App.tsx                # Core application entry and routing
│   └── main.tsx               # DOM mount point
├── DOCUMENTATION.txt          # In-depth technical breakdown & limitations
├── metadata.json              # Applet metadata
├── package.json               # Dependencies and scripts
└── vite.config.ts             # Vite build configuration
```

---

## 📄 License

This project is licensed under the MIT License.
