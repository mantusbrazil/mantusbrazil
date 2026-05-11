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
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
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
        const redirectUrl = response.headers.location.startsWith('http') 
          ? response.headers.location 
          : new URL(response.headers.location, url).href;
        downloadImage(redirectUrl, filepath).then(resolve);
        return;
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(filepath, () => resolve(false));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(filepath);
        if (stats.size < 100) {
          fs.unlink(filepath, () => resolve(false));
        } else {
          resolve(true);
        }
      });
    });
    
    req.on('error', () => { file.close(); fs.unlink(filepath, () => resolve(false)); });
    req.on('timeout', () => { req.destroy(); file.close(); fs.unlink(filepath, () => resolve(false)); });
  });
}

async function extractAndDownloadImages(html, storeName, outputNames) {
  // Find all product image URLs from the HTML
  const imgUrls = [];
  const imgRegex = /https?:\/\/[^"']+\.(jpg|webp|png|jpeg)[^"']*/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const url = match[0].split('?')[0]; // remove query params
    if (!url.includes('theme') && !url.includes('logo') && !url.includes('banner') && !url.includes('placeholder')) {
      imgUrls.push(url);
    }
  }

  // Filter to product image CDN URLs (Nuvemshop pattern)
  const productImages = [...new Set(imgUrls.filter(u => u.includes('acdn-us.mitiendanube.com/stores')))];
  
  console.log(`\n${storeName}: Found ${productImages.length} unique product images`);
  
  if (productImages.length > 0) {
    // Try large sizes
    for (const url of productImages) {
      const largeUrl = url.replace(/-\d+-\d+\.(webp|jpg|png)/, '-1024-1024.$1');
      console.log(`  ${largeUrl}`);
      
      // Try to download to each of our expected filenames
      for (const name of outputNames) {
        const filepath = path.join(IMG_DIR, name);
        if (!fs.existsSync(filepath)) {
          const result = await downloadImage(largeUrl, filepath);
          if (result) {
            console.log(`    ✓ Saved as ${name}`);
            break;
          }
        }
      }
    }
  }
}

