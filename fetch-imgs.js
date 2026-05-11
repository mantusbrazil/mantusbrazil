const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, 'img');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 15000
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve) => {
    // Ensure https://
    if (url.startsWith('//')) url = 'https:' + url;
    else if (url.startsWith('http://')) url = url.replace('http://', 'https://');
    
    const file = fs.createWriteStream(filepath);
    const req = https.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 30000 
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        downloadImage(response.headers.location, filepath).then(resolve);
        return;
      }
      if (response.statusCode !== 200) { file.close(); resolve(false); return; }
      response.pipe(file);
      file.on('finish', () => { file.close(); try { const stats = fs.statSync(filepath); if (stats.size < 100) { fs.unlinkSync(filepath); resolve(false); } else resolve(true); } catch(e) { resolve(false); } });
    });
    req.on('error', () => { file.close(); try { if (fs.existsSync(filepath)) fs.unlinkSync(filepath); } catch(e) {} resolve(false); });
  });
}

async function main() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

  const productUrls = [
    { url: 'https://www.evoluasports.com.br/produtos/camisa-argentina-home-1-2026-adidas-torcedor-masculina-g990l/', names: ['argentina-1-2627-1.jpg'] },
    { url: 'https://www.evoluasports.com.br/produtos/camisa-espanha-home-1-2026-adidas-torcedor-masculina-1vlx4/', names: ['espanha-1-2627.jpg'] },
    { url: 'https://www.evoluasports.com.br/produtos/camisa-portugal-home-1-2026-puma-torcedor-masculina-tegyg/', names: ['portugal-1-2627.jpg'] },
    { url: 'https://www.evoluasports.com.br/produtos/camisa-italia-home-1-2026-adidas-torcedor-masculina-6lrl0/', names: ['italia-1-2627.jpg'] },
    { url: 'https://www.evoluasports.com.br/produtos/camisa-colombia-home-1-2026-adidas-torcedor-masculina-lwfny/', names: ['colombia-1-2627.jpg'] },
    { url: 'https://www.evoluasports.com.br/produtos/camisa-corinthians-home-1-2025-26-nike-torcedor-masculina/', names: ['corinthians-1-2627.jpg'] },
    { url: 'https://www.evoluasports.com.br/produtos/camisa-real-madrid-home-1-2025-26-adidas-torcedor-masculina/', names: ['real-madrid-1-2627.jpg'] },
    { url: 'https://www.evoluasports.com.br/produtos/camisa-barcelona-home-1-2025-26-nike-torcedor-masculina/', names: ['barcelona-1-2627.jpg'] },
    { url: 'https://www.evoluasports.com.br/produtos/camisa-psg-home-1-2025-26-nike-torcedor-masculina/', names: ['psg-1-2627.jpg'] },
    { url: 'https://www.evoluasports.com.br/produtos/camisa-santos-home-1-2025-26-torcedor-masculina/', names: ['santos-1-2627.jpg'] },
    // Additional products from casadomanto
    { url: 'https://www.casadomantojc.com.br/produtos/camisa-portugal-i-2026-copa-do-mundo-masculino-jogador-vermelho-en15h/', names: ['portugal-2-2627.jpg'] },
    { url: 'https://www.casadomantojc.com.br/produtos/camisa-holanda-i-2026-copa-do-mundo-masculino-jogador-laranja-g318b/', names: ['holanda-1-2627.jpg'] },
    { url: 'https://www.casadomantojc.com.br/produtos/camisa-holanda-ii-2026-copa-do-mundo-masculino-jogador-branco-ddfrx/', names: ['holanda-1-2627-2.jpg'] },
  ];

  let success = 0;
  let failed = 0;

  for (const product of productUrls) {
    console.log(`\n${product.url}`);
    
    try {
      const html = await fetchUrl(product.url);
      if (!html || html.length < 100) { console.log('  Failed to fetch page'); failed++; continue; }
      
      // Find all product image URLs (Nuvemshop CDN) - handle both http and https and // protocol-relative
      const imgRegex = /(?:https?:)?\/\/[^"']*?acdn-us\.mitiendanube\.com\/stores\/[^"']*?products\/([^"']+?)(?:-\d+-\d+)?\.(?:webp|jpg|png)[^"']*/gi;
      const allUrls = [];
      let m;
      while ((m = imgRegex.exec(html)) !== null) {
        let url = m[0].split('?')[0];
        if (url.startsWith('//')) url = 'https:' + url;
        else if (url.startsWith('http://')) url = url.replace('http://', 'https://');
        if (!url.includes('theme') && !url.includes('logo')) allUrls.push(url);
      }
      
      const unique = [...new Set(allUrls)];
      console.log(`  Found ${unique.length} product image URLs`);
      
      if (unique.length > 0) {
        for (let i = 0; i < Math.min(unique.length, product.names.length); i++) {
          const filename = product.names[i];
          const filepath = path.join(IMG_DIR, filename);
          
          if (fs.existsSync(filepath) && fs.statSync(filepath).size > 100) {
            console.log(`  Already exists: ${filename}`);
            success++;
            continue;
          }
          
          // Try 1024 size first
          let imgUrl = unique[i].replace(/-\d+-\d+\.(webp|jpg|png)$/, '-1024-1024.$1');
          console.log(`  Downloading ${filename}...`);
          
          let result = await downloadImage(imgUrl, filepath);
          if (!result) {
            imgUrl = unique[i].replace(/-\d+-\d+\.(webp|jpg|png)$/, '-640-0.$1');
            result = await downloadImage(imgUrl, filepath);
          }
          if (!result) {
            result = await downloadImage(unique[i], filepath);
          }
          if (!result) {
            // Try as webp with different extensions
            imgUrl = unique[i].replace(/-\d+-\d+\.(webp|jpg|png)$/, '-1024-1024.webp');
            result = await downloadImage(imgUrl, filepath);
          }
          
          if (result) { console.log('    ✓ Saved as ' + filename); success++; }
          else { console.log('    ✗ Failed: ' + filename); failed++; }
        }
      } else {
        console.log('  No product images found');
        failed++;
      }
    } catch(e) {
      console.log(`  Error: ${e.message}`);
      failed++;
    }
  }
  
  console.log(`\nDone! Success: ${success}, Failed: ${failed}`);
}

main();