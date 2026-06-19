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

    content = content.replace(/text-brand-accent\/70/g, 'text-brand-text-accent/70');
    content = content.replace(/text-brand-accent/g, 'text-brand-text-accent');
    content = content.replace(/border-brand-accent\/10/g, 'border-brand-text-accent/10');
    content = content.replace(/border-brand-accent\/20/g, 'border-brand-text-accent/20');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
