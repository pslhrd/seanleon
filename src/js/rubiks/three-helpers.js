import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import raf from '../utils/raf'

export function init () {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100)
  const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.gl-back'), antialias: true })
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
