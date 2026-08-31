const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Add PricingPage import
if (!code.includes("PricingPage")) {
  code = code.replace(
    "import { UserManualModal } from './components/UserManualModal';",
    "import { UserManualModal } from './components/UserManualModal';\nimport { PricingPage } from './components/PricingPage';"
  );
}

// 2. Add Pricing to Desktop Nav
if (!code.includes(">Pricing<")) {
  const navTarget = `                <button
                  onClick={() => setViewMode('about')}
                  className={\`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer \${
                    viewMode === 'about'
                      ? 'bg-white text-purple-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }\`}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>About</span>
                </button>`;
                
  const navReplace = navTarget + `\n
                <button
                  onClick={() => setViewMode('pricing')}
                  className={\`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer \${
                    viewMode === 'pricing'
                      ? 'bg-white text-purple-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }\`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pricing</span>
                </button>`;
  code = code.replace(navTarget, navReplace);
}

// 3. Remove "Center: Global Search Bar (Trigger)"
const searchRegex = /\{\/\* Center: Global Search Bar \(Trigger\) \*\/\}.*?(?=\{\/\* Right: Top Action Controls \*\/\})/s;
code = code.replace(searchRegex, '');

// 4. Remove "AI Help", "User Manual Button", "Export & Code Dropdown" from header
const aiHelpRegex = /\{\/\* AI Assistant Chatbot Trigger \*\/\}.*?(?=\{\/\* User Manual Button \*\/\})/s;
code = code.replace(aiHelpRegex, '');

const manualRegex = /\{\/\* User Manual Button \*\/\}.*?(?=\{\/\* Export & Code Dropdown \*\/\})/s;
code = code.replace(manualRegex, '');

const exportRegex = /\{\/\* Export & Code Dropdown \*\/\}.*?(?=\{\/\* User Profile \/ Authentication Menu \*\/\})/s;
code = code.replace(exportRegex, '');

// 5. Add PricingPage rendering in the main body
const renderTarget = `          ) : viewMode === 'about' ? (`;
const renderReplace = `          ) : viewMode === 'pricing' ? (
            /* PRICING PAGE */
            <PricingPage 
              currentUser={currentUser}
              onSelectPlanForCheckout={handleSelectPlanForCheckout}
            />
          ) : viewMode === 'about' ? (`;
if (!code.includes("/* PRICING PAGE */")) {
  code = code.replace(renderTarget, renderReplace);
}

// 6. Replace Footer
const footerRegex = /\{\/\* Clean Minimal Footer \*\/\}\s*<footer className=".*?<\/footer>/s;
const newFooter = `{/* Global Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-xs shrink-0">⚡</div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">Tools Pro</span>
            </div>
            <p className="text-sm text-slate-500 text-center md:text-left max-w-xl">
              Engineered for extreme privacy and sub-millisecond speed. All processing happens locally in your browser. 0 Bytes uploaded to external servers.
            </p>
            <div className="text-xs font-semibold text-slate-400">
              © {new Date().getFullYear()} Tools Pro. All rights reserved.
            </div>
          </div>
        </footer>`;
code = code.replace(footerRegex, newFooter);

fs.writeFileSync(filePath, code, 'utf8');
console.log("App.tsx updated successfully.");
