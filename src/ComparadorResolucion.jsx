import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

const RESOLUTIONS = [
  {
    id: '1mp',
    label: '1 MP',
    res: '1280×1024',
    megapixels: '1-MP',
    factor: 0.85,
    noiseOpacity: 0.03,
    filters: 'blur(0.4px) contrast(0.9) saturate(0.85)',
    nightNoiseOpacity: 0.15,
    nightFilters: 'grayscale(1) brightness(0.70) contrast(1.3) sepia(0.3) hue-rotate(80deg)',
    nightVignette: { inner: 'rgba(255, 255, 255, 0.2)', outer: 'rgba(0, 0, 0, 0.85)', radius: 0.5 },
    desc: 'Resolución básica. Limitada para identificar detalles a distancia.',
    capabilities: []
  },
  {
    id: '2mp',
    label: '2 MP',
    res: '1600×1200',
    megapixels: '2-MP',
    factor: 0.9,
    noiseOpacity: 0.01,
    filters: 'blur(0.1px) contrast(0.95) saturate(0.95)',
    nightNoiseOpacity: 0.08,
    nightFilters: 'grayscale(1) brightness(0.85) contrast(1.3) sepia(0.2) hue-rotate(80deg)',
    nightVignette: { inner: 'rgba(255, 255, 255, 0.1)', outer: 'rgba(0, 0, 0, 0.7)', radius: 0.65 },
    desc: 'Resolución estándar Full HD. Buena para visión general y detalles.',
    capabilities: ['face', 'detail']
  },
  {
    id: '4mp',
    label: '4 MP',
    res: '2688×1520',
    megapixels: '4-MP',
    factor: 1,
    noiseOpacity: 0,
    nightNoiseOpacity: 0.1,
    nightFilters: 'grayscale(1) brightness(0.8) contrast(1.4) sepia(0.1) hue-rotate(80deg)',
    nightVignette: { inner: 'rgba(255, 255, 255, 0.05)', outer: 'rgba(0, 0, 0, 0.45)', radius: 0.75 },
    desc: 'Excelente relación calidad/precio para comercios y residencias.',
    capabilities: ['plate', 'face', 'detail']
  },
  {
    id: '4k',
    label: '4K',
    res: '3840×2160',
    megapixels: '8.3 MP',
    factor: 1,
    noiseOpacity: 0,
    filters: 'contrast(1.15) saturate(1.2) brightness(1.05)',
    nightNoiseOpacity: 0.02,
    nightFilters: 'brightness(0.8) contrast(1.15) saturate(1.1)',
    nightVignette: { inner: 'rgba(255, 245, 230, 0.05)', outer: 'rgba(0, 0, 0, 0.25)', radius: .80 },
    desc: 'ColorVu: Visión nocturna a color. Máximo detalle a larga distancia.',
    capabilities: ['plate', 'face', 'detail', 'distance']
  }
]

const INTEREST_POINTS = [
  { id: 'plate', label: 'Matrículas', icon: '🔍' },
  { id: 'face', label: 'Rostros', icon: '👤' },
  { id: 'detail', label: 'Detalles', icon: '🏠' },
  { id: 'distance', label: 'Distancia', icon: '📏' }
]

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

// Generate static noise pattern once
let noiseCanvas = null;
if (typeof document !== 'undefined') {
  noiseCanvas = document.createElement('canvas');
  noiseCanvas.width = 256;
  noiseCanvas.height = 256;
  const nCtx = noiseCanvas.getContext('2d');
  const nData = nCtx.createImageData(256, 256);
  for (let i = 0; i < nData.data.length; i += 4) {
    const v = Math.random() * 255;
    nData.data[i] = v;     // R
    nData.data[i + 1] = v;   // G
    nData.data[i + 2] = v;   // B
    nData.data[i + 3] = 255; // Alpha
  }
  nCtx.putImageData(nData, 0, 0);
}

