import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
import LocomotiveScroll from 'locomotive-scroll'
import barba from '@barba/core'
import { startRubiks } from './js/rubiks/rubiks'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import state from './state'

gsap.registerPlugin(ScrollToPlugin)

const body = document.body

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
  smooth(body)
  startRubiks()
}

barba.init({
  debug: true,
  transitions: [{
    name: 'opacity-transition',
    beforeEnter ({ next }) {
      state.locoScroll.destroy()
      smooth(next.container)
    },
    leave (data) {
      if (isMobile.any()) {
        gsap.set(window, { scrollTo: 0 })
      }
      document.querySelector('.transition').style.transformOrigin = 'bottom'
      gsap.to('.transition', { scaleY: 1, duration: 1, ease: 'power3.inOut' })
      gsap.to(data.current.container, { y: '-2%', duration: 1, ease: 'power3.inOut' })
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
  }]
})

homeLaunch()
