const fs = require('fs');
const path = require('path');

const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(appTsxPath, 'utf8');

const basicTools = [
  'word-counter',
  'text-compare',
  'audio-joiner',
  'pdf-merge',
  'pdf-to-jpg',
  'image-resizer',
  'format-converter',
  'video-downloader',
  'age-calculator',
  'json-formatter'
];

const premiumTools = [
  'pdf-ai-summarize',
  'pdf-ai-translate',
  'youtube-desc-gen',
  'youtube-tags-gen',
  'code-minifier'
];

// Regex to find each tool block in the TOOLS array
// It matches { id: 'some-id', ... } and adds tier: '...', before the closing }
const toolRegex = /({\s*id:\s*'([^']+)',[\s\S]*?)(^  },?)/gm;

content = content.replace(toolRegex, (match, p1, id, p3) => {
  let tier = 'advance';
  if (basicTools.includes(id)) {
    tier = 'basic';
  } else if (premiumTools.includes(id)) {
    tier = 'premium';
  }
  
  // check if tier already exists, if so skip
  if (p1.includes('tier:')) return match;

  return p1 + `    tier: '${tier}',\n` + p3;
});

fs.writeFileSync(appTsxPath, content);
console.log('Tools successfully categorized!');
