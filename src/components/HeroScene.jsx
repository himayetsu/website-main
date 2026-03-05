import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ---------- Google Sphere rotation wrapper ----------

function RotatingGroup({ children }) {
  const groupRef = useRef()
  const rotVel = useRef({ x: 0, y: 0 })
  const hasPointer = useRef(false)

  useFrame((state) => {
    if (!groupRef.current) return
    const mx = state.pointer.x
    const my = state.pointer.y

    if (Math.abs(mx) > 0.001 || Math.abs(my) > 0.001) hasPointer.current = true

    if (hasPointer.current) {
      const targetVelY = mx * 0.016
      const targetVelX = -my * 0.01
      rotVel.current.y += (targetVelY - rotVel.current.y) * 0.05
      rotVel.current.x += (targetVelX - rotVel.current.x) * 0.05
    } else {
      rotVel.current.y += (0.003 - rotVel.current.y) * 0.02
      rotVel.current.x += (0.0005 - rotVel.current.x) * 0.02
    }

    groupRef.current.rotation.y += rotVel.current.y
    groupRef.current.rotation.x += rotVel.current.x
  })

  return <group ref={groupRef}>{children}</group>
}

// ---------- Shared material ----------

const mat = { color: '#a67c52', roughness: 0.75, metalness: 0.15, transparent: true, opacity: 0.45 }
const wireMat = { color: '#8b7355', wireframe: true, transparent: true, opacity: 0.15 }

// ---------- 1. Solar System ----------

function SolarSystem() {
  const planetRefs = useRef([])
  const moonRefs = useRef([])

  const orbits = useMemo(() => [
    { r: 0.9,  speed: 0.8,  size: 0.12, moons: [] },
    { r: 1.5,  speed: 0.45, size: 0.18, moons: [{ r: 0.28, speed: 2.5, size: 0.05 }] },
    { r: 2.15, speed: 0.28, size: 0.15, moons: [{ r: 0.24, speed: 3.0, size: 0.04 }, { r: 0.35, speed: 1.8, size: 0.035 }] },
    { r: 2.8,  speed: 0.17, size: 0.22, moons: [{ r: 0.32, speed: 2.2, size: 0.05 }] },
  ], [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    orbits.forEach((o, i) => {
      if (!planetRefs.current[i]) return
      const px = Math.cos(t * o.speed) * o.r
      const pz = Math.sin(t * o.speed) * o.r
      planetRefs.current[i].position.set(px, 0, pz)
      planetRefs.current[i].rotation.y = t * 0.5

      o.moons.forEach((m, mi) => {
        const key = `${i}-${mi}`
        const ref = moonRefs.current[key]
        if (!ref) return
        ref.position.set(
          px + Math.cos(t * m.speed + mi * 2) * m.r,
          0,
          pz + Math.sin(t * m.speed + mi * 2) * m.r,
        )
      })
    })
  })

  return (
    <group>
      {/* Sun */}
      <mesh>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color="#a67c52" emissive="#8b7355" emissiveIntensity={0.15} roughness={0.6} transparent opacity={0.3} />
      </mesh>
      {/* Sun wireframe glow */}
      <mesh>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshBasicMaterial color="#8b7355" wireframe transparent opacity={0.1} />
      </mesh>

      {orbits.map((o, i) => (
        <group key={i}>
          {/* Orbit ring — flat in XZ */}
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[o.r, 0.005, 8, 80]} />
            <meshBasicMaterial color="#8b7355" transparent opacity={0.1} />
          </mesh>
          {/* Planet */}
          <mesh ref={el => planetRefs.current[i] = el}>
            <sphereGeometry args={[o.size, 16, 16]} />
            <meshStandardMaterial {...mat} opacity={0.3}/>
          </mesh>
          {/* Moons */}
          {o.moons.map((m, mi) => (
            <mesh key={mi} ref={el => { moonRefs.current[`${i}-${mi}`] = el }}>
              <sphereGeometry args={[m.size, 10, 10]} />
              <meshStandardMaterial {...mat} opacity={0.2} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

// ---------- 2. Wave Sphere (Jello on a sphere) ----------

function WaveSphere() {
  const meshRef = useRef()
  const wireRef = useRef()

  const basePositions = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.8, 5)
    return geo.attributes.position.array.slice()
  }, [])

  useFrame((state) => {
    if (!meshRef.current?.geometry || !wireRef.current?.geometry) return
    const t = state.clock.elapsedTime * 2
    const pos = meshRef.current.geometry.attributes.position
    const wPos = wireRef.current.geometry.attributes.position

    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3
      const bx = basePositions[ix]
      const by = basePositions[ix + 1]
      const bz = basePositions[ix + 2]
      const len = Math.sqrt(bx * bx + by * by + bz * bz) || 1
      const nx = bx / len, ny = by / len, nz = bz / len

      const wave = Math.sin(nx * 12 + t) * 0.08
        + Math.sin(ny * 14 + t * 1.4) * 0.07
        + Math.sin(nz * 11 - t * 0.9) * 0.065
        + Math.sin((nx + ny) * 10 + t * 0.8) * 0.055
        + Math.sin((ny - nz) * 13 + t * 1.2) * 0.05
        + Math.sin((nx * ny) * 18 + t * 1.6) * 0.04
        + Math.sin((nx - nz) * 15 - t * 1.1) * 0.04
      const r = len + wave

      pos.array[ix] = nx * r
      pos.array[ix + 1] = ny * r
      pos.array[ix + 2] = nz * r
      wPos.array[ix] = nx * r
      wPos.array[ix + 1] = ny * r
      wPos.array[ix + 2] = nz * r
    }
    pos.needsUpdate = true
    wPos.needsUpdate = true
    meshRef.current.geometry.computeVertexNormals()
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 5]} />
        <meshStandardMaterial {...mat} opacity={0.3} />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.8, 5]} />
        <meshBasicMaterial {...wireMat} opacity={0.5}/>
      </mesh>
    </group>
  )
}

