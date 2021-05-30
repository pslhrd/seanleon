import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
// import { Vector2 } from 'three'

export default function composer ({ renderer, scene, camera }) {
  const composer = new EffectComposer(renderer)
  composer.setSize(window.innerWidth * 2, window.innerHeight * 2)
  composer.addPass(new RenderPass(scene, camera))

  // const bloomFx = new UnrealBloomPass(new Vector2(window.innerWidth * 2, window.innerHeight * 2), 0.8, 0.01, 0)
  // composer.addPass(bloomFx)

	const filmPass = new FilmPass(
	    0.2,   // noise intensity
	    0,  // scanline intensity
	    648,    // scanline count
	    false,  // grayscale
	)
	filmPass.renderToScreen = true

  const uA = navigator.userAgent
  const vendor = navigator.vendor

  if (/Safari/i.test(uA) && /Apple Computer/.test(vendor) && !/Mobi|Android/i.test(uA)) {

  } else {
    composer.addPass(filmPass)
  }
	// 

  const fxaa = new ShaderPass(FXAAShader)
  fxaa.renderToScreen = true
  composer.addPass(fxaa)

  return { composer }
}
