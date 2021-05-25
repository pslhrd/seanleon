import { ExtrudeBufferGeometry, Shape, Vector3 } from 'three'

export function createBoxWithRoundedEdges (width, height, depth, radius0, smoothness) {
  const shape = new Shape()
  const eps = 0.00001
  const radius = radius0 - eps
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true)
  shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true)
  shape.absarc(width - radius * 2, height - radius * 2, eps, Math.PI / 2, 0, true)
  shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true)
  const geometry = new ExtrudeBufferGeometry(shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness
  })

  geometry.center()

  return geometry
}

export function selectFaceCubes (cube, axis, row) {
  return cube.children.filter(c => {
    const target = new Vector3()
    c.children[0].getWorldPosition(target)
    return Math.round(target[axis]) === row - 1
  })
}

export function resetCubeRotation (cube) {
  const pos = new Vector3()
  cube.children[0].getWorldPosition(pos)
  cube.position.set(0, 0, 0)
  cube.rotation.set(0, 0, 0)
  cube.children[0].rotation.set(0, 0, 0)
  cube.children[0].position.set(
    Math.round(pos.x),
    Math.round(pos.y),
    Math.round(pos.z)
  )
}
