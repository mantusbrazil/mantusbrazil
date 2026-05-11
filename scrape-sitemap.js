const https = require('https');
const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, 'img');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 15000 
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath);
    const req = https.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 20000 
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlink(filepath, () => {});
        downloadImage(response.headers.location.startsWith('http') ? response.headers.location : new URL(response.headers.location, url).href, filepath).then(resolve);
        return;
      }
      if (response.statusCode !== 200) { file.close(); fs.unlink(filepath, () => resolve(false)); return; }
      response.pipe(file);
      file.on('finish', () => { file.close(); const stats = fs.statSync(filepath); if (stats.size < 100) { fs.unlink(filepath, () => resolve(false)); } else { resolve(true); } });
    });
    req.on('error', () => { file.close(); fs.unlink(filepath, () => resolve(false)); });
  });
}

async function main() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

  // Product mappings: what we need
  const needed = {
    'real-madrid-1-2627.jpg': ['Real Madrid I', 'real-madrid'],
    'real-madrid-1-2627-2.jpg': ['Real Madrid I', 'real-madrid'],
    'espanha-1-2627.jpg': ['Espanha I', 'espanha'],
    'espanha-2-2627.jpg': ['Espanha II', 'espanha'],
    'portugal-1-2627.jpg': ['Portugal I', 'portugal'],
    'portugal-2-2627.jpg': ['Portugal II', 'portugal'],
    'argentina-2-2627.jpg': ['Argentina II', 'argentina'],
    'inglaterra-1-2627.jpg': ['Inglaterra I', 'inglaterra'],
    'inglaterra-1-2627-2.jpg': ['Inglaterra I', 'inglaterra'],
    'franca-1-2627.jpg': ['França I', 'franca'],
    'franca-2-2627.jpg': ['França II', 'franca'],
    'colombia-1-2627.jpg': ['Colômbia I', 'colombia'],
    'colombia-1-2627-2.jpg': ['Colômbia I', 'colombia'],
    'holanda-1-2627.jpg': ['Holanda I', 'holanda'],
    'holanda-1-2627-2.jpg': ['Holanda I', 'holanda'],
    'italia-1-2627.jpg': ['Itália I', 'italia'],
    'italia-1-2627-2.jpg': ['Itália I', 'italia'],
    'estados-unidos-1-2627.jpg': ['EUA I', 'estados-unidos'],
    'estados-unidos-1-2627-2.jpg': ['EUA I', 'estados-unidos'],
    'corinthians-1-2627.jpg': ['Corinthians I', 'corinthians'],
    'corinthians-2-2627.jpg': ['Corinthians II', 'corinthians'],
    'barcelona-1-2627.jpg': ['Barcelona I', 'barcelona'],
    'barcelona-1-2627-2.jpg': ['Barcelona I', 'barcelona'],
    'psg-1-2627.jpg': ['PSG I', 'psg'],
    'psg-1-2627-2.jpg': ['PSG I', 'psg'],
    'santos-1-2627.jpg': ['Santos I', 'santos'],
    'santos-1-2627-2.jpg': ['Santos I', 'santos'],
  };

  // Try to fetch product pages from clubsimports (which has the Bayern product with known good URLs)
  console.log("=== clubsimports.com.br ===");
  try {
    const { data } = await fetchUrl('https://www.clubsimports.com/produtos/');
    // Extract all product links
    const links = data.match(/href=["'](\/produtos\/[^"']+)["']/g) || [];
    console.log(`Found ${links.length} product links`);
    
    for (const link of links.slice(0, 50)) {
      const href = link.replace(/href=["']/,'').replace(/["']/,'');
      console.log(`  ${href}`);
    }
  } catch(e) {
    console.log(`Error: ${e.message}`);
  }

  // Check what images we already have
  console.log('\n=== Current image status ===');
  const existingFiles = fs.readdirSync(IMG_DIR).filter(f => f.endsWith('.jpg'));
  for (const filename of Object.keys(needed)) {
    const exists = fs.existsSync(path.join(IMG_DIR, filename));
    if (!exists) {
      console.log(`MISSING: ${filename} (${needed[filename][0]})`);
    }
  }
  
  // Try direct product URLs from evoluasports 
  console.log('\n=== Trying evoluasports direct product pages ===');
  const directUrls = [
    'https://www.evoluasports.com.br/produtos/camisa-real-madrid-i-26-27-nike/',
    'https://www.evoluasports.com.br/produtos/camisa-espanha-i-26-27/',
    'https://www.evoluasports.com.br/produtos/camisa-inglaterra-i-26-27/',
    'https://www.evoluasports.com.br/produtos/camisa-franca-i-26-27/',
    'https://www.evoluasports.com.br/produtos/camisa-italia-26-27/',
    'https://www.evoluasports.com.br/produtos/camisa-portugal-26-27/',
    'https://www.evoluasports.com.br/produtos/camisa-corinthians-26-27/',
    'https://www.evoluasports.com.br/produtos/camisa-barcelona-26-27/',
    'https://www.evoluasports.com.br/produtos/camisa-psg-26-27/',
    'https://www.evoluasports.com.br/produtos/camisa-santos-26-27/',
  ];
  
  for (const url of directUrls) {
    try {
      const { data } = await fetchUrl(url);
      const imgUrls = [];
      const imgRegex = /https?:\/\/[^"']*acdn-us\.mitiendanube\.com\/stores\/[^"']+\.(?:jpg|webp|png)[^"']*/gi;
      let m;
      while ((m = imgRegex.exec(data)) !== null) {
        imgUrls.push(m[0].split('?')[0]);
      }
      const unique = [...new Set(imgUrls)];      
      if (unique.length > 0) {
        const productName = url.split('/').filter(s => s).pop() || url;
        console.log(`\n${productName}:`);
        unique.slice(0, 4).forEach((u, idx) => console.log(`  [${idx}] ${u.replace(/-\d+-\d+\.(webp|jpg|png)/, '-1024-1024.$1')}`));
      }
    } catch(e) {
      // Product page not found, skip
    }
  }
}

main();