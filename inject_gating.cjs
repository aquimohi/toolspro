const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(file, 'utf8');

const originalFunc = `  const handleSelectTool = (id: ToolId) => {
    setActiveTool(id);
    setViewMode('tool');
    localStorage.setItem('active_web_tool', id);`;

const newFunc = `  const handleSelectTool = (id: ToolId) => {
    const toolMeta = TOOLS.find(t => t.id === id);
    if (!toolMeta) return;

    const userTier = currentUser?.tier || 'free';
    const toolTier = toolMeta.tier || 'basic';

    let isAllowed = false;
    if (toolTier === 'basic') isAllowed = true;
    else if (toolTier === 'advance' && (userTier === 'pro' || userTier === 'enterprise' || userTier === 'admin')) isAllowed = true;
    else if (toolTier === 'premium' && (userTier === 'enterprise' || userTier === 'admin')) isAllowed = true;

    if (!isAllowed) {
      setIsSubscriptionModalOpen(true);
      return;
    }

    setActiveTool(id);
    setViewMode('tool');
    localStorage.setItem('active_web_tool', id);`;

content = content.replace(originalFunc, newFunc);
fs.writeFileSync(file, content);
console.log('App.tsx handleSelectTool updated.');
