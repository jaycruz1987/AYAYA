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

    content = content.replace(/border-gray-100/g, 'border-brand-text-accent/10');
    content = content.replace(/border-gray-50/g, 'border-brand-text-accent/5');
    content = content.replace(/border-gray-200/g, 'border-brand-text-accent/20');
    content = content.replace(/border-gray-300/g, 'border-brand-text-accent/30');
    content = content.replace(/bg-gray-400/g, 'bg-brand-text-accent/30');
    content = content.replace(/bg-gray-900/g, 'bg-brand-charcoal');
    content = content.replace(/placeholder-gray-400/g, 'placeholder-brand-text-accent/50');
    content = content.replace(/text-gray-300/g, 'text-brand-text-accent/30');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated borders and grays in ${filePath}`);
    }
  }
});
