import * as THREE from 'three'

export default function createParticleSystem (n) {
  const particles = new THREE.BufferGeometry()
  const vertices = []
  const pMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    opacity: 0.15,
    size: 0.1,
    transparent: true
  })

  for (let p = 0; p < n; p++) {
    const pX = Math.random() * 20 - 10
    const pY = Math.random() * 20 - 10
    const pZ = Math.random() * 20 - 10

    vertices.push(pX, pY, pZ)
  }

  particles.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

  return new THREE.Points(particles, pMaterial)
}
