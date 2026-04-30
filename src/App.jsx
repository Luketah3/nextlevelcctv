import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useInView, AnimatePresence } from 'framer-motion'
import ComparadorResolucion from './ComparadorResolucion'

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const ShieldIcon = () => (
  <svg className="w-6 h-6 text-aqua-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const ClockIcon = () => (
  <svg className="w-6 h-6 text-aqua-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
)
const BoltIcon = () => (
  <svg className="w-6 h-6 text-aqua-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
)
const MonitorIcon = () => (
  <svg className="w-6 h-6 text-aqua-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
  </svg>
)
const BellIcon = () => (
  <svg className="w-6 h-6 text-aqua-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
  </svg>
)
const CameraIcon = () => (
  <svg className="w-6 h-6 text-aqua-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const SERVICE_ICONS = [CameraIcon, ClockIcon, BoltIcon, MonitorIcon, BellIcon]

function AnimatedNumber({ value, suffix = "" }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const num = parseInt(value) || 0
  const spring = useSpring(0, { stiffness: 50, damping: 20 })
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    if (isInView) spring.set(num)
  }, [isInView, num, spring])

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v).toString()))
    return () => unsub()
  }, [spring])

  return <span ref={ref}>{display}{suffix}</span>
}

const WA_LINK = "https://wa.me/5491135686456"
const SERVICES = [
  {
    title: "Instalación y Reparación de Cámaras",
    desc: "Instalaciones desde cero, diagnóstico, reparación y mejora de sistemas instalados por terceros. Actualización a tecnología 4K con equipos Dahua, Hikvision y Cygnus.",
    features: ["Equipos líderes del mercado", "Reparación y mejora de sistemas", "Cámaras 4K Ultra HD", "Acceso remoto desde celular"],
    featured: true
  },
  {
    title: "Monitoreo Constante 24/7",
    desc: "Vigilancia continua de sus sistemas de seguridad con alertas en tiempo real y grabación permanente para su tranquilidad.",
    features: ["Monitoreo ininterrumpido", "Alertas en tiempo real", "Grabación en la nube"]
  },
  {
    title: "Instalación de Paneles Eléctricos",
    desc: "Trabajo eléctrico profesional con paneles de distribución, llaves térmicas y diferenciales. Instalaciones seguras y normalizadas.",
    features: ["Tableros de distribución", "Llaves térmicas y diferenciales", "Cableado estructurado"]
  },
  {
    title: "Reparaciones de PC",
    desc: "Servicio técnico completo para computadoras: instalación de software, cambio de pasta térmica y mantenimiento general.",
    features: ["Instalación de software", "Cambio de pasta térmica", "Mantenimiento general"]
  },
  {
    title: "Instalación de Alarmas",
    desc: "Sistemas de alarma domiciliarias, cercos eléctricos y cerraduras electrónicas para una protección completa de su propiedad.",
    features: ["Alarmas domiciliarias", "Cercos eléctricos", "Cerraduras electrónicas"]
  }
]

const GALLERY = [
  { src: "/img/IMG_20251208_131334.jpg", alt: "Centro de Monitoreo", tag: "Monitoreo", title: "Centro de Monitoreo", desc: "Sistema completo con DVR Dahua y monitoreo de 8 canales", wide: true },
  { src: "/img/IMG_20251124_103935_HDR.jpg", alt: "Cámara Antivandálica", tag: "Protección", title: "Cámara Antivandálica", desc: "Jaula de seguridad para máxima protección del equipo" },
  { src: "/img/IMG_20260204_091722.jpg", alt: "Baluns 4K", tag: "Tecnología", title: "Baluns 4K Extra Speed", desc: "Transmisión de video sin pérdida" },
  { src: "/img/IMG_20260225_151241_972.jpg", alt: "Domo Dahua", tag: "Cámaras", title: "Domo Dahua HD", desc: "Cámara domo interior de alta definición" },
  { src: "/img/IMG_20260204_200331.jpg", alt: "Seguridad Comercial", tag: "Comercio", title: "Seguridad Comercial", desc: "Sistema de 4 cámaras para locales", wide: true },
  { src: "/img/20260213143213.jpg", alt: "Vista en Vivo", tag: "Monitoreo", title: "Vista en Vivo HD", desc: "Monitoreo remoto del frente" },
  { src: "/img/IMG_20260222_125348.jpg", alt: "Instalación Externa", tag: "Cámaras", title: "Instalación Externa", desc: "Cámara exterior con visión nocturna" },
  { src: "/img/IMG_20260222_125318.jpg", alt: "DVR Profesional", tag: "Monitoreo", title: "DVR Profesional", desc: "Grabador digital de última generación" },
  { src: "/img/WhatsApp Image 2026-03-06 at 18.13.28.jpeg", alt: "Sistema Completo", tag: "Integral", title: "Sistema Completo", desc: "Solución integral de seguridad", wide: true },
  { src: "/img/IMG_20260216_114303.jpg", alt: "Configuración", tag: "Técnica", title: "Configuración", desc: "Setup profesional de cámaras" },
  { src: "/img/IMG_20260222_124801.jpg", alt: "Cámara Fija", tag: "Cámaras", title: "Cámara Fija", desc: "Cámara bullet para exteriores" },
  { src: "/img/IMG_20251124_104053_HDR.jpg", alt: "Panel Solar", tag: "Energía", title: "Panel Solar", desc: "Alimentación autónoma para cámaras", wide: true }
]

