import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

// ── Sabitler ─────────────────────────────────────────────
const SEGMENTS = 4
const RADIUS = 0.72
const SEG_H = 0.28
const GAP = 0.06
const CAP_H = 0.07

const BODY_COLORS = {
  normal: '#4aace8',  // rgb(74, 174, 232) — kullanıcının istediği mavi
  hover: '#6ec0ef',  // hover için biraz daha parlak açık mavi
  cap: '#348cc2',  // kapaklar için biraz daha koyu/derin mavi
}

function getSegmentY(i: number) {
  const unitH = SEG_H + CAP_H * 2 + GAP
  return (i - (SEGMENTS - 1) / 2) * unitH
}

// ── LED renk & blink konfigürasyonu ─────────────────────
// Pozisyonlar: sol [-0.2], orta [0], sağ [0.2]
const LED_CONFIG = [
  { color: '#22c55e', emissive: '#22c55e', mode: 'blink-fast' }, // Sol  — yeşil, hızlı blink
  { color: '#f97316', emissive: '#f97316', mode: 'blink-slow' }, // Orta — turuncu, yavaş blink
  { color: '#374151', emissive: '#374151', mode: 'off' }, // Sağ  — kapalı, gri
] as const

type BlinkMode = typeof LED_CONFIG[number]['mode']

function blinkValue(t: number, mode: BlinkMode): number {
  if (mode === 'off') return 0.05
  if (mode === 'blink-fast') {
    // Sunucu aktivite blink: düzensiz hızlı yanıp sönme
    const fast = Math.sin(t * 12) > 0.2 ? 1 : 0
    const burst = Math.sin(t * 3.1) > 0.6 ? 1 : 0
    return (fast * 0.6 + burst * 0.4) * 2.8 + 0.05
  }
  if (mode === 'blink-slow') {
    // Yavaş kalp atışı gibi: açık/kapalı
    return Math.sin(t * 2.2) > 0.1 ? 2.2 : 0.05
  }
  return 0
}

// ── Gövde Segmenti ────────────────────────────────────────
function DatabaseSegment({ yCenter, hovered }: { yCenter: number; hovered: boolean }) {
  return (
    <group position={[0, yCenter, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[RADIUS, RADIUS, SEG_H, 128]} />
        <meshStandardMaterial
          color={hovered ? BODY_COLORS.hover : BODY_COLORS.normal}
          metalness={0.45}
          roughness={0.45}
        />
      </mesh>
      <mesh position={[0, SEG_H / 2 + CAP_H / 2, 0]} castShadow>
        <cylinderGeometry args={[RADIUS, RADIUS, CAP_H, 128]} />
        <meshStandardMaterial color={BODY_COLORS.cap} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, -(SEG_H / 2 + CAP_H / 2), 0]} castShadow>
        <cylinderGeometry args={[RADIUS, RADIUS, CAP_H, 128]} />
        <meshStandardMaterial color={BODY_COLORS.cap} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  )
}

