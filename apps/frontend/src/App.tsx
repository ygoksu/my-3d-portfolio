import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, Html, PerformanceMonitor, Environment } from '@react-three/drei'
import * as A11Y from '@react-three/a11y'
import axios from 'axios'
import { DatabaseNode } from './canvas/DatabaseNode'
import { ParticleField } from './canvas/ParticleField'
import { ResumeSection } from './components/ResumeSection'
import { type Project } from './types'

function App() {
  const [dpr, setDpr] = useState(1.5)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/projects`)
      .then(res => setProjects(res.data.data))
      .catch(() => setProjects([]))
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <A11Y.A11yAnnouncer />

      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          background: 'transparent',
        }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
        <Environment preset="city" />
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 8, 5]} intensity={0.4} />
        <pointLight position={[-5, 5, 3]} intensity={0.3} color="#bfdbfe" />

        <Suspense fallback={<Html center><span className="text-lg text-slate-500 animate-pulse">Yükleniyor...</span></Html>}>
          <ScrollControls pages={5} damping={0.2}>

            {/* 3D Katmanı */}
            <Scroll>
              <ParticleField />
              <DatabaseNode />
            </Scroll>

            {/* HTML Katmanı */}
            <Scroll html style={{ width: '100%', pointerEvents: 'none' }}>
              {/* Google Fonts import - <head> içine ekleyin */}
              {/* <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" /> */}

              {/* Hero */}
              <section className="h-screen flex flex-col items-start justify-center px-12 md:px-20">
                <div className="bg-white/60 backdrop-blur-xsm rounded-3xl border border-white/30 shadow-2xl px-10 py-10 pointer-events-auto">
                  <p
                    className="text-md font-semibold tracking-[0.35em] uppercase text-indigo-700 mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Portfolio
                  </p>
                  <h1
                    className="text-5xl md:text-7xl font-black text-slate-900 leading-tight pb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Yusuf Göksu
                  </h1>
                  <p
                    className="text-2xl md:text-4xl font-semibold text-indigo-700 mt-4 tracking-wide"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Data Engineer
                  </p>
                  <div className="mt-6 w-16 h-[2px] bg-indigo-400" />
                  <p
                    className="text-lg md:text-2xl font-medium mt-6 flex flex-wrap gap-x-3 gap-y-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    <span className="text-blue-600">Azure</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-orange-600">Python</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-green-600">Go</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-cyan-600">React</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-violet-600">Three.js</span>
                  </p>

                  {/* Sosyal Medya Butonları */}
                  <div className="mt-8 flex flex-wrap gap-4 pointer-events-auto">
                    <a
                      href="https://github.com/ygoksu"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-6 py-2.5 bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all font-semibold text-slate-800"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      GitHub
                    </a>
                    <a
                      href="https://www.linkedin.com/in/yusufgoksu"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-6 py-2.5 bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all font-semibold text-slate-800"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  </div>
            </div>
          </section>


          {/* Özgeçmiş (Resume) */}
          <ResumeSection />

          {/* Projeler */}
          <section className="min-h-screen flex flex-col items-center justify-start p-10 md:p-32">
            <div className="w-full max-w-5xl pointer-events-auto">
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-indigo-500 mb-3">
                Work
              </p>
              <h2 className="text-4xl font-bold text-slate-900 mb-12">
                Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.length > 0 ? projects.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{p.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{p.description}</p>
                    {p.tech_stack?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {p.tech_stack.map(t => (
                          <span key={t} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )) : (
                  <p className="text-slate-400 text-sm">Loading data...</p>
                )}

                {/* Özelleştirilmiş 42 Projeleri — Link eklenecek yerler */}
                {[
                  { title: "42_solong", description: "A small 2D game using MiniLibX.", tags: ["C", "MiniLibX", "Algorithms"], link: "https://github.com/ygoksu/42_solong" },
                  { title: "push_swap", description: "Data sorting project using two stacks with an optimized algorithm.", tags: ["C", "Sorting", "Algorithm"], link: "https://github.com/ygoksu/push_swap" },
                  { title: "ft_printf", description: "Recoding the famous printf function in C.", tags: ["C", "Variadic Functions"], link: "https://github.com/ygoksu/ft_printf" }
                ].map(proj => (
                  <div key={proj.title} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{proj.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{proj.description}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {proj.tags.map(t => (
                          <span key={t} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* GITHUB LINK */}
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      View Source on GitHub ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>


        </Scroll>
      </ScrollControls>
    </Suspense>
      </Canvas >
    </div >
  )
}

export default App