function Navbar({ scrolled }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass py-3' : 'py-5'}`}
    >
      <div className="max-w-[1240px] mx-auto px-5 flex items-center justify-between">
        <a href="#hero" className="flex items-center">
          <img src="/logonuevo.png" alt="Next Level CCTV" className="h-14 w-auto rounded-full shadow-glow" />
        </a>

        {mobileOpen && (
          <div
            className="fixed inset-0 bg-[#08090c]/60 backdrop-blur-sm md:hidden z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <ul className={`md:flex items-center lg:gap-8 md:gap-5 gap-6 ${mobileOpen ? 'flex' : 'hidden'} fixed md:static top-0 right-0 md:right-0 w-[78%] max-w-[320px] md:w-auto h-screen md:h-auto bg-[#08090c]/98 md:bg-transparent backdrop-blur-2xl md:backdrop-none flex-col md:flex-row justify-center p-8 md:p-0 transition-all duration-300 border-l md:border-l-0 border-[rgba(61,209,204,0.08)] z-50`}>
          {['Inicio', 'Servicios', 'Trabajos', 'Comparador', 'Nosotros'].map(item => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-400 hover:text-gray-100 transition-colors relative group"
                onClick={() => setMobileOpen(false)}
              >
                {item}
                <span className="absolute bottom-[-6px] left-0 w-0 h-[2px] bg-gradient-to-r from-aqua-400 to-emerald-500 transition-all group-hover:w-full rounded" />
              </a>
            </li>
          ))}
          <li>
            <a href="#contacto" onClick={() => setMobileOpen(false)} className="bg-gradient-to-r from-aqua-400 to-emerald-500 text-gray-950 px-5 py-2 rounded-2xl text-sm font-semibold hover:shadow-glow-strong transition-all">
              Contacto
            </a>
          </li>
        </ul>

        <button
          aria-label={mobileOpen ? 'Cerrar menu' : 'Abrir menu'}
          aria-expanded={mobileOpen}
          className="md:hidden flex flex-col gap-1.5 p-1 z-50 relative"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={`w-6 h-0.5 bg-gray-200 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-gray-200 transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-gray-200 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>
    </motion.nav>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const yRaw = useTransform(scrollY, [0, 500], [0, 150])
  const y = useSpring(yRaw, { stiffness: 100, damping: 30 })

  return (
    <header id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <motion.img
          style={{ y }}
          src="/img/stock/hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08090c]/70 via-[#08090c]/20 to-[#08090c]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(61,209,204,0.08),transparent_50%),radial-gradient(ellipse_at_80%_20%,rgba(16,185,129,0.05),transparent_50%)]" />
      </div>

      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-5 pt-28 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05, type: "spring", stiffness: 200 }}
            className="shrink-0"
          >
            <img src="/logonuevo.png" alt="Next Level CCTV" className="w-36 h-36 md:w-48 md:h-48 rounded-full shadow-[0_0_40px_rgba(61,209,204,0.25)]" />
          </motion.div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-aqua-400 bg-[rgba(61,209,204,0.08)] border border-[rgba(61,209,204,0.15)] px-5 py-2 rounded-full mb-6 shadow-glow-soft"
            >
              Seguridad Profesional
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="font-display text-[2.8rem] md:text-[4.8rem] font-extrabold text-gray-100 leading-tight mb-6 tracking-tight"
            >
              Seguridad y Tecnología<br />
              <span className="text-gradient">al Máximo Nivel</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-gray-400 max-w-[600px] leading-relaxed mb-8"
            >
              Instalación profesional, reparación y mejora de cámaras de seguridad, monitoreo 24/7, alarmas y soluciones tecnológicas integrales para hogares y comercios en Buenos Aires.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-4 mb-0 justify-center md:justify-start"
            >
              <a
                href={`${WA_LINK}?text=Hola!%20Quiero%20un%20presupuesto%20sin%20cargo`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-aqua-400 to-emerald-500 text-gray-950 px-8 py-4 rounded-2xl font-semibold hover:shadow-glow-strong hover:-translate-y-1 transition-all"
              >
                <WhatsAppIcon />
                Presupuesto Sin Cargo
              </a>
              <a
                href="#servicios"
                className="inline-flex items-center px-8 py-4 rounded-2xl border border-gray-700 text-gray-100 font-semibold hover:border-aqua-400 hover:text-aqua-400 transition-all"
              >
                Ver Servicios
              </a>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-10 md:gap-14 pt-10 mt-14 border-t border-white/[0.06] w-full"
        >
          {[
            { num: 500, suffix: "+", label: "Cámaras Instaladas" },
            { num: 200, suffix: "+", label: "Clientes Satisfechos" },
            { num: null, display: "24/7", label: "Soporte Continuo" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="font-display text-[1.6rem] md:text-[2.4rem] font-bold text-aqua-400">
                {stat.num != null ? <AnimatedNumber value={stat.num} suffix={stat.suffix} /> : stat.display}
              </span>
              <span className="text-xs text-gray-500 mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#servicios"
        aria-label="Ir a servicios"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-600 hover:text-aqua-400 transition-colors animate-bounce"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </motion.a>
    </header>
  )
}

function Servicios() {
  return (
    <section id="servicios" className="py-24 md:py-36 bg-gray-950 relative">
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(61,209,204,0.12),transparent_60%)]" />

      <div className="max-w-[1240px] mx-auto px-5 relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-aqua-400 bg-[rgba(61,209,204,0.06)] border border-[rgba(61,209,204,0.12)] px-5 py-2 rounded-full mb-5">
            Lo Que Hacemos
          </span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-[2rem] md:text-[3.2rem] font-bold text-gray-100 mb-4">
            Nuestros <span className="text-gradient">Servicios</span>
          </motion.h2>
          <p className="text-gray-400 max-w-[580px] mx-auto leading-relaxed">
            Soluciones integrales en seguridad y tecnología para proteger lo que más importa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative bg-gradient-to-br from-[rgba(26,30,42,0.7)] to-[rgba(15,17,23,0.85)] border border-white/[0.04] rounded-2xl p-8 transition-all hover:-translate-y-2 hover:border-[rgba(61,209,204,0.1)] hover:shadow-glow-card ${service.featured ? 'md:col-span-2 border-[rgba(61,209,204,0.08)] bg-gradient-to-br from-[rgba(61,209,204,0.04)] to-[rgba(15,17,23,0.9)]' : ''}`}
            >
              <div className="w-13 h-13 flex items-center justify-center bg-[rgba(61,209,204,0.08)] border border-[rgba(61,209,204,0.1)] rounded-xl mb-6 transition-transform hover:scale-110">
                {(() => { const Icon = SERVICE_ICONS[i] || CameraIcon; return <Icon /> })()}
              </div>

              {service.featured && (
                <span className="inline-block text-[0.65rem] font-bold uppercase tracking-[0.12em] text-emerald-400 bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.12)] px-3 py-1 rounded-md mb-3">
                  Servicio Principal
                </span>
              )}

              <h3 className="font-display text-lg font-semibold text-gray-100 mb-3">{service.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-5">{service.desc}</p>

              <ul className="flex flex-col gap-2">
                {service.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 bg-aqua-400 rounded-full shadow-[0_0_6px_rgba(61,209,204,0.4)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const GALLERY_TAGS = ['Todos', ...Array.from(new Set(GALLERY.map(g => g.tag)))]

const BENTO_PATTERN = [
  'col-span-2 row-span-2',
  '',
  '',
  'md:row-span-2',
  'col-span-2',
  '',
  'md:row-span-2',
  '',
  'col-span-2 md:row-span-2',
  '',
  '',
  'col-span-2',
]

function CornerBrackets({ tone = 'aqua' }) {
  const c = tone === 'aqua' ? 'border-aqua-400/40' : 'border-white/30'
  return (
    <>
      <span className={`absolute top-1.5 left-1.5 w-3 h-3 border-t border-l ${c} pointer-events-none rounded-tl-sm`} />
      <span className={`absolute top-1.5 right-1.5 w-3 h-3 border-t border-r ${c} pointer-events-none rounded-tr-sm`} />
      <span className={`absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l ${c} pointer-events-none rounded-bl-sm`} />
      <span className={`absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r ${c} pointer-events-none rounded-br-sm`} />
    </>
  )
}

function Trabajos() {
  const [lightbox, setLightbox] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [imageLoaded, setImageLoaded] = useState({})

  const filtered = activeFilter === 'Todos'
    ? GALLERY
    : GALLERY.filter(g => g.tag === activeFilter)

  const tagCounts = GALLERY.reduce(
    (acc, g) => ({ ...acc, [g.tag]: (acc[g.tag] || 0) + 1 }),
    { Todos: GALLERY.length }
  )

  const openLightbox = (item, index) => {
    setLightbox(item)
    setCurrentIndex(index)
  }

  const nextImage = (e) => {
    e?.stopPropagation()
    const next = (currentIndex + 1) % filtered.length
    setCurrentIndex(next)
    setLightbox(filtered[next])
  }

  const prevImage = (e) => {
    e?.stopPropagation()
    const prev = (currentIndex - 1 + filtered.length) % filtered.length
    setCurrentIndex(prev)
    setLightbox(filtered[prev])
  }

  useEffect(() => {
    if (!lightbox) return
    const next = filtered[(currentIndex + 1) % filtered.length]
    const prev = filtered[(currentIndex - 1 + filtered.length) % filtered.length]
    ;[next, prev].forEach(item => {
      if (item) {
        const img = new Image()
        img.src = item.src
      }
    })
  }, [lightbox, currentIndex, filtered])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox) return
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightbox, currentIndex, filtered])

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  const lightboxCamId = lightbox ? String(GALLERY.indexOf(lightbox) + 1).padStart(2, '0') : ''

  return (
    <section id="trabajos" className="py-24 md:py-36 bg-gray-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-aqua-400/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(61,209,204,0.04),transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(16,185,129,0.03),transparent_50%)]" />
      <div className="absolute inset-0 opacity-[0.018] pointer-events-none [background:repeating-linear-gradient(0deg,#fff_0,#fff_1px,transparent_1px,transparent_3px)] motion-reduce:hidden" />

      <div className="max-w-[1400px] mx-auto px-5 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-aqua-400/70">/ ARCHIVO_VISUAL</span>
              <span className="h-px flex-1 bg-gradient-to-r from-aqua-400/30 to-transparent" />
              <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-emerald-400/90">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                LIVE
              </span>
            </div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-[2.2rem] md:text-[3.4rem] font-bold text-gray-100 leading-[1.05] tracking-tight">
              Nuestros <span className="text-gradient">Trabajos</span>
            </motion.h2>
          </div>
          <p className="text-gray-400 max-w-[420px] leading-relaxed text-sm md:text-base">
            Cada instalación refleja nuestro compromiso con la calidad y la seguridad de nuestros clientes.
          </p>
        </div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-gray-500 shrink-0 pr-2 hidden sm:inline">FILTRO</span>
          {GALLERY_TAGS.map(tag => {
            const isActive = activeFilter === tag
            return (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`group relative shrink-0 inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] px-3.5 py-2 rounded-md border transition-all duration-200 ${
                  isActive
                    ? 'bg-aqua-400 text-gray-950 border-aqua-400 shadow-[0_0_24px_rgba(61,209,204,0.35)]'
                    : 'text-gray-400 border-white/[0.08] bg-white/[0.02] hover:border-aqua-400/40 hover:text-aqua-400 hover:bg-aqua-400/5'
                }`}
              >
                <span className={`w-1 h-1 rounded-full ${isActive ? 'bg-gray-950' : 'bg-aqua-400/40 group-hover:bg-aqua-400'}`} />
                {tag}
                <span className={`text-[0.58rem] font-bold ${isActive ? 'text-gray-950/70' : 'text-gray-600'}`}>{tagCounts[tag] || 0}</span>
              </button>
            )
          })}
        </div>

        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[180px] gap-3 md:gap-4 grid-flow-dense"
        >
          {filtered.map((item, i) => {
            const span = activeFilter === 'Todos' ? BENTO_PATTERN[i % BENTO_PATTERN.length] : ''
            const camId = String(GALLERY.indexOf(item) + 1).padStart(2, '0')
            const loaded = imageLoaded[item.src]
            return (
              <motion.button
                key={item.src}
                type="button"
                aria-label={`Ver ${item.title}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.035, duration: 0.4 }}
                onClick={() => openLightbox(item, i)}
                className={`relative rounded-xl overflow-hidden cursor-pointer group bg-gray-950 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ${span}`}
              >
                {!loaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                )}
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setImageLoaded(prev => ({ ...prev, [item.src]: true }))}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none [background:repeating-linear-gradient(0deg,rgba(61,209,204,0.06)_0,rgba(61,209,204,0.06)_1px,transparent_1px,transparent_3px)] motion-reduce:hidden" />

                <div className="absolute inset-0 bg-gradient-to-t from-[#08090c]/95 via-[#08090c]/15 to-[#08090c]/30 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

                <CornerBrackets />

                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-aqua-400/90 bg-black/45 backdrop-blur-sm px-2 py-0.5 rounded-md border border-aqua-400/25">
                    CAM-{camId}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-red-400 bg-black/45 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-red-400/25">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                    REC
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-aqua-400">{item.tag}</span>
                    <span className="h-px flex-1 bg-aqua-400/30" />
                    <span className="font-mono text-[0.55rem] tracking-[0.12em] text-gray-500">HD</span>
                  </div>
                  <h4 className="font-display text-sm md:text-base text-gray-100 font-semibold leading-tight">{item.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-h-0 group-hover:max-h-10 opacity-0 group-hover:opacity-100 transition-all duration-300">{item.desc}</p>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-aqua-400/10 backdrop-blur-md border border-aqua-400/40 flex items-center justify-center scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                    <svg className="w-5 h-5 text-aqua-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.title}
            className="fixed inset-0 z-[2000] bg-[#08090c]/97 backdrop-blur-2xl"
            onClick={() => setLightbox(null)}
          >
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6 pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto" onClick={e => e.stopPropagation()}>
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-aqua-400 bg-black/50 backdrop-blur-md border border-aqua-400/25 px-2.5 py-1.5 rounded-md">
                  CAM-{lightboxCamId}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-red-400 bg-black/50 backdrop-blur-md border border-red-400/25 px-2 py-1 rounded-md">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  LIVE
                </span>
                <span className="hidden md:inline-block font-mono text-[0.55rem] uppercase tracking-[0.18em] text-gray-400 bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}
                </span>
              </div>
              <button
                onClick={() => setLightbox(null)}
                aria-label="Cerrar"
                className="pointer-events-auto w-10 h-10 bg-white/10 border border-white/15 rounded-full text-white flex items-center justify-center hover:bg-red-500/20 hover:border-red-400/40 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="absolute inset-0 flex items-center justify-center px-4 md:px-12 pt-20 pb-36 lg:pb-28" onClick={e => e.stopPropagation()}>
              <button
                onClick={prevImage}
                aria-label="Anterior"
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 border border-white/15 rounded-full text-white flex items-center justify-center hover:bg-aqua-400/20 hover:border-aqua-400/40 transition-all z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={nextImage}
                aria-label="Siguiente"
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 border border-white/15 rounded-full text-white flex items-center justify-center hover:bg-aqua-400/20 hover:border-aqua-400/40 transition-all z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>

              <div className="grid lg:grid-cols-[1fr_320px] gap-6 max-w-[1300px] w-full h-full items-center">
                <motion.div
                  key={lightbox.src}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="relative flex items-center justify-center min-h-0 h-full"
                >
                  <div className="relative">
                    <img
                      src={lightbox.src}
                      alt={lightbox.alt}
                      className="max-w-full max-h-[60vh] lg:max-h-[78vh] object-contain rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.7)]"
                    />
                    <CornerBrackets tone="white" />
                  </div>
                </motion.div>

                <motion.aside
                  key={`info-${lightbox.src}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.08 }}
                  className="hidden lg:flex flex-col gap-5 self-center bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 backdrop-blur-md"
                >
                  <div>
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-aqua-400/70">CATEGORÍA</span>
                    <p className="text-aqua-400 font-semibold mt-1 font-display">{lightbox.tag}</p>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div>
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-gray-500">TÍTULO</span>
                    <h3 className="font-display text-xl text-gray-100 font-semibold mt-1 leading-tight">{lightbox.title}</h3>
                  </div>
                  <div>
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-gray-500">DESCRIPCIÓN</span>
                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">{lightbox.desc}</p>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/30 rounded-lg p-3 border border-white/[0.04]">
                      <span className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-gray-500">RESOLUCIÓN</span>
                      <p className="text-aqua-400 font-mono text-sm mt-1 font-bold">4K · HD</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 border border-white/[0.04]">
                      <span className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-gray-500">ESTADO</span>
                      <p className="text-emerald-400 font-mono text-sm mt-1 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        ACTIVA
                      </p>
                    </div>
                  </div>
                  <div className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-gray-600 border-t border-white/[0.06] pt-3">
                    ← → · ESC para salir
                  </div>
                </motion.aside>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-2 pointer-events-none">
              <div className="lg:hidden text-center mb-3 pointer-events-auto" onClick={e => e.stopPropagation()}>
                <span className="inline-block font-mono text-[0.58rem] uppercase tracking-[0.2em] text-aqua-400 bg-aqua-400/10 border border-aqua-400/25 px-2.5 py-0.5 rounded-md mb-1.5">{lightbox.tag}</span>
                <h3 className="font-display text-base text-gray-100 font-semibold leading-tight">{lightbox.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 max-w-[420px] mx-auto">{lightbox.desc}</p>
              </div>

              <div className="flex items-center justify-center gap-1.5 pointer-events-auto overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" onClick={e => e.stopPropagation()}>
                {filtered.map((item, idx) => (
                  <button
                    key={item.src}
                    onClick={() => { setCurrentIndex(idx); setLightbox(item) }}
                    aria-label={`Ir a ${item.title}`}
                    className={`shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 ${idx === currentIndex ? 'w-14 h-14 border-aqua-400 shadow-[0_0_14px_rgba(61,209,204,0.4)]' : 'w-10 h-10 border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'}`}
                  >
                    <img src={item.src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
              <p className="text-center font-mono text-[0.55rem] uppercase text-gray-600 mt-2 tracking-[0.2em] lg:hidden">
                {String(currentIndex + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')} · ← → · ESC
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Nosotros() {
  return (
    <section id="nosotros" className="py-24 md:py-36 bg-gray-950 relative">
      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-[radial-gradient(ellipse_at_70%_100%,rgba(61,209,204,0.04),transparent_60%)]" />

      <div className="max-w-[1240px] mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-aqua-400 bg-[rgba(61,209,204,0.06)] border border-[rgba(61,209,204,0.12)] px-5 py-2 rounded-full mb-5">
              Por Qué Elegirnos
            </span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-[2rem] md:text-[3.2rem] font-bold text-gray-100 mb-4">
              Seguridad que<br />
              <span className="text-gradient">genera confianza</span>
            </motion.h2>
            <p className="text-gray-400 leading-relaxed mb-10">
              En Next Level CCTV combinamos experiencia técnica con equipamiento de primera línea para ofrecer soluciones de seguridad que realmente funcionan. Realizamos instalaciones desde cero y también evaluamos, reparamos y mejoramos sistemas previamente instalados por otros, elevando el estándar de seguridad de su hogar o negocio.
            </p>

            <div className="flex flex-col gap-7">
              {[
                { icon: <ShieldIcon />, title: "Equipos Certificados", desc: "Trabajamos con marcas líderes como Dahua, Hikvision y Cygnus, garantizando alta calidad y durabilidad." },
                { icon: <BoltIcon />, title: "Instalaciones y Mejoras", desc: "Instalaciones prolijas con altos estándares, además de diagnóstico, corrección y puesta en valor de redes preexistentes." },
                { icon: <ClockIcon />, title: "Soporte Post-Venta", desc: "No te dejamos solo. Brindamos asistencia continua y mantenimiento para que tu sistema siempre funcione perfecto." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-5"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-[rgba(61,209,204,0.06)] border border-[rgba(61,209,204,0.1)] rounded-xl shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-display text-base font-semibold text-gray-100 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[520px]"
          >
            <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-[28px] overflow-hidden border-2 border-white/[0.04]">
              <img src="/img/IMG_20251208_130612.jpg" alt="Sistema de monitoreo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="absolute bottom-0 right-0 w-[55%] h-[52%] rounded-[28px] overflow-hidden border-4 border-gray-950 z-10">
              <img src="/img/IMG_20251124_104028_HDR.jpg" alt="Cámara de seguridad" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute bottom-[18%] left-[-3%] glass rounded-xl p-5 text-center z-20 animate-float"
            >
              <span className="font-display text-[2.2rem] font-bold text-gradient">100%</span>
              <span className="block text-xs text-gray-400 mt-1">Garantía en<br />instalaciones</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CTABanner() {
  return (
    <section className="py-12 bg-gray-950">
      <div className="max-w-[1240px] mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-br from-[rgba(61,209,204,0.08)] via-[rgba(16,185,129,0.04)] to-[rgba(61,209,204,0.06)] border border-[rgba(61,209,204,0.1)] rounded-[28px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl"
        >
          <div className="absolute top-[-80%] right-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(61,209,204,0.08),transparent_70%)] rounded-full animate-pulse-glow" />

          <div className="relative z-10 text-center md:text-left">
            <h2 className="font-display text-[1.5rem] md:text-[2.2rem] font-bold text-gray-100 mb-2">
              Presupuesto <span className="text-gradient">Sin Cargo</span>
            </h2>
            <p className="text-gray-400">Contactanos hoy y recibe una evaluación gratuita de seguridad para tu hogar o negocio.</p>
          </div>

          <a
            href={`${WA_LINK}?text=Hola!%20Quiero%20un%20presupuesto%20sin%20cargo`}
            target="_blank"
            rel="noopener"
            className="relative z-10 inline-flex items-center gap-3 bg-gradient-to-r from-aqua-400 to-emerald-500 text-gray-950 px-8 py-4 rounded-2xl font-semibold hover:shadow-glow-strong hover:-translate-y-1 transition-all whitespace-nowrap"
          >
            <WhatsAppIcon />
            Consultar por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function Contacto() {
  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const nombre = form.nombre.value
    const telefono = form.telefono.value
    const email = form.email.value
    const servicio = form.servicio.value
    const mensaje = form.mensaje.value

    const text = encodeURIComponent(
      `Hola! Soy *${nombre}*\nTel: ${telefono}\nEmail: ${email}\nServicio: ${servicio}\nMensaje: ${mensaje}`
    )
    window.open(`${WA_LINK}?text=${text}`, '_blank')
  }

  return (
    <section id="contacto" className="py-24 md:py-36 bg-gray-900 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div className="max-w-[1240px] mx-auto px-5">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-aqua-400 bg-[rgba(61,209,204,0.06)] border border-[rgba(61,209,204,0.12)] px-5 py-2 rounded-full mb-5">
            Contacto
          </span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-[2rem] md:text-[3.2rem] font-bold text-gray-100 mb-4">
            Hablemos de tu <span className="text-gradient">Seguridad</span>
          </motion.h2>
          <p className="text-gray-400 max-w-[580px] mx-auto leading-relaxed">
            Estamos listos para ayudarte. Escribinos o llamanos para una consulta sin compromiso.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "📞", title: "Teléfono / WhatsApp", value: "+54 9 11 3568-6456", link: WA_LINK },
              { icon: "✉️", title: "Email", value: "nextlevelcctv1@gmail.com", link: "mailto:nextlevelcctv1@gmail.com" },
              { icon: "🕐", title: "Horario de Atención", value: "Lunes a Viernes: 10:00 - 20:00", span: true }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass rounded-2xl p-6 transition-all hover:-translate-y-2 hover:shadow-glow-strong ${item.span ? 'sm:col-span-2' : ''}`}
              >
                <div className="w-11 h-11 flex items-center justify-center bg-[rgba(61,209,204,0.06)] border border-[rgba(61,209,204,0.1)] rounded-xl mb-4 text-xl">
                  {item.icon}
                </div>
                <h4 className="font-display text-sm font-semibold text-gray-100 mb-1">{item.title}</h4>
                {item.link ? (
                  <a href={item.link} className={`text-sm ${item.highlight ? 'text-[#25D366]' : 'text-gray-400'} hover:text-aqua-400 transition-colors`}>
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-gray-400">{item.value}</p>
                )}
              </motion.div>
            ))}
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="glass rounded-[28px] p-8 md:p-10 grid sm:grid-cols-2 gap-5"
          >
            <div className="relative">
              <input type="text" name="nombre" required placeholder=" " className="w-full px-4 py-4 bg-[rgba(8,9,12,0.4)] border border-white/[0.05] rounded-xl text-gray-100 outline-none focus:border-aqua-400 focus:shadow-[0_0_0_3px_rgba(61,209,204,0.08)] transition-all peer" />
              <label className="absolute top-4 left-4 text-sm text-gray-500 pointer-events-none transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-aqua-400 peer-focus:bg-[rgba(15,17,23,0.9)] peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-xs">Nombre completo</label>
            </div>
            <div className="relative">
              <input type="tel" name="telefono" required placeholder=" " className="w-full px-4 py-4 bg-[rgba(8,9,12,0.4)] border border-white/[0.05] rounded-xl text-gray-100 outline-none focus:border-aqua-400 focus:shadow-[0_0_0_3px_rgba(61,209,204,0.08)] transition-all peer" />
              <label className="absolute top-4 left-4 text-sm text-gray-500 pointer-events-none transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-aqua-400 peer-focus:bg-[rgba(15,17,23,0.9)] peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-xs">Teléfono</label>
            </div>
            <div className="relative">
              <input type="email" name="email" required placeholder=" " className="w-full px-4 py-4 bg-[rgba(8,9,12,0.4)] border border-white/[0.05] rounded-xl text-gray-100 outline-none focus:border-aqua-400 focus:shadow-[0_0_0_3px_rgba(61,209,204,0.08)] transition-all peer" />
              <label className="absolute top-4 left-4 text-sm text-gray-500 pointer-events-none transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-aqua-400 peer-focus:bg-[rgba(15,17,23,0.9)] peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-xs">Email</label>
            </div>
            <div className="relative">
              <select name="servicio" required defaultValue="" className="w-full px-4 py-4 bg-[rgba(8,9,12,0.4)] border border-white/[0.05] rounded-xl text-gray-100 outline-none focus:border-aqua-400 transition-all appearance-none cursor-pointer">
                <option value="" disabled>Seleccione un servicio</option>
                <option value="camaras">Instalación o Mejora de Cámaras</option>
                <option value="monitoreo">Monitoreo 24/7</option>
                <option value="paneles">Paneles Eléctricos</option>
                <option value="pc">Reparación de PC</option>
                <option value="alarmas">Instalación de Alarmas</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="relative sm:col-span-2">
              <textarea name="mensaje" rows="4" required placeholder=" " className="w-full px-4 py-4 bg-[rgba(8,9,12,0.4)] border border-white/[0.05] rounded-xl text-gray-100 outline-none focus:border-aqua-400 focus:shadow-[0_0_0_3px_rgba(61,209,204,0.08)] transition-all peer resize-none" />
              <label className="absolute top-4 left-4 text-sm text-gray-500 pointer-events-none transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-aqua-400 peer-focus:bg-[rgba(15,17,23,0.9)] peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-xs">Mensaje</label>
            </div>
            <button type="submit" className="sm:col-span-2 bg-gradient-to-r from-aqua-400 to-emerald-500 text-gray-950 px-8 py-4 rounded-2xl font-semibold hover:shadow-glow-strong hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
              Enviar Consulta
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-18 bg-gray-950 border-t border-white/[0.04] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-px bg-gradient-to-r from-transparent via-aqua-400 to-transparent opacity-30" />

      <div className="max-w-[1240px] mx-auto px-5 pb-0">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 pb-14">
          <div>
            <a href="#hero" className="inline-block">
              <img src="/logonuevo.png" alt="Next Level CCTV" className="h-12 w-auto rounded-full shadow-glow" />
            </a>
            <p className="text-sm text-gray-500 mt-5 leading-relaxed max-w-[280px]">
              Seguridad y Tecnología al Máximo Nivel. Protegemos lo que más importa con soluciones profesionales e integrales.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-gray-100 mb-5">Servicios</h4>
            <ul className="flex flex-col gap-2.5">
              {["Cámaras de Seguridad", "Monitoreo 24/7", "Paneles Eléctricos", "Reparación de PC", "Alarmas"].map((s, i) => (
                <li key={i}><a href="#servicios" className="text-sm text-gray-500 hover:text-aqua-400 transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-gray-100 mb-5">Navegación</h4>
            <ul className="flex flex-col gap-2.5">
              {["Inicio", "Servicios", "Trabajos", "Comparador", "Nosotros", "Contacto"].map((s, i) => (
                <li key={i}><a href={`#${s.toLowerCase()}`} className="text-sm text-gray-500 hover:text-aqua-400 transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-gray-100 mb-5">Contacto</h4>
            <ul className="flex flex-col gap-3.5">
              <li className="flex items-center gap-2">
                <span className="text-gray-600">📞</span>
                <a href={WA_LINK} className="text-sm text-gray-500 hover:text-aqua-400">+54 9 11 3568-6456</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-600">✉️</span>
                <a href="mailto:nextlevelcctv1@gmail.com" className="text-sm text-gray-500 hover:text-aqua-400">nextlevelcctv1@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-600">🌐</span>
                <a href="https://www.nextlevelcctv.com.ar" className="text-sm text-gray-500 hover:text-aqua-400">www.nextlevelcctv.com.ar</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.04] py-7 text-center">
          <p className="text-xs text-gray-600">© 2026 Next Level CCTV. Todos los derechos reservados.</p>
          <p className="text-xs text-gray-600 mt-3">
            Desarrollado por <a href="mailto:ganymedev.sdk@gmail.com" className="text-aqua-400 font-bold hover:text-emerald-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-gradient-to-r after:from-aqua-400 after:to-emerald-500 hover:after:w-full">ganymedev</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppFloat() {
  return (
    <motion.a
      href={`${WA_LINK}?text=Hola!%20Quiero%20consultar%20por%20un%20servicio`}
      target="_blank"
      rel="noopener"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 z-[999] group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366]/10 animate-ping" />
      <span className="relative w-[60px] h-[60px] bg-[#08090c] border-2 border-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.35)] group-hover:shadow-[0_4px_40px_rgba(37,211,102,0.5)] group-hover:border-[#30e87a] transition-all duration-300">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366" className="group-hover:fill-[#30e87a] transition-all duration-300">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </span>
    </motion.a>
  )
}

function ScrollProgress({ scrollYProgress }) {
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-aqua-400 to-emerald-500 z-[1001] shadow-[0_0_10px_rgba(61,209,204,0.5)] origin-left"
    />
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()

  useEffect(() => {
    const unsub = scrollY.onChange((v) => setScrolled(v > 50))
    return () => unsub()
  }, [scrollY])

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />
      <Navbar scrolled={scrolled} />
      <main>
        <Hero />
        <Servicios />
        <Trabajos />
        <ComparadorResolucion />
        <Nosotros />
        <CTABanner />
        <Contacto />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
