const https = require('https');
const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, 'img');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 15000,
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath);
    const req = https.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 30000,
      rejectUnauthorized: false
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        downloadImage(response.headers.location, filepath).then(resolve);
        return;
      }
      if (response.statusCode !== 200) { file.close(); resolve(false); return; }
      response.pipe(file);
      file.on('finish', () => { file.close(); const stats = fs.statSync(filepath); if (stats.size < 100) { fs.unlinkSync(filepath); resolve(false); } else resolve(true); });
    });
    req.on('error', () => { file.close(); if (fs.existsSync(filepath)) fs.unlinkSync(filepath); resolve(false); });
  });
}

async function main() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

  if (!fs.existsSync(IMG_DIR)) {
    console.log('Creating img directory');
    fs.mkdirSync(IMG_DIR, { recursive: true });
  }

  // First, let's get product sitemap from evoluasports
  console.log('=== Fetching sitemap from evoluasports ===');
  try {
    const sitemap = await fetchUrl('https://www.evoluasports.com.br/sitemap.xml');
    // Find product URLs
    const productUrls = sitemap.match(/<loc>([^<]*\/produtos\/[^<]+)<\/loc>/g) || [];
    console.log(`Found ${productUrls.length} product URLs in sitemap`);
    
    // Filter for our products
    const ourKeywords = ['real-madrid', 'espanha', 'portugal', 'argentina', 'inglaterra', 'franca', 'colombia', 'holanda', 'italia', 'corinthians', 'barcelona', 'psg', 'santos', 'estados-unidos'];
    
    for (const urlStr of productUrls.slice(0, 200)) {
      const productUrl = urlStr.replace(/<\/?loc>/g, '');
      const hasKeyword = ourKeywords.some(k => productUrl.includes(k));
      if (!hasKeyword) continue;
      
      try {
        console.log(`\nFetching: ${productUrl}`);
        const html = await fetchUrl(productUrl);
        
        // Find image URLs from the product page
        const images = [];
        
        // Try JSON-LD first
        const jsonMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
        if (jsonMatch) {
          try {
            const json = JSON.parse(jsonMatch[1]);
            if (json.image) {
              const imgs = Array.isArray(json.image) ? json.image : [json.image];
              imgs.forEach(i => { if (typeof i === 'string' && !images.includes(i)) images.push(i); });
            }
          } catch(e) {}
        }
        
        // Find in data-variants or similar
        const dataImages = html.match(/https:\/\/acdn-us\.mitiendanube\.com\/stores\/[^"']+products\/([^"']+?)(-\d+-\d+)?\.(webp|jpg|png)/gi);
        if (dataImages) {
          dataImages.forEach(url => {
            const clean = url.split('?')[0];
            if (!clean.includes('theme') && !clean.includes('logo') && !images.includes(clean)) {
              images.push(clean);
            }
          });
        }
        
        if (images.length > 0) {
          const unique = [...new Set(images)];
          console.log(`  Found ${unique.length} images`);
          unique.slice(0, 3).forEach(u => console.log(`    ${u}`));
        }
      } catch(e) {
        console.log(`  Error: ${e.message}`);
      }
    }
  } catch(e) {
    console.log(`Sitemap error: ${e.message}`);
  }
}

main();