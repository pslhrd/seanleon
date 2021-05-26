import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import raf from '../utils/raf'

export function init (selector, opt) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, opt.from, opt.to)
  const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector(selector), antialias: true, alpha: opt.alpha })
  const controls = new OrbitControls(camera, renderer.domElement)

  renderer.setSize(window.innerWidth, window.innerHeight)
  // document.querySelector('main').appendChild(renderer.domElement)

  controls.enableDamping = true
  controls.enableZoom = false
  controls.autoRotate = true
  controls.autoRotateSpeed = 2

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  raf.subscribe(() => {
    controls.update()
  })

  return {
    scene,
    camera,
    renderer,
    controls
  }
}
