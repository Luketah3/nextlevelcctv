import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname } from 'path';

const OUTPUT_DIR = join(import.meta.dirname, '..', 'public', 'img', 'products');

const products = [
  // IMOU - Indoor
  { name: 'cue2c', url: 'https://static-website.imou.com/9847fdf4-acb9-4a79-b611-bfb5f3158d48.png', fallback: 'https://www.bneta.co.za/wp-content/uploads/2024/06/Bulb-Cam-1_1.png.jpg' },
  { name: 'ranger2c', url: 'https://static-website.imou.com/f178cd19-d4f9-4156-b256-531c92401f0d.png', fallback: 'https://cdn11.bigcommerce.com/s-sp9oc95xrw/products/22388/images/76958/S300843862_1__29030.1708789188.386.513.jpg?c=2' },
  { name: 'rangemini', url: 'https://cdn11.bigcommerce.com/s-sp9oc95xrw/products/22388/images/76958/S300843862_1__29030.1708789188.386.513.jpg?c=2', fallback: null },
  { name: 'rex4mp', url: 'https://d1x12lhh8s9nlj.cloudfront.net/images/productos/products/IPC-A46LP-D-IMOU/IPC-A46LP-D-IMOU.png', fallback: null },
  { name: 'dk7', url: 'https://mediakomputer.com/wp-content/uploads/2025/02/id-11134207-7ras8-m4a9gkkgkw8q8c-e1739413070673.jpeg', fallback: null },
  { name: 'bulbcam2c', url: 'https://www.bneta.co.za/wp-content/uploads/2024/06/Bulb-Cam-1_1.png.jpg', fallback: null },
  // IMOU - Outdoor
  { name: 'bullet2c', url: 'https://static-website.imou.com/f6f8563c-869c-40cd-a656-da6dee806971.png', fallback: 'https://www.imou.com.pk/cdn/shop/files/1_6f58e93c-1c96-4e63-a7fc-7f48c1a1a718.jpg?v=1727757015&width=600' },
  { name: 'cruiser3mp', url: 'https://static-website.imou.com/3d482be8-ec0c-4616-b25b-597540ec124c.png', fallback: null },
  { name: 'cruiser5mp', url: 'https://static-website.imou.com/3d482be8-ec0c-4616-b25b-597540ec124c.png', fallback: null },
  { name: 'cruiserdual', url: 'https://static-website.imou.com/add2fa8c-28eb-4e6b-9367-4bbc19c0f245.png', fallback: null },
  { name: 'cruisertriple', url: 'https://static-website.imou.com/15574d35-0306-414c-808c-a10d4c8af254.png', fallback: null },
  { name: 'aovpt', url: 'https://jayawewa.com/wp-content/uploads/2026/04/single-lens-solar-1.png', fallback: null },
  // IMOU - Accessories
  { name: 'hr300', url: 'https://techshopng.com/wp-content/uploads/2025/04/0074_HR300.jpg', fallback: null },
  { name: 'nvr4ch', url: 'https://www.vshgroup.com.my/wp-content/uploads/2023/02/VSH-nvr1104hs-w-s2-wireless-recorder-4ch-min.png', fallback: null },
  { name: 'nvr8ch', url: 'https://www.bneta.co.za/wp-content/uploads/2023/10/image-3-3.webp', fallback: 'https://www.vshgroup.com.my/wp-content/uploads/2023/02/VSH-nvr1104hs-w-s2-wireless-recorder-4ch-min.png' },
  { name: 'nvr10ch', url: 'https://www.bneta.co.za/wp-content/uploads/2023/10/image-3-3.webp', fallback: 'https://www.vshgroup.com.my/wp-content/uploads/2023/02/VSH-nvr1104hs-w-s2-wireless-recorder-4ch-min.png' },
  // EZVIZ
  { name: 'h1c', url: 'https://mfs.ezvizlife.com/4090aa33d295b536d220e3b43ac4bab2.png', fallback: null },
  { name: 'h3c', url: 'https://tiendaezviz.com.ar/assets/2025/04/H3c-Camara-de-seguridad-wifi-fija-para-exteriores-fuoll-hd-1080p.webp', fallback: null },
  { name: 'h3ccolor', url: 'https://mfs.ezvizlife.com/5b063c778a449cee7517c688c4642028.jpg', fallback: 'https://orientcctv.com/wp-content/uploads/2025/01/25-1.jpg' },
  { name: 'c6n', url: 'https://mfs.ezvizlife.com/41fa00d9db9bef10b22f0e75dd5f31ec.jpg', fallback: null },
  { name: 'h8c', url: 'https://mfs.ezvizlife.com/df6b54ca5abd887d3ea08a487fce96a0.jpg', fallback: null },
  { name: 'h8c4g', url: 'https://mfs.ezvizlife.com/df6b54ca5abd887d3ea08a487fce96a0.jpg', fallback: null },
  { name: 'h9cdual', url: 'https://cdn11.bigcommerce.com/s-sp9oc95xrw/products/72173/images/166993/41rNPrXR9HL._AC_SL1000___52173.1782565306.386.513.jpg?c=2', fallback: null },
  { name: 'eb84g', url: 'https://mfs.ezvizlife.com/79884a856537c49323cfd84acea92af1.jpg', fallback: null },
  { name: 'eb3', url: 'https://tiendaezviz.com.ar/assets/2025/06/EB3-Ezviz.webp', fallback: 'https://101-multimedia.com/wp-content/uploads/2025/07/4-77.jpg' },
];

async function downloadImage(product) {
  const ext = extname(new URL(product.url).pathname).split('?')[0] || '.jpg';
  const filename = `${product.name}${ext}`;
  const filepath = join(OUTPUT_DIR, filename);

  for (const attempt of [product.url, product.fallback]) {
    if (!attempt) continue;
    try {
      console.log(`Downloading ${product.name} from ${attempt.substring(0, 80)}...`);
      const res = await fetch(attempt, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const contentType = res.headers.get('content-type') || '';
      let finalExt = ext;
      if (contentType.includes('webp')) finalExt = '.webp';
      else if (contentType.includes('png')) finalExt = '.png';
      else if (contentType.includes('jpeg') || contentType.includes('jpg')) finalExt = '.jpg';

      const finalFilename = `${product.name}${finalExt}`;
      const finalPath = join(OUTPUT_DIR, finalFilename);
      const buffer = Buffer.from(await res.arrayBuffer());

      if (buffer.length < 500) throw new Error('File too small, likely not an image');

      await writeFile(finalPath, buffer);
      console.log(`  -> ${finalFilename} (${(buffer.length / 1024).toFixed(1)} KB)`);
      return { name: product.name, file: finalFilename, ok: true };
    } catch (err) {
      console.log(`  Failed: ${err.message}`);
    }
  }
  return { name: product.name, file: null, ok: false };
}

async function main() {
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Downloading ${products.length} product images...\n`);

  const results = [];
  // Download sequentially to avoid rate limiting
  for (const product of products) {
    const result = await downloadImage(product);
    results.push(result);
  }

  console.log('\n--- Results ---');
  const ok = results.filter(r => r.ok);
  const fail = results.filter(r => !r.ok);
  console.log(`OK: ${ok.length}, Failed: ${fail.length}`);
  if (fail.length > 0) {
    console.log('Failed products:', fail.map(f => f.name).join(', '));
  }

  // Output mapping for reference
  console.log('\n--- Image Mapping ---');
  for (const r of ok) {
    console.log(`  "${r.name}": "/img/products/${r.file}",`);
  }
}

main().catch(console.error);