// ── Ana Bileşen ───────────────────────────────────────────
export function DatabaseNode() {
  const groupRef = useRef<THREE.Group>(null!)
  const scroll = useScroll()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Her LED için materyal ref'i: [segment][dot]
  const ledRefs = useRef<(THREE.MeshStandardMaterial | null)[][]>(
    Array.from({ length: SEGMENTS }, () => Array(LED_CONFIG.length).fill(null))
  )

  // ── Mouse drag ───────────────────────────────────────────
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const dragVel = useRef({ x: 0, y: 0 })
  const autoRotate = useRef(true)
  const timeRef = useRef(0)

  const onPointerDown = (e: any) => {
    e.stopPropagation()
    isDragging.current = true
    autoRotate.current = false
    lastPointer.current = { x: e.clientX, y: e.clientY }
    dragVel.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: any) => {
    if (!isDragging.current || !groupRef.current) return
    const dx = e.clientX - lastPointer.current.x
    const dy = e.clientY - lastPointer.current.y
    groupRef.current.rotation.y += dx * 0.012
    groupRef.current.rotation.x += dy * 0.012
    dragVel.current = { x: dy * 0.012, y: dx * 0.012 }
    lastPointer.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = () => {
    isDragging.current = false
    setTimeout(() => { autoRotate.current = true }, 2000)
  }

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    timeRef.current += delta * (hovered ? 0.6 : 0.3)

    // ── LED blink güncelle ─────────────────────────────────
    ledRefs.current.forEach((row) => {
      LED_CONFIG.forEach((cfg, di) => {
        const mat = row[di]
        if (mat) mat.emissiveIntensity = blinkValue(t, cfg.mode)
      })
    })

    // ── Rotasyon ───────────────────────────────────────────
    if (!isDragging.current) {
      if (Math.abs(dragVel.current.x) > 0.0001 || Math.abs(dragVel.current.y) > 0.0001) {
        groupRef.current.rotation.x += dragVel.current.x
        groupRef.current.rotation.y += dragVel.current.y
        dragVel.current.x *= 0.92
        dragVel.current.y *= 0.92
      }
      if (autoRotate.current) {
        // -120° ile +120° (toplam 240 derecelik bir alan) arasında sarkaç gibi salınım (oscillation)
         const targetY = Math.sin(timeRef.current) * (100 * Math.PI / 180)
         groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05)

        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          Math.sin(t * 0.6) * 0.07,
          0.03
        )
      }
    }

    // ── Scroll pozisyon ─────────────────────────────────────
    const r2 = scroll.range(1 / 4, 1 / 4) as number
    const r3 = scroll.range(2 / 4, 1 / 4) as number
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, r2 * 2.5 + r3 * -2.5, 0.05)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, r2 * -1 + r3 * 1.5, 0.05)

    const targetScale = clicked ? 1.25 : 1
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1))
  })

  const LED_X = [-0.2, 0, 0.2]

  return (
    <>
      {/* Dış group: sabit sağa offset */}
      <group position={[1.8, 0, 0]}>
        {/* İç group: ref, drag ve animasyon */}
        <group
          ref={groupRef}
          onClick={(e: any) => { e.stopPropagation(); setClicked(!clicked) }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onPointerOver={() => { setHovered(true); document.body.style.cursor = 'grab' }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        >
          {/* Gövde katmanları */}
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <DatabaseSegment key={i} yCenter={getSegmentY(i)} hovered={hovered} />
          ))}

          {/* LED dot'lar */}
          {Array.from({ length: SEGMENTS }, (_, si) =>
            LED_CONFIG.map((cfg, di) => {
              // Silindirin kavisinden dolayı x eksenindeki konuma göre z derinliğini hesaplıyoruz
              // Böylece tüm LED'ler eşit gömülü görünür (ne çok içeride ne dışarıda)
              const xPos = LED_X[di]
              const zPos = Math.sqrt(RADIUS * RADIUS - xPos * xPos) - 0.019

              return (
                <mesh key={`${si}-${di}`} position={[xPos, getSegmentY(si), zPos]}>
                  <sphereGeometry args={[0.038, 16, 16]} />
                  <meshStandardMaterial
                    ref={(mat) => { ledRefs.current[si][di] = mat }}
                    color={cfg.color}
                    emissive={cfg.emissive}
                    emissiveIntensity={0.05}
                    roughness={0.1}
                    metalness={0}
                  />
                </mesh>
              )
            })
          )}

          {/* Minimal glow ışıkları */}
          <pointLight position={[0, 1.0, 0.6]} intensity={hovered ? 0.3 : 0.08} color="#00d4ff" distance={3} />
          <pointLight position={[0, -1.0, 0.6]} intensity={hovered ? 0.2 : 0.05} color="#22c55e" distance={3} />
        </group>
      </group>
    </>
  )
}