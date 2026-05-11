const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000 
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  // Try to scrape real store pages to find actual product image URLs
  const stores = [
    { name: 'netshirtsbr', url: 'https://netshirtsbr.com.br/' },
    { name: 'casadomanto', url: 'https://www.casadomantojc.com.br/' },
    { name: 'evoluasports', url: 'https://www.evoluasports.com.br/' },
  ];
  
  for (const store of stores) {
    try {
      console.log(`\n=== ${store.name} ===`);
      const html = await fetchUrl(store.url);
      
      // Find all image URLs
      const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
      const matches = [];
      let match;
      while ((match = imgRegex.exec(html)) !== null) {
        const url = match[1];
        if (url.includes('.jpg') || url.includes('.png') || url.includes('.webp')) {
          if (!url.includes('logo') && !url.includes('icon') && !url.includes('banner') && !url.includes('whatsapp')) {
            matches.push(url);
          }
        }
      }
      
      console.log(`Found ${matches.length} product image references`);
      matches.slice(0, 30).forEach(u => console.log(`  ${u}`));
      
      // Also look for Shopify product JSON data
      const productRegex = /\/products\/([a-z0-9-]+)/g;
      const products = new Set();
      while ((match = productRegex.exec(html)) !== null) {
        products.add(match[1]);
      }
      console.log(`\nFound ${products.size} product handles`);
      [...products].slice(0, 15).forEach(p => console.log(`  ${p}`));
      
    } catch (err) {
      console.log(`Error fetching ${store.name}: ${err.message}`);
    }
  }
}

main();