import { init } from './three-helpers'
import raf from '../utils/raf'
import fx from './effects'
import { randomGenerator } from '../utils/helpers'
import { AmbientLight, Color, Fog, Mesh, MeshPhysicalMaterial, Object3D, PointLight, RepeatWrapping, TextureLoader } from 'three'
import { createBoxWithRoundedEdges, resetCubeRotation, selectFaceCubes } from './rubiks-helpers'
import gsap from 'gsap/all'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import normalMapTexture from '../../assets/normalmap.jpg'

const loader = new TextureLoader()
const seed = Math.round(Math.random() * 999999999)
const random = randomGenerator(17846364) // seed qui marche bien (le random sera toujours le même au refresh)
gsap.registerPlugin(ScrollTrigger)

// INIT

const { camera, renderer, scene } = init()
renderer.pixelRatio = 2
scene.background = new Color(0x080A18)

const { composer } = fx({ renderer, scene, camera })

camera.position.z = 25
camera.position.x = 25
camera.position.y = 25

scene.fog = new Fog(0x080A18, 8, 20)

// SKETCH

const light1 = new PointLight(0xffffff, 2, 0, 2)
const light2 = new PointLight(0xffffff, 2, 0, 2)
const amb = new AmbientLight(0xffffff, 1)
light1.position.set(10, 20, 15)
light2.position.set(-20, 40, 30)
scene.add(light1, light2, amb)

const colors = [0x110847, 0x085441, 0x111958, 0x07275a]

// creating rubiks cube
const rubiks = new Object3D()
for (let x = 0; x < 3; x++) {
  for (let y = 0; y < 3; y++) {
    for (let z = 0; z < 3; z++) {
      const wrapper = new Object3D()
      const color = colors[Math.round(random() * (colors.length - 1))]
      const normalMap = loader.load(normalMapTexture)
      normalMap.wrapS = RepeatWrapping
      normalMap.wrapT = RepeatWrapping
      // normalMap.repeat.set(4, 4)
      const geometry = createBoxWithRoundedEdges(0.98, 0.98, 0.98, 0.07, 2)
      const material = new MeshPhysicalMaterial({
        color,
        metalness: 0.5,
        roughness: 0.2,
        normalMap
      })
      const mesh = new Mesh(geometry, material)
      mesh.position.set(x - 1, y - 1, z - 1)
      wrapper.add(mesh)
      rubiks.add(wrapper)
    }
  }
}

let int
export function startRubiks () {
  scene.add(rubiks)

  rubiks.children.forEach(c => resetCubeRotation(c))

  gsap.to(camera.position, { x: 8, y: 8, z: 8, ease: 'expo.inOut', duration: 3 })

  // cubes moves every 3.5 seconds
  int = setInterval(() => {
    console.log(window.scrollY)
    if (window.scrollY === 0 && !document.hidden) {
      const axis = ['x', 'y', 'z'][Math.round(random() * 2)]
      rubiks.children.forEach(c => resetCubeRotation(c))

      gsap.to(selectFaceCubes(rubiks, axis, Math.round(random() * 2)).map(c => c.rotation), {
        [axis]: Math.PI / 2 * Math.ceil(random() * 3),
        duration: 3,
        ease: 'expo.inOut'
      })
    }
  }, 3500)

  const cubeExplosion = gsap.timeline({
    scrollTrigger: {
      trigger: document.body,
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
      c.rotation.x = progress.val * r()
      c.rotation.y = progress.val * r()
      c.rotation.z = progress.val * r()
    })
    composer.render()
  })
}
