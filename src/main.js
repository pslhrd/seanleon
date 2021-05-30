import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
import LocomotiveScroll from 'locomotive-scroll'
import barba from '@barba/core'
import { startRubiks } from './js/rubiks/rubiks'
import { startCubes } from './js/rubiks/randomCubes'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import state from './state'
import SplitText from './SplitText'

gsap.registerPlugin(ScrollToPlugin)
gsap.registerPlugin(ScrollTrigger)

const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i)
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i)
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i)
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i)
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i)
  },
  any: function () {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())
  }
}

if (isMobile.any() === null) {
  console.log('Not Mobile')
} else {
  console.log(isMobile.any())
}

let videos;

function smooth (container) {
  if (state.locoScroll) state.locoScroll.destroy()
  state.locoScroll = new LocomotiveScroll({
    el: container.querySelector('[data-scroll-container]'),
    smooth: true,
    smoothMobile: false
  })

  state.locoScroll.on('scroll', ScrollTrigger.update)

  ScrollTrigger.scrollerProxy('[data-scroll-container]', {
    scrollTop (value) {
      return arguments.length ? state.locoScroll.scrollTo(value, 0, 0) : state.locoScroll.scroll.instance.scroll.y
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect () {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
    },
    // LocomotiveScroll handles things completely differently on mobile devices -
    // it doesn't even transform the container at all! So to get the correct
    // behavior and avoid jitters, we should pin things with position:
    // fixed on mobile. We sense it by checking to see if there's a transform
    // applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed'
  })

  ScrollTrigger.addEventListener('refresh', () => state.locoScroll.update())
  ScrollTrigger.refresh()
}

function homeLaunch () {
  const tl = gsap.timeline()
  gsap.set('.gods', { opacity: 0, x: '-10%' })
  gsap.set('.algo', { opacity: 0, y: '-20%' })
  gsap.set('.hero .data', { opacity: 0 })
  gsap.set('.hero01', { x: '10%' })
  gsap.set('.title-wrapper-content span, .title-wrapper-infos span', { opacity: 0 })
  gsap.set('header .logo, ul li a', { opacity: 0 })

  tl
    .add(() => startRubiks())
    .to('header .logo, ul li a', { opacity: 1, stagger: 0.1, duration: 0.1 }, '+=1.5')
    .to('.gods', { opacity: 1, duration: 0.01 })
    .to('.gods', { x: '0%', duration: 1.5, ease: 'power4.out' })
    .to('.algo', { opacity: 1, duration: 0.01 }, '-=1.4')
    .to('.algo', { y: '0%', duration: 1.4, ease: 'power4.out' }, '-=1.4')
    .to('.title-wrapper-content span, .title-wrapper-infos span', {opacity: 1, duration: 0.01, stagger: 0.1, ease: 'power4.out'}, '-=0.8')
    .to('.hero .data', { opacity: 1, duration: 0.1, stagger: 0.075 }, '-=1')
    .to('.hero01', { x: '0%', duration: 1.2, ease: 'power4.out' }, '-=1')
}

function touchLaunch (cubes) {

  const words = new SplitText(".content-page-title", {type:"words", wordsClass:"words"})
  const lines = new SplitText(".content-page-text", {type:"lines", linesClass:"lines"})

  const tl2 = gsap.timeline()
  gsap.set('.words', { opacity: 0, y: '80%' })
  gsap.set('.lines', { opacity: 0})
  gsap.set('header .logo, ul li a', { opacity: 0 })
  gsap.set('.appear', { opacity:0, y:'20%' })

  tl2
    .add(() => startCubes(cubes))
    .to('header .logo, ul li a', { opacity: 1, stagger: 0.1, duration: 0.1 })
    .to('.words', { opacity: 1, y: '0%', duration:1.3, ease:'power4.out', stagger:0.075}, '-=0.2')
    .to('.content-page-text .lines', { opacity: 1, duration: 0.1, stagger: 0.1}, '-=1.1')
    .to('.appear', { opacity: 1, y: '0%', duration:1.3, ease:'power4.out'}, '-=1')
}

function seeScroll() {
  state.locoScroll.on('call', function (event, element, i) {
    if (event === 'video') {
      let video = i.el.querySelector('video')
      video.play()
    }
  })
}

function homeScroll () {

  const splitLines = new SplitText(".protagonist-content, .objective-content, .reality-content, .simulation-content", {type:"lines", linesClass:"lines"})
  gsap.set('.lines', { opacity: 0 })

  gsap.set('.protagonist .first', { opacity: 0, y: '15%' })
  gsap.set('.protagonist .second', { opacity: 0, x: '10%' })
  gsap.set('.protagonist .third', { opacity: 0, x: '-5%' })

  gsap.set('.objective .first', { opacity: 0 })
  gsap.set('.objective .second', { opacity: 0, x: '3%' })
  gsap.set('.objective .number', { opacity: 0, y: '-20%' })

  gsap.set('.reality .first', { opacity: 0, x: '-10%' })
  gsap.set('.reality .second', { opacity: 0, x: '10%' })
  gsap.set('.reality .third', { opacity: 0, y: '10%' })

  gsap.set('.simulation .first', { opacity: 0, x: '-10%' })
  gsap.set('.simulation .second', { opacity: 0, x: '10%' })
  gsap.set('.simulation .mono', { opacity: 0 })

  state.locoScroll.on('call', function (event, element, i) {
    if (event === 'protagonist') {
      const tl = gsap.timeline()
      tl
        .to('.protagonist .first', { opacity: 1, duration: 0.1 })
        .to('.protagonist .first', { y: '0%', duration: 1.2, ease: 'power4.out' })
        .to('.protagonist .second', { opacity: 1, duration: 0.1 }, '-=1')
        .to('.protagonist .second', { x: '0%', duration: 1.2, ease: 'power4.out' }, '-=1')
        .to('.protagonist .third', { opacity: 1, duration: 0.1 }, '-=1.1')
        .to('.protagonist .third', { x: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.1')
    }

    if (event === 'objective') {
      const tl = gsap.timeline()
      tl
        .to('.objective .first', { opacity: 1, duration: 0.1 })
        .to('.objective .second', { opacity: 1, duration: 0.1 }, 0.2)
        .to('.objective .second', { x: '0%', duration: 1.2, ease: 'power4.out' }, 0.2)
        .to('.objective .number', { opacity: 1, duration: 0.1 }, '-=1.2')
        .to('.objective .number', { y: '0%', duration: 1.6, ease: 'power4.out' }, '-=1.2')
    }

    if (event === 'reality') {
      const tl = gsap.timeline()
      tl
        .to('.reality .third', { opacity: 1, duration: 0.1 })
        .to('.reality .third', { y: '0%', duration: 1.2, ease: 'power4.out' })
        .to('.reality .first', { opacity: 1, duration: 0.1 }, '-=1.1')
        .to('.reality .first', { x: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.1')
        .to('.reality .second', { opacity: 1, duration: 0.1 }, '-=1.1')
        .to('.reality .second', { x: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.1')
    }

    if (event === 'simulation') {
      const tl = gsap.timeline()
      tl
        .to('.simulation .mono', { opacity: 1, stagger:0.4, duration:0.1})
        .to('.simulation .first', { opacity: 1, duration: 0.1 }, '-=0.4')
        .to('.simulation .first', { x: '0%', duration: 1.2, ease: 'power4.out' }, '-=1')
        .to('.simulation .second', { opacity: 1, duration: 0.1 }, '-=1.1')
        .to('.simulation .second', { x: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.1')
    }

    if (event === 'appear') {
      i.el.classList.add('opacity')
      const text = i.el.querySelectorAll('.lines')
      gsap.to(text, { opacity: 1, duration: 0.01, stagger: 0.2, ease: 'power3.out' })
    }

    if (event === 'opacity') {
      gsap.to(i.el, { opacity: 1, duration: 1.3, y: 0, ease: 'power4.out' })
    }
  })

  const albumTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.album',
      scroller: '[data-scroll-container]',
      scrub: 1,
      start: '-=60%',
      end: '+=90%',
    }
  })

  const introTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".introduction",
      scroller: '[data-scroll-container]',
      scrub: true,
      start: "top top",
      end: "+=100%",
    } 
  })

  introTl
  .to('.fixed-wrapper-content span', {opacity:1, stagger:0.1, y:0, duration:1, ease:'power3.out'})
  .to('.fixed-wrapper-content span', {opacity:0, stagger:0.1, y:-40, duration:1, ease:'power3.in'})


  albumTl
  .from('.rectangle', { rotationX: 6, scale:0.7, autoAlpha:0, duration:1, ease:'power3.inOut' })
  .from('.circle', {scale:0.7, autoAlpha:0, duration:1, ease:'power3.inOut' }, '-=0.8')
  .from('.album-cover .img-wrapper', { rotation: -10, scale:0.7, autoAlpha:0, duration:1.6, ease:'power4.out' }, '-=0.5')
  .from('.album-content span', { y:20, autoAlpha:0,duration:1, ease:'power3.out', stagger:0.1 }, '-=0.6')
  
}

barba.init({
  debug: true,
  transitions: [{
    name: 'opacity-transition',
    once ({ next }) {
      gsap.to('.preloader', { autoAlpha: 0, duration: 1, delay: 0.5 })
      smooth(next.container)
    },
    beforeEnter ({ next }) {
      state.nextContainer = next.container
      smooth(next.container)
    },
    leave (data) {
      if (isMobile.any()) {
        gsap.set(window, { scrollTo: 0 })
      }
      document.querySelector('.transition').style.transformOrigin = 'bottom'
      return gsap.to(data.current.container, { opacity: 0, duration: 0.6, ease: 'power3.inOut' })
    },
    enter (data) {
      data.current.container.style.display = 'none'
      document.querySelector('.transition').style.transformOrigin = 'top'
      state.locoScroll.update()
      return gsap.from(data.next.container, { opacity: 0, duration: 1, ease: 'power3.inOut', delay: 0.5 })
    }
  }],
  views: [{
    namespace: 'home',
    beforeEnter ({ next }) {
      state.nextContainer = next.container
      smooth(next.container)
      homeLaunch()
      if (isMobile.any()) {
        next.container.querySelector('.gl-front').style.position = 'fixed'
        next.container.querySelector('.gl-back').style.position = 'fixed'
      }
    },
    afterEnter ({ next }) {
      homeScroll()
    }
  }, {
    namespace: 'touch',
    beforeEnter ({ next }) {
      state.nextContainer = next.container
      smooth(next.container)
      touchLaunch([
        { x: 0, y: 1, z: -6 },
        { x: -2, y: 2, z: 4 },
        { x: 1, y: -1, z: -1 },
        { x: 7, y: -10, z: 1 },
        { x: -4, y: -15, z: 2 },
        { x: 2, y: -20, z: -1 }
      ])
      if (isMobile.any()) {
        next.container.querySelector('.gl-front').style.position = 'fixed'
        next.container.querySelector('.gl-back').style.position = 'fixed'
      }
    },
    afterEnter ({ next }) {
      // smooth(next.container)
    }
  }, {
    namespace: 'see',
    beforeEnter ({ next }) {
      state.nextContainer = next.container
      smooth(next.container)
      touchLaunch([
        { x: -3, y: 3, z: 4 },
        { x: 3, y: -5, z: -2 },
        { x: -2, y: 0, z: 2 },
        { x: -5, y: -5, z: 0 },
        { x: 7, y: -10, z: 1 },
        { x: -4, y: -15, z: 2 },
        { x: 2, y: -20, z: -1 },
        { x: 2, y: 4, z: -6 }
      ])
      if (isMobile.any()) {
        next.container.querySelector('.gl-front').style.position = 'fixed'
        next.container.querySelector('.gl-back').style.position = 'fixed'
      }
    },
    afterEnter ({ next }) {
      // smooth(next.container)
      seeScroll()
    }
  }]
})
