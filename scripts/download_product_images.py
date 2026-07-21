#!/usr/bin/env python3
"""
Descarga imágenes de productos IMOU y EZVIZ extrayendo og:image de sus páginas oficiales.
"""
import os
import json
import re
import urllib.request
import urllib.error
import ssl
import time

ssl._create_default_https_context = ssl._create_unverified_context

BASE = os.path.join(os.path.dirname(__file__), '..', 'public')
OUTPUT_DIR = os.path.join(BASE, 'img', 'products')
JSON_OUTPUT = os.path.join(BASE, 'product_images.json')

# Producto clave -> (nombre_para_buscar, URL oficial del producto)
PRODUCT_SOURCES = {
    # IMOU
    "Cue 2 1080": "https://www.imou.com/en/product/detail/cue2",
    "cue 2 3mpx": "https://www.imou.com/en/product/detail/cue2c-3mp",
    "Ranger 2c 2mpx": "https://www.imou.com/en/product/detail/ranger2c",
    "Ranger 2c 4mpx": "https://www.imou.com/en/product/detail/ranger2c-4mp",
    "RANGER MINI K2MP - 3H1WE": "https://www.imou.com/en/product/detail/ranger-mini",
    "RANGER DUAL 10MP": "https://www.imou.com/en/product/detail/ranger-dual",
    "IMOU REX A46LP -D": "https://www.imou.com/en/product/detail/rex",
    "Bullet 2c 3mpx": "https://www.imou.com/en/product/detail/bullet2c",
    "Bullet 2c 5mpx": "https://www.imou.com/en/product/detail/bullet2c-5mp",
    "Bullet 2e 3mpx": "https://www.imou.com/en/product/detail/bullet2e",
    "Bullet 2e 5mpx": "https://www.imou.com/en/product/detail/bullet2e-5mp",
    "dk7 2mpx 1080": "https://www.imou.com/en/product/detail/dk3",
    "BULB CAM  2C 3MP (foco)": "https://www.imou.com/en/product/detail/bulb-2c",
    "Cruiser 3mpx": "https://www.imou.com/en/product/detail/cruiser",
    "Cruiser 5mpx": "https://www.imou.com/en/product/detail/cruiser-5mp",
    "Cruiser Dual 6mpx": "https://www.imou.com/en/product/detail/cruiser-dual",
    "Cruiser Dual 10mpx": "https://www.imou.com/en/product/detail/cruiser-dual",
    "cruiser triple 11mpx": "https://www.imou.com/en/product/detail/cruiser-triple",
    "AOV PT 4G 5MP": "https://www.imou.com/en/product/detail/aov-pt",
    "Router HR300": "https://www.imou.com/en/product/detail/hr300",
    "NVR1104HS-W-S2 4CH": "https://www.imou.com/en/product/detail/nvr1104hs-w-s2",
    "NVR1108HS-W-S2 8CH": "https://www.imou.com/en/product/detail/nvr1108hs-w-s2",
    "MOU NVR N10W - 8AOE": "https://www.imou.com/en/product/detail/nvr-n10w",
    "NVR N110 - 8A0E ( 10 CH)": "https://www.imou.com/en/product/detail/nvr-n110",
    # EZVIZ
    "h1c 1080": "https://www.ezviz.com/product/h1c/47789",
    "H3C 1080": "https://www.ezviz.com/product/H3c/42661",
    "H3C 1080 F/COLOR": "https://www.ezviz.com/product/h3c+color/42859",
    "C6N 1080": "https://www.ezviz.com/product/C6N/9046",
    "H8C 1080": "https://www.ezviz.com/product/H8c/47039",
    "H8C 1080 4G": "https://www.ezviz.com/product/H8c+4G/62547",
    "H9C DUAL 5mpx+ 5mpx": "https://www.ezviz.com/product/H9c+Dual/54087",
    "EB8 4G C/PANEL SOLAR": "https://www.ezviz.com/product/EB8+4G/62547",
    "EB3 C/ PANEL SOLAR": "https://www.ezviz.com/product/EB3/54087",
}

# Fallback: URLs directas de imágenes conocidas (CDN de dahuawireless.com / resellers)
FALLBACK_IMAGES = {
    "Cue 2 1080": "https://www.dahuawireless.com/wp-content/uploads/2023/12/IPC-C22EP.png",
}

def fetch_og_image(url):
    """Obtiene la imagen og:image de una página web."""
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            
        # Buscar og:image
        patterns = [
            r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']',
            r'<meta\s+content=["\']([^"\']+)["\']\s+property=["\']og:image["\']',
            r'<meta\s+name=["\']twitter:image["\']\s+content=["\']([^"\']+)["\']',
            r'<meta\s+content=["\']([^"\']+)["\']\s+name=["\']twitter:image["\']',
        ]
        for pat in patterns:
            m = re.search(pat, html, re.IGNORECASE)
            if m:
                img_url = m.group(1)
                if img_url.startswith('//'):
                    img_url = 'https:' + img_url
                return img_url
        
        # Buscar cualquier imagen grande del producto
        img_patterns = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html, re.IGNORECASE)
        for img in img_patterns:
            if any(x in img.lower() for x in ['product', 'ipc-', 'cs-', 'bullet', 'ranger', 'cruiser', 'cue', '.png', '.jpg']):
                if img.startswith('//'):
                    img = 'https:' + img
                elif img.startswith('/'):
                    from urllib.parse import urlparse
                    parsed = urlparse(url)
                    img = f"{parsed.scheme}://{parsed.netloc}{img}"
                return img
    except Exception as e:
        print(f"  Error fetching page: {e}")
    return None


def download_image(url, filepath):
    """Descarga una imagen."""
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            if len(data) < 500:
                return False
            with open(filepath, 'wb') as f:
                f.write(data)
            return True
    except Exception as e:
        print(f"  Error descargando imagen: {e}")
    return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    results = {}
    success = 0
    failed = 0
    total = len(PRODUCT_SOURCES)
    
    print(f"Procesando {total} productos...\n")
    
    for i, (product_name, page_url) in enumerate(PRODUCT_SOURCES.items(), 1):
        print(f"[{i}/{total}] {product_name}")
        
        # Intentar obtener og:image de la página oficial
        img_url = fetch_og_image(page_url)
        
        if not img_url and product_name in FALLBACK_IMAGES:
            img_url = FALLBACK_IMAGES[product_name]
            print(f"  Usando fallback URL")
        
        if not img_url:
            print(f"  No se encontró imagen, omitiendo")
            failed += 1
            continue
        
        print(f"  Imagen: {img_url[:100]}...")
        
        # Crear nombre de archivo
        safe_name = product_name.strip()
        for ch in ['/', '\\', ':', '*', '?', '"', '<', '>', '|', ' ', '(', ')']:
            safe_name = safe_name.replace(ch, '_')
        safe_name = safe_name[:60]
        
        ext = '.png'
        if '.jpg' in img_url.lower() or '.jpeg' in img_url.lower():
            ext = '.jpg'
        elif '.webp' in img_url.lower():
            ext = '.webp'
        
        filename = f"{safe_name}{ext}"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        if download_image(img_url, filepath):
            size = os.path.getsize(filepath)
            results[product_name] = f"img/products/{filename}"
            print(f"  OK ({size:,} bytes)")
            success += 1
        else:
            failed += 1
        
        time.sleep(0.5)
    
    # Guardar mapeo
    with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*50}")
    print(f"Descargadas: {success}/{total}")
    print(f"Fallidas: {failed}/{total}")
    print(f"Mapeo: {JSON_OUTPUT}")
    print(f"Imágenes: {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
