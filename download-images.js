const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, 'img');

// Products that need images (main image only, variations will be auto-detected)
const missingImages = [
  // 26/27 Season Products
  { filename: 'real-madrid-1-2627.jpg', url: 'https://www.casadomantojc.com.br/cdn/shop/files/real-madrid-1-2627.jpg' },
  { filename: 'espanha-1-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/espanha-1-2627.jpg' },
  { filename: 'espanha-2-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/espanha-2-2627.jpg' },
  { filename: 'portugal-1-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/portugal-1-2627.jpg' },
  { filename: 'portugal-2-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/portugal-2-2627.jpg' },
  { filename: 'argentina-2-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/argentina-2-2627.jpg' },
  { filename: 'inglaterra-1-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/inglaterra-1-2627.jpg' },
  { filename: 'franca-1-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/franca-1-2627.jpg' },
  { filename: 'franca-2-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/franca-2-2627.jpg' },
  { filename: 'colombia-1-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/colombia-1-2627.jpg' },
  { filename: 'holanda-1-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/holanda-1-2627.jpg' },
  { filename: 'italia-1-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/italia-1-2627.jpg' },
  { filename: 'estados-unidos-1-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/estados-unidos-1-2627.jpg' },
  { filename: 'corinthians-1-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/corinthians-1-2627.jpg' },
  { filename: 'corinthians-2-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/corinthians-2-2627.jpg' },
  { filename: 'barcelona-1-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/barcelona-1-2627.jpg' },
  { filename: 'psg-1-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/psg-1-2627.jpg' },
  { filename: 'santos-1-2627.jpg', url: 'https://netshirtsbr.com.br/cdn/shop/files/santos-1-2627.jpg' },
];

function downloadImage(url, filepath) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath);
    
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 15000 
    }, (response) => {
      // If redirect, follow it
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlink(filepath, () => {});
        const redirectUrl = response.headers.location.startsWith('http') 
          ? response.headers.location 
          : new URL(response.headers.location, url).href;
        downloadImage(redirectUrl, filepath).then(resolve);
        return;
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(filepath, () => {});
        resolve(false);
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        // Verify the file has content
        const stats = fs.statSync(filepath);
        if (stats.size < 100) {
          fs.unlink(filepath, () => {});
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
    
    req.on('error', () => {
      file.close();
      fs.unlink(filepath, () => {});
      resolve(false);
    });
    
    req.on('timeout', () => {
      req.destroy();
      file.close();
      fs.unlink(filepath, () => {});
      resolve(false);
    });
  });
}

async function tryDownloadAlternatives(filename) {
  const nameWithoutExt = filename.replace('.jpg', '');
  
  // Try different store URLs
  const stores = [
    `https://netshirtsbr.com.br/cdn/shop/files/${filename}`,
    `https://www.casadomantojc.com.br/cdn/shop/files/${filename}`,
    `https://www.evoluasports.com.br/cdn/shop/files/${filename}`,
  ];
  
  for (const storeUrl of stores) {
    console.log(`  Trying: ${storeUrl}`);
    const result = await downloadImage(storeUrl, path.join(IMG_DIR, filename));
    if (result) {
      console.log(`  ✓ Downloaded: ${filename}`);
      return true;
    }
  }
  
  return false;
}

async function main() {
  console.log('Starting download of missing product images...\n');
  
  if (!fs.existsSync(IMG_DIR)) {
    fs.mkdirSync(IMG_DIR, { recursive: true });
  }

  let success = 0;
  let failed = 0;

  for (const item of missingImages) {
    const filepath = path.join(IMG_DIR, item.filename);
    
    if (fs.existsSync(filepath)) {
      console.log(`  Already exists: ${item.filename}`);
      success++;
      continue;
    }
    
    process.stdout.write(`Downloading: ${item.filename}... `);
    const result = await tryDownloadAlternatives(item.filename);
    
    if (result) {
      success++;
    } else {
      console.log(`  ✗ Failed: ${item.filename}`);
      failed++;
    }
  }
  
  console.log(`\nDone! ${success} downloaded, ${failed} failed`);
}

main().catch(console.error);