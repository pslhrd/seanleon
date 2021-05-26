import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
import LocomotiveScroll from 'locomotive-scroll'
import barba from '@barba/core'
import { startRubiks } from './js/rubiks/rubiks'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import state from './state'

gsap.registerPlugin(ScrollToPlugin)

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

function smooth (container) {
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
  startRubiks()

  const tl = gsap.timeline()
  gsap.set('.gods, .algo', { opacity: 0, x: '-10%' })
  gsap.set('.hero .data', { opacity: 0 })
  gsap.set('.hero01', { x: '10%' })
  gsap.set('.hero03', { x: '-50%' })
  gsap.set('header .logo, ul li a', { opacity: 0 })

  tl
    .to('header .logo, ul li a', { opacity: 1, stagger: 0.1, duration: 0.1 }, 0.2)
    .to('.gods', { opacity: 1, duration: 0.01 }, 0.3)
    .to('.gods', { x: '0%', duration: 1.5, ease: 'power4.out' }, 0.3)
    .to('.algo', { opacity: 1, duration: 0.01 }, 0.7)
    .to('.algo', { x: '0%', duration: 1.4, ease: 'power4.out' }, '-=1.5')
    .to('.hero .data', { opacity: 1, duration: 0.1, stagger: 0.075 }, '-=1.5')
    .to('.hero01', { x: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.5')
    .to('.hero03', { x: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.5')
}

function touchLaunch () {
  // startRubiks()

  const tl = gsap.timeline()
  gsap.set('.touch', { opacity: 0, x: '-10%' })
  gsap.set('.hero03', { x: '50%' })
  gsap.set('.hero .data', { opacity: 0 })
  gsap.set('header .logo, ul li a', { opacity: 0 })

  tl
    .to('header .logo, ul li a', { opacity: 1, stagger: 0.1, duration: 0.1 })
    .to('.touch', { opacity: 1, duration: 0.01 }, 0.3)
    .to('.touch', { x: '0%', duration: 1.5, ease: 'power4.out' }, 0.3)
    .to('.hero .data', { opacity: 1, duration: 0.1, stagger: 0.075 }, '-=1.4')
    .to('.hero03', { x: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.4')
}

function homeScroll () {
  gsap.set('.protagonist .first', { opacity: 0, y: '15%' })
  gsap.set('.protagonist .second', { opacity: 0, x: '10%' })
  gsap.set('.protagonist .third', { opacity: 0, x: '-5%' })

  gsap.set('.objective .first', { opacity: 0 })
  gsap.set('.objective .second', { opacity: 0, x: '3%' })
  gsap.set('.objective .number', { opacity: 0, y: '-20%' })

  gsap.set('.reality .first', { opacity: 0, x: '-10%' })
  gsap.set('.reality .second', { opacity: 0, x: '10%' })
  gsap.set('.reality .third', { opacity: 0, y: '10%' })

  state.locoScroll.on('call', function (event, element, i) {
    if (event === 'protagonist') {
      console.log('done')
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
      console.log('done')
      const tl = gsap.timeline()
      tl
        .to('.objective .first', { opacity: 1, duration: 0.1 })
        .to('.objective .second', { opacity: 1, duration: 0.1 }, 0.2)
        .to('.objective .second', { x: '0%', duration: 1.2, ease: 'power4.out' }, 0.2)
        .to('.objective .number', { opacity: 1, duration: 0.1 }, '-=1.2')
        .to('.objective .number', { y: '0%', duration: 1.6, ease: 'power4.out' }, '-=1.2')
    }

    if (event === 'reality') {
      console.log('done')
      const tl = gsap.timeline()
      tl
        .to('.reality .third', { opacity: 1, duration: 0.1 })
        .to('.reality .third', { y: '0%', duration: 1.2, ease: 'power4.out' })
        .to('.reality .first', { opacity: 1, duration: 0.1 }, '-=1.1')
        .to('.reality .first', { x: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.1')
        .to('.reality .second', { opacity: 1, duration: 0.1 }, '-=1.1')
        .to('.reality .second', { x: '0%', duration: 1.2, ease: 'power4.out' }, '-=1.1')
    }

    if (event === 'appear') {
      const text = i.el.querySelectorAll('span')
      console.log(text)
      gsap.to(text, { y: '0%', opacity: 1, duration: 1.3, stagger: 0.1, ease: 'power3.out' })
    }

    if (event === 'opacity') {
      gsap.to(i.el, { opacity: 1, duration: 1.3, y: 0, ease: 'power4.out' })
    }
    // if (event === 'video') {
    //   i.el.play()
    //   gsap.to(i.el, {scale:1, opacity:1, duration:1.5, ease:'power3.out'})
    // }

    // if (event === 'text') {
    //   const text = i.el.querySelectorAll('.lines')
    //   gsap.to(text, {y:'0%', opacity:1, duration:1.5, stagger:0.1, ease:'power3.out'})
    // }
  })
}

barba.init({
  debug: true,
  transitions: [{
    name: 'opacity-transition',
    once ({ next }) {
      smooth(next.container)
    },
    beforeEnter ({ next }) {
      state.locoScroll.destroy()
      smooth(next.container)
    },
    leave (data) {
      if (isMobile.any()) {
        gsap.set(window, { scrollTo: 0 })
      }
      return gsap.to(data.current.container, { opacity: 0, duration: 0.6, ease: 'power3.inOut' })
    },
    enter (data) {
      data.current.container.style.display = 'none'
      document.querySelector('.transition').style.transformOrigin = 'top'
      state.locoScroll.update()
      gsap.to('.transition', { scaleY: 0, duration: 0.8, ease: 'power3.out' })
      gsap.from(data.next.container, { y: '2%', duration: 1, ease: 'power3.out' })
      return gsap.from(data.next.container, { opacity: 0, duration: 0.5, ease: 'power3.inOut' })
    }
  }],
  views: [{
    namespace: 'home',
    beforeEnter ({ next }) {
      smooth(next.container)
      homeLaunch()
    },
    afterEnter ({ next }) {
      smooth(next.container)
      homeScroll()
    }
  }, {
    namespace: 'touch',
    beforeEnter ({ next }) {
      smooth(next.container)
      touchLaunch()
    },
    afterEnter ({ next }) {
      // smooth(next.container)
      // homeScroll()
    }
  }, {
    namespace: 'see',
    beforeEnter ({ next }) {
      smooth(next.container)
      touchLaunch()
    },
    afterEnter ({ next }) {
      // smooth(next.container)
      // homeScroll()
    }
  }]
})