// ---------- 3. Asteroid Field (N-body gravity, elastic collisions) ----------

const ASTEROID_COUNT = 20
const G = 0.6
const G_CENTER = 1
const SOFTENING = 0.15
const DT = 0.0008

function AsteroidField() {
  const rockRefs = useRef([])

  const sim = useMemo(() => {
    const bodies = []
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.5 + Math.random() * 1.6
      const scale = 0.08 + Math.random() * 0.16
      const mass = scale * scale * scale * 800

      const px = r * Math.sin(phi) * Math.cos(theta)
      const py = r * Math.sin(phi) * Math.sin(theta)
      const pz = r * Math.cos(phi)

      const tangent = new THREE.Vector3(-py, px, pz * 0.3).normalize()
      const speed = 0.06 + Math.random() * 0.08

      bodies.push({
        pos: new THREE.Vector3(px, py, pz),
        vel: tangent.multiplyScalar(speed),
        mass,
        radius: scale,
        scale,
        detail: Math.floor(Math.random() * 2),
        rotAxis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
        rotAngle: 0,
        rotSpeed: 0.06 + Math.random() * 0.16,
      })
    }
    return { bodies }
  }, [])

  useFrame(() => {
    const { bodies } = sim
    const n = bodies.length
    const dt = DT

    // Accumulate gravitational acceleration
    for (let i = 0; i < n; i++) {
      const a = bodies[i]
      const ax = new THREE.Vector3(0, 0, 0)

      for (let j = 0; j < n; j++) {
        if (i === j) continue
        const b = bodies[j]
        const dx = b.pos.x - a.pos.x
        const dy = b.pos.y - a.pos.y
        const dz = b.pos.z - a.pos.z
        const distSq = dx * dx + dy * dy + dz * dz + SOFTENING * SOFTENING
        const dist = Math.sqrt(distSq)
        const force = G * b.mass / distSq
        ax.x += force * dx / dist
        ax.y += force * dy / dist
        ax.z += force * dz / dist
      }

      a.vel.x += ax.x * dt
      a.vel.y += ax.y * dt
      a.vel.z += ax.z * dt
    }

    // Update positions
    for (let i = 0; i < n; i++) {
      const a = bodies[i]
      a.pos.x += a.vel.x * dt
      a.pos.y += a.vel.y * dt
      a.pos.z += a.vel.z * dt
    }

    // Elastic collisions (100% energy retention)
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = bodies[i]
        const b = bodies[j]
        const dx = b.pos.x - a.pos.x
        const dy = b.pos.y - a.pos.y
        const dz = b.pos.z - a.pos.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        const minDist = a.radius + b.radius

        if (dist < minDist && dist > 0.001) {
          const nx = dx / dist, ny = dy / dist, nz = dz / dist

          // Separate overlapping bodies
          const overlap = (minDist - dist) / 2
          a.pos.x -= nx * overlap
          a.pos.y -= ny * overlap
          a.pos.z -= nz * overlap
          b.pos.x += nx * overlap
          b.pos.y += ny * overlap
          b.pos.z += nz * overlap

          // Elastic collision: exchange velocity components along collision normal
          const dvx = a.vel.x - b.vel.x
          const dvy = a.vel.y - b.vel.y
          const dvz = a.vel.z - b.vel.z
          const dvDotN = dvx * nx + dvy * ny + dvz * nz

          if (dvDotN > 0) {
            const totalMass = a.mass + b.mass
            const impulseA = (2 * b.mass / totalMass) * dvDotN
            const impulseB = (2 * a.mass / totalMass) * dvDotN

            a.vel.x -= impulseA * nx
            a.vel.y -= impulseA * ny
            a.vel.z -= impulseA * nz
            b.vel.x += impulseB * nx
            b.vel.y += impulseB * ny
            b.vel.z += impulseB * nz
          }
        }
      }
    }

    // Central gravity point — always pulls toward origin
    for (let i = 0; i < n; i++) {
      const a = bodies[i]
      const dist = a.pos.length()
      if (dist > 0.01) {
        const force = G_CENTER / (dist * dist + SOFTENING * SOFTENING)
        a.vel.x -= (a.pos.x / dist) * force * dt
        a.vel.y -= (a.pos.y / dist) * force * dt
        a.vel.z -= (a.pos.z / dist) * force * dt
      }
    }

    // Update meshes
    for (let i = 0; i < n; i++) {
      const ref = rockRefs.current[i]
      if (!ref) continue
      const b = bodies[i]
      ref.position.copy(b.pos)
      b.rotAngle += b.rotSpeed * dt
      ref.setRotationFromAxisAngle(b.rotAxis, b.rotAngle)
    }
  })

  return (
    <group>
      {sim.bodies.map((b, i) => (
        <mesh key={i} ref={el => rockRefs.current[i] = el} scale={b.scale}>
          <icosahedronGeometry args={[1, b.detail]} />
          <meshStandardMaterial {...mat} opacity={0.3}/>
        </mesh>
      ))}
    </group>
  )
}

