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
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath);
    const req = https.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 30000 
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlink(filepath, () => {});
        downloadImage(response.headers.location, filepath).then(resolve);
        return;
      }
      if (response.statusCode !== 200) { file.close(); resolve(false); return; }
      response.pipe(file);
      file.on('finish', () => { file.close(); const stats = fs.statSync(filepath); if (stats.size < 100) { fs.unlink(filepath, () => resolve(false)); } else { resolve(true); } });
    });
    req.on('error', () => { file.close(); resolve(false); });
  });
}

async function main() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

  // Known working pattern from clubsimports - they use Shopify/Nuvemshop
  // Let's try direct product page access
  const products = [
    { slug: 'camisa-real-madrid-i-26-27', names: ['real-madrid-1-2627.jpg', 'real-madrid-1-2627-2.jpg'] },
    { slug: 'camisa-brasil-i-26-27', names: ['brasil-1-2627-1.jpg'] },
    { slug: 'camisa-brasil-ii-26-27', names: ['brasil-2-2627.jpg'] },
    { slug: 'camisa-argentina-i-26-27', names: ['argentina-1-2627-1.jpg', 'argentina-1-2627-2.jpg'] },
    { slug: 'camisa-argentina-ii-26-27', names: ['argentina-2-2627.jpg'] },
    { slug: 'camisa-espanha-i-26-27', names: ['espanha-1-2627.jpg'] },
    { slug: 'camisa-espanha-ii-26-27', names: ['espanha-2-2627.jpg'] },
    { slug: 'camisa-portugal-i-26-27', names: ['portugal-1-2627.jpg'] },
    { slug: 'camisa-portugal-ii-26-27', names: ['portugal-2-2627.jpg'] },
    { slug: 'camisa-inglaterra-i-26-27', names: ['inglaterra-1-2627.jpg', 'inglaterra-1-2627-2.jpg'] },
    { slug: 'camisa-franca-i-26-27', names: ['franca-1-2627.jpg', 'franca-1-2627-2.jpg'] },
    { slug: 'camisa-franca-ii-26-27', names: ['franca-2-2627.jpg', 'franca-2-2627-2.jpg'] },
    { slug: 'camisa-colombia-i-26-27', names: ['colombia-1-2627.jpg', 'colombia-1-2627-2.jpg'] },
    { slug: 'camisa-holanda-i-26-27', names: ['holanda-1-2627.jpg', 'holanda-1-2627-2.jpg'] },
    { slug: 'camisa-italia-i-26-27', names: ['italia-1-2627.jpg', 'italia-1-2627-2.jpg'] },
    { slug: 'camisa-estados-unidos-i-26-27', names: ['estados-unidos-1-2627.jpg'] },
    { slug: 'camisa-corinthians-i-26-27', names: ['corinthians-1-2627.jpg'] },
    { slug: 'camisa-corinthians-ii-26-27', names: ['corinthians-2-2627.jpg'] },
    { slug: 'camisa-barcelona-i-26-27', names: ['barcelona-1-2627.jpg', 'barcelona-1-2627-2.jpg'] },
    { slug: 'camisa-psg-i-26-27', names: ['psg-1-2627.jpg', 'psg-1-2627-2.jpg'] },
    { slug: 'camisa-santos-i-26-27', names: ['santos-1-2627.jpg', 'santos-1-2627-2.jpg'] },
  ];

  const domains = [
    { name: 'clubsimports', urlPattern: 'https://www.clubsimports.com/produtos/{slug}/' },
  ];

  for (const product of products) {
    for (const domain of domains) {
      const url = domain.urlPattern.replace('{slug}', product.slug);
      try {
        console.log(`\n${product.slug} @ ${domain.name}:`);
        const html = await fetchUrl(url);
        
        // Find product image URLs - clubsimports uses Shopify-like structure
        // Check for og:image first
        const ogMatch = html.match(/<meta\s+property="og:image"[^>]*content="([^"]+)"/i);
        
        // Look for all product images
        const imgRegex = /https?:\/\/[^"']*?acdn-us\.mitiendanube\.com\/stores\/[^"']*?products\/([^"']*?-\d+-\d+)\.(webp|jpg|png)/gi;
        const urls = [];
        let m;
        while ((m = imgRegex.exec(html)) !== null) {
          const fullUrl = m[0].split('?')[0];
          urls.push(fullUrl);
        }
        
        // Check for JSON-LD structured data
        const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
        if (jsonLdMatch) {
          try {
            const jsonLd = JSON.parse(jsonLdMatch[1]);
            if (jsonLd.image) {
              const images = Array.isArray(jsonLd.image) ? jsonLd.image : [jsonLd.image];
              images.forEach(img => {
                if (typeof img === 'string' && !urls.includes(img)) urls.push(img);
              });
            }
          } catch(e) {}
        }
        
        const unique = [...new Set(urls.filter(u => !u.includes('theme') && !u.includes('logo')))];
        
        if (ogMatch) console.log(`  og:image: ${ogMatch[1]}`);
        if (unique.length > 0) {
          console.log(`  Found ${unique.length} unique image URLs`);
          
          // Try to download images
          for (let i = 0; i < Math.min(unique.length, product.names.length); i++) {
            let imgUrl = unique[i];
            // Try largest size
            imgUrl = imgUrl.replace(/-\d+-\d+\.(webp|jpg|png)$/, '-1024-1024.$1');
            
            const filename = product.names[i];
            const filepath = path.join(IMG_DIR, filename);
            
            if (!fs.existsSync(filepath)) {
              console.log(`  Downloading ${filename}...`);
              const success = await downloadImage(imgUrl, filepath);
              if (success) {
                console.log(`    ✓ Saved`);
              } else {
                // Try smaller size
                const altUrl = unique[i].replace(/-\d+-\d+\.(webp|jpg|png)$/, '-640-0.$1');
                const success2 = await downloadImage(altUrl, filepath);
                if (success2) console.log(`    ✓ Saved (640px)`);
                else console.log(`    ✗ Failed`);
              }
            }
          }
          break; // Found on this domain
        } else {
          console.log(`  No product images found`);
        }
      } catch(e) {
        console.log(`  ${url}: Error - ${e.message}`);
      }
    }
  }
}

main();