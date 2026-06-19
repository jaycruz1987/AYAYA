const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src/app', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Backgrounds
    content = content.replace(/bg-gray-50/g, 'bg-brand-gray');
    content = content.replace(/bg-white/g, 'bg-brand-surface');
    
    // Texts
    content = content.replace(/text-gray-800/g, 'text-brand-charcoal');
    content = content.replace(/text-gray-900/g, 'text-brand-charcoal');
    content = content.replace(/text-gray-500/g, 'text-brand-accent');
    content = content.replace(/text-gray-600/g, 'text-brand-accent');
    content = content.replace(/text-gray-400/g, 'text-brand-accent/70'); // lighter accent
    
    // Primary actions (blue -> orange for main actions)
    content = content.replace(/bg-blue-600/g, 'bg-brand-orange hover:bg-brand-orange-dark');
    content = content.replace(/bg-blue-500/g, 'bg-brand-orange hover:bg-brand-orange-dark');
    content = content.replace(/text-blue-600/g, 'text-brand-orange');
    content = content.replace(/text-blue-500/g, 'text-brand-orange');
    content = content.replace(/border-blue-600/g, 'border-brand-orange');
    content = content.replace(/border-blue-500/g, 'border-brand-orange');
    content = content.replace(/bg-blue-50/g, 'bg-brand-orange-light');
    content = content.replace(/text-blue-100/g, 'text-brand-orange-light');
    content = content.replace(/border-blue-200/g, 'border-brand-orange-light');
    content = content.replace(/bg-blue-100/g, 'bg-brand-orange-light');
    
    // Replace gray backgrounds for placeholders
    content = content.replace(/bg-gray-100/g, 'bg-brand-gray border border-brand-accent/10');
    content = content.replace(/bg-gray-200/g, 'bg-brand-gray border border-brand-accent/20');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
