const https = require('https');
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

async function downloadImagesFromPage(url, filenames) {
  try {
    const html = await fetchUrl(url);
    if (!html || html.length < 100) { console.log('  Failed to fetch page'); return 0; }

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
    console.log(`  Found ${unique.length} image URLs`);
    let count = 0;

    for (let i = 0; i < Math.min(unique.length, filenames.length); i++) {
      const filename = filenames[i];
      const filepath = path.join(IMG_DIR, filename);

      if (fs.existsSync(filepath) && fs.statSync(filepath).size > 100) {
        console.log(`  Already exists: ${filename}`);
        continue;
      }

      let imgUrl = unique[i].replace(/-\d+-\d+\.(webp|jpg|png)$/, '-1024-1024.$1');
      let result = await downloadImage(imgUrl, filepath);
      if (!result) {
        imgUrl = unique[i].replace(/-\d+-\d+\.(webp|jpg|png)$/, '-640-0.$1');
        result = await downloadImage(imgUrl, filepath);
      }
      if (!result) result = await downloadImage(unique[i], filepath);

      if (result) { console.log(`  ✓ Saved: ${filename}`); count++; }
      else { console.log(`  ✗ Failed: ${filename}`); }
    }
    return count;
  } catch(e) {
    console.log(`  Error: ${e.message}`);
    return 0;
  }
}

async function main() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

  const products = [
    // França I 26/27 - using away product page to get images
    { url: 'https://www.evoluasports.com.br/produtos/camisa-franca-away-2-2026-nike-torcedor-masculina-vjqey/', names: ['franca-2-2627.jpg', 'franca-2-2627-2.jpg'] },
    // França I 26/27 home
    { url: 'https://www.casadomantojc.com.br/produtos/camisa-franca-i-2026-copa-do-mundo-masculino-jogador/', names: ['franca-1-2627.jpg', 'franca-1-2627-2.jpg'] },
    // Inglaterra I 26/27
    { url: 'https://www.evoluasports.com.br/produtos/camisa-inglaterra-home-1-2026-nike-torcedor-masculina-axewi/', names: ['inglaterra-1-2627.jpg', 'inglaterra-1-2627-2.jpg'] },
    // Argentina II 26/27 (away)
    { url: 'https://www.evoluasports.com.br/produtos/camisa-argentina-away-2-2026-adidas-torcedor-masculina-3cves/', names: ['argentina-2-2627.jpg'] },
    // Espanha II 26/27 (away)
    { url: 'https://www.evoluasports.com.br/produtos/camisa-espanha-away-2-2026-adidas-torcedor-masculina-13xqn/', names: ['espanha-2-2627.jpg'] },
    // Estados Unidos I 26/27
    { url: 'https://www.evoluasports.com.br/produtos/camisa-estados-unidos-home-1-2026-nike-torcedor-masculina-13oth/', names: ['estados-unidos-1-2627.jpg', 'estados-unidos-1-2627-2.jpg'] },
    // Corinthians II 26/27 (away)
    { url: 'https://www.evoluasports.com.br/produtos/camisa-corinthians-away-2-2025-26-nike-torcedor-masculina/', names: ['corinthians-2-2627.jpg'] },
    // Try searching for real-madrid-1-2627-2.jpg (second image of Real Madrid)
    { url: 'https://www.evoluasports.com.br/produtos/camisa-real-madrid-home-1-2025-26-adidas-torcedor-masculina/', names: ['real-madrid-1-2627-2.jpg'] },
    // barcelona-1-2627-2.jpg (second image)
    { url: 'https://www.evoluasports.com.br/produtos/camisa-barcelona-home-1-2025-26-nike-torcedor-masculina/', names: ['barcelona-1-2627-2.jpg'] },
    // psg-1-2627-2.jpg (second image)
    { url: 'https://www.evoluasports.com.br/produtos/camisa-psg-home-1-2025-26-nike-torcedor-masculina/', names: ['psg-1-2627-2.jpg'] },
    // santos-1-2627-2.jpg (second image)
    { url: 'https://www.evoluasports.com.br/produtos/camisa-santos-home-1-2025-26-torcedor-masculina/', names: ['santos-1-2627-2.jpg'] },
    // corinthians-1-2627-2.jpg (second image)
    { url: 'https://www.evoluasports.com.br/produtos/camisa-corinthians-home-1-2025-26-nike-torcedor-masculina/', names: ['corinthians-1-2627-2.jpg'] },
    // colombia-1-2627-2.jpg (second image)
    { url: 'https://www.evoluasports.com.br/produtos/camisa-colombia-home-1-2026-adidas-torcedor-masculina-lwfny/', names: ['colombia-1-2627-2.jpg'] },
    // italia-1-2627-2.jpg (second image)
    { url: 'https://www.evoluasports.com.br/produtos/camisa-italia-home-1-2026-adidas-torcedor-masculina-6lrl0/', names: ['italia-1-2627-2.jpg'] },
    // portugal-1-2627-2.jpg (second image)
    { url: 'https://www.evoluasports.com.br/produtos/camisa-portugal-home-1-2026-puma-torcedor-masculina-tegyg/', names: ['portugal-1-2627-2.jpg'] },
  ];

  let total = 0;
  for (const p of products) {
    console.log(`\n${p.names[0]}...`);
    const count = await downloadImagesFromPage(p.url, p.names);
    total += count;
  }
  console.log(`\nDownloaded ${total} new images`);
}

main();