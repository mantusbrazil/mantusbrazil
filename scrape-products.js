const https = require('https');

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

async function main() {
  // Search for product pages on each store
  const stores = [
    { name: 'Casa do Manto', domain: 'www.casadomantojc.com.br' },
    { name: 'Net Shirts', domain: 'netshirtsbr.com.br' },
    { name: 'Evolua Sports', domain: 'www.evoluasports.com.br' },
  ];

  const searches = [
    'real-madrid',
    'espanha', 
    'portugal',
    'argentina',
    'inglaterra',
    'franca',
    'colombia',
    'holanda',
    'italia',
    'corinthians',
    'barcelona',
    'psg',
    'santos',
    'estados-unidos'
  ];

  for (const store of stores) {
    console.log(`\n========== ${store.name} ==========`);
    
    for (const search of searches) {
      const url = `https://${store.domain}/busca/${search}?q=${search}`;
      try {
        const { status, data } = await fetchUrl(url);
        if (status === 200 && data.length > 1000) {
          // Find first product image URL
          const imgRegex = /<img[^>]+src=["']([^"']+\.(jpg|webp|png)[^"']*)["']/i;
          const match = imgRegex.exec(data);
          if (match) {
            let imgUrl = match[1];
            if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
            console.log(`${search}: ${imgUrl}`);
            
            // Try multiple sizes to get the largest (1024x1024)
            const baseUrl = imgUrl.replace(/-\d+-\d+\.(webp|jpg|png)/, '-1024-1024.$1');
            console.log(`  large: ${baseUrl}`);
          }
        }
      } catch (err) {
        // Skip
      }
    }
  }
}

main();