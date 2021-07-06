import * as THREE from 'three'
import { init } from './three-helpers'
import raf from '../utils/raf'
import fx from './effects'
import { AmbientLight, AudioListener, ExtrudeBufferGeometry, Shape, Vector3, Color, CubeReflectionMapping, Fog, Mesh, MeshPhysicalMaterial, Object3D, PointLight, TextureLoader } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { createBoxWithRoundedEdges, resetCubeRotation, selectFaceCubes } from './rubiks-helpers'
import { randomGenerator } from '../utils/helpers'
import createParticleSystem from './particleSystem'
import normalMapTexture from '../../assets/normalmap.jpeg'
import albumTexture from '../../assets/images/album.jpg'
import aquariusTexture from '../../assets/images/aquarius.jpg'
import logoTexture from '../../assets/images/wordmark.png'
import artworkTexture from '../../assets/images/artwork.jpg'
import aquariusSong from '../../assets/sounds/aquarius.mp3'


export function startMuseum(canvas) {

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const inits = [
    init(
      '.touch',
      {}
    )
  ]

    // MANAGER
    const manager = new THREE.LoadingManager()

    const loader = new TextureLoader(manager)
    const normalMap = loader.load(normalMapTexture)
    // const planeTexture = loader.load(albumTexture)
    const planeTexture = loader.load(aquariusTexture)
    // const planeTexture3 = loader.load(logoTexture)
    // const planeTexture4 = loader.load(artworkTexture)


    // AUDIO
    const listener = new THREE.AudioListener()
    const sound = new THREE.Audio(listener)

    const audioLoader = new THREE.AudioLoader(manager)
    audioLoader.load(aquariusSong, function(buffer) {
      sound.setBuffer(buffer)
      sound.setLoop(true)
      sound.setVolume(0.5)
    })


  inits.forEach(({ camera, renderer, scene, controls }, i) => {

    const composers = []

    const mouse = new THREE.Vector2()
    const targetList = []
    let INTERSECTED
    const colors = [0x2A3493, 0x329B8A, 0x483090, 0x2E6DA0, 0x4A589F]
    const Random = randomGenerator(17846364)

    // CUBES
    function buildCube (color) {
      
      normalMap.wrapS = CubeReflectionMapping
      normalMap.wrapT = CubeReflectionMapping

      const geometry = createBoxWithRoundedEdges(0.98, 0.98, 0.98, 0.07, 2)
      const material = new MeshPhysicalMaterial({
        color,
        metalness: 0.3,
        roughness: 0.2,
        normalMap
      })
      return new Mesh(geometry, material)
    }


    // CREATE SCENE
    scene.background = new Color(0x10122C)
    scene.fog = new Fog(0x10122C, 20, 30)


    // CUBES
    const cubeNumber = 18
    const cubes = new Object3D()

    for (let createCubes = 0; createCubes < cubeNumber; createCubes++) {
      const cube = buildCube(colors[Math.round(Random() * (colors.length - 1))])
      let positions = {
        x: getRandomInt(-16, 16),
        y: getRandomInt(-16, 16),
        z: getRandomInt(-16, 16),
        rotationZ: getRandomInt(-60, 60),
        rotationX: getRandomInt(-60, 60),
        rotationY: getRandomInt(-60, 60),
      }
      cubes.add(cube)
      cube.position.x = positions.x
      cube.position.z = positions.z
      cube.position.y = positions.y
      cube.rotation.z = positions.rotationZ
      cube.rotation.x = positions.rotationX
      cube.rotation.x = positions.rotationY
    }
    scene.add(cubes)


    // PLANE
    const planeGeo = new THREE.PlaneGeometry(5,5)

    const album = new THREE.MeshBasicMaterial({map: planeTexture})
    const plane_GA = new THREE.Mesh(planeGeo, album)
    plane_GA.material.side = THREE.DoubleSide
    plane_GA.position.y = 0
    plane_GA.position.z = 12
    plane_GA.rotation.x = 0
    plane_GA.userData = { URL: "https://www.godsalgorithm.world/"}
    scene.add(plane_GA)
    targetList.push(plane_GA)


    // const aquarius = new THREE.MeshBasicMaterial({map: planeTexture2})
    // const plane_AQ = new THREE.Mesh(planeGeo, aquarius)
    // plane_AQ.material.side = THREE.DoubleSide
    // plane_AQ.position.y = 0
    // plane_AQ.position.z = -12
    // plane_AQ.rotation.x = 0
    // scene.add(plane_AQ)
    // targetList.push(plane_AQ)

    // const planeGeo2 = new THREE.PlaneGeometry(14,4)

    // const logo = new THREE.MeshBasicMaterial({map: planeTexture3, transparent: true})
    // const plane_LG = new THREE.Mesh(planeGeo2, logo)
    // plane_LG.material.side = THREE.DoubleSide
    // plane_LG.position.y = -12
    // plane_LG.position.z = 0
    // plane_LG.rotation.x = Math.PI / 2
    // plane_LG.rotation.y = Math.PI
    // scene.add(plane_LG)
    // targetList.push(plane_LG)



    // const artwork = new THREE.MeshBasicMaterial({map: planeTexture4})
    // const plane_AT = new THREE.Mesh(planeGeo, artwork)
    // plane_AT.material.side = THREE.DoubleSide
    // plane_AT.position.y = 12
    // plane_AT.position.z = 0
    // plane_AT.rotation.x = -Math.PI / 2
    // scene.add(plane_AT)
    // targetList.push(plane_AT)


    // LIGHTS
    const light1 = new PointLight(0xffffff, 1.8, 0, 1)
    const light2 = new PointLight(0xffffff, 2, 0, 1)
    const amb = new AmbientLight(0xffffff, 0.5)
    light1.position.set(10, 20, 15)
    light2.position.set(-20, 40, 30)
    scene.add(light1, light2, amb)


    // RENDERER
    renderer.setPixelRatio = 2
    renderer.setSize(window.innerWidth, window.innerHeight)


    // CAMERA
    camera.position.z = -10
    camera.position.x = 0
    camera.position.y = 0
    scene.add(camera)
    camera.add(listener)


    // LIGHTS
    const light = new THREE.AmbientLight( 0x404040 ) // soft white light
    scene.add(light)


    // PARTICLES
    const particles = createParticleSystem(250)
    scene.add(particles)


    // CONTROLS
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.085
    controls.autoRotateSpeed = 0

    let vector
    const raycaster = new THREE.Raycaster()

    function onDocumentMouseMove( event ) {

      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }
    document.addEventListener('mousemove', onDocumentMouseMove, false)

    function onWindowResize() {
      renderer.setSize( window.innerWidth, window.innerHeight )
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      animate()
    }

    function onDocumentMouseClick(event) {
      raycaster.setFromCamera(vector, camera)
      const intersects = raycaster.intersectObjects(targetList)
      if (intersects.length > 0) {
        sound.play()
      }
    }

    function onDocumentTouchEnd(event) {
        event.preventDefault()
        mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1

        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(targetList)
        if (intersects.length > 0) {
          sound.play()
        }
    }

    document.addEventListener('click', onDocumentMouseClick, false)
    document.addEventListener('resize', onWindowResize, false)
    document.addEventListener('touchend', onDocumentTouchEnd, false)
    composers.push(fx({ renderer, scene, camera }).composer)

    // ANIMATION

    raf.subscribe((time) => {
      const r = randomGenerator(3675)
      cubes.children.forEach(c => {
        c.rotation.x = time * (r() - 0.5) / 1500
        c.rotation.y = time * (r() - 0.5) / 1500
        c.rotation.z = time * (r() - 0.5) / 1500
      })
      vector = new THREE.Vector3(mouse.x, mouse.y, 1)
      raycaster.setFromCamera(vector, camera)

      const intersects = raycaster.intersectObjects(targetList) 
      
      if ( intersects.length > 0 ) {
        if ( intersects[0].object != INTERSECTED ) {
          if ( INTERSECTED ) 
            INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
          INTERSECTED = intersects[0].object
          INTERSECTED.currentHex = INTERSECTED.material.color.getHex()
          INTERSECTED.material.color.setHex( 0x99ccff )
          renderer.domElement.style.cursor = 'pointer'
        }
      } 
      else {
        if ( INTERSECTED ) 
        INTERSECTED.material.color.setHex( INTERSECTED.currentHex )
        INTERSECTED = null
        renderer.domElement.style.cursor = 'grab'
      }
      composers[i].render()
    })
  })
}