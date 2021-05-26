import { init } from './three-helpers'
import raf from '../utils/raf'
import fx from './effects'
import { randomGenerator } from '../utils/helpers'
import { AmbientLight, Color, Fog, Mesh, MeshPhysicalMaterial, Object3D, PointLight, RepeatWrapping, TextureLoader } from 'three'
import { createBoxWithRoundedEdges, resetCubeRotation, selectFaceCubes } from './rubiks-helpers'
import gsap from 'gsap/all'
import normalMapTexture from '../../assets/normalmap.jpeg'
import state from '../../state'

export function startRubiks () {
  const loader = new TextureLoader()

  // const seed = Math.round(Math.random() * 999999999)
  const Random = randomGenerator(17846364) // seed qui marche bien (le random sera toujours le même au refresh)

  const light1 = new PointLight(0xffffff, 1.8, 0, 1)
  const light2 = new PointLight(0xffffff, 1.8, 0, 1)
  const amb = new AmbientLight(0xffffff, 0.4)
  light1.position.set(10, 20, 15)
  light2.position.set(-20, 40, 30)

  const colors = [0x2A3493, 0x329B8A, 0x483090, 0x2E6DA0, 0x4A589F]

  // creating rubiks cube
  const originalRubiks = new Object3D()
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        const wrapper = new Object3D()
        const color = colors[Math.round(Random() * (colors.length - 1))]
        const normalMap = loader.load(normalMapTexture)
        normalMap.wrapS = RepeatWrapping
        normalMap.wrapT = RepeatWrapping

        const geometry = createBoxWithRoundedEdges(0.98, 0.98, 0.98, 0.07, 4)
        const material = new MeshPhysicalMaterial({
          color,
          metalness: 0.2,
          roughness: 0.05,
          normalMap
        })
        const mesh = new Mesh(geometry, material)
        mesh.position.set(x - 1, y - 1, z - 1)
        wrapper.add(mesh)
        originalRubiks.add(wrapper)
      }
    }
  }

  const composers = []

  // INIT
  const inits = [
    init('.gl-back', { alpha: false, from: 11, to: 100 }),
    init('.gl-front', { alpha: true, from: 0.1, to: 11.1 })
  ]

  inits.forEach(({ renderer, camera, scene, controls }, i) => {
    // const seed = Math.round(Math.random() * 999999999)
    const random = randomGenerator(17846364) // seed qui marche bien (le random sera toujours le même au refresh)

    renderer.pixelRatio = 2
    if (i === 0) scene.background = new Color(0x080A18)

    composers.push(fx({ renderer, scene, camera }).composer)

    camera.position.z = 25
    camera.position.x = 25
    camera.position.y = 25

    scene.fog = new Fog(0x080A18, 8, 16)

    // SKETCH
    scene.add(light1.clone(), light2.clone(), amb.clone())

    const rubiks = originalRubiks.clone(true)
    scene.add(rubiks)

    rubiks.children.forEach(c => resetCubeRotation(c))

    gsap.to(camera.position, { x: 8, y: 8, z: 8, ease: 'expo.out', duration: 3 })
    gsap.from(rubiks.rotation, {y:-16, z: 4, x:4, ease: 'expo.out', duration: 3})

    // cubes moves every 3.5 seconds
    let currentAnim
    setInterval(() => {
      if (state.locoScroll.scroll.instance.scroll.y === 0 && !document.hidden) {
        const axis = ['x', 'y', 'z'][Math.round(random() * 2)]
        rubiks.children.forEach(c => resetCubeRotation(c))

        currentAnim = gsap.to(selectFaceCubes(rubiks, axis, Math.round(random() * 2)).map(c => c.rotation), {
          [axis]: Math.PI / 2 * Math.ceil(random() * 3),
          duration: 3,
          ease: 'expo.inOut'
        })
      }
    }, 3500)

    state.locoScroll.on('scroll', () => {
      if (state.locoScroll.scroll.instance.scroll.y === 0) {
        controls.autoRotateSpeed = 2
      } else {
        controls.autoRotateSpeed = 1.5
        if (currentAnim) {
          currentAnim.progress(0)
          currentAnim.kill()
        }
      }
    })

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
    cubeExplosion.to(rubiks.scale, { x: 0.7, y: 0.7, z: 0.7 }, 0)

    rubiks.children.map(c => c.children[0]).forEach(c => {
      // c = un des 9 cubes du rubiks cube
      const pos = { x: c.position.x, y: c.position.y, z: c.position.z }
      const randA = random() + 7
      const randB = (random() - 0.5) * 10
      cubeExplosion.to(c.position, {
        x: pos.x * randA + randB,
        y: pos.y * randA + randB,
        z: pos.z * randA + randB
      }, 0)
    })

    // ANIMATION

    raf.subscribe((time) => {
      const r = randomGenerator(3675)
      rubiks.children.map(c => c.children[0]).forEach(c => {
        c.rotation.x = progress.val * r() * 2
        c.rotation.y = progress.val * r() * 2
        c.rotation.z = progress.val * r() * 2
      })
      composers[i].render()
    })
  })
}