// ---------- 4. Particle Cloud / Nebula (Prisma) ----------

function ParticleCloud() {
  const ref = useRef()
  const count = 300

  const { positions, basePositions } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const basePositions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 0.2 + Math.pow(Math.random(), 0.7) * 2.3
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      positions[i * 3] = basePositions[i * 3] = x
      positions[i * 3 + 1] = basePositions[i * 3 + 1] = y
      positions[i * 3 + 2] = basePositions[i * 3 + 2] = z
    }
    return { positions, basePositions }
  }, [])

  useFrame((state) => {
    const geo = ref.current
    if (!geo?.attributes?.position) return
    const t = state.clock.elapsedTime
    const pos = geo.attributes.position
    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const bx = basePositions[ix], by = basePositions[ix + 1], bz = basePositions[ix + 2]
      const drift = 1 + Math.sin(t * 0.4 + i * 0.25) * 0.1 + Math.cos(t * 0.3 + i * 0.15) * 0.06
      pos.array[ix] = bx * drift
      pos.array[ix + 1] = by * drift
      pos.array[ix + 2] = bz * drift
    }
    pos.needsUpdate = true
  })

  return (
    <points>
      <bufferGeometry ref={ref}>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.055} color="#a67c52" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

// ---------- Scene list ----------

const scenes = [SolarSystem, WaveSphere, AsteroidField, ParticleCloud]

// ---------- Ambient particles (from noise-sphere era — cursor-reactive, in every scene) ----------

function FloatingParticles() {
  const ref = useRef()
  const meshRef = useRef()
  const mouseSmooth = useRef({ x: 0, y: 0 })

  const { positions, basePositions } = useMemo(() => {
    const count = 120
    const positions = new Float32Array(count * 3)
    const basePositions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.5 + Math.random() * 4
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      positions[i * 3] = basePositions[i * 3] = x
      positions[i * 3 + 1] = basePositions[i * 3 + 1] = y
      positions[i * 3 + 2] = basePositions[i * 3 + 2] = z
    }
    return { positions, basePositions }
  }, [])

  useFrame((state) => {
    if (!ref.current || !meshRef.current?.attributes?.position) return
    const t = state.clock.elapsedTime
    mouseSmooth.current.x += (state.pointer.x - mouseSmooth.current.x) * 0.02
    mouseSmooth.current.y += (state.pointer.y - mouseSmooth.current.y) * 0.02
    const mx = mouseSmooth.current.x
    const my = mouseSmooth.current.y

    const pos = meshRef.current.attributes.position
    for (let i = 0; i < 120; i++) {
      const ix = i * 3
      const bx = basePositions[ix]
      const by = basePositions[ix + 1]
      const bz = basePositions[ix + 2]
      const orbit = t * 0.04 + i * 0.02
      const drift = Math.sin(orbit) * 0.15 + Math.cos(t * 0.2 + i * 0.1) * 0.1
      const towardCursor = 1 + (mx * bx * 0.15 + my * by * 0.15) + drift
      pos.array[ix] = bx * towardCursor
      pos.array[ix + 1] = by * towardCursor
      pos.array[ix + 2] = bz * towardCursor
    }
    pos.needsUpdate = true

    ref.current.rotation.y = t * 0.03 + mx * 0.2
    ref.current.rotation.x = Math.sin(t * 0.025) * 0.15 + my * 0.15
  })

  return (
    <points ref={ref}>
      <bufferGeometry ref={meshRef}>
        <bufferAttribute attach="attributes-position" count={120} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.055} color="#8b7355" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

// ---------- Main ----------

export default function HeroScene() {
  const [Scene] = useState(() => scenes[Math.floor(Math.random() * scenes.length)])

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'absolute',
      top: 0,
      left: 0,
    }}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[4, 3, 4]} intensity={0.5} color="#e8dcc8" />
        <pointLight position={[-3, -2, 3]} intensity={0.25} color="#c4b59a" />
        <RotatingGroup>
          <Scene />
          <FloatingParticles />
        </RotatingGroup>
      </Canvas>
    </div>
  )
}
