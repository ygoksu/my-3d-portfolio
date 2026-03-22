import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ── Ayarlar ───────────────────────────────────────────────
const PARTICLE_COUNT     = 750
const SPREAD_X           = 16
const SPREAD_Y           = 9
const WAVE_AMPLITUDE     = 0.22
const WAVE_SPEED         = 0.9
const REPULSION_RADIUS   = 1.5
const REPULSION_STRENGTH = 0.22
const RETURN_SPEED       = 0.03
const DAMPING            = 0.25
const COLOR_CYCLE_SPEED  = 0.10   // hue/saniye (düşük = yavaş geçiş)
const POINT_SIZE         = 0.2   // world-space nokta boyutu
// ─────────────────────────────────────────────────────────

// HSL → RGB (Three.js Color kullanmadan, hızlı inline)
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h * 12) % 12
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return [f(0), f(8), f(4)]
}

// Altıgen texture — CanvasTexture
function createDashTexture() {
  const size = 32
  const canvas = document.createElement('canvas')
  canvas.width  = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = 'white'

  // Düzenli altıgen (flat-top): merkez (16,16), yarıçap 14
  const cx = size / 2, cy = size / 2, rad = 13
  ctx.beginPath()
  for (let k = 0; k < 6; k++) {
    const angle = (Math.PI / 3) * k - Math.PI / 6   // pointy-top
    const x = cx + rad * Math.cos(angle)
    const y = cy + rad * Math.sin(angle)
    k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fill()
  return new THREE.CanvasTexture(canvas)
}

export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null!)
  const { camera } = useThree()
  const mouse = useRef(new THREE.Vector3(9999, 9999, 0))
  const clock = useRef(0)

  const dashTexture = useMemo(() => createDashTexture(), [])

  const { positions, origins, velocities, colors, hueOffsets, phases } = useMemo(() => {
    const positions  = new Float32Array(PARTICLE_COUNT * 3)
    const origins    = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const colors     = new Float32Array(PARTICLE_COUNT * 3)
    const hueOffsets = new Float32Array(PARTICLE_COUNT)   // 0..1 başlangıç hue
    const phases     = new Float32Array(PARTICLE_COUNT)   // dalga fazı

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * SPREAD_X
      const y = (Math.random() - 0.5) * SPREAD_Y
      const z = (Math.random() - 0.5) * 0.05

      positions[i * 3]     = origins[i * 3]     = x
      positions[i * 3 + 1] = origins[i * 3 + 1] = y
      positions[i * 3 + 2] = origins[i * 3 + 2] = z

      hueOffsets[i] = Math.random()
      phases[i]     = Math.random() * Math.PI * 2

      // Başlangıç rengi
      const [r, g, b] = hslToRgb(hueOffsets[i], 0.85, 0.42)
      colors[i * 3] = r; colors[i * 3 + 1] = g; colors[i * 3 + 2] = b
    }

    return { positions, origins, velocities, colors, hueOffsets, phases }
  }, [])

  // Mouse → world space
  useMemo(() => {
    const onMove = (e: MouseEvent) => {
      const ndcX = (e.clientX / window.innerWidth)  * 2 - 1
      const ndcY = -(e.clientY / window.innerHeight) * 2 + 1
      const vec  = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera)
      const dir  = vec.sub(camera.position).normalize()
      const t    = -camera.position.z / dir.z
      const wp   = camera.position.clone().add(dir.multiplyScalar(t))
      mouse.current.set(wp.x, wp.y, 0)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [camera])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    clock.current += delta

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const colAttr = pointsRef.current.geometry.attributes.color    as THREE.BufferAttribute
    const pos = posAttr.array as Float32Array
    const col = colAttr.array as Float32Array

    const mx = mouse.current.x
    const my = mouse.current.y
    const t  = clock.current

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3
      const px = pos[idx], py = pos[idx + 1]
      const ox = origins[idx], oy = origins[idx + 1]

      // ── Dalga hedefi ──────────────────────────────────────
      const waveY = oy + Math.sin(t * WAVE_SPEED + phases[i]) * WAVE_AMPLITUDE
      const waveX = ox + Math.cos(t * WAVE_SPEED * 0.6 + phases[i]) * WAVE_AMPLITUDE * 0.5

      // ── Repulsion ─────────────────────────────────────────
      const dx = px - mx, dy = py - my
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < REPULSION_RADIUS && dist > 0.001) {
        const force = (REPULSION_RADIUS - dist) / REPULSION_RADIUS
        velocities[idx]     += (dx / dist) * force * REPULSION_STRENGTH
        velocities[idx + 1] += (dy / dist) * force * REPULSION_STRENGTH
      }

      // ── Spring → dalga hedefi + damping ──────────────────
      velocities[idx]     = (velocities[idx]     + (waveX - px) * RETURN_SPEED) * DAMPING
      velocities[idx + 1] = (velocities[idx + 1] + (waveY - py) * RETURN_SPEED) * DAMPING

      pos[idx]     = px + velocities[idx]
      pos[idx + 1] = py + velocities[idx + 1]

      // ── Renk döngüsü (yavaş HSL hue cycling) ─────────────
      const hue = (hueOffsets[i] + t * COLOR_CYCLE_SPEED) % 1.0
      const [r, g, b] = hslToRgb(hue, 0.85, 0.42)
      col[idx] = r; col[idx + 1] = g; col[idx + 2] = b
    }

    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={dashTexture}
        size={POINT_SIZE}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        alphaTest={0.05}
        depthWrite={false}
      />
    </points>
  )
}
