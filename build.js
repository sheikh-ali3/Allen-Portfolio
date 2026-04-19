const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy public assets if they exist
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
    copyDir(publicDir, distDir);
}

// Copy assets folder
const assetsDir = path.join(__dirname, 'assets');
if (fs.existsSync(assetsDir)) {
    const distAssets = path.join(distDir, 'assets');
    copyDir(assetsDir, distAssets);
}

// Render EJS templates
const viewsDir = path.join(__dirname, 'views');
const templates = ['index', 'experience', 'training'];

templates.forEach(template => {
    const templatePath = path.join(viewsDir, `${template}.ejs`);
    if (fs.existsSync(templatePath)) {
        const html = ejs.render(fs.readFileSync(templatePath, 'utf8'), {
            title: template === 'index' ? 'Allen Whales - Dispatch Manager Portfolio' : 
                   template === 'experience' ? 'Experience - Allen Whales' : 
                   'Training Services - Allen Whales',
            name: 'Allen Whales'
        });
        
        const outputFile = template === 'index' ? 'index.html' : `${template}.html`;
        fs.writeFileSync(path.join(distDir, outputFile), html);
        console.log(`Built ${outputFile}`);
    }
});

console.log('Build complete!');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