async function main() {
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });

  // Try clubsimports for specific products
  console.log('=== Trying Clubs Imports ===');
  const clubProdutos = [
    { slug: 'camisa-bayern-de-munique-ii-25-26', names: ['bayern-de-munique-2-2526-1.jpg'] },
  ];
  
  for (const p of clubProdutos) {
    try {
      const { data, headers } = await fetchUrl(`https://www.clubsimports.com/produtos/${p.slug}/`);
      const imgUrls = [];
      const imgRegex = /https?:\/\/[^"']+\.(jpg|webp|png)[^"']*/gi;
      let match;
      while ((match = imgRegex.exec(data)) !== null) {
        imgUrls.push(match[0].split('?')[0]);
      }
      console.log(`\n${p.slug}:`);
      const uniqueUrls = [...new Set(imgUrls.filter(u => !u.includes('logo') && !u.includes('icon')))];
      uniqueUrls.slice(0, 5).forEach(u => console.log(`  ${u}`));
    } catch(e) {
      console.log(`  Error: ${e.message}`);
    }
  }

  // Try evoluasports product search
  console.log('\n=== Searching Evolua Sports ===');
  const searches = [
    { q: 'real-madrid-26-27', names: ['real-madrid-1-2627.jpg', 'real-madrid-1-2627-1.jpg', 'real-madrid-1-2627-2.jpg'] },
    { q: 'espanha-26-27', names: ['espanha-1-2627.jpg', 'espanha-2-2627.jpg'] },
    { q: 'portugal-26-27', names: ['portugal-1-2627.jpg', 'portugal-2-2627.jpg'] },
    { q: 'argentina-26-27', names: ['argentina-2-2627.jpg'] },
    { q: 'inglaterra-26-27', names: ['inglaterra-1-2627.jpg', 'inglaterra-1-2627-2.jpg'] },
    { q: 'franca-26-27', names: ['franca-1-2627.jpg', 'franca-2-2627.jpg'] },
    { q: 'colombia-26-27', names: ['colombia-1-2627.jpg', 'colombia-1-2627-2.jpg'] },
    { q: 'holanda-26-27', names: ['holanda-1-2627.jpg', 'holanda-1-2627-2.jpg'] },
    { q: 'italia-26-27', names: ['italia-1-2627.jpg', 'italia-1-2627-2.jpg'] },
    { q: 'corinthians-26-27', names: ['corinthians-1-2627.jpg', 'corinthians-2-2627.jpg'] },
    { q: 'barcelona-26-27', names: ['barcelona-1-2627.jpg', 'barcelona-1-2627-2.jpg'] },
    { q: 'psg-26-27', names: ['psg-1-2627.jpg', 'psg-1-2627-2.jpg'] },
    { q: 'santos-26-27', names: ['santos-1-2627.jpg', 'santos-1-2627-2.jpg'] },
    { q: 'estados-unidos-26-27', names: ['estados-unidos-1-2627.jpg', 'estados-unidos-1-2627-2.jpg'] },
  ];

  const domains = ['evoluasports.com.br', 'casadomantojc.com.br', 'netshirtsbr.com.br'];
  
  for (const s of searches) {
    for (const domain of domains) {
      try {
        const baseUrl = domain === 'evoluasports.com.br' 
          ? `https://www.${domain}/busca/${s.q}?q=${s.q}`
          : `https://www.${domain}/busca/${s.q}?q=${s.q}`;
        
        const { data } = await fetchUrl(baseUrl);
        
        // Find first product link
        const linkMatch = data.match(/href=["'](\/[^"']*(?:real-madrid|espanha|portugal|argentina|inglaterra|franca|colombia|holanda|italia|corinthians|barcelona|psg|santos|estados-unidos)[^"']*)["']/i);
        
        if (linkMatch) {
          const productUrl = `https://www.${domain}${linkMatch[1]}`;
          console.log(`\n${s.q} @ ${domain}:`);
          console.log(`  Product page: ${productUrl}`);
          
          const { data: productData } = await fetchUrl(productUrl);
          
          // Extract all image URLs
          const imgUrls = [];
          const imgRegex = /https?:\/\/[^"']+\.(jpg|webp|png)[^"']*/gi;
          let m;
          while ((m = imgRegex.exec(productData)) !== null) {
            const url = m[0].split('?')[0];
            if (url.includes('acdn-us.mitiendanube.com/stores')) {
              imgUrls.push(url);
            }
          }
          
          const uniqueUrls = [...new Set(imgUrls)];
          console.log(`  Found ${uniqueUrls.length} product images`);
          
          if (uniqueUrls.length > 0) {
            // Try to download each unique image size to each filename
            for (let i = 0; i < Math.min(uniqueUrls.length, s.names.length); i++) {
              const imgUrl = uniqueUrls[i].replace(/-\d+-\d+\.(webp|jpg|png)/, '-1024-1024.$1');
              const filename = s.names[i];
              const filepath = path.join(IMG_DIR, filename);
              
              if (!fs.existsSync(filepath)) {
                console.log(`  Downloading: ${filename}`);
                const result = await downloadImage(imgUrl, filepath);
                if (result) {
                  console.log(`    ✓ Saved`);
                } else {
                  // Try original URL
                  const result2 = await downloadImage(uniqueUrls[i].replace(/-\d+-\d+\.(webp|jpg|png)/, '-640-0.$1'), filepath);
                  if (result2) console.log(`    ✓ Saved (640px)`);
                  else console.log(`    ✗ Failed`);
                }
              } else {
                console.log(`  Already exists: ${filename}`);
              }
            }
          }
          break; // Found on this domain, move to next search
        }
      } catch(e) {
        // Skip if domain doesn't have this product
      }
    }
  }
}

main();