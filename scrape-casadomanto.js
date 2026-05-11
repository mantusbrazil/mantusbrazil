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

async function findAndDownload() {
  // Get casadomanto JSON product data
  const terms = ['26-27', '2627', 'adidas', 'nike'];
  
  for (const term of terms) {
    const searchUrl = `https://www.casadomantojc.com.br/busca/${term}?q=${term}`;
    try {
      console.log(`Searching: ${searchUrl}`);
      const html = await fetchUrl(searchUrl);
      
      // Find product data in JSON-LD or script tags
      const jsonLd = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
      if (jsonLd) {
        console.log(`  Found JSON-LD data`);
      }
      
      // Find product image URLs in the HTML
      const imgRegex = /https:\/\/acdn-us\.mitiendanube\.com\/stores\/[^"']+products\/([^"']+?)(-\d+-\d+)?\.(webp|jpg|png)[^"']*/gi;
      const urls = [];
      let m;
      while ((m = imgRegex.exec(html)) !== null) {
        const url = m[0].split('?')[0];
        const cleanUrl = url.replace(/-\d+-\d+\.(webp|jpg|png)$/, '-1024-1024.$1');
        if (!url.includes('theme') && !url.includes('logo')) {
          urls.push(cleanUrl);
        }
      }
      
      if (urls.length > 0) {
        const unique = [...new Set(urls)];
        console.log(`  Found ${unique.length} product image URLs`);
        unique.slice(0, 5).forEach(u => console.log(`    ${u}`));
        
        // Try to match product names and download
        const productPatterns = [
          { keywords: ['real', 'madrid'], names: ['real-madrid-1-2627.jpg'] },
          { keywords: ['espanha', 'espanha'], names: ['espanha-1-2627.jpg', 'espanha-2-2627.jpg'] },
          { keywords: ['portugal'], names: ['portugal-1-2627.jpg', 'portugal-2-2627.jpg'] },
          { keywords: ['inglaterra'], names: ['inglaterra-1-2627.jpg'] },
          { keywords: ['franca', 'frança'], names: ['franca-1-2627.jpg', 'franca-2-2627.jpg'] },
          { keywords: ['colombia', 'colômbia'], names: ['colombia-1-2627.jpg'] },
          { keywords: ['holanda'], names: ['holanda-1-2627.jpg'] },
          { keywords: ['italia', 'itália'], names: ['italia-1-2627.jpg'] },
          { keywords: ['corinthians'], names: ['corinthians-1-2627.jpg', 'corinthians-2-2627.jpg'] },
          { keywords: ['barcelona'], names: ['barcelona-1-2627.jpg'] },
          { keywords: ['psg'], names: ['psg-1-2627.jpg'] },
          { keywords: ['santos'], names: ['santos-1-2627.jpg'] },
          { keywords: ['argentina'], names: ['argentina-2-2627.jpg'] },
          { keywords: ['estados', 'unidos', 'eua'], names: ['estados-unidos-1-2627.jpg'] },
        ];
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }
  
  // Try product API endpoints
  console.log('\n=== Trying product JSON API ===');
  const apiUrls = [
    'https://www.casadomantojc.com.br/api/products?q=26-27',
    'https://www.casadomantojc.com.br/api/products?q=2627',
    'https://www.casadomantojc.com.br/api/products?q=camisa+26+27',
  ];
  
  for (const url of apiUrls) {
    try {
      const data = await fetchUrl(url);
      console.log(`API ${url}: ${data.substring(0, 300)}`);
    } catch (e) {
      console.log(`API ${url}: Error - ${e.message}`);
    }
  }
  
  // Try to get the JSON version of the store's collection
  // Many Nuvemshop stores have /produtos.json
  console.log('\n=== Trying JSON product feeds ===');
  const jsonUrls = [
    'https://www.casadomantojc.com.br/produtos.json',
    'https://www.casadomantojc.com.br/products.json',
  ];
  
  for (const url of jsonUrls) {
    try {
      const data = await fetchUrl(url);
      console.log(`${url}: ${data.substring(0, 500)}`);
    } catch (e) {
      console.log(`${url}: Error - ${e.message}`);
    }
  }
  
  // Try the search page with more specific queries
  console.log('\n=== Trying specific store searches ===');
  const specificSearches = [
    { url: 'https://www.casadomantojc.com.br/busca/camisa+real+madrid+2627?q=camisa+real+madrid+2627', names: ['real-madrid-1-2627.jpg'] },
    { url: 'https://www.casadomantojc.com.br/busca/camisa+barcelona+2627?q=camisa+barcelona+2627', names: ['barcelona-1-2627.jpg'] },
    { url: 'https://www.casadomantojc.com.br/busca/camisa+corinthians+2627?q=camisa+corinthians+2627', names: ['corinthians-1-2627.jpg'] },
  ];
  
  for (const { url, names } of specificSearches) {
    try {
      const html = await fetchUrl(url);
      // Find product data in script tags (Nuvemshop stores often embed product JSON in a data layer)
      const dataLayer = html.match(/LS\.productData\s*=\s*(\[[\s\S]*?\]);/);
      if (dataLayer) {
        console.log(`\n${url}`);
        console.log(`  Found product data: ${dataLayer[1].substring(0, 500)}`);
      }
      
      // Also try to find ProductItem JSON
      const productItems = html.match(/ProductItem\s*=\s*({[\s\S]*?});/g);
      if (productItems) {
        console.log(`  Found ${productItems.length} ProductItem entries`);
        productItems.slice(0, 2).forEach(item => console.log(`    ${item.substring(0, 300)}`));
      }
      
      // Search for product image URLs in HTML
      const imgMatch = html.match(/https:\/\/acdn-us\.mitiendanube\.com\/stores\/[^"']*products\/[^"']*-(?:1024|640)-\d+\.(?:webp|jpg|png)/g);
      if (imgMatch) {
        const uniqueUrls = [...new Set(imgMatch)];
        console.log(`  Found ${uniqueUrls.length} unique image URLs`);
        
        for (let i = 0; i < Math.min(uniqueUrls.length, names.length); i++) {
          const imgUrl = uniqueUrls[i];
          let downloadUrl = imgUrl.replace(/-\d+-\d+\.(webp|jpg|png)/, '-1024-1024.$1');
          // Convert webp to jpg in storage
          const name = names[i];
          const filepath = path.join(IMG_DIR, name);
          
          if (!fs.existsSync(filepath)) {
            console.log(`  Downloading: ${name} from ${downloadUrl}`);
            const result = await downloadImage(downloadUrl, filepath);
            if (result) console.log(`    ✓ Saved`);
            else {
              // Try 640 size
              const url640 = imgUrl.replace(/-\d+-\d+\.(webp|jpg|png)/, '-640-0.$1');
              const result2 = await downloadImage(url640, filepath);
              if (result2) console.log(`    ✓ Saved (640px)`);
              else console.log(`    ✗ Failed`);
            }
          }
        }
      }
    } catch(e) {
      console.log(`${url}: Error - ${e.message}`);
    }
  }
}

findAndDownload();