function CanvasViewer({ imgRef, imageLoaded, resolution, isNightVision }) {
  const canvasRef = useRef(null)
  const offscreenRef = useRef(null)

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !imgRef.current) return
    const ctx = canvas.getContext('2d')
    const img = imgRef.current
    const res = RESOLUTIONS.find(r => r.id === resolution)
    if (!res) return

    const cw = canvas.width
    const ch = canvas.height
    ctx.clearRect(0, 0, cw, ch)
    ctx.imageSmoothingEnabled = false

    if (!offscreenRef.current) offscreenRef.current = document.createElement('canvas')
    const off = offscreenRef.current

    const factor = res.factor
    const ow = Math.max(Math.round(cw * factor), 16)
    const oh = Math.max(Math.round(ch * factor), 16)
    off.width = ow
    off.height = oh

    const offCtx = off.getContext('2d')
    offCtx.imageSmoothingEnabled = true
    offCtx.imageSmoothingQuality = 'low'

    const imgAspect = img.width / img.height
    const canAspect = cw / ch
    let srcW, srcH
    if (imgAspect > canAspect) { srcH = img.height; srcW = srcH * canAspect }
    else { srcW = img.width; srcH = srcW / canAspect }

    const srcX = (img.width - srcW) / 2
    const srcY = (img.height - srcH) / 2

    offCtx.clearRect(0, 0, ow, oh)
    offCtx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, ow, oh)

    // Apply color filters if defined
    let activeFilter = 'none';
    if (isNightVision && res.nightFilters) {
      activeFilter = res.nightFilters;
    } else if (!isNightVision && res.filters) {
      activeFilter = res.filters;
    }
    ctx.filter = activeFilter;

    ctx.imageSmoothingEnabled = factor > 0.7
    ctx.drawImage(off, 0, 0, ow, oh, 0, 0, cw, ch)

    // Apply IR Spotlight / Vignette
    if (isNightVision && res.nightVignette) {
      const { inner, outer, radius } = res.nightVignette;
      const gradRadius = Math.max(cw, ch) * radius;
      const gradient = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, gradRadius);
      gradient.addColorStop(0, inner);
      gradient.addColorStop(1, outer);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, cw, ch);
    }

    // Apply noise overlay
    const targetNoise = isNightVision ? (res.nightNoiseOpacity || 0) : (res.noiseOpacity || 0);
    if (targetNoise > 0 && noiseCanvas) {
      ctx.globalAlpha = targetNoise;
      ctx.globalCompositeOperation = 'overlay';
      const pattern = ctx.createPattern(noiseCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, cw, ch);
      }
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';
    }

    // Reset filter for HUD
    ctx.filter = 'none';

    // Resolution HUD
    ctx.imageSmoothingEnabled = true
    const hudH = 32
    ctx.fillStyle = 'rgba(8, 9, 12, 0.7)'
    ctx.fillRect(0, 0, cw, hudH)

    ctx.font = `600 ${Math.max(11, Math.round(cw / 60))}px Inter, sans-serif`
    ctx.fillStyle = '#3dd1cc'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${res.label}  •  ${res.res}`, 10, hudH / 2)
  }, [imgRef, resolution, isNightVision])

  useEffect(() => {
    if (!imageLoaded) return
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    const rect = parent.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    requestAnimationFrame(drawCanvas)
  }, [imageLoaded, drawCanvas])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageLoaded) return
    const parent = canvas.parentElement
    const observer = new ResizeObserver(() => {
      const rect = parent.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      drawCanvas()
    })
    observer.observe(parent)
    return () => observer.disconnect()
  }, [imageLoaded, drawCanvas])

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gray-950 border border-[rgba(61,209,204,0.15)]">
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-aqua-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

export default function ComparadorResolucion() {
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isNightVision, setIsNightVision] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { imgRef.current = img; setImageLoaded(true) }
    img.src = '/img/base.jpg'
  }, [])

  return (
    <section id="comparador" className="py-24 md:py-36 bg-gray-950 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-[radial-gradient(ellipse_at_30%_0%,rgba(61,209,204,0.06),transparent_60%)]" />

      <div className="max-w-[1400px] mx-auto px-5 relative">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-aqua-400 bg-[rgba(61,209,204,0.06)] border border-[rgba(61,209,204,0.12)] px-5 py-2 rounded-full mb-5">
            Calidad de Imagen
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-[2rem] md:text-[3.2rem] font-bold text-gray-100 mb-4"
          >
            Comparador de <span className="text-gradient">Resoluciones</span>
          </motion.h2>
          <p className="text-gray-400 max-w-[800px] mx-auto leading-relaxed mb-6">
            Observá las 4 diferentes calidades aplicadas a la misma escena para entender qué nivel de detalle te ofrece cada cámara.
          </p>

          <div className="flex justify-center pb-4">
            <button
              onClick={() => setIsNightVision(!isNightVision)}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${isNightVision
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20'
                }`}
            >
              {isNightVision ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  Volver a Día (RGB)
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  Simular Noche (IR / ColorVu)
                </>
              )}
            </button>
          </div>
        </div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {RESOLUTIONS.map((res) => (
            <div key={res.id} className="flex flex-col gap-4">
              <div className="aspect-video relative rounded-2xl overflow-hidden shadow-lg shadow-black/50">
                <CanvasViewer
                  imgRef={imgRef}
                  imageLoaded={imageLoaded}
                  resolution={res.id}
                  isNightVision={isNightVision}
                />
              </div>
              <div className="glass p-5 rounded-2xl flex-1 flex flex-col">
                <h3 className="font-display text-xl font-bold text-gray-100 flex items-center justify-between">
                  {res.label}
                  <span className="text-sm font-normal text-gray-500 bg-gray-900/50 px-2 py-1 rounded-md border border-white/5">{res.res}</span>
                </h3>
                <p className="text-sm text-gray-400 mt-3 leading-relaxed min-h-[60px]">
                  {res.desc}
                </p>
                <div className="mt-4 pt-4 border-t border-white/[0.05] flex flex-col gap-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Capacidades:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {INTEREST_POINTS.map(pt => {
                      const canSee = res.capabilities.includes(pt.id)
                      return (
                        <div key={pt.id} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[0.65rem] md:text-xs font-bold border transition-all ${canSee
                          ? 'bg-[rgba(61,209,204,0.1)] border-[rgba(61,209,204,0.25)] text-aqua-400'
                          : 'bg-[rgba(239,68,68,0.06)] border-[rgba(239,68,68,0.15)] text-red-500/70'
                          }`}>
                          {canSee ? <CheckIcon /> : <XIcon />}
                          <span className="truncate" title={pt.label}>{pt.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
