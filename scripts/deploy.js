import { execSync } from 'child_process'
import { cpSync, copyFileSync } from 'fs'

// 1. Restore the clean source template before building
console.log('Restoring source template...')
copyFileSync('src/template.html', 'index.html')

// 2. Run Vite build
console.log('Building...')
execSync('npx vite build', { stdio: 'inherit' })

// 3. Copy dist output to root (for GitHub Pages)
console.log('Deploying to root...')
cpSync('dist/assets', 'assets', { recursive: true, force: true })
copyFileSync('dist/index.html', 'index.html')

// Copy static files if they exist
for (const file of ['robots.txt', 'sitemap.xml', 'favicon.svg', 'logo.svg', 'logo-circular.svg', 'logonuevo.png']) {
  try { copyFileSync(`dist/${file}`, file) } catch {}
}

console.log('Deploy complete!')
