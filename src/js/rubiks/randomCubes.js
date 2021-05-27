import { init } from './three-helpers'
import raf from '../utils/raf'
import fx from './effects'
import { randomGenerator } from '../utils/helpers'
import { AmbientLight, Fog, Mesh, MeshPhysicalMaterial, Object3D, PointLight, RepeatWrapping, TextureLoader } from 'three'
import { createBoxWithRoundedEdges } from './rubiks-helpers'
import gsap from 'gsap/all'
import normalMapTexture from '../../assets/normalmap.jpeg'

export function startCubes (positions) {
  const loader = new TextureLoader()

  // const seed = Math.round(Math.random() * 999999999)
  const Random = randomGenerator(17836364) // seed qui marche bien (le random sera toujours le même au refresh)

  const colors = [0x2A3493, 0x329B8A, 0x483090, 0x2E6DA0, 0x4A589F]

  const composers = []

  function buildCube (color) {
    const normalMap = loader.load(normalMapTexture)
    normalMap.wrapS = RepeatWrapping
    normalMap.wrapT = RepeatWrapping

    const geometry = createBoxWithRoundedEdges(0.98, 0.98, 0.98, 0.07, 2)
    const material = new MeshPhysicalMaterial({
      color,
      metalness: 0.3,
      roughness: 0.2,
      normalMap
    })
    return new Mesh(geometry, material)
  }

  // INIT
  const inits = [
    init(
      '.gl-front',
      { alpha: true, from: 0.1, to: 100 }
    )
  ]

  inits.forEach(({ camera, renderer, scene, controls }, i) => {
    // const seed = Math.round(Math.random() * 999999999)
    // const random = randomGenerator(17846364) // seed qui marche bien (le random sera toujours le même au refresh)

    controls.autoRotateSpeed = 0

    const light1 = new PointLight(0xffffff, 1.8, 0, 1)
    const light2 = new PointLight(0xffffff, 2, 0, 1)
    const amb = new AmbientLight(0xffffff, 0.5)
    light1.position.set(10, 20, 15)
    light2.position.set(-20, 40, 30)

    renderer.pixelRatio = 2
    // if (i === 0) scene.background = new Color(0x080A18)

    composers.push(fx({ renderer, scene, camera }).composer)

    camera.position.z = 18
    camera.position.x = 16
    camera.position.y = 60

    scene.fog = new Fog(0x10122C, 8, 20)

    // SKETCH
    scene.add(light1, light2, amb)

    const cubes = new Object3D()

    // HERE CUBES
    positions.forEach(position => {
      const cube = buildCube(colors[Math.round(Random() * (colors.length - 1))])
      cube.position.set(position.x, position.y, position.z)
      cubes.add(cube)
    })
    scene.add(cubes)

    console.log(cubes.children)

    gsap.to(camera.position, { x: 8, y: 8, z: 8, ease: 'expo.out', duration: 1.6 })
    // gsap.from(cubes.rotation, { x: 3, ease: 'expo.inOut', duration: 3 })

    const cubeExplosion = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        scroller: '[data-scroll-container]',
        start: 'top',
        end: 'bottom',
        scrub: 0.5
      }
    })

    const progress = { val: 0 }

    cubeExplosion.to(progress, { val: 1 }, 0)
    cubeExplosion.to(cubes.position, { y: 20 }, 0)

    // ANIMATION

    raf.subscribe((time) => {
      const r = randomGenerator(3675)
      cubes.children.forEach(c => {
        c.rotation.x = progress.val * r() * 3
        c.rotation.y = progress.val * r() * 3
        c.rotation.z = progress.val * r() * 3
      })
      composers[i].render()
    })
  })
}
